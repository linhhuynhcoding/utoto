import { useState, useMemo, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCarDetail } from "@/hooks/useCarDetail"
import { Button } from "@/components/ui/button"
import { addDays } from "date-fns"
import { Loader2, ChevronLeft, ShieldCheck, MapPin, Clock, AlertCircle } from "lucide-react"
import { createTrip } from "@/services/trip.service"
import { getCarCalendar } from "@/services/car.service"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import RentalTimePicker from "@/components/home/RentalTimePicker"
import { CarCalendar } from "@utoto/shared"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function RentCar() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { data: car, isLoading, error } = useCarDetail(id)
    const [bookedDates, setBookedDates] = useState<CarCalendar[]>([])
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(false)

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(addDays(new Date(), 1))

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [licenseAlertOpen, setLicenseAlertOpen] = useState(false)

    useEffect(() => {
        const fetchCalendar = async () => {
            if (!id) return
            setIsLoadingCalendar(true)
            try {
                const res = await getCarCalendar(id)
                if (res.success) {
                    setBookedDates(res.data)
                }
            } catch (err) {
                console.error("Failed to fetch car calendar", err)
            } finally {
                setIsLoadingCalendar(false)
            }
        }
        fetchCalendar()
    }, [id])

    const days = useMemo(() => {
        const diffMs = endDate.getTime() - startDate.getTime()
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    }, [startDate, endDate])

    const pricePerDay = car?.price || 0
    const rentAmount = pricePerDay * (days || 1)
    const platformFee = Math.round(rentAmount * 0.1)
    const insuranceFee = Math.round(rentAmount * 0.08)
    const totalAmount = rentAmount + platformFee + insuranceFee

    const handleConfirmBooking = async () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thực hiện đặt xe")
            navigate("/login")
            return
        }

        if (!user.verified?.driverLicense) {
            setLicenseAlertOpen(true)
            return
        }

        if (!startDate || !endDate) {
            toast.error("Vui lòng chọn thời gian thuê xe")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await createTrip({
                renter_id: user.id,
                car_id: id!,
                from_date: startDate.toISOString(),
                to_date: endDate.toISOString(),
                ship_method: 1, // Standard
                rent_amount: totalAmount,
            })

            if (response.success) {
                toast.success("Đặt xe thành công! Chủ xe sẽ sớm liên hệ với bạn.")
                navigate("/account") // Go to trips page (mocked as profile for now)
            }
        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra khi đặt xe")
        } finally {
            setIsSubmitting(false)
        }
    }

    const disabledDates = useMemo(() => {
        return bookedDates.map(booking => ({
            from: new Date(booking.from_date),
            to: new Date(booking.to_date)
        }))
    }, [bookedDates])

    if (isLoading || isLoadingCalendar) {
        return (
            <div className="flex flex-col items-center justify-center min-vh-100">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !car) {
        return (
            <div className="container py-20 text-center">
                <p className="text-red-500">Không tìm thấy thông tin xe.</p>
                <Button variant="link" onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold">Xác nhận đặt xe</h1>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Car Summary */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm flex gap-6">
                            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={car.images[0]}
                                    alt={car.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-1">{car.name}</h2>
                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{car.location?.province || "Vị trí không xác định"}</span>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>{car.transmission}</span>
                                    <span>{car.seat} ghế</span>
                                    <span>{car.engine_type}</span>
                                </div>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="text-lg font-bold mb-6 tracking-tight">Thời gian thuê</h3>

                            <RentalTimePicker
                                initialStart={startDate}
                                initialEnd={endDate}
                                disabledDates={disabledDates}
                                onChange={(val) => {
                                    setStartDate(new Date(val.startDate))
                                    setEndDate(new Date(val.endDate))
                                }}
                            />

                            <div className="mt-6 flex items-start gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10 text-primary-foreground/80 text-sm">
                                <Clock className="h-5 w-5 flex-shrink-0 text-primary" />
                                <div className="space-y-1">
                                    <p className="font-bold text-primary">Lưu ý về thời gian</p>
                                    <p className="text-gray-600 leading-relaxed">Phí thuê xe được tính theo block 24h. Bạn có thể thoải mái chọn giờ nhận và trả xe phù hợp với lịch trình.</p>
                                </div>
                            </div>
                        </div>

                        {/* Renter Info Mock */}
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Thông tin người thuê</h3>
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">{user?.name || "Khách hàng"}</span>
                                        <Button variant="link" className="text-primary p-0 h-auto">Chỉnh sửa</Button>
                                    </div>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                                {user?.verified?.driverLicense ? (
                                    <div className="flex items-start gap-3 p-4 border border-green-100 bg-green-50 rounded-lg text-green-800 text-sm">
                                        <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold">GPLX đã được xác thực</p>
                                            <p>Bạn đã đủ điều kiện để thuê xe này.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3 p-4 border border-yellow-100 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold">Chưa xác thực GPLX</p>
                                            <Button 
                                                variant="link" 
                                                className="p-0 h-auto text-yellow-800 underline"
                                                onClick={() => setLicenseAlertOpen(true)}
                                            >
                                                Cập nhật ngay
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Price Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-gray-800">Chi tiết giá</h3>

                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá thuê ({days || 1} ngày)</span>
                                    <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(rentAmount)}đ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí dịch vụ</span>
                                    <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(platformFee)}đ</span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-600">Phí bảo hiểm</span>
                                        <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(insuranceFee)}đ</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-extrabold text-primary pt-2">
                                    <span>Tổng cộng</span>
                                    <span>{new Intl.NumberFormat('vi-VN').format(totalAmount)}đ</span>
                                </div>
                            </div>

                            <Button
                                className="w-full py-7 text-lg font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-black shadow-lg"
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting || days === 0}
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                                XÁC NHẬN THUÊ
                            </Button>

                            <p className="text-[10px] text-center text-gray-400 mt-4 uppercase font-bold tracking-tighter">
                                Bằng cách nhấp vào nút này, bạn đồng ý với các điều khoản của UTOTO
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <Dialog open={licenseAlertOpen} onOpenChange={setLicenseAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Yêu cầu xác minh GPLX</DialogTitle>
                        <DialogDescription>
                            Bạn cần xác minh Giấy phép lái xe trước khi thực hiện đặt xe. Việc này giúp đảm bảo an toàn và tin cậy cho cộng đồng.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLicenseAlertOpen(false)}>
                            Để sau
                        </Button>
                        <Button onClick={() => navigate("/verify-license")}>
                            Cập nhật ngay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
