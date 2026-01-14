import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepIndicatorProps {
    currentStep: number
}

const steps = [
    { id: 1, label: "Thông tin" },
    { id: 2, label: "Cho thuê" },
    { id: 3, label: "Hình ảnh" },
]

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="mb-8 flex justify-center">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id
                    const isActive = currentStep === step.id

                    return (
                        <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                                        isActive || isCompleted
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-200 text-gray-500"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                                </div>
                                <span
                                    className={cn(
                                        "text-xs font-medium uppercase",
                                        isActive ? "text-green-600" : "text-gray-500"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "mx-4 h-[2px] w-12 md:w-24",
                                        currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
