import { useEffect, useState } from "react"
import CarCard from "@/components/home/CarCard"
import { useAuth } from "@/contexts"
import { getMyCars } from "@/services/car.service"
import { CarResponse } from "@utoto/shared"

export default function MyCarList() {
    const { user } = useAuth()
    const [cars, setCars] = useState<CarResponse[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCars = async () => {
            // Fallback to USER_1 for dev testing if not logged in
            const userId = user?.id || "USER_1";
            setLoading(true)
            try {
                const res = await getMyCars(userId)
                // The API usage in car.service.ts was returning response directly.
                // Assuming interceptor returns data.
                // res should be { success: true, items: ..., total: ... }
                // but typescript sees 'any' because of my service definition hack.
                if (res.success) {
                    setCars(res.items || []) // CarRepository returns 'items'
                }
            } catch (error) {
                console.error("Failed to fetch cars", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCars()
    }, [user])

    if (loading) return <div>Đang tải...</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
                <CarCard
                    key={index}
                    car={{
                        name: car.name,
                        image: car.images?.[0] || "",
                        price: car.priceWithPlatformFee?.toLocaleString() + "đ",
                        rating: 5.0, // Mock for now
                        trips: 0, // Mock for now
                        location: car.location?.province || "",
                        transmission: car.transmission === "AUTOMATIC" ? "Tự động" : "Số sàn",
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        fuel: car.engine_type === "GASOLINE" ? "Xăng" : (car.engine_type === "DIESEL" ? "Dầu" : "Điện"),
                        seats: car.seat,
                        tags: []
                    }}
                />
            ))}
            {cars.length === 0 && !loading && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                    Bạn chưa có xe nào.
                </div>
            )}
        </div>
    )
}
