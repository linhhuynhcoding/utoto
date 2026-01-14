import * as React from "react"
import { Upload, ImageIcon, X } from "lucide-react"

interface ImageUploadFormProps {
    data: any
    updateData: (data: any) => void
}

export function ImageUploadForm({ data, updateData }: ImageUploadFormProps) {
    const [images, setImages] = React.useState<string[]>([])

    // Simple mock image upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Mock: Creating a fake URL for the uploaded file
            // In a real app, this would be uploaded to a server or converted to base64
            const newImage = URL.createObjectURL(e.target.files[0])
            const updatedImages = [...images, newImage]
            setImages(updatedImages)
            updateData({ ...data, images: updatedImages })
        }
    }

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
        updateData({ ...data, images: updatedImages })
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h3 className="text-lg font-semibold">Đăng tải hình ảnh xe</h3>
                <p className="text-sm text-gray-500">
                    Đăng nhiều hình ảnh ở các góc độ khác nhau để tăng sự tin cậy cho khách thuê.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {/* Upload Button */}
                <div className="relative flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={handleFileChange}
                    />
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Thêm ảnh</span>
                </div>

                {/* List placeholder images (Mocked from previous HTML context if needed, or just allow adding new ones) */}
                {images.map((img, idx) => (
                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border bg-white">
                        <img src={img} alt={`Car ${idx}`} className="h-full w-full object-cover" />
                        <button
                            onClick={() => removeImage(idx)}
                            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {/* If empty, show some placeholders to look good */}
                {images.length === 0 && (
                    <>
                        <div className="flex aspect-square items-center justify-center rounded-lg border bg-gray-50">
                            <ImageIcon className="h-8 w-8 text-gray-200" />
                        </div>
                        <div className="flex aspect-square items-center justify-center rounded-lg border bg-gray-50">
                            <ImageIcon className="h-8 w-8 text-gray-200" />
                        </div>
                        <div className="flex aspect-square items-center justify-center rounded-lg border bg-gray-50">
                            <ImageIcon className="h-8 w-8 text-gray-200" />
                        </div>
                    </>
                )}
            </div>

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                <p className="font-semibold">Mẹo chụp ảnh:</p>
                <ul className="list-disc pl-5">
                    <li>Chụp xe ở nơi có ánh sáng tốt.</li>
                    <li>Chụp đủ 4 góc của xe (Trước, Sau, Trái, Phải).</li>
                    <li>Chụp nội thất xe và khoang hành lý.</li>
                </ul>
            </div>
        </div>
    )
}
