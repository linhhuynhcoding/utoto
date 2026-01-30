import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"

export default function Terms() {
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
                        <h1 className="text-4xl font-black tracking-tighter mb-8">Quy định chung</h1>
                        <p className="text-muted-foreground mb-6">Chào mừng bạn đến với Utoto. Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các quy định sau đây.</p>

                        <h2 className="text-2xl font-bold mt-12 mb-4">1. Điều kiện đối với người thuê xe</h2>
                        <p>Để thuê xe trên hệ thống Utoto, bạn cần đáp ứng các tiêu chuẩn sau:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Đủ 21 tuổi trở lên có đầy đủ năng lực hành vi dân sự.</li>
                            <li>Có giấy phép lái xe hợp lệ và còn hiệu lực.</li>
                            <li>Đã thực hiện xác thực tài khoản trên hệ thống Utoto.</li>
                            <li>Không có các vi phạm nghiêm trọng trong lịch sử thuê xe.</li>
                        </ul>

                        <h2 className="text-2xl font-bold mt-12 mb-4">2. Quy trình đặt xe và thanh toán</h2>
                        <p>Người dùng thực hiện đặt xe trực tuyến qua ứng dụng. Việc đặt xe chỉ được xác nhận sau khi chủ xe đồng ý và người thuê thanh toán tiền cọc theo quy định.</p>

                        <h2 className="text-2xl font-bold mt-12 mb-4">3. Trách nhiệm của các bên</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Chủ xe:</strong> Cung cấp xe đúng tình trạng mô tả, đầy đủ giấy tờ và đảm bảo an toàn kỹ thuật.</li>
                            <li><strong>Người thuê:</strong> Sử dụng xe đúng mục đích, tuân thủ luật giao thông và hoàn trả xe đúng hạn, đúng tình trạng ban đầu.</li>
                        </ul>

                        <h2 className="text-2xl font-bold mt-12 mb-4">4. Chính sách hủy chuyến</h2>
                        <p>Việc hủy chuyến cần được thực hiện qua hệ thống. Tùy thuộc vào thời điểm hủy, người thuê có thể được hoàn lại toàn bộ hoặc một phần tiền cọc theo chính sách cụ thể hiển thị khi đặt xe.</p>

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
