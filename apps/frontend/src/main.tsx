import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'
import envConfig from './config.ts'
import { Toaster } from '@/components/ui/toaster'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={envConfig.GOOGLE_CLIENT_ID} >
            <App />
            <Toaster />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
