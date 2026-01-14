import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Zap } from "lucide-react"

export function OwnerInfo() {
    return (
        <div className="flex items-start gap-4 p-6 bg-white rounded-lg border shadow-sm">
            <Avatar className="h-16 w-16">
                <AvatarImage src="https://n1-astg.mioto.vn/g/2026/00/03/16/Sn2hPp2JiLUvvN3HYG9vbQ.jpg" />
                <AvatarFallback>LH</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">Huỳnh Vũ Nhật Linh</h4>
                <div className="flex flex-wrap gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">4.9</span>
                        <span className="text-gray-500">(15 chuyến)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-green-600 fill-green-100" />
                        <span className="text-gray-600">Phản hồi <span className="font-medium text-green-600">100%</span></span>
                    </div>
                    <div className="text-gray-600">
                        Tham gia: <span className="font-medium">15/05/2023</span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                    Chủ xe thân thiện, hỗ trợ nhiệt tình. Xe luôn sạch sẽ và bảo dưỡng định kỳ.
                </p>
            </div>
        </div>
    )
}
