import { useState } from "react"
import { Star, MapPin, Share2, Heart, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CarBasicInfoProps {
    name: string
    rating: number
    trips: number
    location: string
    tags?: string[]
}

export function CarBasicInfo({ name, rating, trips, location, tags = [] }: CarBasicInfoProps) {
    const [isFavorite, setIsFavorite] = useState(false)

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Đã sao chép liên kết!")
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite)
        if (!isFavorite) {
            toast.success("Đã thêm vào mục yêu thích!")
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 uppercase">{name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                        </div>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                            <ShieldCheck className="h-4 w-4" />
                            {trips} chuyến
                        </div>
                        <span className="w-1 h-1 bg-gray-300 rounded-full hidden md:block"></span>
                        <div className="hidden md:flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {location}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-none px-3 py-1 font-normal">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                            "rounded-full transition-colors",
                            isFavorite ? "text-red-500 bg-red-50 border-red-200" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                        )}
                        onClick={toggleFavorite}
                    >
                        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </Button>
                </div>
            </div>

            <div className="md:hidden flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-500" />
                {location}
            </div>
        </div>
    )
}
