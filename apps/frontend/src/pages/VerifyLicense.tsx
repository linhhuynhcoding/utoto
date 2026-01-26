import { useState } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { verificationService, DrivingLicenseData } from "@/services/verification.service"
import { Loader2, Upload, CheckCircle2, AlertCircle } from "lucide-react"

import { useAuth } from "@/contexts"

export default function VerifyLicense() {
    const { updateUser } = useAuth()
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<DrivingLicenseData | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError(null)
            setResult(null)
        }
    }

    const handleVerify = async () => {
        if (!file) {
            toast.error("Vui lòng chọn ảnh giấy phép lái xe")
            return
        }

        setIsLoading(true)
        setError(null)
        setResult(null)
        
        try {
            const response = await verificationService.verifyLicense(file)
            if (response.success) {
                setResult(response.data.extracted)
                
                // Update Global User State
                const updatedUser = response.data.user
                updateUser({
                    ...updatedUser,
                    verified: {
                        ...updatedUser.verified,
                        driverLicense: true
                    }
                })
                
                toast.success("Xác minh thành công! Hồ sơ đã được cập nhật.")
            }
        } catch (error: any) {
            console.error(error)
            const errorMessage = error.response?.data?.message || "Không thể xác minh ảnh này. Vui lòng đảm bảo ảnh rõ nét, đầy đủ ánh sáng và là GPLX hợp lệ."
            setError(errorMessage)
            toast.error("Xác minh thất bại")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container py-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <ProfileSidebar />
                    
                    <div className="flex-1 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle>Xác minh giấy phép lái xe (GPLX)</CardTitle>
                                <CardDescription>Hệ thống sử dụng AI để tự động trích xuất thông tin từ ảnh GPLX của bạn.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="license-image">Ảnh mặt trước GPLX</Label>
                                    <Input id="license-image" type="file" accept="image/*" onChange={handleFileChange} />
                                </div>

                                <Button onClick={handleVerify} disabled={isLoading || !file} className="w-full max-w-sm">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Xác minh ngay
                                        </>
                                    )}
                                </Button>

                                {error && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-sm">Xác minh thất bại</h4>
                                            <p className="text-sm mt-1">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {result && (
                                    <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-4 text-green-700 font-semibold">
                                            <CheckCircle2 className="h-5 w-5" />
                                            Thông tin đã được xác thực
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 block">Số GPLX</span>
                                                <span className="font-medium">
                                                    {(() => {
                                                        const code = result.id;
                                                        if (!code) return '---';
                                                        if (code.length < 6) return code;
                                                        return `${code.slice(0, 3)}xxxx${code.slice(-3)}`;
                                                    })()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Họ và tên</span>
                                                <span className="font-medium">{result.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Ngày sinh</span>
                                                <span className="font-medium">{result.dob}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Hạng</span>
                                                <span className="font-medium">{result.class}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Ngày cấp</span>
                                                <span className="font-medium">{result.date}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Ngày hết hạn</span>
                                                <span className="font-medium">{result.doe}</span>
                                            </div>
                                            <div className="md:col-span-2">
                                                <span className="text-gray-500 block">Nơi thường trú</span>
                                                <span className="font-medium">{result.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
