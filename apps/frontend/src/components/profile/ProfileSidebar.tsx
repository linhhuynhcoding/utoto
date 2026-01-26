import { User, Heart, Gift, MapPin, Key, Trash, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts"
import { useNavigate, useLocation } from "react-router-dom"

interface ProfileSidebarProps {
    className?: string
}

export function ProfileSidebar({ className }: ProfileSidebarProps) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const location = useLocation()
    const currentPath = location.pathname

    const menuItems = [
        { icon: User, label: "Tài khoản của tôi", active: currentPath === "/account", href: "/account" },
        { icon: Key, label: "Xác minh GPLX", active: currentPath === "/verify-license", href: "/verify-license" },
        { icon: User, label: "Quản lý cho thuê", active: currentPath === "/mycars", href: "/mycars" },
        { icon: Heart, label: "Xe yêu thích", active: currentPath === "/myfavs", href: "/myfavs" },
        { icon: MapPin, label: "Chuyến của tôi", active: currentPath === "/mytrips", href: "/mytrips" },
        { icon: Gift, label: "Đơn hàng Thuê xe dài hạn", active: currentPath === "/mycstrips", href: "/mycstrips" },
        { icon: Gift, label: "Quà tặng", active: currentPath === "/myreward", href: "/myreward" },
        { icon: MapPin, label: "Địa chỉ của tôi", active: currentPath === "/myaddress", href: "/myaddress" },
    ]

    const securityItems = [
        { icon: Key, label: "Đổi mật khẩu", href: "/resetpw" },
        { icon: Trash, label: "Yêu cầu xoá tài khoản", href: "/deleteaccount" },
    ]

    return (
        <div className={cn("w-full md:w-[360px] flex-shrink-0", className)}>
            <div className="bg-white rounded-lg border shadow-sm sticky top-24">
                <div className="p-6 pb-2">
                    <h4 className="text-xl font-bold">Xin chào {user?.name || 'bạn'}!</h4>
                </div>

                <div className="py-2">
                    <Separator className="mb-2" />
                    <nav className="flex flex-col">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-slate-50 relative",
                                    item.active ? "text-primary bg-primary/5" : "text-gray-600"
                                )}
                            >
                                {item.active && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                    />
                                )}
                                <item.icon className={cn("h-5 w-5", item.active ? "text-primary" : "text-gray-500")} />
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </nav>

                    <Separator className="my-2" />

                    <nav className="flex flex-col">
                        {securityItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-slate-50"
                            >
                                <item.icon className="h-5 w-5 text-gray-500" />
                                <span>{item.label}</span>
                            </a>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-6 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Đăng xuất</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Mobile Dropdown Replacement (Visible on small screens if needed, but for now focusing on desktop sidebar structure as per mock) */}
        </div>
    )
}
