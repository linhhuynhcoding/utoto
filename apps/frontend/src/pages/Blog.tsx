import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { motion } from "framer-motion"

export default function Blog() {
    const posts = [
        {
            title: "5 Bí kíp du lịch Đà Lạt bằng xe tự lái",
            excerpt: "Khám phá những cung đường đẹp nhất và kinh nghiệm thuê xe tự lái tại thành phố ngàn hoa.",
            image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800",
            category: "Kinh nghiệm"
        },
        {
            title: "Utoto chính thức ra mắt giao diện mới",
            excerpt: "Trải nghiệm đặt xe mượt mà hơn với giao diện tối giản và hiện đại từ Utoto.",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
            category: "Tin tức"
        },
        {
            title: "Ưu đãi hè rực rỡ - Giảm ngay 20%",
            excerpt: "Nhận ngay mã giảm giá cho mọi chuyến xe trong mùa hè này. Đặt xe ngay tại Utoto!",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
            category: "Khuyến mãi"
        }
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="py-20 bg-secondary/20">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Utoto Blog</h1>
                        <p className="text-lg text-muted-foreground">Chia sẻ kinh nghiệm, tin tức và những hành trình đầy cảm hứng.</p>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {posts.map((post, idx) => (
                                <motion.article
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group cursor-pointer"
                                >
                                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{post.category}</span>
                                    <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                                    <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
