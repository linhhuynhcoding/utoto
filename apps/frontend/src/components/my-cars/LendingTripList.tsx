import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts"
import { getMyLendingTrips } from "@/services/trip.service"
import { TripResponse } from "@utoto/shared"

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

export default function LendingTripList() {
    const { user } = useAuth()
    const [trips, setTrips] = useState<any[]>([]) // Using any for joined data convenience
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTrips = async () => {
            // Fallback to USER_1 for dev testing if not logged in
            const userId = user?.id || "USER_1";
            setLoading(true)
            try {
                const res = await getMyLendingTrips(userId)
                if (res.success) {
                    setTrips(res.trips || [])
                }
            } catch (error) {
                console.error("Failed to fetch trips", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrips()
    }, [user])

    if (loading) return <div>Đang tải...</div>

    return (
        <div className="space-y-4">
            {trips.map((trip) => {
                // TripRepository includes 'cars' and 'users' (renter)
                const carName = trip.cars?.name || "Unknown Car";
                const renterName = trip.users?.name || "Unknown Renter";
                const renterAvatar = trip.users?.avatar || "";
                const amount = Number(trip.rent_amount || 0);

                return (
                    <Card key={trip.trip_id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                                <div className="p-4 flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Badge className={`${STATUS_MAP[trip.status]?.color || "bg-gray-500"} text-white border-none`}>
                                                {STATUS_MAP[trip.status]?.label || trip.status}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">#{trip.trip_id}</span>
                                        </div>
                                        <div className="text-lg font-bold text-primary">
                                            {amount.toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2">{carName}</h3>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                                        <div>
                                            <p className="font-medium text-foreground">Bắt đầu</p>
                                            <p>{formatDate(trip.from_date)}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Kết thúc</p>
                                            <p>{formatDate(trip.to_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={renterAvatar} />
                                            <AvatarFallback>{renterName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{renterName}</p>
                                            <p className="text-xs text-muted-foreground">Người thuê</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
            {trips.length === 0 && !loading && (
                <div className="text-center py-10 text-muted-foreground">
                    Chưa có lịch sử cho thuê nào.
                </div>
            )}
        </div>
    )
}
