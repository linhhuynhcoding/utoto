import { Fuel, Zap, Settings, ShieldCheck, Map, Bluetooth, CreditCard, Wind, Layout } from "lucide-react"

export function CarFeatures() {
    const features = [
        { icon: Layout, label: "Số ghế", value: "7 ghế" },
        { icon: Settings, label: "Truyền động", value: "Số tự động" },
        { icon: Fuel, label: "Nhiên liệu", value: "Xăng" },
        { icon: Zap, label: "Năng lượng", value: "7L / 100km" },
    ]

    const amenities = [
        { icon: Map, label: "Bản đồ" },
        { icon: Bluetooth, label: "Bluetooth" },
        { icon: ShieldCheck, label: "Camera 360" },
        { icon: ShieldCheck, label: "Camera hành trình" },
        { icon: ShieldCheck, label: "Cảm biến va chạm" },
        { icon: Wind, label: "Cửa sổ trời" },
        { icon: CreditCard, label: "ETC" },
    ]

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-center">
                        <item.icon className="h-6 w-6 text-gray-500 mb-2" />
                        <span className="text-sm text-gray-500 mb-1">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>

            <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Tiện nghi khác</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-full text-green-600">
                                <item.icon className="h-4 w-4" />
                            </div>
                            <span className="text-gray-700">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
