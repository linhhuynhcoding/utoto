import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/register-car/StepIndicator"
import { BasicInfoForm } from "@/components/register-car/BasicInfoForm"
import { RentalConfigForm } from "@/components/register-car/RentalConfigForm"
import { ImageUploadForm } from "@/components/register-car/ImageUploadForm"

export default function RegisterCar() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Step 1
        licensePlate: "",
        make: "",
        model: "",
        seats: "",
        year: "",
        transmission: "",
        fuel: "",
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
        address: "",
        hasLimit: true,
        maxKmPerDay: 400,
        terms: "",
        // Step 3
        images: []
    })

    const updateData = (newData: any) => {
        setFormData((prev) => ({ ...prev, ...newData }))
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
            window.scrollTo(0, 0)
        } else {
            // Submit
            console.log("Submitting forms:", formData)
            alert("Đăng ký xe thành công! (Dữ liệu đã được log ra console)")
            navigate("/")
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
                            >
                                {currentStep === 3 ? "Đăng ký" : "Kế tiếp"}
                            </Button>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}
