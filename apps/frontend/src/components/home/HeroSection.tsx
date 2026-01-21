import { Button } from "@/components/ui/button"
import { Car, Clock, MapPin } from "lucide-react"
import LocationPicker from "./LocationPicker"
import RentalTimePicker from "./RentalTimePicker"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function HeroSection() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'self' | 'driver' | 'long'>('self')

    // Search State - Default to HCM
    const [location, setLocation] = useState<{ province: string, district: string, ward: string } | null>({
        province: "79",
        district: "",
        ward: ""
    })
    const [dates, setDates] = useState<{ startDate: string, endDate: string } | null>(null)

    const handleSearch = () => {
        const params = new URLSearchParams()

        if (location?.province) params.append('province', location.province)
        if (location?.district) params.append('district', location.district)
        if (location?.ward) params.append('ward', location.ward)

        if (dates?.startDate) params.append('start', dates.startDate)
        if (dates?.endDate) params.append('end', dates.endDate)

        params.append('type', activeTab === 'self' ? 'self-driving' : activeTab === 'driver' ? 'with-driver' : 'long-term')

        navigate(`/search?${params.toString()}`)
    }

    return (
        <div className="relative border-b bg-background min-h-[650px] md:min-h-[700px] flex items-center overflow-hidden">
            {/* Background with Ambient Gradient */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.7] transform scale-105 transition-transform duration-[10s] ease-linear"
                style={{ backgroundImage: 'url("https://www.mioto.vn/static/media/bg-landingpage-4.13f36d4c.png")' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
            </div>

            <div className="container relative z-10 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
                {/* Hero Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-4xl font-black tracking-tighter lg:text-6xl mb-4 text-white drop-shadow-2xl leading-[1.1]">
                        Mioto - Cùng Bạn <br className="hidden md:block" />
                        <span className="text-primary italic relative">
                            Trên Mọi Hành Trình
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed">
                        Trải nghiệm sự khác biệt từ <span className="text-primary font-black italic">hơn 10.000</span> xe gia đình <br className="hidden md:block" /> đời mới khắp Việt Nam
                    </p>
                </motion.div>

                {/* Search Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/20 bg-background/80 backdrop-blur-3xl p-4 md:p-8 shadow-[0_48px_80px_-16px_rgba(0,0,0,0.5)]"
                >
                    {/* Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 mb-8">
                        <button
                            className={cn(
                                "h-24 flex flex-col items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 group relative overflow-hidden",
                                activeTab === 'self'
                                    ? "bg-primary text-white shadow-2xl shadow-primary/40 -translate-y-1"
                                    : "bg-white/50 hover:bg-white text-muted-foreground hover:text-primary hover:shadow-xl"
                            )}
                            onClick={() => setActiveTab('self')}
                        >
                            <Car className={cn("h-8 w-8 transition-transform duration-500", activeTab === 'self' ? "scale-110" : "group-hover:scale-110")} />
                            <span className="font-black text-base tracking-tight">Xe tự lái</span>
                            {activeTab === 'self' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-2 bg-white/30" />
                            )}
                        </button>

                        <button
                            className={cn(
                                "h-24 flex flex-col items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 group relative overflow-hidden",
                                activeTab === 'driver'
                                    ? "bg-primary text-white shadow-2xl shadow-primary/40 -translate-y-1"
                                    : "bg-white/50 hover:bg-white text-muted-foreground hover:text-primary hover:shadow-xl"
                            )}
                            onClick={() => setActiveTab('driver')}
                        >
                            <div className="relative">
                                <Car className={cn("h-8 w-8 transition-transform duration-500", activeTab === 'driver' ? "scale-110" : "group-hover:scale-110")} />
                                <div className={cn(
                                    "absolute -right-2 -top-2 rounded-full px-1.5 py-0.5 text-[0.6rem] font-black shadow-lg border-2",
                                    activeTab === 'driver' ? "bg-white text-primary border-primary" : "bg-primary text-white border-white"
                                )}>
                                    TX
                                </div>
                            </div>
                            <span className="font-black text-base tracking-tight">Xe có tài xế</span>
                            {activeTab === 'driver' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-2 bg-white/30" />
                            )}
                        </button>

                        <button
                            className={cn(
                                "h-24 flex flex-col items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 group relative overflow-hidden",
                                activeTab === 'long'
                                    ? "bg-primary text-white shadow-2xl shadow-primary/40 -translate-y-1"
                                    : "bg-white/50 hover:bg-white text-muted-foreground hover:text-primary hover:shadow-xl"
                            )}
                            onClick={() => setActiveTab('long')}
                        >
                            <Clock className={cn("h-8 w-8 transition-transform duration-500", activeTab === 'long' ? "scale-110" : "group-hover:scale-110")} />
                            <span className="font-black text-base tracking-tight">Thuê xe dài hạn</span>
                            {activeTab === 'long' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-2 bg-white/30" />
                            )}
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch p-2 bg-white/40 rounded-[2.5rem] border border-white/50 shadow-inner">
                        <div className="flex-1 flex flex-col gap-2 text-left p-3">
                            <label className="text-[11px] font-black text-primary/80 flex items-center gap-2 uppercase tracking-[0.25em] ml-2">
                                <MapPin className="h-3.5 w-3.5" /> Địa điểm
                            </label>
                            <LocationPicker onChange={setLocation} />
                        </div>

                        <div className="hidden lg:flex items-center">
                            <div className="h-14 w-px bg-primary/20"></div>
                        </div>

                        <div className="flex-[1.5] flex flex-col gap-2 text-left p-3">
                            <label className="text-[11px] font-black text-primary/80 flex items-center gap-2 uppercase tracking-[0.25em] ml-2">
                                <Clock className="h-3.5 w-3.5" /> Thời gian thuê
                            </label>
                            <RentalTimePicker onChange={setDates} />
                        </div>

                        <div className="flex items-center p-1.5">
                            <Button
                                size="lg"
                                className="w-full lg:w-auto px-10 h-16 md:h-18 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/40 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-500"
                                onClick={handleSearch}
                            >
                                Tìm Xe Ngay
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
