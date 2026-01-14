import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ReactNode } from "react"

interface CarDetailLayoutProps {
    children: ReactNode
}

export function CarDetailLayout({ children }: CarDetailLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 pb-12">
                {children}
            </main>
            <Footer />
        </div>
    )
}
