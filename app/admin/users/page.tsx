// app/admin/users/page.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { getUsersServer } from '@/actions/serverActions/getUserActions'
import UserManagementClient from '@/components/layout/user-wrapper'

type SearchParams = Promise<{
  page?: string
  limit?: string
}>

interface AdminUsersPageProps {
  searchParams: SearchParams
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const limit = parseInt(resolvedSearchParams.limit || '10')

  try {
    // Fetch users data on the server
    const usersData = await getUsersServer({ 
      page: page.toString(), 
      limit: limit.toString() 
    })

    return (
      <div className="container mx-auto py-8 px-4 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-base md:text-3xl font-bold flex items-center gap-2">
              <Users className="h-4 md:h-8 w-4 md:w-8" />
              User Management
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-2">
              Manage user roles and permissions
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Users: {usersData?.data.pagination?.totalUsers || 0}
          </div>
        </div>

        {/* Client Component for Interactive Features */}
        <UserManagementClient
          initialData={usersData} 
          currentPage={page}
          limit={limit}
        />
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto py-8 px-4 min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Failed to load users. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
