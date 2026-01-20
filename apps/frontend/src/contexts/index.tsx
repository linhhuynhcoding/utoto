import { ReactNode } from 'react'
import { StorageProvider } from './StorageContext'
import { AuthProvider } from './AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

// Export all contexts and hooks
export { StorageProvider, useStorage, StorageKeys } from './StorageContext'
export { AuthProvider, useAuth } from './AuthContext'
export type { User } from './AuthContext'

// Combined providers component for easy composition
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <StorageProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </StorageProvider>
        </QueryClientProvider>
    )
}
