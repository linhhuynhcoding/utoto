import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/register-car/StepIndicator"
import { BasicInfoForm } from "@/components/register-car/BasicInfoForm"
import { RentalConfigForm } from "@/components/register-car/RentalConfigForm"
import { ImageUploadForm } from "@/components/register-car/ImageUploadForm"
import { useCarDetail } from "@/hooks/useCarDetail"
import { useUpdateCar } from "@/hooks/useCars"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function EditCar() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)

    const { data: car, isLoading: isFetching } = useCarDetail(id)
    const { mutate, isPending: isUpdating } = useUpdateCar()

    const [formData, setFormData] = useState({
        brand_id: "",
        model_id: "",
        licensePlate: "",
        seats: 4,
        year: new Date().getFullYear(),
        transmission: "MANUAL",
        fuel: "GASOLINE",
        consumption: "",
        description: "",
        features: [] as string[],
        price: 0,
        hasDiscount: false,
        weeklyDiscount: 0,
        hasDelivery: false,
        maxDeliveryDistance: 0,
        deliveryFee: 0,
        address: null as any,
        hasLimit: false,
        maxKmPerDay: 0,
        terms: "",
        images: [] as string[]
    })

    // Populate form data once car details are fetched
    useEffect(() => {
        if (car) {
            setFormData({
                brand_id: car.brand.id,
                model_id: car.model.id,
                licensePlate: car.name,
                seats: car.seat,
                year: 2024, // Assuming year is not in CarResponse for now, fallback to 2024
                transmission: car.transmission,
                fuel: car.engine_type,
                consumption: "", // TODO: Add to CarResponse if needed
                description: car.desc,
                features: car.features.map(f => f.id),
                price: car.price,
                hasDiscount: false,
                weeklyDiscount: 0,
                hasDelivery: car.deliveryFee ? car.deliveryFee > 0 : false,
                maxDeliveryDistance: car.deliveryRadius || 0,
                deliveryFee: car.deliveryFee || 0,
                address: car.location ? {
                    province: car.location.province_id,
                    district: car.location.district_id,
                    ward: car.location.ward_id,
                    street: car.location.street
                } : null,
                hasLimit: false,
                maxKmPerDay: 0,
                terms: "",
                images: car.images
            })
        }
    }, [car])

    const updateData = (newData: any) => {
        setFormData((prev) => ({ ...prev, ...newData }))
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
            window.scrollTo(0, 0)
        } else {
            if (!id) return;

            const payload = {
                name: formData.licensePlate,
                desc: formData.description,
                model_id: formData.model_id,
                transmission: formData.transmission as "MANUAL" | "AUTOMATIC",
                seat: parseInt(String(formData.seats)),
                engine_type: formData.fuel as "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID",
                price: Number(formData.price),
                deliveryFee: Number(formData.deliveryFee),
                deliveryRadius: Number(formData.maxDeliveryDistance),
                feature_ids: formData.features,
                image_urls: formData.images,
                // Only update address if it changed or exists
                address: formData.address ? {
                    province: formData.address.province,
                    district: formData.address.district,
                    ward: formData.address.ward,
                    street: formData.address.street
                } : undefined
            }

            mutate({ id, data: payload as any }, {
                onSuccess: () => {
                    toast.success("Cập nhật thông tin xe thành công!")
                    navigate("/mycars")
                },
                onError: (error) => {
                    console.error(error)
                    toast.error(`Cập nhật thất bại: ${error.message}`)
                }
            })
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            window.scrollTo(0, 0)
        } else {
            navigate("/mycars")
        }
    }

    if (isFetching) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 bg-gray-50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto max-w-3xl px-4">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin xe</h1>
                        <p className="text-gray-500 mt-1">Cập nhật các thông tin chi tiết về xe của bạn</p>
                    </div>

                    <StepIndicator currentStep={currentStep} />

                    <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
                        {currentStep === 1 && (
                            <BasicInfoForm data={formData} updateData={updateData} />
                        )}
                        {currentStep === 2 && (
                            <RentalConfigForm data={formData} updateData={updateData} />
                        )}
                        {currentStep === 3 && (
                            <ImageUploadForm data={formData} updateData={updateData} />
                        )}

                        <div className="mt-8 flex justify-between border-t border-gray-100 pt-6">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                {currentStep === 1 ? "Hủy bỏ" : "Quay lại"}
                            </Button>

                            <Button
                                onClick={handleNext}
                                className="min-w-[120px] bg-primary hover:bg-primary/90"
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Đang lưu..." : (currentStep === 3 ? "Lưu thay đổi" : "Kế tiếp")}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
