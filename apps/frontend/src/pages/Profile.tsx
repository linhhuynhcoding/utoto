import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { ProfileContent } from "@/components/profile/ProfileContent"

export default function Profile() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container py-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <ProfileSidebar />
                    <ProfileContent />
                </div>
            </main>

            <Footer />
        </div>
    )
}
