import { Fuel, Settings, Map, Bluetooth, ShieldCheck, Wind, CreditCard, Layout, Car } from "lucide-react"
import { Feature } from "@utoto/shared"

interface CarFeaturesProps {
    seat: number
    transmission: string
    engineType: string
    features: Feature[]
}

const getFeatureIcon = (name: string | null) => {
    if (!name) return Car
    const n = name.toLowerCase()
    if (n.includes("bản đồ")) return Map
    if (n.includes("bluetooth")) return Bluetooth
    if (n.includes("camera 360") || n.includes("camera hành trình") || n.includes("cảm biến")) return ShieldCheck
    if (n.includes("cửa sổ trời")) return Wind
    if (n.includes("etc")) return CreditCard
    return Car
}

export function CarFeatures({ seat, transmission, engineType, features }: CarFeaturesProps) {
    const mainFeatures = [
        { icon: Layout, label: "Số ghế", value: `${seat} ghế` },
        { icon: Settings, label: "Truyền động", value: transmission === "AUTOMATIC" ? "Số tự động" : "Số sàn" },
        { icon: Fuel, label: "Nhiên liệu", value: engineType === "GASOLINE" ? "Xăng" : engineType === "DIESEL" ? "Dầu" : engineType === "ELECTRIC" ? "Điện" : "Hybrid" },
    ]

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mainFeatures.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-center">
                        <item.icon className="h-6 w-6 text-gray-500 mb-2" />
                        <span className="text-sm text-gray-500 mb-1">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>

            {features && features.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">Tiện nghi khác</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {features.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-full text-green-600">
                                    {/* Try to use logo if it's a valid icon name or use mapping */}
                                    {(() => {
                                        const Icon = getFeatureIcon(item.name)
                                        return <Icon className="h-4 w-4" />
                                    })()}
                                </div>
                                <span className="text-gray-700">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
