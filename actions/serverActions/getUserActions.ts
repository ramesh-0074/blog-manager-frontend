// actions/serverActions/getUserActions.ts
import { UserDetailsResponse, UsersResponse } from "@/types/Auth.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    return token || null;
  } catch (error) {
    console.error("Error accessing cookies:", error);
    return null;
  }
}

export async function getUsersServer(
  params?: Record<string, string>
): Promise<UsersResponse> {
  const token = await getAuthToken();

  if (!token) {
    redirect("/auth/login");
  }

  const queryString = params ? new URLSearchParams(params).toString() : "";

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/users${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    if (response.status === 401) {
      redirect("/auth/login");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserDetailsServer(): Promise<UserDetailsResponse> {
  const token = await getAuthToken();

  if (!token) {
    redirect("/auth/login");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/user-details`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (response.status === 401) {
      redirect("/auth/login");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
}
