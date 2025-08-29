// components/admin/UserManagementClient.tsx
"use client"

import React, { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Shield,
  ShieldCheck,
  Trash2,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { useAuthStore } from "@/store/authStore"
import { authAPI } from "@/actions/authActions"
import { User, UserManagementClientProps } from "@/types/Auth.types"

export default function UserManagementClient({ 
  initialData, 
  currentPage, 
  limit 
}: UserManagementClientProps) {
  const { user: currentUser } = useAuthStore()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    initialData.data.users,
    (state, { type, userId, role }: { type: 'update' | 'delete', userId: string, role?: string }) => {
      if (type === 'delete') {
        return state.filter(user => user._id !== userId)
      }
      if (type === 'update' && role) {
        return state.map(user => 
          user._id === userId ? { ...user, role } : user
        )
      }
      return state
    }
  )

  const users = optimisticUsers
  const pagination = initialData.data.pagination

  const handleRoleToggle = (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin"
    
    startTransition(async () => {
      // Move optimistic update inside transition
      setOptimisticUsers({ type: 'update', userId: user._id, role: newRole })
      
      try {
        await authAPI.updateUserRole(user._id, newRole)
        toast.success(`User role updated successfully`)
        router.refresh()
      } catch (error: unknown) {
        toast.error('Failed to update user role')
        // Revert optimistic update on error
        router.refresh()
      }
    })
  }

  const handleDeleteUser = (userId: string) => {
    startTransition(async () => {
      // Move optimistic update inside transition
      setOptimisticUsers({ type: 'delete', userId })
      
      try {
        await authAPI.deleteUser(userId)
        toast.success('User deleted successfully')
        router.refresh()
      } catch (error: unknown) {
        toast.error('Failed to delete user')
        // Revert optimistic update on error
        router.refresh()
      }
    })
  }

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}&limit=${limit}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-black text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {user._id === currentUser?._id && (
                            <p className="text-xs text-muted-foreground">
                              (You)
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className="flex items-center gap-1 w-fit"
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <Shield className="h-3 w-3" />
                        )}
                        {user.role.charAt(0).toUpperCase() +
                          user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(user.createdAt || ""), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Role Toggle Button */}
                        {user._id !== currentUser?._id && (
                          <Button
                            onClick={() => handleRoleToggle(user)}
                            disabled={isPending}
                            size="sm"
                            variant={
                              user.role === "admin" ? "outline" : "default"
                            }
                            className="flex items-center gap-1"
                          >
                            {isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : user.role === "admin" ? (
                              <>
                                <Shield className="h-3 w-3" />
                                Demote
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-3 w-3" />
                                Promote
                              </>
                            )}
                          </Button>
                        )}

                        {/* Delete Button */}
                        {user._id !== currentUser?._id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isPending}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete User
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, pagination.totalUsers)} of{" "}
                  {pagination.totalUsers} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    size="sm"
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm px-3 py-1 bg-muted rounded">
                    {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    size="sm"
                    variant="outline"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
