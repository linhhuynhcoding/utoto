import { Button } from "@/components/ui/button"
import { Car, Clock, MapPin } from "lucide-react"

export default function HeroSection() {
    return (
        <div className="relative border-b bg-background">
            <div
                className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://www.mioto.vn/static/media/bg-landingpage-4.13f36d4c.png")' }}
            ></div>
            <div className="container relative z-10 py-20 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Mioto - Cùng Bạn Trên Mọi Hành Trình
                </h1>
                <div className="h-1 w-20 bg-primary mx-auto mb-4 rounded-full"></div>
                <p className="text-xl text-muted-foreground mb-12">
                    Trải nghiệm sự khác biệt từ <span className="text-primary font-bold">hơn 10.000</span> xe gia đình đời mới khắp Việt Nam
                </p>

                <div className="mx-auto max-w-4xl rounded-xl border bg-background p-6 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Button variant="outline" className="h-24 flex-col gap-2 border-primary bg-primary/5 hover:bg-primary/10 hover:text-primary">
                            <Car className="h-8 w-8" />
                            <span>Xe tự lái</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5 hover:text-primary">
                            <div className="relative">
                                <Car className="h-8 w-8" />
                                <div className="absolute -right-2 -top-2 rounded-full bg-primary p-0.5 text-[0.6rem] text-primary-foreground">
                                    tx
                                </div>
                            </div>
                            <span>Xe có tài xế</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5 hover:text-primary">
                            <Clock className="h-8 w-8" />
                            <span>Thuê xe dài hạn</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-center">
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Địa điểm
                            </label>
                            <div className="h-10 rounded-md border px-3 py-2 text-sm">
                                TP. Hồ Chí Minh
                            </div>
                        </div>
                        <div className="hidden md:block h-12 w-px bg-border"></div>
                        <div className="flex flex-col gap-2 text-left">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Thời gian thuê
                            </label>
                            <div className="h-10 rounded-md border px-3 py-2 text-sm flex items-center">
                                21:00, 11/01/2026 - 20:00, 12/01/2026
                            </div>
                        </div>
                        <Button size="lg" className="h-full">
                            Tìm Xe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
