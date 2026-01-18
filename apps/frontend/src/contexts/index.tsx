import { ReactNode } from 'react'
import { StorageProvider } from './StorageContext'
import { AuthProvider } from './AuthContext'

// Export all contexts and hooks
export { StorageProvider, useStorage, StorageKeys } from './StorageContext'
export { AuthProvider, useAuth } from './AuthContext'
export type { User } from './AuthContext'

// Combined providers component for easy composition
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <StorageProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </StorageProvider>
    )
}
