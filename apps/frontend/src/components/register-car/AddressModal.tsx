import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { X, MapPin } from "lucide-react"

interface AddressModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (address: string) => void
    initialAddress?: string
}

export function AddressModal({ isOpen, onClose, onSave }: AddressModalProps) {
    const [addressData, setAddressData] = React.useState({
        province: "",
        district: "",
        ward: "",
        street: "",
    })

    if (!isOpen) return null

    const handleSave = () => {
        // Mock address combination
        const fullAddress = `${addressData.street}, ${addressData.ward}, ${addressData.district}, ${addressData.province}`.replace(/^, /, "").replace(/, ,/g, ",")
        onSave(fullAddress || "Hồ Chí Minh")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold">Địa chỉ xe</h3>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Tỉnh/ Thành phố</Label>
                            <Select
                                value={addressData.province}
                                onChange={(e) => setAddressData({ ...addressData, province: e.target.value })}
                            >
                                <option value="">Chọn Tỉnh/ TP</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Quận/ Huyện</Label>
                            <Select
                                value={addressData.district}
                                onChange={(e) => setAddressData({ ...addressData, district: e.target.value })}
                            >
                                <option value="">Chọn Quận/ Huyện</option>
                                <option value="Quận 1">Quận 1</option>
                                <option value="Quận 2">Quận 2</option>
                                <option value="Quận 3">Quận 3</option>
                                <option value="Thủ Đức">Thủ Đức</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Phường/ Xã</Label>
                            <Select
                                value={addressData.ward}
                                onChange={(e) => setAddressData({ ...addressData, ward: e.target.value })}
                            >
                                <option value="">Chọn Phường/ Xã</option>
                                <option value="Phường 1">Phường 1</option>
                                <option value="Phường 2">Phường 2</option>
                                <option value="Thảo Điền">Thảo Điền</option>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Đường</Label>
                        <Input
                            placeholder="Tên đường, số nhà..."
                            value={addressData.street}
                            onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                        />
                    </div>

                    {/* Map Placeholder */}
                    <div className="flex h-48 w-full items-center justify-center rounded-md border-2 border-dashed bg-gray-50 text-gray-400">
                        <div className="flex flex-col items-center">
                            <MapPin className="h-8 w-8 mb-2" />
                            <span>Bản đồ (Mock)</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose}>Hủy</Button>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Xác nhận</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
