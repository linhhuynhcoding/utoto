import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-secondary py-12">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Cách thức hoạt động</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Cách thức hoạt động</Link></li>
                            <li><Link to="/delivery" className="hover:text-primary transition-colors">Giao nhận xe</Link></li>
                            <li><Link to="/search" className="hover:text-primary transition-colors">Dòng xe</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Về Utoto</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-primary transition-colors">Giới thiệu</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Tuyển dụng</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/help" className="hover:text-primary transition-colors">Trung tâm hỗ trợ</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Quy định chung</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Liên hệ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Kết nối với chúng tôi</h3>
                        <div className="flex gap-4">
                            {/* Social icons placeholder */}
                            <div className="h-8 w-8 bg-muted rounded-full hover:bg-primary/20 cursor-pointer transition-colors"></div>
                            <div className="h-8 w-8 bg-muted rounded-full hover:bg-primary/20 cursor-pointer transition-colors"></div>
                            <div className="h-8 w-8 bg-muted rounded-full hover:bg-primary/20 cursor-pointer transition-colors"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © 2026 Utoto. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
