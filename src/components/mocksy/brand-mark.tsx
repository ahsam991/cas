import Image from "next/image";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={[
        "inline-flex size-9 items-center justify-center rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/logo (2).png"
        alt="Mocksy"
        width={32}
        height={32}
        className="size-full object-cover"
        priority
      />
    </div>
  );
}
