import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { MapPin, Truck, Home } from "lucide-react"

export default function Delivery() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="py-20 bg-primary/5">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Chính sách Giao nhận xe</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Utoto cung cấp nhiều phương thức giao nhận linh hoạt để phù hợp nhất với kế hoạch di chuyển của bạn.
                        </p>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                        <Home size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Nhận tại địa chỉ chủ xe</h3>
                                        <p className="text-muted-foreground italic">Đây là phương thức mặc định và hoàn toàn miễn phí giao nhận. Bạn sẽ đến địa chỉ mà chủ xe cung cấp trên hệ thống để nhận xe.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Giao xe tận nơi</h3>
                                        <p className="text-muted-foreground italic">Tiết kiệm thời gian bằng cách yêu cầu chủ xe giao tận nhà, khách sạn hoặc sân bay. Phí giao xe sẽ được tính dựa trên khoảng cách (ví dụ 10k/km).</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Phạm vi giao nhận</h3>
                                        <p className="text-muted-foreground italic">Chủ xe thường có phạm vi giao hàng tối đa trong bán kính 20km. Hãy kiểm tra thông tin này trong chi tiết xe hoặc chat trực tiếp với chủ xe.</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 bg-black text-white rounded-[40px] shadow-2xl shadow-black/20"
                            >
                                <h3 className="text-2xl font-bold mb-6">Lưu ý khi giao nhận</h3>
                                <div className="space-y-6">
                                    <p className="flex items-start gap-3">
                                        <span className="w-6 h-6 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">1</span>
                                        <span className="text-white/80">Kiểm tra kỹ ngoại thất và nội thất xe. Chụp ảnh/quay phim làm bằng chứng.</span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <span className="w-6 h-6 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">2</span>
                                        <span className="text-white/80">Kiểm tra mức nhiên liệu và số km hiện tại ghi trên hợp đồng/biên bản.</span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <span className="w-6 h-6 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">3</span>
                                        <span className="text-white/80">Ký xác nhận vào biên bản giao xe trên ứng dụng hoặc bản giấy (nếu có).</span>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
