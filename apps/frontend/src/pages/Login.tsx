import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()

    const handleGoogleLogin = () => {
        // Mock login action
        console.log('Logging in with Google...')
        // Simulate a delay and then redirect
        setTimeout(() => {
            navigate('/')
        }, 800)
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
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-14 text-base font-medium relative hover:bg-gray-50/80 transition-all duration-200 border-gray-200"
                        onClick={handleGoogleLogin}
                    >
                        <div className="absolute left-4 flex items-center justify-center">
                            <svg className="h-6 w-6" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        </div>
                        <span className="ml-8 text-gray-700">Continue with Google</span>
                    </Button>

                    <div className="text-center text-sm text-gray-400 mt-6">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
