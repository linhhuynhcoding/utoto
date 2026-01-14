import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Zap, Gauge, User } from "lucide-react"

interface CarProps {
    name: string
    image: string
    price: string
    originalPrice?: string
    rating: number
    trips: number
    location: string
    transmission: "Tự động" | "Số sàn"
    fuel: "Xăng" | "Dầu" | "Điện"
    seats: number
    tags?: string[]
}

export default function CarCard({ car }: { car: CarProps }) {
    return (
        <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={car.image}
                    alt={car.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-400 hover:bg-yellow-500 text-black border-none">
                        Giảm 10%
                    </Badge>
                </div>
                <div className="absolute bottom-2 left-2 flex gap-1">
                    {car.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100/80">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">{car.name}</h3>

                <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Gauge className="h-3 w-3" /> {car.transmission}
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {car.seats} chỗ
                    </div>
                    <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" /> {car.fuel}
                    </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3 truncate">
                    <MapPin className="h-3 w-3 shrink-0" /> {car.location}
                </div>

                <div className="my-2 h-px bg-border" />

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{car.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-xs">• {car.trips} chuyến</span>
                    </div>
                    <div className="text-right">
                        {car.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through block">{car.originalPrice}</span>
                        )}
                        <div className="font-bold text-primary">
                            {car.price} <span className="text-xs font-normal text-muted-foreground">/ngày</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
