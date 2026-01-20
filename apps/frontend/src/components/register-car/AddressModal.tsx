import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { X, MapPin } from "lucide-react"
import { fetchProvinces, fetchDistricts, fetchWards } from "@/api/location"
import { Province, District, Ward } from "@utoto/shared"

interface AddressModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (address: any) => void
    initialAddress?: any
}

export function AddressModal({ isOpen, onClose, onSave }: AddressModalProps) {
    const [addressData, setAddressData] = React.useState({
        province: "",
        district: "",
        ward: "",
        street: "",
    })

    const [provinces, setProvinces] = React.useState<Province[]>([])
    const [districts, setDistricts] = React.useState<District[]>([])
    const [wards, setWards] = React.useState<Ward[]>([])

    React.useEffect(() => {
        if (isOpen) {
            fetchProvinces().then(setProvinces).catch(console.error)
        }
    }, [isOpen])

    React.useEffect(() => {
        if (addressData.province) {
            fetchDistricts(addressData.province).then(setDistricts).catch(console.error)
            setAddressData(prev => ({ ...prev, district: "", ward: "" }))
            setWards([])
        } else {
            setDistricts([])
            setWards([])
        }
    }, [addressData.province])

    React.useEffect(() => {
        if (addressData.district) {
            fetchWards(addressData.district).then(setWards).catch(console.error)
            setAddressData(prev => ({ ...prev, ward: "" }))
        } else {
            setWards([])
        }
    }, [addressData.district])

    if (!isOpen) return null

    const handleSave = () => {
        const provinceName = provinces.find(p => p.code === addressData.province)?.name || ""
        const districtName = districts.find(d => d.code === addressData.district)?.name || ""
        const wardName = wards.find(w => w.code === addressData.ward)?.name || ""

        // const fullAddress = `${addressData.street}, ${wardName}, ${districtName}, ${provinceName}`.replace(/^, /, "").replace(/, ,/g, ",")
        onSave({
            ...addressData,
            province_name: provinceName,
            district_name: districtName,
            ward_name: wardName
        })
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
                                {provinces.map(p => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Quận/ Huyện</Label>
                            <Select
                                value={addressData.district}
                                onChange={(e) => setAddressData({ ...addressData, district: e.target.value })}
                                disabled={!addressData.province}
                            >
                                <option value="">Chọn Quận/ Huyện</option>
                                {districts.map(d => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Phường/ Xã</Label>
                            <Select
                                value={addressData.ward}
                                onChange={(e) => setAddressData({ ...addressData, ward: e.target.value })}
                                disabled={!addressData.district}
                            >
                                <option value="">Chọn Phường/ Xã</option>
                                {wards.map(w => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
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
