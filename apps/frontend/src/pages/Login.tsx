import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import toast from '@/hooks/use-toast'
import { useAuth } from '@/contexts'

interface GoogleDecodedToken {
    email: string;
    name: string;
    picture?: string;
}

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const token = credentialResponse.credential;
            const decoded = jwtDecode<GoogleDecodedToken>(token);

            const loginPromise = axios.post('http://localhost:4000/auth/google/callback', {
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture
            });

            toast.promise(loginPromise, {
                loading: 'Signing in...',
                success: 'Welcome back!',
                error: 'Failed to login. Please try again.'
            });

            const response = await loginPromise;

            if (response.data.success) {
                // Use AuthContext to store user info
                login(response.data.data);
                navigate('/')
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    const handleError = () => {
        toast.error('Login failed', 'Unable to sign in with Google')
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

            <Card className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border-white/20 relative z-10">
                <CardHeader className="text-center space-y-2 pb-6">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6 text-primary"
                        >
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9.7-1.7 1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c.5-.4 1.1-.7 1.8-.7V5C14.1 5 12.3 6.1 12 7.5V10H6v2h1v9.6c.7.2 1.4.3 2.2.4L18 22V17zM7 2h10" />
                            <path d="M17 2v5" />
                        </svg>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-lg">
                        Sign in to continue to Utoto
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            theme="outline"
                            size="large"
                            width="100%"
                            login_uri='http://localhost:4000/auth/google/callback'
                        />
                    </div>

                    <div className="text-center text-sm text-gray-400 mt-6">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

