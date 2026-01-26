
import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { searchCars } from "@/services/car.service"
import { CarResponse } from "@utoto/shared"
import CarCard from "@/components/home/CarCard"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function Search() {
    const [searchParams] = useSearchParams()

    // Convert searchParams to object
    const params: Record<string, any> = {
        limit: 100, // Fetch more for search
        page: 1
    }

    const province = searchParams.get('province') || '79'
    const district = searchParams.get('district')
    const ward = searchParams.get('ward')
    const type = searchParams.get('type')

    if (province) params.province = province
    if (district) params.district = district
    if (ward) params.ward = ward
    if (type) params.type = type
    // Additional filters mapping if backend supports it
    // Note: Backend might expect specific named params like 'location_id' or codes directly.
    // Assuming backend search endpoint might need adjustments, or we pass what we have.
    // For now passing generic params.

    const { data: searchData, isLoading } = useQuery({
        queryKey: ["search-cars", Object.fromEntries(searchParams.entries())],
        queryFn: () => searchCars(params)
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
            originalPrice: undefined,
            rating: 5.0,
            trips: 0,
            location: car.location ? car.location.province : "Hồ Chí Minh",
            transmission: car.transmission === "AUTOMATIC" ? "Tự động" as const : "Số sàn" as const,
            fuel: fuelMap[car.engine_type] || "Xăng",
            seats: car.seat,
            tags: car.features?.slice(0, 1).map(f => f.name || "") || [],
            id: car.id,
        }
    }

    const cars = searchData?.items.map(mapCarToCard) || []
    const total = searchData?.total || 0

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-gray-50 py-8">
                <div className="container">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Kết quả tìm kiếm</h1>
                        <p className="text-muted-foreground">Tìm thấy {total} xe phù hợp</p>
                    </div>

                    {isLoading ? (
                        <div className="py-20 text-center">Đang tìm kiếm xe...</div>
                    ) : cars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {cars.map((car, i) => (
                                <CarCard key={i} car={car} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-white rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold mb-2">Không tìm thấy xe nào</h3>
                            <p className="text-muted-foreground">Vui lòng thử thay đổi địa điểm hoặc thời gian tìm kiếm</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
