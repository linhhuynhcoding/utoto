import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, MapPin, X } from "lucide-react"
import { fetchProvinces, fetchDistricts, fetchWards } from "@/api/location"
import { Select } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

interface LocationPickerProps {
    onChange?: (value: { province: string; district: string; ward: string }) => void
}

export default function LocationPicker({ onChange }: LocationPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pickerRef = useRef<HTMLDivElement>(null)

    // Selection State - Default to HCM (79)
    const [provinceCode, setProvinceCode] = useState<string>("79")
    const [districtCode, setDistrictCode] = useState<string>("")
    const [wardCode, setWardCode] = useState<string>("")

    // Data Fetching
    const { data: provinces } = useQuery({
        queryKey: ["provinces"],
        queryFn: fetchProvinces
    })

    const { data: districts } = useQuery({
        queryKey: ["districts", provinceCode],
        queryFn: () => fetchDistricts(provinceCode),
        enabled: !!provinceCode
    })

    const { data: wards } = useQuery({
        queryKey: ["wards", districtCode],
        queryFn: () => fetchWards(districtCode),
        enabled: !!districtCode
    })

    // Notify parent on change
    useEffect(() => {
        onChange?.({ province: provinceCode, district: districtCode, ward: wardCode })
    }, [provinceCode, districtCode, wardCode, onChange])

    // Display Text Logic
    const getDisplayText = () => {
        if (wardCode && districtCode && provinceCode) {
            const p = provinces?.find(p => p.code === provinceCode)?.name
            const d = districts?.find(d => d.code === districtCode)?.name
            const w = wards?.find(w => w.code === wardCode)?.name
            return `${w}, ${d}, ${p}`
        }
        if (provinceCode) {
            const p = provinces?.find(p => p.code === provinceCode)?.name
            return p || "TP. Hồ Chí Minh"
        }
        return "TP. Hồ Chí Minh"
    }

    return (
        <div className="relative" ref={pickerRef}>
            {/* Trigger Button - Premium Style */}
            <div
                className={cn(
                    "h-[52px] rounded-2xl border px-5 text-sm flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all bg-white shadow-sm hover:shadow-md",
                    isOpen && "ring-2 ring-primary/20 border-primary"
                )}
                onClick={() => setIsOpen(true)}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate font-bold text-base">{getDisplayText()}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-300", isOpen && "rotate-180")} />
            </div>

            {/* Modal - Centered with backdrop (Rendered via Portal) */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pointer-events-none">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-[4px] pointer-events-auto"
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-[480px] bg-background border rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-8 md:p-10 pointer-events-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="font-black text-3xl tracking-tight">Địa điểm xe</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-3 hover:bg-muted rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-primary/60 uppercase tracking-[0.2em] ml-1">Tỉnh / Thành phố</label>
                                        <Select
                                            value={provinceCode}
                                            className="h-14 rounded-2xl text-base font-bold border-2 hover:border-primary/30 transition-all font-sans px-6"
                                            onChange={(e) => {
                                                setProvinceCode(e.target.value)
                                                setDistrictCode("") // Reset district
                                                setWardCode("")     // Reset ward
                                            }}
                                        >
                                            <option value="" disabled>Chọn tỉnh thành</option>
                                            {provinces?.map((p) => (
                                                <option key={p.code} value={p.code}>{p.name}</option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-primary/60 uppercase tracking-[0.2em] ml-1">Quận / Huyện</label>
                                        <Select
                                            value={districtCode}
                                            className={cn(
                                                "h-14 rounded-2xl text-base font-bold border-2 hover:border-primary/30 transition-all font-sans px-6",
                                                !provinceCode && "opacity-50"
                                            )}
                                            onChange={(e) => {
                                                setDistrictCode(e.target.value)
                                                setWardCode("") // Reset ward
                                            }}
                                            disabled={!provinceCode}
                                        >
                                            <option value="" disabled>Chọn quận huyện</option>
                                            {districts?.map((d) => (
                                                <option key={d.code} value={d.code}>{d.name}</option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-primary/60 uppercase tracking-[0.2em] ml-1">Phường / Xã</label>
                                        <Select
                                            value={wardCode}
                                            className={cn(
                                                "h-14 rounded-2xl text-base font-bold border-2 hover:border-primary/30 transition-all font-sans px-6",
                                                !districtCode && "opacity-50"
                                            )}
                                            onChange={(e) => setWardCode(e.target.value)}
                                            disabled={!districtCode}
                                        >
                                            <option value="" disabled>Chọn phường xã</option>
                                            {wards?.map((w) => (
                                                <option key={w.code} value={w.code}>{w.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <button
                                        className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--muted-foreground) / 0.15);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--primary) / 0.4);
                }
            `}} />
        </div>
    )
}
