import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, User, Car, MapPin, Clock, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts"
import { getMyLendingTrips } from "@/services/trip.service"
import TripMap from "@/components/my-cars/TripMap"
import { toast } from "sonner"
import envConfig from "@/config"
import { useSSE } from "@/hooks/useSSE"

const STATUS_MAP: Record<string, { label: string, color: string }> = {
    PENDING: { label: "Chờ duyệt", color: "bg-yellow-500 hover:bg-yellow-600" },
    APPROVED: { label: "Đã duyệt", color: "bg-blue-500 hover:bg-blue-600" },
    REJECTED: { label: "Từ chối", color: "bg-red-500 hover:bg-red-600" },
    CANCELLED: { label: "Đã hủy", color: "bg-gray-500 hover:bg-gray-600" },
    COMPLETED: { label: "Hoàn thành", color: "bg-green-500 hover:bg-green-600" },
}

const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(d);
}

const formatDateOnly = (date: Date | string) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(d);
}

export default function TripDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [trip, setTrip] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [locations, setLocations] = useState<{ lat: number; lng: number }[]>([])

    const { } = useSSE(`${envConfig.API_URL}/gps/sse`, [
        {
            event: "gps",
            handler: (event) => {
                try {   
                    const parsedData = JSON.parse(event.data);
                    console.log("Received data: ", parsedData)
                    setLocations((prev) => [...prev.slice(-1000), { lat: parsedData.lat, lng: parsedData.lng }])
                } catch (parseError) {
                    console.error('Error parsing SSE data:', parseError);
                }
            }
        }
    ])

    useEffect(() => {
        const fetchTrip = async () => {
            if (!user || !id) return
            setLoading(true)
            try {
                const res = await getMyLendingTrips(user.id)
                if (res.trips) {
                    const foundTrip = res.trips.find((t: any) => t.trip_id === id)
                    if (foundTrip) {
                        setTrip(foundTrip)
                    } else {
                        toast.error("Không tìm thấy chuyến xe")
                        navigate("/mycars")
                    }
                }
            } catch (error) {
                console.error("Failed to fetch trip", error)
                toast.error("Có lỗi xảy ra khi tải thông tin chuyến xe")
            } finally {
                setLoading(false)
            }
        }
        fetchTrip()
    }, [user, id, navigate])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!trip) {
        return null
    }

    const carName = trip.cars?.name || "Unknown Car"
    const carImage = trip.cars?.car_images?.[0]?.image_url || ""
    const licenseNumber = trip.cars?.license_number || "N/A"
    const renterName = trip.users?.name || "Unknown Renter"
    const renterAvatar = trip.users?.avatar || ""
    const renterEmail = trip.users?.email || ""
    const amount = Number(trip.rent_amount || 0)
    const location = trip.cars?.locations

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/mycars")}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">Chi tiết chuyến xe</h1>
                            <p className="text-sm text-muted-foreground">#{trip.trip_id}</p>
                        </div>
                        <Badge className={`${STATUS_MAP[trip.status]?.color || "bg-gray-500"} text-white border-none px-4 py-2`}>
                            {STATUS_MAP[trip.status]?.label || trip.status}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* GPS Map */}
                        <TripMap licenseNumber={carName.toUpperCase()} carName={carName} locations={locations} />

                        {/* Car Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Car className="h-5 w-5" />
                                    Thông tin xe
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    {carImage && (
                                        <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={carImage}
                                                alt={carName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-2">{carName}</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Biển số</p>
                                                <p className="font-semibold font-mono">{licenseNumber}</p>
                                            </div>
                                            {location && (
                                                <div>
                                                    <p className="text-muted-foreground">Vị trí</p>
                                                    <p className="font-semibold">{location.province}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trip Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Lịch trình
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <p className="font-semibold text-green-600">Bắt đầu</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(trip.from_date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <p className="font-semibold text-red-600">Kết thúc</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(trip.to_date)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Renter Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Người thuê
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={renterAvatar} />
                                        <AvatarFallback>{renterName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{renterName}</p>
                                        <p className="text-sm text-muted-foreground">{renterEmail}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Thanh toán
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-3 border-b">
                                        <span className="text-muted-foreground">Tổng tiền thuê</span>
                                        <span className="font-semibold">{amount.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Tổng cộng</span>
                                        <span className="text-2xl font-bold text-primary">{amount.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Thông tin thêm
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mã chuyến</span>
                                    <span className="font-mono font-semibold">#{trip.trip_id.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ngày tạo</span>
                                    <span className="font-semibold">{formatDateOnly(trip.created_at || trip.from_date)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
