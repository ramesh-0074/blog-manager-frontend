import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Cookies from 'js-cookie'

export interface User {
  _id: string
  name: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
}

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
  sameSite: 'strict' as const,
  path: '/'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        // Set token in cookies
        Cookies.set('auth-token', token, COOKIE_OPTIONS)
        
        set({ user, token, isAuthenticated: true })
      },
      
      clearAuth: () => {
        // Remove token from cookies
        Cookies.remove('auth-token', { path: '/' })
        
        set({ user: null, token: null, isAuthenticated: false })
      },
      
      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Initialize token from cookies on hydration
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const cookieToken = Cookies.get('auth-token')
          if (cookieToken && state.token !== cookieToken) {
            state.token = cookieToken
          }
        }
      },
    }
  )
)

// Helper function to get token from cookies (useful for SSR)
export const getTokenFromCookies = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  return Cookies.get('auth-token') || null
}

// Helper function to initialize auth from cookies (useful for SSR scenarios)
export const initializeAuthFromCookies = () => {
  const token = getTokenFromCookies()
  const state = useAuthStore.getState()
  
  if (token && !state.token) {
    // If we have a token in cookies but not in store, we need to validate it
    // You might want to make an API call here to verify the token and get user data
    console.log('Token found in cookies, consider validating it')
  }
}
