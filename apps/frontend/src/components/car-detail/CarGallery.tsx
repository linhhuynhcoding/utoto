import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Image as ImageIcon, X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CarGalleryProps {
    images: string[]
}

export function CarGallery({ images }: CarGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    return (
        <>
            <div className="w-full bg-black/5 relative group">
                {/* Main Image Stage */}
                <div
                    className="relative h-[300px] md:h-[500px] w-full overflow-hidden flex items-center justify-center bg-gray-100 cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            alt={`Car image ${currentIndex + 1}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full object-contain"
                        />
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full shadow-md" onClick={prevSlide}>
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full shadow-md" onClick={nextSlide}>
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Zoom Hint */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md">
                            <Maximize2 className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm z-10">
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

            {/* Custom Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4 text-white hover:bg-white/20 z-[110] h-10 w-10"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="h-8 w-8" />
                        </Button>

                        <div className="relative w-full h-full flex items-center justify-center cursor-default" onClick={(e) => e.stopPropagation()}>
                            <motion.img
                                key={currentIndex}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                src={images[currentIndex]}
                                alt="Full car"
                                className="max-w-full max-h-full object-contain pointer-events-none"
                            />

                            {/* Lightbox Nav */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-8">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-16 w-16 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                >
                                    <ChevronLeft className="h-12 w-12" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-16 w-16 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                >
                                    <ChevronRight className="h-12 w-12" />
                                </Button>
                            </div>

                            {/* Counter in Lightbox */}
                            <div className="absolute bottom-4 text-white/70 font-medium">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
