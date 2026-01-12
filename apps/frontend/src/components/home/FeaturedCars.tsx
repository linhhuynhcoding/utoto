import CarCard from "./CarCard"

export default function FeaturedCars() {
    const cars = [
        {
            name: "TOYOTA WIGO 2023",
            image: "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/toyota_wigo_2023/p/g/2025/11/11/15/du4sHbP48yRNapIsGRKTlA.jpg",
            price: "582K",
            originalPrice: "682K",
            rating: 5.0,
            trips: 9,
            location: "Phường 25, Quận Bình Thạnh",
            transmission: "Tự động" as const,
            fuel: "Xăng" as const,
            seats: 4,
            tags: ["Miễn thế chấp"]
        },
        {
            name: "TOYOTA COROLLA ALTIS 2022",
            image: "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/toyota_corolla_altis_2022/p/g/2025/11/20/08/BNEO9aGylGh1Lan_NGqGUw.jpg",
            price: "902K",
            originalPrice: "1.002K",
            rating: 5.0,
            trips: 55,
            location: "Phường 04, Quận Tân Bình",
            transmission: "Tự động" as const,
            fuel: "Xăng" as const,
            seats: 5,
            tags: ["Miễn thế chấp"]
        },
        {
            name: "MAZDA CX30 PREMIUM 2024",
            image: "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/mazda_cx30_premium__2024/p/g/2025/08/13/10/tFkm4tdy_0l13mnZCavMoA.jpg",
            price: "1.100K",
            originalPrice: "1.300K",
            rating: 5.0,
            trips: 12,
            location: "Phường 12, Quận 10",
            transmission: "Tự động" as const,
            fuel: "Xăng" as const,
            seats: 5,
            tags: ["Giao xe tận nơi"]
        },
        {
            name: "VINFAST VF8 PLUS 2023",
            image: "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/vinfast_vf8_plus_2023/p/g/2025/10/14/09/K1wZ7x8_7t5F9g9.jpg",
            price: "1.500K",
            rating: 4.9,
            trips: 23,
            location: "Thảo Điền, Quận 2",
            transmission: "Tự động" as const,
            fuel: "Điện" as const,
            seats: 5,
            tags: ["Xe điện"]
        }
    ]

    return (
        <div className="py-16">
            <div className="container">
                <h2 className="text-3xl font-bold mb-8">Xe Dành Cho Bạn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cars.map((car, i) => (
                        <CarCard key={i} car={car} />
                    ))}
                </div>
            </div>
        </div>
    )
}
