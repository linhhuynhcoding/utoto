import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Bell, MessageCircle, Menu, LogOut, Heart, Gift } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts"

import logo from "@/assets/logo_utoto.jpg"

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getUserInitials = () => {
        if (!user?.name) return 'U'
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white/95 border-b shadow-sm backdrop-blur" : "bg-white border-b"
            }`}>
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-white flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Utoto Logo"
                                className="h-full w-full object-cover mix-blend-multiply scale-110"
                            />
                        </div>
                        <span className="text-2xl md:text-3xl font-[1000] text-[#55d07c] tracking-tighter">
                            UTOTO
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">Về Utoto</Link>
                    <Link to="/register-car" className="text-sm font-medium hover:text-primary transition-colors">Trở thành chủ xe</Link>
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
                                    <Link to="/about" className="py-2 text-lg" onClick={() => setMobileMenuOpen(false)}>Về Utoto</Link>
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
