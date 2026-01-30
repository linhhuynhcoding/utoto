import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"

export default function About() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 bg-primary/5">
                    <div className="container px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                                Utoto - Nâng Tầm Trải Nghiệm <br className="hidden md:block" /> Thuê Xe Online
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Utoto là nền tảng cho thuê xe tự lái hàng đầu, kết nối chủ xe và khách thuê một cách dễ dàng, an toàn và minh bạch. Chúng tôi truyền cảm hứng cho những hành trình tự do và đầy ắp niềm vui.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
                                <p className="text-lg text-muted-foreground mb-4">
                                    Tại Utoto, chúng tôi tin rằng mỗi chuyến đi không chỉ là việc di chuyển từ điểm A đến điểm B, mà là cơ hội để khám phá, kết nối và tạo ra những kỷ niệm đẹp.
                                </p>
                                <p className="text-lg text-muted-foreground">
                                    Sứ mệnh của chúng tôi là thay đổi cách mọi người thuê xe bằng công nghệ, mang đến sự tiện lợi tối đa và sự tin tưởng tuyệt đối cho cả khách hàng và chủ xe.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="aspect-video rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000"
                                    alt="About Utoto"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-secondary/30">
                    <div className="container px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Giá trị cốt lõi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Tin cậy", desc: "Mọi xe và người dùng đều được xác thực kỹ lưỡng." },
                                { title: "Tiện lợi", desc: "Đặt xe chỉ với vài thao tác trên điện thoại." },
                                { title: "An toàn", desc: "Bảo hiểm đi kèm cho mọi hành trình thuê xe." }
                            ].map((val, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 bg-background rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                                    <p className="text-muted-foreground">{val.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
