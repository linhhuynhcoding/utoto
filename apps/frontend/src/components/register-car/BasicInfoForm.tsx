import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
    Map, Bluetooth, Camera, Video, EyeOff, Sidebar, Disc, Activity,
    Gauge, Sun, Navigation, Layers, LifeBuoy, MonitorPlay, Truck,
    CreditCard, ShieldCheck, Usb, Loader2
} from "lucide-react"
import { CarBrand } from "@utoto/shared"
import { useCarSettings } from "@/hooks/useCarSettings"

interface BasicInfoFormProps {
    data: any
    updateData: (data: any) => void
}

const FEATURE_ICONS: Record<string, any> = {
    "map": Map,
    "bluetooth": Bluetooth,
    "camera_360": Camera,
    "dash_cam": Video,
    "reverse_cam": EyeOff,
    "sidebar_cam": Sidebar,
    "tire_sensor": Disc,
    "collision_sensor": Activity,
    "speed_warning": Gauge,
    "sunroof": Sun,
    "gps": Navigation,
    "head_up": Layers,
    "spare_tire": LifeBuoy,
    "dvd": MonitorPlay,
    "trunk_lid": Truck,
    "etc": CreditCard,
    "airbag": ShieldCheck,
    "usb": Usb,
}

export function BasicInfoForm({ data, updateData }: BasicInfoFormProps) {
    const { data: settingsResponse, isLoading } = useCarSettings()

    const brands = settingsResponse?.data.brands || []
    const availableFeatures = settingsResponse?.data.features || []

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        // Reset model if brand changes
        if (name === "brand_id") {
            updateData({ ...data, [name]: value, model_id: "" })
        } else {
            updateData({ ...data, [name]: value })
        }
    }

    const handleFeatureToggle = (featureId: string) => {
        const currentFeatures = data.features || []
        const newFeatures = currentFeatures.includes(featureId)
            ? currentFeatures.filter((id: string) => id !== featureId)
            : [...currentFeatures, featureId]
        updateData({ ...data, features: newFeatures })
    }

    const selectedBrand = brands.find((b: CarBrand) => b.id === data.brand_id)
    const models = selectedBrand?.models || []

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* License Plate */}
            <div className="space-y-4 rounded-lg bg-orange-50 p-4 border border-orange-100">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <Label htmlFor="licensePlate" className="mb-2 block">Biển số xe</Label>
                        <Input
                            id="licensePlate"
                            name="licensePlate"
                            placeholder="51H-12345"
                            className="uppercase"
                            value={data.licensePlate || ""}
                            onChange={handleChange}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Lưu ý: Biển số xe sẽ không thể thay đổi sau khi đăng ký.
                            Vui lòng kiểm tra kỹ thông tin trước khi tiếp tục.
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Hãng xe</Label>
                        <Select name="brand_id" value={data.brand_id || ""} onChange={handleChange}>
                            <option value="">Chọn hãng xe</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Mẫu xe</Label>
                        <Select name="model_id" value={data.model_id || ""} onChange={handleChange} disabled={!data.brand_id}>
                            <option value="">Chọn mẫu xe</option>
                            {models.map(model => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Số ghế</Label>
                        <Select name="seats" value={data.seats || ""} onChange={handleChange}>
                            <option value="">Chọn số ghế</option>
                            <option value="4">4 ghế</option>
                            <option value="5">5 ghế</option>
                            <option value="7">7 ghế</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Năm sản xuất</Label>
                        <Select name="year" value={data.year || ""} onChange={handleChange}>
                            <option value="">Chọn năm</option>
                            {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Truyền động</Label>
                        <Select name="transmission" value={data.transmission || ""} onChange={handleChange}>
                            <option value="">Chọn truyền động</option>
                            <option value="MANUAL">Số sàn</option>
                            <option value="AUTOMATIC">Số tự động</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Nhiên liệu</Label>
                        <Select name="fuel" value={data.fuel || ""} onChange={handleChange}>
                            <option value="">Chọn nhiên liệu</option>
                            <option value="GASOLINE">Xăng</option>
                            <option value="DIESEL">Dầu</option>
                            <option value="ELECTRIC">Điện</option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Consumption */}
            <div className="space-y-2">
                <Label>Mức tiêu thụ nhiên liệu (lít/100km)</Label>
                <Input
                    name="consumption"
                    type="number"
                    placeholder="Ví dụ: 7"
                    value={data.consumption || ""}
                    onChange={handleChange}
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                    name="description"
                    placeholder="Mô tả chi tiết về xe của bạn..."
                    value={data.description || ""}
                    onChange={handleChange}
                    rows={4}
                />
            </div>

            {/* Features */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tính năng</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {availableFeatures.map((feature) => {
                        const Icon = FEATURE_ICONS[feature.id] || Map
                        const isChecked = (data.features || []).includes(feature.id)
                        return (
                            <div
                                key={feature.id}
                                onClick={() => handleFeatureToggle(feature.id)}
                                className={cn(
                                    "cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-gray-50",
                                    isChecked
                                        ? "border-green-600 bg-green-50 text-green-700"
                                        : "border-gray-100 bg-white text-gray-600"
                                )}
                            >
                                <Icon className={cn("h-8 w-8", isChecked ? "text-green-600" : "text-gray-400")} />
                                <span className={cn("text-sm font-medium text-center", isChecked && "font-bold")}>
                                    {feature.name || feature.id}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
