import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/home/HeroSection"
import PromoSection from "@/components/home/PromoSection"
import FeaturedCars from "@/components/home/FeaturedCars"

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <PromoSection />
                <FeaturedCars />
            </main>
            <Footer />
        </div>
    )
}
