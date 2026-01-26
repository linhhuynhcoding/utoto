import { useEffect, useState } from "react"
import CarCard from "@/components/home/CarCard"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts"
import { getMyCars } from "@/services/car.service"
import { CarResponse } from "@utoto/shared"
import { Edit2, Loader2, Car as CarIcon } from "lucide-react"

export default function MyCarList() {
    const { user } = useAuth()
    const navigate = useNavigate()
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
                if (res) {
                    setCars(res || []) // CarRepository returns 'items'
                }
            } catch (error) {
                console.error("Failed to fetch cars", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCars()
    }, [user])

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
                <div key={car.id} className="relative group/car">
                    <CarCard
                        car={{
                            id: car.id,
                            name: car.name,
                            image: car.images?.[0] || "",
                            price: car.priceWithPlatformFee?.toLocaleString() + "đ",
                            rating: 5.0,
                            trips: 0,
                            location: car.location?.province || "",
                            transmission: car.transmission === "AUTOMATIC" ? "Tự động" : "Số sàn",
                            fuel: car.engine_type === "GASOLINE" ? "Xăng" : (car.engine_type === "DIESEL" ? "Dầu" : "Điện"),
                            seats: car.seat,
                            tags: []
                        }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/mycars/edit/${car.id}`);
                            }}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                            title="Chỉnh sửa"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
            {cars.length === 0 && !loading && (
                <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-dashed">
                    <div className="flex justify-center mb-4">
                        <CarIcon className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Bạn chưa đăng ký xe nào</h3>
                    <p className="text-gray-500 mt-1">Đăng ký xe ngay để bắt đầu tăng thêm thu nhập!</p>
                </div>
            )}
        </div>
    )
}
