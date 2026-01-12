export default function Footer() {
    return (
        <footer className="bg-secondary py-12">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Cách thức hoạt động</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#">Cách thức hoạt động</a></li>
                            <li><a href="#">Giao nhận xe</a></li>
                            <li><a href="#">Dòng xe</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Về Mioto</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#">Trung tâm trợ giúp</a></li>
                            <li><a href="#">Quy định chung</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Kết nối với chúng tôi</h3>
                        <div className="flex gap-4">
                            {/* Social icons placeholder */}
                            <div className="h-8 w-8 bg-muted rounded-full"></div>
                            <div className="h-8 w-8 bg-muted rounded-full"></div>
                            <div className="h-8 w-8 bg-muted rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © 2026 Mioto. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
