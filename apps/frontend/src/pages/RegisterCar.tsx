import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/register-car/StepIndicator"
import { BasicInfoForm } from "@/components/register-car/BasicInfoForm"
import { RentalConfigForm } from "@/components/register-car/RentalConfigForm"
import { ImageUploadForm } from "@/components/register-car/ImageUploadForm"
import { useRegisterCar } from "@/hooks/useCars"
import { toast } from "sonner"

export default function RegisterCar() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Step 1
        brand_id: "",
        model_id: "",
        licensePlate: "",
        // make: "", // Removed in favor of brand_id
        // model: "", // Removed in favor of model_id
        seats: 4,
        year: new Date().getFullYear(),
        transmission: "MANUAL",
        fuel: "GASOLINE",
        consumption: "",
        description: "",
        features: [],
        // Step 2
        price: 1500,
        hasDiscount: true,
        weeklyDiscount: 10,
        hasDelivery: true,
        maxDeliveryDistance: 15,
        deliveryFee: 15,
        address: null as any,
        hasLimit: true,
        maxKmPerDay: 400,
        terms: "",
        // Step 3
        images: []
    })

    const { mutate, isPending } = useRegisterCar()

    const updateData = (newData: any) => {
        setFormData((prev) => ({ ...prev, ...newData }))
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
            window.scrollTo(0, 0)
        } else {
            // Prepare payload
            const payload = {
                license_number: formData.licensePlate,
                desc: formData.description,
                yom: Number(formData.year),
                model_id: formData.model_id,
                transmission: formData.transmission as "MANUAL" | "AUTOMATIC",
                seat: parseInt(String(formData.seats)),
                engine_type: formData.fuel as "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID",
                price: Number(formData.price),
                deliveryFee: Number(formData.deliveryFee),
                deliveryRadius: Number(formData.maxDeliveryDistance),
                feature_ids: formData.features,
                image_urls: formData.images,
                address: formData.address ? {
                    province: formData.address.province,
                    district: formData.address.district,
                    ward: formData.address.ward,
                    street: formData.address.street
                } : undefined,
                // Map other optional pricing fields if they exist in form or use defaults
                hasLimit: formData.hasLimit,
                maxKmPerDay: Number(formData.maxKmPerDay),
                terms: formData.terms
            }

            console.log("Submitting payload:", payload)

            mutate(payload as any, {
                onSuccess: () => {
                    toast.success("Đăng ký xe thành công!")
                    navigate("/")
                },
                onError: (error: any) => {
                    console.error("Registration error:", error)
                    const errorMessage = error?.response?.data?.message || error.message || "Đã có lỗi xảy ra"
                    toast.error("Đăng ký thất bại", {
                        description: errorMessage
                    })
                }
            })
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            window.scrollTo(0, 0)
        } else {
            navigate(-1) // Or back to My Cars
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 bg-gray-50 py-8">
                <div className="container mx-auto max-w-3xl px-4">

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Đăng ký xe cho thuê</h1>
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
                                className="min-w-[120px] bg-green-600 hover:bg-green-700"
                                disabled={isPending}
                            >
                                {isPending ? "Đang xử lý..." : (currentStep === 3 ? "Đăng ký" : "Kế tiếp")}
                            </Button>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}
