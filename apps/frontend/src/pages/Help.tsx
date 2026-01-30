import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { Search, HelpCircle, Phone, Mail } from "lucide-react"

export default function Help() {
    const faqs = [
        { q: "Làm thế nào để đặt xe trên Utoto?", a: "Bạn chỉ cần chọn xe mình thích, chọn thời gian thuê và nhấn Đặt xe. Sau khi chủ xe xác nhận, bạn sẽ thanh toán tiền cọc để giữ xe." },
        { q: "Tôi cần những giấy tờ gì để thuê xe?", a: "Thông thường bạn cần có Bằng lái xe (đã xác thực trên Utoto), CCCD và một số chủ xe có thể yêu cầu tài sản thế chấp (xe máy hoặc tiền mặt)." },
        { q: "Chính sách hủy chuyến như thế nào?", a: "Bạn có thể hủy chuyến miễn phí nếu thực hiện trước 24h so với giờ khởi hành. Chi tiết xem tại mục Quy định chung." },
        { q: "Xe trên Utoto có bảo hiểm không?", a: "Tất cả các chuyến xe được đặt qua Utoto đều được tặng kèm gói bảo hiểm thuê xe tự lái từ các đối tác uy tín." }
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                {/* Search Hero */}
                <section className="bg-primary py-16 text-white overflow-hidden relative">
                    <div className="container px-4 relative z-10">
                        <div className="max-w-2xl mx-auto text-center">
                            <h1 className="text-4xl font-bold mb-6">Chúng tôi có thể giúp gì cho bạn?</h1>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <input
                                    className="w-full py-4 pl-12 pr-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg"
                                    placeholder="Tìm kiếm câu hỏi, vấn đề..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                </section>

                <section className="py-20">
                    <div className="container px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                <HelpCircle className="text-primary" /> Câu hỏi thường gặp
                            </h2>
                            <div className="space-y-6">
                                {faqs.map((faq, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-6 border rounded-2xl hover:bg-secondary/20 transition-colors"
                                    >
                                        <h3 className="font-bold mb-2">{faq.q}</h3>
                                        <p className="text-muted-foreground">{faq.a}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-20 p-8 bg-secondary/30 rounded-3xl border border-dashed border-primary/30 text-center">
                                <h2 className="text-2xl font-bold mb-4">Bạn vẫn còn thắc mắc?</h2>
                                <p className="text-muted-foreground mb-8">Nếu bạn không tìm thấy câu trả lời ở đây, hãy liên hệ trực tiếp với chúng tôi.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a href="tel:19001234" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:brightness-110 transition-all">
                                        <Phone size={18} /> 1900 6331
                                    </a>
                                    <a href="mailto:support@utoto.vn" className="flex items-center gap-2 px-6 py-3 bg-white border rounded-full font-bold hover:bg-slate-50 transition-all">
                                        <Mail size={18} /> support@utoto.vn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
