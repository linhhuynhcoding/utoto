import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function ReviewsList() {
    const reviews = [
        {
            user: "Nguyễn Văn A",
            avatar: "",
            date: "12/01/2026",
            rating: 5,
            comment: "Xe sạch sẽ, chạy êm, chủ xe nhiệt tình. Sẽ ủng hộ lần sau.",
        },
        {
            user: "Trần Thị B",
            avatar: "",
            date: "10/01/2026",
            rating: 4,
            comment: "Xe ổn, nhận xe hơi trễ một chút nhưng không sao.",
        },
    ]

    return (
        <div className="space-y-6">
            {reviews.map((review, idx) => (
                <div key={idx} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h5 className="font-semibold text-gray-900">{review.user}</h5>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <span>•</span>
                                    <span>{review.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
            ))}

            <button className="text-primary font-medium text-sm hover:underline">Xem tất cả 15 đánh giá</button>
        </div>
    )
}
