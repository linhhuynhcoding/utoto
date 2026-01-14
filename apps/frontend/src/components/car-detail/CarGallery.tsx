import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CarGalleryProps {
    images: string[]
}

export function CarGallery({ images }: CarGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    return (
        <div className="w-full bg-black/5 relative group">
            {/* Main Image Stage */}
            <div className="relative h-[300px] md:h-[480px] w-full overflow-hidden flex items-center justify-center bg-gray-100">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Car image ${currentIndex + 1}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full object-contain md:object-cover"
                    />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full" onClick={prevSlide}>
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full" onClick={nextSlide}>
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                {/* Image Counter Badge */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                    <ImageIcon className="h-4 w-4" />
                    <span>{currentIndex + 1} / {images.length}</span>
                </div>
            </div>

            {/* Thumbnails (Desktop) */}
            <div className="hidden md:flex gap-2 p-2 overflow-x-auto justify-center bg-white border-b">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                            "relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                            currentIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                    >
                        <img src={img} alt={`Thumb ${idx}`} className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    )
}
