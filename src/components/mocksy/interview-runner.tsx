"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CircleDot, Mic, Play, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMmSs, questionsForSession } from "@/lib/mocksy/session";
import type { InterviewQuestion, MockSession } from "@/lib/mocksy/types";

export function InterviewRunner({
  session,
  questionBank,
  questionTypeFilter,
  questionTypeOptions,
  onQuestionTypeFilterChange,
  loggedInUserName,
}: {
  session: MockSession;
  questionBank: InterviewQuestion[];
  questionTypeFilter: string;
  questionTypeOptions: Array<{ value: string; label: string }>;
  onQuestionTypeFilterChange: (value: string) => void;
  loggedInUserName: string;
}) {
  const router = useRouter();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawRafRef = React.useRef<number | null>(null);
  const currentRef = React.useRef<InterviewQuestion | null>(null);
  const mediaRequestRef = React.useRef(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recordingChunksRef = React.useRef<BlobPart[]>([]);
  const recordingObjectUrlRef = React.useRef<string | null>(null);

  const questions = React.useMemo(() => questionsForSession(session, questionBank), [session, questionBank]);

  const [mediaStream, setMediaStream] = React.useState<MediaStream | null>(null);
  const [mediaStatus, setMediaStatus] = React.useState<"idle" | "requesting" | "ready" | "error">("idle");
  const [mediaError, setMediaError] = React.useState<string | null>(null);
  const [recordingStatus, setRecordingStatus] = React.useState<"idle" | "recording" | "stopping" | "ready" | "unsupported" | "error">("idle");
  const [recordingUrl, setRecordingUrl] = React.useState<string | null>(null);
  const [recordingError, setRecordingError] = React.useState<string | null>(null);
  const [recordElapsed, setRecordElapsed] = React.useState(0);

  const total = questions.length;
  const sessionKey = React.useMemo(() => session.sessionId, [session.sessionId]);

  type Phase = "intro" | "prep" | "answer" | "done";
  type State = {
    phase: Phase;
    idx: number;
    prepLeft: number;
    answerLeft: number;
    prepTotal: number;
    answerTotal: number;
    recording: "idle" | "recording" | "stopped";
    running: boolean;
  };
  type Action =
    | { type: "SET_PREP_TOTAL"; value: number }
    | { type: "START" }
    | { type: "END" }
    | { type: "RESET" }
    | { type: "TICK" };

  const initialState = React.useMemo<State>(
    () => ({
      phase: "intro",
      idx: 0,
      prepTotal: 20, // 15–30 allowed; default 20
      prepLeft: 20,
      answerTotal: 60,
      answerLeft: 60,
      recording: "idle",
      running: false,
    }),
    [],
  );

  const reducer = React.useCallback(
    (state: State, action: Action): State => {
      switch (action.type) {
        case "SET_PREP_TOTAL": {
          const v = Math.max(15, Math.min(30, Math.floor(action.value)));
          if (state.phase !== "intro") return state;
          return { ...state, prepTotal: v, prepLeft: v };
        }
        case "START": {
          if (!total) return state;
          return {
            ...state,
            phase: "prep",
            idx: 0,
            prepLeft: state.prepTotal,
            answerLeft: state.answerTotal,
            recording: "recording",
            running: true,
          };
        }
        case "END": {
          return {
            ...state,
            phase: "done",
            answerLeft: 0,
            running: false,
            recording: "stopped",
          };
        }
        case "RESET": {
          return { ...initialState };
        }
        case "TICK": {
          if (!state.running) return state;
          if (state.phase === "prep") {
            if (state.prepLeft <= 1) {
              return { ...state, phase: "answer", prepLeft: 0, answerLeft: state.answerTotal };
            }
            return { ...state, prepLeft: state.prepLeft - 1 };
          }
          if (state.phase === "answer") {
            if (state.answerLeft <= 1) {
              // Auto-advance to next question or finish
              if (state.idx >= total - 1) return { ...state, phase: "done", answerLeft: 0, running: false, recording: "stopped" };
              return {
                ...state,
                idx: state.idx + 1,
                phase: "prep",
                prepLeft: state.prepTotal,
                answerLeft: state.answerTotal,
              };
            }
            return { ...state, answerLeft: state.answerLeft - 1 };
          }
          return state;
        }
        default:
          return state;
      }
    },
    [initialState, total],
  );

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const stopMedia = React.useCallback(() => {
    setMediaStream((prev) => {
      if (prev) {
        prev.getTracks().forEach((track) => track.stop());
      }
      return null;
    });

    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }

    setMediaStatus("idle");
  }, []);

  const clearRecordingUrl = React.useCallback(() => {
    if (recordingObjectUrlRef.current) {
      URL.revokeObjectURL(recordingObjectUrlRef.current);
      recordingObjectUrlRef.current = null;
    }
    setRecordingUrl(null);
  }, []);

  const getRecordingFileName = React.useCallback(() => {
    const safeUserName = (loggedInUserName || "student")
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    return `mocksy-interview-${safeUserName || "student"}.webm`;
  }, [loggedInUserName]);

  const finalizeRecording = React.useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (recorder.state === "inactive") {
      return;
    }

    setRecordingStatus("stopping");
    try {
      recorder.stop();
    } catch {
      setRecordingStatus("error");
    }
  }, []);

  const startCanvasLoop = React.useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } catch {
        // drawImage can throw if video not ready; ignore and retry
      }

      // overlay: semi-transparent box at bottom with question text
      const padding = 16;
      const boxHeight = 96;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(padding, canvas.height - boxHeight - padding, canvas.width - padding * 2, boxHeight);

      ctx.fillStyle = "white";
      ctx.textBaseline = "middle";
      const fontSize = Math.max(18, Math.floor(canvas.width / 64));
      ctx.font = `${fontSize}px system-ui, -apple-system, 'Segoe UI', Roboto`;
      const text = currentRef.current?.prompt ?? "Loading question…";
      const maxWidth = canvas.width - padding * 3;
      // simple single-line truncation
      let display = text;
      while (ctx.measureText(display).width > maxWidth && display.length > 0) {
        display = display.slice(0, -1);
      }
      if (display !== text) display = display.slice(0, -3) + "...";

      ctx.fillText(display, padding * 2, canvas.height - boxHeight / 2 - padding);

      drawRafRef.current = requestAnimationFrame(draw);
    };

    if (drawRafRef.current == null) {
      draw();
    }
  }, []);

  const stopCanvasLoop = React.useCallback(() => {
    if (drawRafRef.current != null) {
      cancelAnimationFrame(drawRafRef.current);
      drawRafRef.current = null;
    }
  }, []);

  const startRecording = React.useCallback(() => {
    if (!mediaStream) return;
    if (typeof MediaRecorder === "undefined") {
      setRecordingStatus("unsupported");
      setRecordingError("This browser does not support video recording.");
      return;
    }

    if (mediaRecorderRef.current?.state === "recording") {
      return;
    }

    clearRecordingUrl();
    recordingChunksRef.current = [];
    setRecordingError(null);

    const preferredTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";

    try {
      // If we have a canvas available, capture the composited video frames
      let recordingStream: MediaStream = mediaStream;

      const canvas = canvasRef.current;
      if (canvas && typeof canvas.captureStream === "function") {
        // start draw loop to ensure canvas is rendering frames
        startCanvasLoop();
        const canvasStream = canvas.captureStream(30);
        const audioTracks = mediaStream.getAudioTracks() ?? [];
        recordingStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks]);
      }

      const recorder = new MediaRecorder(recordingStream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // stop canvas render loop when recording ends
        stopCanvasLoop();

        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || "video/webm" });
        recordingChunksRef.current = [];

        if (recordingObjectUrlRef.current) {
          URL.revokeObjectURL(recordingObjectUrlRef.current);
        }

        const objectUrl = URL.createObjectURL(blob);
        recordingObjectUrlRef.current = objectUrl;
        setRecordingUrl(objectUrl);
        setRecordingStatus("ready");
      };

      recorder.onerror = () => {
        stopCanvasLoop();
        setRecordingStatus("error");
        setRecordingError("Video recording stopped unexpectedly.");
      };

      recorder.start(1000);
      setRecordingStatus("recording");
    } catch {
      stopCanvasLoop();
      setRecordingStatus("error");
      setRecordingError("Could not start video recording in this browser.");
    }
  }, [clearRecordingUrl, mediaStream]);

  // keep a ref of the current question for the canvas draw loop

  const startMedia = React.useCallback(async () => {
    if (mediaRequestRef.current) return;
    if (mediaStream) {
      setMediaStatus("ready");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaStatus("error");
      setMediaError("This browser does not support camera and microphone capture.");
      return;
    }

    mediaRequestRef.current = true;
    setMediaStatus("requesting");
    setMediaError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setMediaStream(stream);
      setMediaStatus("ready");
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Permission denied. Please allow camera and microphone access to continue."
          : error instanceof DOMException && error.name === "NotFoundError"
            ? "No camera or microphone was found on this device."
            : "Could not start camera and microphone. Please check your device settings and try again.";

      setMediaStatus("error");
      setMediaError(message);
    } finally {
      mediaRequestRef.current = false;
    }
  }, [mediaStream]);

  React.useEffect(() => {
    // reset when the session changes (InterviewPage remounts by key, but keep safe)
    dispatch({ type: "RESET" });
  }, [sessionKey]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!mediaStream) {
      video.srcObject = null;
      return;
    }

    video.srcObject = mediaStream;
    void video.play().catch(() => {
      // Autoplay might be blocked until user gesture on some browsers.
    });

    return () => {
      if (video.srcObject === mediaStream) {
        video.srcObject = null;
      }
    };
  }, [mediaStream]);

  React.useEffect(() => {
    if (state.phase === "intro" || state.phase === "done") return;
    if (!state.running) return;
    const id = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(id);
  }, [state.phase, state.running]);

  React.useEffect(() => {
    if (!mediaStream) return;
    if (state.phase !== "prep" && state.phase !== "answer") return;
    startRecording();

    return () => {
      // Keep the recorder active through the interview; final stop happens on END/done.
    };
  }, [mediaStream, state.phase, startRecording]);

  React.useEffect(() => {
    void startMedia();
  }, [startMedia]);

  React.useEffect(() => {
    return () => {
      finalizeRecording();
      clearRecordingUrl();
      stopMedia();
    };
  }, [clearRecordingUrl, finalizeRecording, stopMedia]);

  React.useEffect(() => {
    if (state.phase === "done") {
      finalizeRecording();
      stopMedia();
    }
  }, [finalizeRecording, state.phase, stopMedia]);

  const current = total ? questions[Math.min(state.idx, total - 1)] : null;
  React.useEffect(() => {
    currentRef.current = current;
  }, [current]);
  const showTimer = state.phase === "prep" ? state.prepLeft : state.phase === "answer" ? state.answerLeft : 0;
  const isLive = !!mediaStream && state.phase !== "intro" && state.phase !== "done";
  const canStartTest = !!total && mediaStatus === "ready";
  const canDownloadRecording = recordingStatus === "ready" && !!recordingUrl;

  React.useEffect(() => {
    if (!isLive) {
      setRecordElapsed(0);
      return;
    }

    const startedAt = Date.now();
    setRecordElapsed(0);

    const id = window.setInterval(() => {
      setRecordElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(id);
  }, [isLive]);

  const timeBoxTone =
    state.phase === "prep"
      ? "bg-violet-500/15 border-violet-500/25"
      : state.phase === "answer"
        ? "bg-emerald-500/15 border-emerald-500/25"
        : "bg-muted/30 border-border";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-130 w-245 -translate-x-1/2 rounded-[56px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.22),transparent_70%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent_70%)]" />
        <div className="absolute -bottom-52 right-10 h-105 w-105 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.12),transparent_70%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(34,197,94,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015),transparent_35%,transparent_65%,rgba(0,0,0,0.02))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_35%,transparent_65%,rgba(255,255,255,0.035))]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
          <div className="space-y-4 lg:col-span-8">
              <Card className="rounded-3xl shadow-sm">
              <CardContent className="space-y-5 p-6 sm:p-7">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Pre-CAS / UKVI Mock Interview</h1>
                      <Badge variant="secondary" className="rounded-full">
                        {state.phase === "intro" ? "Instructions" : state.phase === "prep" ? "Preparation" : state.phase === "answer" ? "Answer" : "Complete"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Question set: <span className="font-medium text-foreground">{total || 0}</span> prompts · Think {state.prepTotal}s · Answer {state.answerTotal}s
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <label htmlFor="question-category-filter" className="sr-only">
                      Filter questions by category
                    </label>
                    <select
                      id="question-category-filter"
                      value={questionTypeFilter}
                      onChange={(event) => onQuestionTypeFilterChange(event.target.value)}
                      className="h-10 min-w-44 rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                    >
                      {questionTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {state.phase !== "intro" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => dispatch({ type: "END" })}
                        >
                          <span className="inline-flex items-center gap-2">
                            <X className="size-4" />
                            Submit
                          </span>
                        </Button>
                        <Button type="button" variant="outline" className="rounded-2xl" onClick={() => dispatch({ type: "RESET" })}>
                          Restart
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <Separator />

                <AnimatePresence mode="wait">
                  {state.phase === "intro" ? (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div className="rounded-3xl border bg-muted/20 p-5">
                        <div className="text-sm font-medium">How this test works</div>
                        <div className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                          <div className="rounded-2xl border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Step 1</div>
                            <div className="mt-1 font-medium text-foreground">Preparation</div>
                            <div className="mt-1">You’ll get {state.prepTotal} seconds to think before speaking.</div>
                          </div>
                          <div className="rounded-2xl border bg-background p-4">
                            <div className="text-xs text-muted-foreground">Step 2</div>
                            <div className="mt-1 font-medium text-foreground">Answer</div>
                            <div className="mt-1">Then you’ll get {state.answerTotal} seconds to respond.</div>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                          Camera and microphone access is required before you can start.
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          Prep time:
                          {[15, 20, 30].map((v) => (
                            <Button
                              key={v}
                              type="button"
                              size="sm"
                              variant={state.prepTotal === v ? "default" : "outline"}
                              className="rounded-2xl"
                              onClick={() => dispatch({ type: "SET_PREP_TOTAL", value: v })}
                            >
                              {v}s
                            </Button>
                          ))}
                        </div>

                        <Button
                          type="button"
                          size="lg"
                          className="rounded-2xl px-6"
                          onClick={() => dispatch({ type: "START" })}
                          disabled={!canStartTest}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Play className="size-4" />
                            Start test
                          </span>
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {mediaStatus === "requesting"
                          ? "Checking camera and microphone access..."
                          : mediaStatus === "error"
                            ? mediaError ?? "Camera/microphone access is blocked."
                            : mediaStatus === "ready"
                              ? "Camera and microphone are ready."
                              : "Waiting to initialize camera and microphone."}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="flow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className={["rounded-3xl border p-4", timeBoxTone].join(" ")}>
                          <div className="text-xs text-muted-foreground">
                            {state.phase === "prep" ? "Time allocation (prepare)" : state.phase === "answer" ? "Time allocation (answer)" : "Time allocation"}
                          </div>
                          <div className="mt-2 flex items-end justify-between gap-3">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-foreground">
                                {state.phase === "prep" ? "Think about your answer" : state.phase === "answer" ? "Speak your response" : "Complete"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {state.phase === "prep" ? `${state.prepTotal} seconds` : state.phase === "answer" ? `${state.answerTotal} seconds` : "—"}
                              </div>
                            </div>
                            <div className="text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
                              {formatMmSs(showTimer)}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-3xl border bg-muted/20 p-4">
                          <div className="text-xs text-muted-foreground">Progress</div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge className="rounded-full" variant="outline">
                              {state.idx + 1}/{total}
                            </Badge>
                            <Badge className="rounded-full" variant="secondary">
                              {state.phase === "prep" ? "Preparing" : state.phase === "answer" ? "Answering" : "Done"}
                            </Badge>
                          </div>
                          <div className="mt-3 text-sm text-muted-foreground">
                            {state.phase === "prep"
                              ? "Use the countdown to structure your answer in 2–3 points."
                              : state.phase === "answer"
                                ? "Speak clearly. Keep answers consistent with your study plan and funding story."
                                : "Finish to view the results UI."}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border bg-background p-6 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge className="rounded-full" variant="outline">
                            {current?.category === "pre-cas" ? "Pre-CAS" : current?.category === "ukvi" ? "UKVI" : "General"}
                          </Badge>
                          <div className="text-xs text-muted-foreground">Question {state.idx + 1} of {total}</div>
                        </div>

                        <div className="mt-4 text-balance text-lg leading-8 sm:text-xl sm:leading-9">
                          {current?.prompt ?? "Loading question…"}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Auto-advances when the answer timer ends (UI simulation).
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Recording</div>
                    <div className="text-sm text-muted-foreground">
                      {mediaStatus === "requesting"
                        ? "Requesting camera and microphone access..."
                        : mediaStatus === "error"
                          ? "Camera and microphone could not be started."
                          : mediaStatus === "ready" && state.phase === "intro"
                            ? "Camera and microphone are ready before the test starts."
                            : isLive
                              ? "Live camera and microphone are active."
                              : "Recording is not active."}
                    </div>
                  </div>
                  <Badge className="rounded-full" variant={isLive ? "default" : "secondary"}>
                    {mediaStatus === "requesting"
                      ? "Starting"
                      : mediaStatus === "error"
                        ? "Blocked"
                        : mediaStatus === "ready" && state.phase === "intro"
                          ? "Ready"
                          : isLive
                            ? "REC"
                            : "Idle"}
                  </Badge>
                </div>

                <motion.div
                  className="relative overflow-hidden rounded-3xl border bg-linear-to-b from-muted/60 to-muted"
                  initial={false}
                  animate={
                    isLive
                      ? { boxShadow: "0 0 0 1px rgba(239,68,68,0.25), 0 18px 60px rgba(239,68,68,0.12)" }
                      : { boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }
                  }
                  transition={{ duration: 0.35 }}
                >
                  {mediaStream ? (
                    <video
                      ref={videoRef}
                      className="aspect-video w-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="grid aspect-video place-items-center">
                      <div className="text-center">
                        <div className="mx-auto mb-3 inline-flex size-12 items-center justify-center rounded-2xl border bg-background shadow-sm">
                          <Mic className="size-5" />
                        </div>
                        <div className="text-sm font-medium">Camera preview</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {mediaStatus === "error" ? mediaError ?? "Unable to access camera/microphone." : "Waiting for camera and microphone access."}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* hidden canvas used to composite overlay into the recorded video */}
                  <canvas ref={canvasRef} aria-hidden style={{ display: "none" }} />

                  {isLive ? (
                    <motion.div
                      className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.span
                        className="inline-flex"
                        animate={{ opacity: [1, 0.35, 1] }}
                        transition={{ repeat: Infinity, duration: 1.1 }}
                      >
                        <CircleDot className="size-3 text-red-500" />
                      </motion.span>
                      REC {formatMmSs(recordElapsed)}
                    </motion.div>
                  ) : null}
                </motion.div>

                <div className="space-y-3">
                  {recordingStatus === "recording" ? (
                    <div className="rounded-2xl border bg-muted/20 p-3 text-xs text-muted-foreground">
                      Recording is running locally in the browser. Nothing is stored until you download it.
                    </div>
                  ) : null}
                  {recordingStatus === "error" ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                      {recordingError ?? "Video recording is unavailable."}
                    </div>
                  ) : null}

                  {state.phase === "done" ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        type="button"
                        className="h-11 rounded-2xl"
                        onClick={() => router.push("/profile")}
                      >
                        View results
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-2xl"
                        disabled={!canDownloadRecording}
                        onClick={() => {
                          if (!recordingUrl) return;
                          const a = document.createElement("a");
                          a.href = recordingUrl;
                            a.download = getRecordingFileName();
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        }}
                      >
                        Download recording
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
