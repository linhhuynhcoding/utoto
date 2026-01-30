import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { Briefcase, Users, Rocket } from "lucide-react"

export default function Careers() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="py-20 bg-primary/5">
                    <div className="container px-4 text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 underline decoration-primary/30 decoration-8 underline-offset-8">
                                Gia nhập đội ngũ Utoto
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Chúng tôi đang tìm kiếm những tài năng trẻ, đam mê công nghệ và muốn thay đổi tương lai ngành vận tải tại Việt Nam.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                            {[
                                { icon: Rocket, title: "Sáng tạo", desc: "Luôn khuyến khích những ý tưởng mới và đột phá." },
                                { icon: Users, title: "Đoàn kết", desc: "Môi trường làm việc thân thiện, hỗ trợ lẫn nhau." },
                                { icon: Briefcase, title: "Chuyên nghiệp", desc: "Quy trình làm việc hiện đại, minh bạch." }
                            ].map((item, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-6 text-center">
                                        <item.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="max-w-4xl mx-auto rounded-3xl border p-12 bg-white shadow-xl shadow-primary/5">
                            <h2 className="text-3xl font-bold mb-8 text-center">Vị trí đang tuyển dụng</h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Frontend Developer (ReactJS)", type: "Full-time", location: "Hồ Chí Minh" },
                                    { title: "Backend Developer (NodeJS)", type: "Full-time", location: "Hà Nội" },
                                    { title: "UI/UX Designer", type: "Full-time", location: "Remote" },
                                    { title: "Marketing Specialist", type: "Full-time", location: "Hồ Chí Minh" }
                                ].map((job, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-secondary/20 rounded-2xl hover:bg-secondary/40 transition-colors cursor-pointer">
                                        <div>
                                            <h4 className="font-bold text-lg">{job.title}</h4>
                                            <p className="text-sm text-muted-foreground">{job.location} • {job.type}</p>
                                        </div>
                                        <button className="mt-4 md:mt-0 px-6 py-2 bg-primary text-white font-bold rounded-full text-sm">Ứng tuyển ngay</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
