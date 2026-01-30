import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send } from "lucide-react"

export default function Contact() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="py-20 bg-primary/5">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Liên hệ với chúng tôi</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Đội ngũ Utoto luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. Hãy kết nối với chúng tôi ngay nhé!
                        </p>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div>
                                <h2 className="text-3xl font-bold mb-8">Thông tin liên hệ</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase font-black tracking-widest">Tổng đài</p>
                                            <p className="text-xl font-bold">1900 6331</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase font-black tracking-widest">Email</p>
                                            <p className="text-xl font-bold">support@utoto.vn</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase font-black tracking-widest">Văn phòng</p>
                                            <p className="text-xl font-bold">Tòa nhà Utoto, Quận 1, TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="p-8 bg-white border rounded-3xl shadow-xl shadow-primary/5"
                            >
                                <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho Utoto</h2>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="w-full p-4 bg-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Họ tên" />
                                        <input className="w-full p-4 bg-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Số điện thoại" />
                                    </div>
                                    <input className="w-full p-4 bg-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Email" />
                                    <textarea className="w-full p-4 bg-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 h-32" placeholder="Lời nhắn của bạn..." />
                                    <button className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                                        <Send size={18} /> Gửi ngay
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
