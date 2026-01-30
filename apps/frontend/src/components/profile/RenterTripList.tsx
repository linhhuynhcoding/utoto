import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts"
import { getMyTrips } from "@/services/trip.service"
import { Loader2, MapPin, Calendar } from "lucide-react"

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

export default function RenterTripList() {
    const { user } = useAuth()
    const [trips, setTrips] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTrips = async () => {
            if (!user) return;
            setLoading(true)
            try {
                const res = await getMyTrips(user.id)
                if (res.trips) {
                    setTrips(res.trips)
                }
            } catch (error) {
                console.error("Failed to fetch trips", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrips()
    }, [user])

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (trips.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                <div className="flex justify-center mb-4">
                    <Calendar className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Chưa có chuyến nào</h3>
                <p className="text-gray-500 mt-1">Hãy bắt đầu hành trình đầu tiên của bạn ngay!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {trips.map((trip) => {
                const car = trip.cars;
                const carName = car?.name || "Xe không xác định";
                const carImage = car?.images?.[0] || "";
                const ownerName = car?.users?.name || "Chủ xe";
                const ownerAvatar = car?.users?.avatar || "";
                const amount = Number(trip.rent_amount || 0);

                return (
                    <Card key={trip.trip_id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="w-full md:w-48 h-32 md:h-auto overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                        src={carImage}
                                        alt={carName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${STATUS_MAP[trip.status]?.color || "bg-gray-500"} text-white border-none px-3`}>
                                                    {STATUS_MAP[trip.status]?.label || trip.status}
                                                </Badge>
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">#{trip.trip_id.slice(-6)}</span>
                                            </div>
                                            <div className="text-xl font-black text-primary">
                                                {amount.toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold mb-3">{carName}</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                                            <div className="flex items-start gap-2">
                                                <div className="p-1.5 bg-green-50 rounded-lg text-green-600 mt-0.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Bắt đầu</p>
                                                    <p className="text-gray-500">{formatDate(trip.from_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="p-1.5 bg-red-50 rounded-lg text-red-600 mt-0.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Kết thúc</p>
                                                    <p className="text-gray-500">{formatDate(trip.to_date)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7 border">
                                                <AvatarImage src={ownerAvatar} />
                                                <AvatarFallback>{ownerName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{ownerName}</p>
                                                <p className="text-[10px] text-gray-500">Chủ xe</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <MapPin className="h-3 w-3" />
                                            <span className="text-[10px] font-medium">{car?.locations?.province || "Vị trí"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
