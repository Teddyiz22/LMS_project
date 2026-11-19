import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  changePassword as changePasswordRequest,
  getCurrentUser,
  loginAccount,
  registerAccount,
  requestPasswordReset as requestPasswordResetRequest,
} from '../services/authService.js'
import { clearToken, getToken, storeToken } from '../services/api.js'

const AuthContext = createContext(null)

// Keys from the old mock auth — removed once so a stale mock session can
// never look like a real login.
const LEGACY_KEYS = ['eduflow_mock_auth_user', 'eduflow_mock_session_user']

function normalizeUser(user) {
  if (!user) return null
  return {
    id: user.id,
    fullName: user.full_name || user.fullName || '',
    email: user.email,
    role: user.role,
    title: user.title || null,
    bio: user.bio || null,
    program: user.program || null,
    avatarUrl: user.avatar_url || user.avatarUrl || null,
    isActive: user.is_active ?? true,
    createdAt: user.created_at || user.createdAt || null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    try {
      LEGACY_KEYS.forEach((key) => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
    } catch {
      // Ignore storage errors.
    }

    const restoreSession = async () => {
      if (!getToken()) {
        if (mountedRef.current) setIsInitializing(false)
        return
      }
      try {
        const { user: currentUser } = await getCurrentUser()
        if (mountedRef.current) setUser(normalizeUser(currentUser))
      } catch {
        clearToken()
        if (mountedRef.current) setUser(null)
      } finally {
        if (mountedRef.current) setIsInitializing(false)
      }
    }
    restoreSession()

    return () => { mountedRef.current = false }
  }, [])

  const login = useCallback(async ({ email, password, remember }) => {
    const { user: authenticatedUser, token } = await loginAccount({ email, password })
    storeToken(token, Boolean(remember))
    const normalized = normalizeUser(authenticatedUser)
    setUser(normalized)
    return normalized
  }, [])

  const register = useCallback(async ({ email, fullName, password, role, ...profile }) => {
    const { user: registeredUser, token } = await registerAccount({
      email, fullName, password, role, ...profile,
    })
    storeToken(token, true)
    const normalized = normalizeUser(registeredUser)
    setUser(normalized)
    return normalized
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const { user: currentUser } = await getCurrentUser()
    const normalized = normalizeUser(currentUser)
    setUser(normalized)
    return normalized
  }, [])

  const requestPasswordReset = useCallback(async ({ email }) => {
    const result = await requestPasswordResetRequest({ email })
    return result
  }, [])

  const changePassword = useCallback(async ({ current, next }) => {
    const result = await changePasswordRequest({ current, next })
    return result
  }, [])

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isInitializing,
    login,
    logout,
    register,
    refreshUser,
    requestPasswordReset,
    changePassword,
  }), [user, isInitializing, login, logout, register, refreshUser, requestPasswordReset, changePassword])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// This hook intentionally lives with its provider so consumers share one context instance.
// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider.')
  return context
}
