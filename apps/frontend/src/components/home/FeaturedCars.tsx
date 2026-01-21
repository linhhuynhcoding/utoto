import { useQuery } from "@tanstack/react-query"
import CarCard from "./CarCard"
import { getFeaturedCars } from "@/api/cars"
import { CarResponse } from "@utoto/shared"

export default function FeaturedCars() {
    const { data: carsData, isLoading } = useQuery({
        queryKey: ["featured-cars"],
        queryFn: getFeaturedCars
    })

    const mapCarToCard = (car: CarResponse) => {
        const fuelMap: Record<string, "Xăng" | "Dầu" | "Điện"> = {
            GASOLINE: "Xăng",
            DIESEL: "Dầu",
            ELECTRIC: "Điện",
            HYBRID: "Xăng"
        };

        return {
            name: `${car.brand.name} ${car.model.name}`,
            image: car.images?.[0] || "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/toyota_wigo_2023/p/g/2025/11/11/15/du4sHbP48yRNapIsGRKTlA.jpg",
            price: `${(car.price / 1000).toLocaleString('vi-VN')}K`,
            originalPrice: undefined, // API doesn't have original price yet
            rating: 5.0, // Default
            trips: 0, // Default
            location: car.location ? car.location.province : "Hồ Chí Minh",
            transmission: car.transmission === "AUTOMATIC" ? "Tự động" as const : "Số sàn" as const,
            fuel: fuelMap[car.engine_type] || "Xăng",
            seats: car.seat,
            tags: car.features?.slice(0, 1).map(f => f.name || "") || [],
            id: car.id,
        }
    }

    const cars = carsData?.map(mapCarToCard) || []

    if (isLoading) {
        return (
            <div className="py-16 text-center">
                <div className="container">
                    <h2 className="text-3xl font-bold mb-8">Xe Dành Cho Bạn</h2>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="py-16">
            <div className="container">
                <h2 className="text-3xl font-bold mb-8">Xe Dành Cho Bạn</h2>
                {cars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cars.map((car, i) => (
                            <CarCard key={i} car={car} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">Chưa có xe nào.</p>
                )}
            </div>
        </div>
    )
}
