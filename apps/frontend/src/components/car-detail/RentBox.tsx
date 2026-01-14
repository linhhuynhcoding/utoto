import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Info, ShieldCheck } from "lucide-react"

export function RentBox() {
    return (
        <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24">
            <div className="flex items-end gap-2 mb-4">
                <h3 className="text-3xl font-bold text-primary">967K</h3>
                <span className="text-gray-500 mb-1.5 font-medium">/ngày</span>
                <span className="text-sm line-through text-gray-400 mb-2 ml-auto">1.007K</span>
            </div>

            <div className="space-y-4 mb-6">
                {/* Time Selection Mock */}
                <div className="grid grid-cols-2 gap-0 border rounded-lg overflow-hidden">
                    <div className="p-3 border-r bg-gray-50/50">
                        <label className="text-xs text-gray-500 font-semibold uppercase">Nhận xe</label>
                        <div className="font-medium">15/01/2026</div>
                        <div className="text-sm text-gray-600">21:00</div>
                    </div>
                    <div className="p-3 bg-gray-50/50">
                        <label className="text-xs text-gray-500 font-semibold uppercase">Trả xe</label>
                        <div className="font-medium">18/01/2026</div>
                        <div className="text-sm text-gray-600">20:00</div>
                    </div>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-md text-sm text-blue-800 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5" />
                    <p>Đơn giao tận nơi hiện chưa được hỗ trợ. Vui lòng nhận xe tại địa chỉ của chủ xe.</p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Đơn giá thuê</span>
                    <span className="font-medium">1.007.180đ /ngày</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">Bảo hiểm thuê xe <ShieldCheck className="h-3.5 w-3.5 text-green-600" /></span>
                    <span className="font-medium">87.734đ /ngày</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="insurance" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked />
                        <label htmlFor="insurance" className="font-medium">Bảo hiểm người trên xe</label>
                    </div>
                    <span className="font-medium">50.000đ /ngày</span>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                    <span>Tổng cộng</span>
                    <span>3.164.742đ</span>
                </div>
            </div>

            <Button className="w-full mt-6 text-lg py-6 font-bold uppercase tracking-wide bg-primary hover:bg-primary/90">
                Chọn thuê
            </Button>
        </div>
    )
}
