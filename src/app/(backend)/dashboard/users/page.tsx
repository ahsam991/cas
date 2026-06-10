import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { getAdminDashboardSummary } from "@/lib/admin-data";
import { QUESTION_BANK } from "@/lib/mocksy/questions";

export default async function UsersPage() {
  const { totalUsers, totalUsersWithDetails } = await getAdminDashboardSummary();
  const users = totalUsersWithDetails;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage and view all system users</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10 rounded-lg"
            />
          </div>
          <Button variant="outline" className="rounded-lg sm:w-auto w-full">
            Filter
          </Button>
        </div>
      </Card>

      {/* Users Table (desktop) and List (mobile) */}
      <Card className="overflow-hidden rounded-2xl border bg-card/80 shadow-sm">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`border-b transition-colors hover:bg-muted/50 ${idx === users.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full bg-muted">
                        <img src={user.avatar} alt={user.name} width="40" height="40" className="size-full object-cover" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.createdAt}</td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="rounded-full">{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-lg">
                        <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 cursor-pointer">
                          <Eye className="size-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 cursor-pointer">
                          <Edit className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 cursor-pointer text-destructive">
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-3 p-4">
          {users.map((user) => (
            <Card key={user.id} className="rounded-2xl border bg-card/80 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 overflow-hidden rounded-full bg-muted">
                    <img src={user.avatar} alt={user.name} width="40" height="40" className="size-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    <div className="text-xs text-muted-foreground">{user.createdAt}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="default" className="rounded-full">{user.role}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-lg">
                      <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 cursor-pointer">
                        <Eye className="size-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 cursor-pointer">
                        <Edit className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 cursor-pointer text-destructive">
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted-foreground">Showing 1 to {users.length} of {totalUsers} users</p>
          <div className="flex gap-2 self-start sm:self-auto">
            <Button variant="outline" size="sm" className="rounded-lg">Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
