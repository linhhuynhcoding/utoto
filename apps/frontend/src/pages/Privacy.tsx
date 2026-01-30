import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow py-20">
                <div className="container px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto prose prose-slate lg:prose-lg"
                    >
                        <h1 className="text-4xl font-black tracking-tighter mb-8">Chính sách bảo mật</h1>
                        <p className="text-muted-foreground mb-6">Utoto cam kết bảo vệ sự riêng tư và thông tin cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập và sử dụng dữ liệu của bạn.</p>

                        <h2 className="text-2xl font-bold mt-12 mb-4">1. Thông tin chúng tôi thu thập</h2>
                        <p>Chúng tôi thu thập các thông tin sau để phục vụ dịch vụ:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Thông tin cá nhân: Họ tên, số điện thoại, email, địa chỉ.</li>
                            <li>Thông tin xác thực: Hình ảnh GPLX, CCCD.</li>
                            <li>Thông tin giao dịch: Lịch sử thuê xe, thanh toán.</li>
                            <li>Dữ liệu vị trí: Để gợi ý các xe gần bạn nhất.</li>
                        </ul>

                        <h2 className="text-2xl font-bold mt-12 mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
                        <p>Thông tin của bạn được sử dụng để:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Xác thực danh tính người dùng nhằm đảm bảo an toàn.</li>
                            <li>Xử lý các giao dịch đặt xe và thanh toán.</li>
                            <li>Liên lạc và hỗ trợ khách hàng khi cần thiết.</li>
                            <li>Nâng cao chất lượng dịch vụ và cá nhân hóa trải nghiệm.</li>
                        </ul>

                        <h2 className="text-2xl font-bold mt-12 mb-4">3. Chia sẻ thông tin</h2>
                        <p>Utoto chỉ chia sẻ những thông tin cần thiết nhất giữa chủ xe và người thuê xe sau khi giao dịch đặt xe được xác nhận để tạo điều kiện thuận lợi cho việc giao nhận xe.</p>

                        <h2 className="text-2xl font-bold mt-12 mb-4">4. Bảo mật dữ liệu</h2>
                        <p>Chúng tôi sử dụng các biện pháp mã hóa và tường lửa tiên tiến để bảo vệ dữ liệu của bạn khỏi các truy cập trái phép.</p>

                        <div className="mt-20 p-6 bg-secondary rounded-2xl">
                            <p className="text-sm text-center italic">Cập nhật lần cuối: 30/01/2026</p>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
