import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { AddressModal } from "./AddressModal"

interface RentalConfigFormProps {
    data: any
    updateData: (data: any) => void
}

export function RentalConfigForm({ data, updateData }: RentalConfigFormProps) {
    const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        // Handle sliders specifically as numbers
        const finalValue = type === 'range' ? Number(value) : value
        updateData({ ...data, [name]: finalValue })
    }

    const handleSwitchChange = (name: string, checked: boolean) => {
        updateData({ ...data, [name]: checked })
    }

    return (
        <div className="space-y-8">

            {/* Price */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Đơn giá thuê mặc định</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Label>Đơn giá (K)</Label>
                        <div className="relative mt-2">
                            <Input
                                type="number"
                                name="price"
                                value={data.price || 1500}
                                onChange={handleChange}
                                className="pr-12"
                            />
                            <span className="absolute right-3 top-2.5 text-sm text-gray-500">K</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Giá đề xuất: 1500K - 2000K
                        </p>
                    </div>
                </div>
            </div>

            {/* Discount */}
            <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold">Giảm giá</h4>
                        <p className="text-sm text-gray-500">Giảm giá cho thuê tuần/tháng</p>
                    </div>
                    <Switch
                        checked={data.hasDiscount}
                        onCheckedChange={(checked) => handleSwitchChange("hasDiscount", checked)}
                    />
                </div>
                {data.hasDiscount && (
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Giảm giá thuê tuần (% trên đơn giá)</Label>
                                <span className="font-bold text-green-600">{data.weeklyDiscount || 0}%</span>
                            </div>
                            <input
                                type="range"
                                name="weeklyDiscount"
                                min="0" max="50"
                                value={data.weeklyDiscount || 0}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}
            </div>


            {/* Address */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Địa chỉ xe</h3>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            value={data.address ? `${data.address.street}, ${data.address.ward_name || '...'}, ${data.address.district_name || '...'}, ${data.address.province_name || '...'}` : ""}
                            readOnly
                            placeholder="Chưa có địa chỉ"
                            className="pl-10"
                        />
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <Button variant="outline" onClick={() => setIsAddressModalOpen(true)}>
                        Thay đổi
                    </Button>
                </div>
            </div>

            {/* Delivery */}
            <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold">Giao xe tận nơi</h4>
                        <p className="text-sm text-gray-500">Cung cấp dịch vụ giao xe cho khách</p>
                    </div>
                    <Switch
                        checked={data.hasDelivery}
                        onCheckedChange={(checked) => handleSwitchChange("hasDelivery", checked)}
                    />
                </div>
                {data.hasDelivery && (
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Quãng đường giao xe tối đa (km)</Label>
                                <span className="font-bold">{data.maxDeliveryDistance || 15}km</span>
                            </div>
                            <input
                                type="range"
                                name="maxDeliveryDistance"
                                min="0" max="50"
                                value={data.maxDeliveryDistance || 15}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Phí giao nhận xe cho mỗi km (k)</Label>
                                <span className="font-bold">{data.deliveryFee || 15}k</span>
                            </div>
                            <input
                                type="range"
                                name="deliveryFee"
                                min="0" max="50"
                                value={data.deliveryFee || 15}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Mileage Limit */}
            <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold">Giới hạn số km</h4>
                        <p className="text-sm text-gray-500">Giới hạn số km tối đa trong ngày</p>
                    </div>
                    <Switch
                        checked={data.hasLimit}
                        onCheckedChange={(checked) => handleSwitchChange("hasLimit", checked)}
                    />
                </div>
                {data.hasLimit && (
                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Số km tối đa trong 1 ngày</Label>
                                <span className="font-bold">{data.maxKmPerDay || 400}km</span>
                            </div>
                            <input
                                type="range"
                                name="maxKmPerDay"
                                min="100" max="1000" step="50"
                                value={data.maxKmPerDay || 400}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Terms */}
            <div className="space-y-2">
                <Label>Điều khoản thuê xe</Label>
                <Textarea
                    name="terms"
                    placeholder="Ghi chú thêm về quy định (Không hút thuốc, không chở thú cưng...)"
                    rows={4}
                    value={data.terms || ""}
                    onChange={handleChange}
                />
            </div>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSave={(addr) => updateData({ ...data, address: addr })}
                initialAddress={data.address}
            />

        </div>
    )
}
