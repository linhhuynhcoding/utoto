import { useState } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import MyCarList from "@/components/my-cars/MyCarList"
import LendingTripList from "@/components/my-cars/LendingTripList"
import { cn } from "@/lib/utils"

export default function MyCars() {
    const [activeTab, setActiveTab] = useState<"my-cars" | "lending-history">("my-cars")

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container py-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <ProfileSidebar />

                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-lg p-6 shadow-sm min-h-[500px]">
                            <h1 className="text-2xl font-bold mb-6">Quản lý cho thuê</h1>

                            <div className="w-full">
                                <div className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setActiveTab("my-cars")}
                                        className={cn(
                                            "py-2 text-sm font-medium rounded-md transition-all duration-200",
                                            activeTab === "my-cars"
                                                ? "bg-white text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-primary/60"
                                        )}
                                    >
                                        Xe của tôi
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("lending-history")}
                                        className={cn(
                                            "py-2 text-sm font-medium rounded-md transition-all duration-200",
                                            activeTab === "lending-history"
                                                ? "bg-white text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-primary/60"
                                        )}
                                    >
                                        Lịch sử cho thuê
                                    </button>
                                </div>

                                {activeTab === "my-cars" && <MyCarList />}
                                {activeTab === "lending-history" && <LendingTripList />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
