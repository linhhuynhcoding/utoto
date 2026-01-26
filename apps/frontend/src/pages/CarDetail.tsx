import { useParams, useNavigate } from "react-router-dom"
import { CarDetailLayout } from "@/components/car-detail/CarDetailLayout"
import { CarGallery } from "@/components/car-detail/CarGallery"
import { RentBox } from "@/components/car-detail/RentBox"
import { CarBasicInfo } from "@/components/car-detail/CarBasicInfo"
import { CarFeatures } from "@/components/car-detail/CarFeatures"
import { CarContentSection } from "@/components/car-detail/CarContentSection"
import { OwnerInfo } from "@/components/car-detail/OwnerInfo"
import { ReviewsList } from "@/components/car-detail/ReviewsList"
import { Separator } from "@/components/ui/separator"
import { FileText, Map as MapIcon, Loader2 } from "lucide-react"
import { useCarDetail } from "@/hooks/useCarDetail"

export default function CarDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: car, isLoading, error } = useCarDetail(id)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-gray-500">Đang tải thông tin xe...</p>
            </div>
        )
    }

    if (error || !car) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-red-500 font-medium">Không tìm thấy thông tin xe hoặc có lỗi xảy ra.</p>
            </div>
        )
    }

    return (
        <CarDetailLayout>
            <CarGallery images={car.images} />

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Main Content */}
                    <div className="lg:col-span-2 space-y-2">
                        <CarBasicInfo
                            id={car.id}
                            name={car.name}
                            rating={5.0} // Mocked for now as not in schema
                            trips={15} // Mocked for now as not in schema
                            location={car.location ? `${car.location.street}, ${car.location.ward}, ${car.location.district}, ${car.location.province}` : "Vị trí không xác định"}
                            tags={[
                                car.is_self_driving ? "Miễn thế chấp" : "",
                                "Giao xe tận nơi"
                            ].filter(Boolean)}
                        />

                        <Separator className="my-8" />

                        <CarContentSection title="Đặc điểm">
                            <CarFeatures
                                seat={car.seat}
                                transmission={car.transmission}
                                engineType={car.engine_type}
                                features={car.features}
                            />
                        </CarContentSection>

                        <CarContentSection title="Mô tả">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {car.desc || "Không có mô tả cho xe này."}
                            </p>
                        </CarContentSection>

                        <CarContentSection title="Giấy tờ thuê xe (Bản gốc)">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                    <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">CMND và GPLX (đối chiếu)</p>
                                        <p className="text-sm text-gray-600">Khách hàng cần xuất trình CMND/CCCD và GPLX khi nhận xe.</p>
                                    </div>
                                </div>
                            </div>
                        </CarContentSection>

                        <CarContentSection title="Vị trí xe">
                            <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border text-gray-400">
                                <MapIcon className="h-8 w-8 mb-2 opacity-50" />
                                <span>Bản đồ vị trí xe (Placeholder)</span>
                                <span className="text-sm mt-1">
                                    {car.location ? `${car.location.street}, ${car.location.ward}, ${car.location.district}, ${car.location.province}` : "Vị trí không xác định"}
                                </span>
                            </div>
                        </CarContentSection>

                        <CarContentSection title="Chủ xe">
                            <OwnerInfo
                                name={car.owner_info?.name || "Chủ xe"}
                                avatar={car.owner_info?.avatar || ""}
                                isVerified={car.owner_info?.isVerified}
                            />
                        </CarContentSection>

                        <CarContentSection title="Đánh giá" className="border-b-0">
                            <ReviewsList />
                        </CarContentSection>

                    </div>

                    {/* Right Sticky Sidebar */}
                    <div className="hidden lg:block">
                        <RentBox price={car.price} carId={car.id} />
                    </div>
                </div>
            </div>

            {/* Mobile Rent Box - Sticky Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex justify-between items-center">
                <div>
                    <div className="flex items-end gap-1">
                        <span className="text-xl font-bold text-primary">{(car.price / 1000).toFixed(0)}K</span>
                        <span className="text-sm text-gray-500 mb-1">/ngày</span>
                    </div>
                </div>
                <button
                    className="bg-primary text-black font-bold px-8 py-3 rounded-lg"
                    onClick={() => navigate(`/rent/${car.id}`)}
                >
                    CHỌN THUÊ
                </button>
            </div>
        </CarDetailLayout>
    )
}
