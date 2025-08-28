"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, LogOut, Menu, X, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    clearAuth();
    window.location.href = "/auth/login";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navigationItems = [{ href: "/blogs", label: "Blogs" }];

  const adminNavigationItems = [
    { href: "/admin/users", label: "Users" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  B
                </span>
              </div>
              <span className="font-bold text-base md:text-xl">Blog Manager</span>
            </Link>
          </div>

          {/* Desktop Navigation */}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAuthenticated && (
                  <nav className="hidden md:flex items-center space-x-6">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}

                    {user?.role == "admin" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="flex items-center space-x-1">
                            <Shield className="h-4 w-4" />
                            <span>Admin</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {adminNavigationItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href}>{item.label}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </nav>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-black">
                          {getInitials(user?.name || "U")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        <Badge variant="secondary" className="w-fit text-xs">
                          {user?.role}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </>
            ) : (
              /* Auth Buttons for Non-authenticated Users */
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="bg-black text-sm md:text-base hover:scale-105 shadow-md rounded-md text-white px-2 py-1">Sign In</Link>
                <Link href="/auth/register" className="bg-black text-sm md:text-base hover:scale-105 shadow-md rounded-md text-white px-2 py-1">Get Started</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="py-4 space-y-2">

              {/* Navigation Links */}
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md mx-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Admin Links */}
              {user?.role === "admin" && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Admin
                  </div>
                  {adminNavigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md mx-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
