import { CarDetailLayout } from "@/components/car-detail/CarDetailLayout"
import { CarGallery } from "@/components/car-detail/CarGallery"
import { RentBox } from "@/components/car-detail/RentBox"
import { CarBasicInfo } from "@/components/car-detail/CarBasicInfo"
import { CarFeatures } from "@/components/car-detail/CarFeatures"
import { CarContentSection } from "@/components/car-detail/CarContentSection"
import { OwnerInfo } from "@/components/car-detail/OwnerInfo"
import { ReviewsList } from "@/components/car-detail/ReviewsList"
import { Separator } from "@/components/ui/separator"
import { FileText, Map as MapIcon } from "lucide-react"

export default function CarDetail() {
    // const { id } = useParams()

    const mockImages = [
        "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/suzuki_xl7_hybrid_2023/p/g/2025/11/22/11/1K22Ngq-QonqrA5p1BapkQ.jpg",
        "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/suzuki_xl7_hybrid_2023/p/g/2025/11/22/11/crkO89zmpy8TohDRIw-aQA.jpg",
        "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/suzuki_xl7_hybrid_2023/p/g/2025/11/22/11/3Qmuad1rr99sk2BbToRFmw.jpg",
        "https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/suzuki_xl7_hybrid_2023/p/g/2025/11/22/11/r0K4f2xyNzrotnGOdARQDg.jpg"
    ]

    return (
        <CarDetailLayout>
            <CarGallery images={mockImages} />

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Main Content */}
                    <div className="lg:col-span-2 space-y-2">
                        <CarBasicInfo
                            name="SUZUKI XL7 HYBRID 2023"
                            rating={5.0}
                            trips={15}
                            location="Phường Linh Đông, Quận Thủ Đức"
                            tags={["Miễn thế chấp", "Giao xe tận nơi"]}
                        />

                        <Separator className="my-8" />

                        <CarContentSection title="Đặc điểm">
                            <CarFeatures />
                        </CarContentSection>

                        <CarContentSection title="Mô tả">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                Xe mới sạch sẽ, tiết kiệm xăng. Phù hợp đi gia đình, công tác.
                                Hỗ trợ giao xe tận nơi khu vực Thủ Đức.
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
                                <span className="text-sm mt-1">Phường Linh Đông, Quận Thủ Đức, TP. Hồ Chí Minh</span>
                            </div>
                        </CarContentSection>

                        <CarContentSection title="Chủ xe">
                            <OwnerInfo />
                        </CarContentSection>

                        <CarContentSection title="Đánh giá" className="border-b-0">
                            <ReviewsList />
                        </CarContentSection>

                    </div>

                    {/* Right Sticky Sidebar */}
                    <div className="hidden lg:block">
                        <RentBox />
                    </div>
                </div>
            </div>

            {/* Mobile Rent Box - Sticky Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex justify-between items-center">
                <div>
                    <div className="flex items-end gap-1">
                        <span className="text-xl font-bold text-primary">967K</span>
                        <span className="text-sm text-gray-500 mb-1">/ngày</span>
                    </div>
                    <span className="text-xs line-through text-gray-400">1.007K</span>
                </div>
                <button className="bg-primary text-black font-bold px-8 py-3 rounded-lg">
                    CHỌN THUÊ
                </button>
            </div>
        </CarDetailLayout>
    )
}
