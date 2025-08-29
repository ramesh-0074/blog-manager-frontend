// components/profile/ProfileClient.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/actions/authActions";

interface ProfileFormData {
  name: string;
  email: string;
}

interface UserDetailsResponse {
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    };
  };
}

interface ProfileClientProps {
  initialData: UserDetailsResponse;
}

export default function ProfileClient({ initialData }: ProfileClientProps) {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const userData = initialData.data.user;

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      name: userData.name,
      email: userData.email,
    },
  });

  // Update form when data changes
  useEffect(() => {
    if (userData && !profileForm.formState.isDirty) {
      profileForm.reset({
        name: userData.name,
        email: userData.email,
      });
    }
  }, [userData, profileForm]);

  const onProfileSubmit = (data: ProfileFormData) => {
    startTransition(async () => {
      try {
        const response = await authAPI.updateProfile(data);
        const updatedUser = response.data.user;

        updateUser({
          name: updatedUser.name,
          email: updatedUser.email,
        });

        toast.success(response.message);
        setIsUpdate(false);
        router.refresh(); // Refresh server component
      } catch (error: unknown) {
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
        <TabsTrigger value="profile">Edit Profile</TabsTrigger>
        <TabsTrigger value="account">Account Info</TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    {...profileForm.register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    disabled={!isUpdate || isPending}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-600">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...profileForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    disabled={!isUpdate || isPending}
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {!isUpdate && (
                  <Button
                    className="w-full md:w-auto"
                    type="button"
                    disabled={isPending}
                    onClick={() => setIsUpdate(true)}
                  >
                    Update Profile
                  </Button>
                )}

                {isUpdate && (
                  <>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full md:w-auto"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsUpdate(false);
                        profileForm.reset({
                          name: userData.name,
                          email: userData.email,
                        });
                      }}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Info Tab */}
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              View your account details and status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {user?.role === "admin" && (
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {userData._id}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account Role</p>
                    <Badge variant="secondary" className="text-xs">
                      {userData.role?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Account Stats */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium mb-4">Account Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Active
                  </div>
                  <div className="text-xs text-green-600/80 dark:text-green-400/80">
                    Account Status
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {userData.role === "admin"
                      ? "Administrator"
                      : "Standard User"}
                  </div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                    Access Level
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-purple-600/80 dark:text-purple-400/80">
                    Member Since
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
