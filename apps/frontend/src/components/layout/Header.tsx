import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Bell, MessageCircle, Menu, LogOut, Heart, Gift } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts"

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getUserInitials = () => {
        if (!user?.name) return 'U'
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <a href="/" className="flex items-center space-x-2">
                        <img
                            src="https://www.mioto.vn/static/media/logo-full.ea382559.png"
                            alt="Mioto"
                            className="h-8 hidden md:block"
                        />
                        <img
                            src="data:image/png;base64,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"
                            alt="Mioto Mobile"
                            className="h-8 md:hidden"
                        />
                    </a>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <a href="/about" className="text-sm font-medium hover:text-primary">Về Mioto</a>
                    <a href="/register-car" className="text-sm font-medium hover:text-primary">Trở thành chủ xe</a>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MessageCircle className="h-5 w-5" />
                                </Button>
                                <Link to="/account" className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded-full transition-colors">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{user?.name}</span>
                                </Link>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button>Đăng nhập</Button>
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-background md:hidden">
                    <div className="container py-4">
                        <div className="flex justify-end p-4">
                            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                                <span className="text-2xl">×</span>
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4 p-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/account" className="flex items-center gap-4 mb-4" onClick={() => setMobileMenuOpen(false)}>
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user?.avatar} />
                                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-lg font-bold">{user?.name}</span>
                                    </Link>
                                    <Separator />
                                    <a href="#" className="flex items-center gap-2 py-2 text-lg"><Heart className="h-5 w-5" /> Xe yêu thích</a>
                                    <a href="#" className="flex items-center gap-2 py-2 text-lg"><Gift className="h-5 w-5" /> Quà tặng</a>
                                    <Separator />
                                    <a href="#" className="py-2 text-lg">Về Mioto</a>
                                    <a href="#" className="py-2 text-lg">Trở thành chủ xe</a>
                                    <a href="#" className="py-2 text-lg">Chuyến của tôi</a>
                                    <Separator />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 py-2 text-lg text-destructive"
                                    >
                                        <LogOut className="h-5 w-5" /> Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">Đăng nhập</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
