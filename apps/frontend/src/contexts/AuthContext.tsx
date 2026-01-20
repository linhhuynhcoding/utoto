import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useStorage, StorageKeys } from './StorageContext'

export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    phone?: string
    dateOfBirth?: string
    gender?: string
    joinedDate?: string
    points?: number
    trips?: number
    verified?: {
        phone?: boolean
        email?: boolean
        driverLicense?: boolean
    }
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (userData: User, token: string) => void
    logout: () => void
    updateUser: (userData: Partial<User>) => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const storage = useStorage()

    // Load user from storage on mount
    useEffect(() => {
        const storedUser = storage.getItem<User>(StorageKeys.USER)
        if (storedUser) {
            setUser(storedUser)
        }
        setLoading(false)
    }, [])

    const login = (userData: User, token: string) => {
        setUser(userData)
        storage.setItem(StorageKeys.USER, userData)
        storage.setItem(StorageKeys.AUTH_TOKEN, token)
    }

    const logout = () => {
        setUser(null)
        storage.removeItem(StorageKeys.USER)
        storage.removeItem(StorageKeys.AUTH_TOKEN)
    }

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData }
            setUser(updatedUser)
            storage.setItem(StorageKeys.USER, updatedUser)
        }
    }

    const isAuthenticated = user !== null

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateUser,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
