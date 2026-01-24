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
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border min-h-[600px]">
                            <h1 className="text-3xl font-black mb-8 tracking-tight">Quản lý cho thuê</h1>

                            <div className="w-full">
                                <div className="grid w-full grid-cols-2 mb-10 bg-slate-100/50 p-1.5 rounded-[1.25rem] border">
                                    <button
                                        onClick={() => setActiveTab("my-cars")}
                                        className={cn(
                                            "py-3 text-sm font-bold rounded-xl transition-all duration-300",
                                            activeTab === "my-cars"
                                                ? "bg-white text-primary shadow-lg scale-[1.02]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                        )}
                                    >
                                        Xe của tôi
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("lending-history")}
                                        className={cn(
                                            "py-3 text-sm font-bold rounded-xl transition-all duration-300",
                                            activeTab === "lending-history"
                                                ? "bg-white text-primary shadow-lg scale-[1.02]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
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
