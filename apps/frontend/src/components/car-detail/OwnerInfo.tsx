import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Zap } from "lucide-react"

interface OwnerInfoProps {
    name: string
    avatar: string
    isVerified?: boolean
}

export function OwnerInfo({ name, avatar, isVerified }: OwnerInfoProps) {
    return (
        <div className="flex items-start gap-4 p-6 bg-white rounded-lg border shadow-sm">
            <Avatar className="h-16 w-16">
                <AvatarImage src={avatar || ""} alt={name} />
                <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                    {name}
                    {isVerified && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold">Chủ xe 5*</span>}
                </h4>
                <div className="flex flex-wrap gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">5.0</span>
                        <span className="text-gray-500">(15 chuyến)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-green-600 fill-green-100" />
                        <span className="text-gray-600">Phản hồi <span className="font-medium text-green-600">100%</span></span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                    Chủ xe thân thiện, hỗ trợ nhiệt tình. Xe luôn sạch sẽ và bảo dưỡng định kỳ.
                </p>
            </div>
        </div>
    )
}
