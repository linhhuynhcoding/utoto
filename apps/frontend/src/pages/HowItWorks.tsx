import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { Search, Calendar, Car, Key } from "lucide-react"

export default function HowItWorks() {
    const steps = [
        { icon: Search, title: "Tìm xe", desc: "Sử dụng bộ lọc để tìm kiếm những chiếc xe ưng ý gần bạn." },
        { icon: Calendar, title: "Đặt xe", desc: "Chọn thời gian thuê, phương thức thanh toán và gửi lời mời đến chủ xe." },
        { icon: Key, title: "Nhận xe", desc: "Gặp chủ xe, kiểm tra tình trạng xe và nhận chìa khóa hành trình." },
        { icon: Car, title: "Tận hưởng", desc: "Lái xe an toàn và trả xe đúng hạn sau khi kết thúc chuyến đi." }
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="py-20 text-center">
                    <div className="container px-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-center">Cách thức hoạt động</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Chỉ với 4 bước đơn giản, bạn đã có thể bắt đầu hành trình của mình với Utoto.</p>
                    </div>
                </section>

                <section className="py-12">
                    <div className="container px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                            {/* Connector line for desktop */}
                            <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-primary/10 -z-10" />

                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex flex-col items-center text-center p-8"
                                >
                                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-6 shadow-xl shadow-primary/30 text-center">
                                        <step.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{idx + 1}. {step.title}</h3>
                                    <p className="text-muted-foreground">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-secondary/20">
                    <div className="container px-4">
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Tại sao nên chọn Utoto?</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                        <div>
                                            <h4 className="font-bold">Đa dạng lựa chọn</h4>
                                            <p className="text-sm text-muted-foreground italic">Hàng ngàn mẫu xe từ sedan, SUV đến xe điện đời mới.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                        <div>
                                            <h4 className="font-bold">Giá cả minh bạch</h4>
                                            <p className="text-sm text-muted-foreground italic">Không phí ẩn, mọi chi tiết đều được hiển thị rõ ràng trước khi đặt.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                        <div>
                                            <h4 className="font-bold">Hỗ trợ 24/7</h4>
                                            <p className="text-sm text-muted-foreground italic">Đội ngũ hỗ trợ luôn sẵn sàng đồng hành cùng bạn trên mọi nẻo đường.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3">
                                <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800" alt="Drive" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
