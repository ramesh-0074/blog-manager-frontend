import { cookies } from "next/headers"

export async function getAuthToken(): Promise<string | null> {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth-token')?.value
      return token || null
    } catch (error) {
      console.error('Error accessing cookies:', error)
      return null
    }
  }
  