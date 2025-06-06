"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { Loader2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useRole } from "../contexts/RoleContext";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { API_ENDPOINTS } from "@/src/config/api";
import { toast } from "sonner";
interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

interface PendingChange {
  userId: number;
  newRole: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const { role } = useRole();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(()=>{
    async function fetchVerificationResponse(){
  
      const response = await axios.post(`${API_ENDPOINTS.USER.IS_VERIFIED}`, {
        userId: session.data?.user.id
      })
      if(response.data.isVerified==undefined) return;
      if(!response.data.isVerified){
        router.push("/sendEmailVerification")
      }
    }
    fetchVerificationResponse()
  
  },[])
useEffect(()=>{
  if(!role) return;
  if(role!=="admin")
  {
    if(typeof window !== "undefined"){  
      window.location.href="/"
    }
  }
},[role])
  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_ENDPOINTS.USER.ALL_USERS}`
      );
      setUsers(response.data.users);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = (userId: number, newRole: string) => {
    setPendingChanges((prev) => {
      const filtered = prev.filter((change) => change.userId !== userId);
      if (users.find((u) => u.id === userId)?.role !== newRole) {
        return [...filtered, { userId, newRole }];
      }
      return filtered;
    });
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      setError(null);
      await axios.post(`${API_ENDPOINTS.USER.DELETE_USER}`, {
        id: userId,
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setPendingChanges((prev) =>
        prev.filter((change) => change.userId !== userId)
      );
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      toast("User Deleted Successfully")
    } catch (err) {
      setError(`Failed to delete ${users.find((u) => u.id === userId)?.name}`);
      console.error("Failed to delete user:", err);
      toast("Failed to delete User")
    }
  };

  const handleSaveChanges = async () => {
    if (pendingChanges.length === 0) return;

    try {
      setSaving(true);
      setError(null);

      await Promise.all(
        pendingChanges.map(({ userId, newRole }) =>
          axios.patch(
            `${API_ENDPOINTS.USER.UPDATE_ROLE(userId.toString())}`,
            {
              role: newRole,
            }
          )
        )
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const change = pendingChanges.find((c) => c.userId === user.id);
          return change ? { ...user, role: change.newRole } : user;
        })
      );

      setPendingChanges([]);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Failed to save changes:", err);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10">
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span>{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        const pendingRole = pendingChanges.find(
          (change) => change.userId === user.id
        )?.newRole;

        return (
          <Select
            key={user.id}
            value={pendingRole || user.role}
            onValueChange={(value) => handleRoleChange(user.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={pendingRole || user.role} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
    
        return (
          <DropdownMenu>
            <DropdownMenuTrigger 
              asChild 
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openDeleteDialog(user.id);
                }}
              >
                <MdDelete className="mr-2" /> Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  return (
     <div className="p-6 bg-gray-100 dark:bg-black min-h-screen">
    {/* Delete User Dialog */}
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the user {users.find(u => u.id === userToDelete)?.name}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setDeleteDialogOpen(false);
              setUserToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => userToDelete && handleDeleteUser(userToDelete)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-400 dark:text-slate-300">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
        </div>
      
        <Button
          onClick={handleSaveChanges}
          disabled={saving || pendingChanges.length === 0}
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            `Save Changes (${pendingChanges.length})`
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-md">
        <div className="p-4 flex gap-4">
          <Input
            placeholder="Filter by name..."
            value={
              (table.getColumn("name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={
              (table.getColumn("role")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("role")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="editor">Editors</SelectItem>
              <SelectItem value="viewer">Viewers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    router.push(`/admindashboard/${row.original.id}`)
                  }
                  className={
                    pendingChanges.some(
                      (change) => change.userId === row.original.id
                    )
                      ? "bg-black dark:bg-black cursor-pointer"
                      : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2 p-4">
          <div className="flex-1 text-sm text-gray-500 dark:text-gray-400">
            {table.getFilteredRowModel().rows.length} user(s)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}