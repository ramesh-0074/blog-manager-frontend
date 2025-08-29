import { getUserDetailsServer } from "@/actions/serverActions/getUserActions";
import ProfileWrapper from "@/components/layout/profile-wrapper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/helper-fns";
import React from "react";

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  try {
    const userDetails = await getUserDetailsServer();
    const userData = userDetails.data.user;
    return (
      <div className="container mx-auto py-8 space-y-8 min-h-screen">
        <div className="flex items-center space-x-4 mx-3">
          <Avatar className="h-15 md:h-20 w-15 md:w-20">
            <AvatarFallback className="text-base md:text-lg">
              {getInitials(userData?.name || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-base md:text-3xl font-bold">{userData?.name}</h1>
            <p className="text-muted-foreground text-sm md:text-base">{userData?.email}</p>
            <Badge variant="secondary" className="w-fit">
              {userData?.role}
            </Badge>
          </div>
        </div>

        {/* Client Component for Interactive Features */}
        <ProfileWrapper initialData={userDetails} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8 min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Failed to load profile. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
