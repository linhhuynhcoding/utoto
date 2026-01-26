import { createContext, useContext, ReactNode } from 'react'

// Storage keys enum for type safety
export enum StorageKeys {
    USER = 'user',
    AUTH_TOKEN = 'auth_token',
    FAVORITES = 'favorites',
    // Add more keys as needed
}

interface StorageContextType {
    getItem: <T>(key: string) => T | null
    setItem: <T>(key: string, value: T) => void
    removeItem: (key: string) => void
    clear: () => void
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
    // Check if window is available (SSR safety)
    const isClient = typeof window !== 'undefined'

    const getItem = <T,>(key: string): T | null => {
        if (!isClient) return null

        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage:`, error)
            return null
        }
    }

    const setItem = <T,>(key: string, value: T): void => {
        if (!isClient) return

        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(`Error setting item ${key} in localStorage:`, error)
        }
    }

    const removeItem = (key: string): void => {
        if (!isClient) return

        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error(`Error removing item ${key} from localStorage:`, error)
        }
    }

    const clear = (): void => {
        if (!isClient) return

        try {
            localStorage.clear()
        } catch (error) {
            console.error('Error clearing localStorage:', error)
        }
    }

    return (
        <StorageContext.Provider value={{ getItem, setItem, removeItem, clear }}>
            {children}
        </StorageContext.Provider>
    )
}

export function useStorage() {
    const context = useContext(StorageContext)
    if (context === undefined) {
        throw new Error('useStorage must be used within a StorageProvider')
    }
    return context
}
