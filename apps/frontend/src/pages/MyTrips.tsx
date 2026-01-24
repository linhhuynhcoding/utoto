import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import RenterTripList from "@/components/profile/RenterTripList"

export default function MyTrips() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container py-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <ProfileSidebar />

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border min-h-[600px]">
                            <h1 className="text-3xl font-black mb-8 tracking-tight">Chuyến của tôi</h1>

                            <div className="w-full">
                                <RenterTripList />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
