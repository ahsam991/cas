export type MockUser = {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: "Active" | "Inactive";
  interviews: number;
  avatar: string;
};

export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    joinDate: "Jan 15, 2025",
    status: "Active",
    interviews: 12,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    joinDate: "Feb 10, 2025",
    status: "Active",
    interviews: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "Mar 05, 2025",
    status: "Inactive",
    interviews: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    joinDate: "Mar 20, 2025",
    status: "Active",
    interviews: 15,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@example.com",
    joinDate: "Apr 02, 2025",
    status: "Active",
    interviews: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
  },
  {
    id: 6,
    name: "Emma Davis",
    email: "emma@example.com",
    joinDate: "Apr 18, 2025",
    status: "Active",
    interviews: 9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
];
