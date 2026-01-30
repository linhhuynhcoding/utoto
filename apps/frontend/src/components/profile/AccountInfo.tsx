import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Pencil, CheckCircle2, AlertCircle, XCircle, Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts"
import { useEffect, useState } from "react"
import { userService } from "@/services/user.service"
import { UserResponse, UpdateProfile, TripStats } from "@utoto/shared"
import toast from "@/hooks/use-toast"
import { EditProfileDialog } from "./EditProfileDialog"
import { EditFieldDialog } from "./EditFieldDialog"

export function AccountInfo() {
    const { user: authUser } = useAuth()
    const [userProfile, setUserProfile] = useState<UserResponse | null>(null)
    const [tripStats, setTripStats] = useState<TripStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [editingField, setEditingField] = useState<{
        fieldName: keyof UpdateProfile
        fieldLabel: string
        currentValue: string
        fieldType?: "text" | "date" | "tel"
        placeholder?: string
    } | null>(null)

    useEffect(() => {
        fetchUserProfile()
        fetchTripStats()
    }, [])

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true)
            const profile = await userService.getProfile()
            setUserProfile(profile)
        } catch (error: any) {
            toast.error("Không thể tải thông tin profile", error?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTripStats = async () => {
        try {
            const stats = await userService.getTripStats()
            setTripStats(stats)
        } catch (error: any) {
            console.error('Failed to fetch trip stats:', error)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ảnh quá lớn", "Kích thước tối đa 5MB")
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("File không hợp lệ", "Vui lòng chọn file ảnh")
            return
        }

        try {
            setIsUploadingAvatar(true)
            await userService.uploadAvatar(file)
            toast.success("Cập nhật avatar thành công")
            await fetchUserProfile()
        } catch (error: any) {
            toast.error("Upload avatar thất bại", error?.response?.data?.message || "Vui lòng thử lại")
        } finally {
            setIsUploadingAvatar(false)
            // Reset input
            e.target.value = ''
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const user = userProfile || authUser

    const getUserInitials = () => {
        if (!user?.name) return 'U'
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <div className="space-y-6">
            {/* Account Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white rounded-lg border shadow-sm">
                <div className="flex items-center gap-2">
                    <h5 className="text-lg font-bold">Thông tin tài khoản</h5>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => setIsEditDialogOpen(true)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Total trips */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        <span className="font-semibold">{tripStats?.totalTrips || 0}</span>
                        <span>tổng</span>
                    </div>
                    {/* Completed trips */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="font-semibold">{tripStats?.completedTrips || 0}</span>
                        <span>hoàn thành</span>
                    </div>
                    {/* Ongoing trips */}
                    {(tripStats?.ongoingTrips || 0) > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span className="font-semibold">{tripStats?.ongoingTrips}</span>
                            <span>đang diễn ra</span>
                        </div>
                    )}
                    {/* Cancelled trips */}
                    {(tripStats?.cancelledTrips || 0) > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                            <XCircle className="h-3.5 w-3.5" />
                            <span className="font-semibold">{tripStats?.cancelledTrips}</span>
                            <span>đã hủy</span>
                        </div>
                    )}
                </div>
            </div>

            {/* User Profile Summary */}
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border shadow-sm text-center">
                <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                        <AvatarImage src={user?.avatar || undefined} />
                        <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload">
                        <Button 
                            size="icon" 
                            variant="secondary" 
                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md cursor-pointer"
                            disabled={isUploadingAvatar}
                            asChild
                        >
                            <div>
                                {isUploadingAvatar ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Pencil className="h-3.5 w-3.5" />
                                )}
                            </div>
                        </Button>
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                    />
                </div>
                <h2 className="text-xl font-bold mb-1">{user?.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground mb-4">Tham gia: {user?.id ? new Date().toLocaleDateString('vi-VN') : '--/--/----'}</p>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                    <span>{user?.points || 0} điểm</span>
                </div>
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mb-1">Ngày sinh</p>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => setEditingField({
                                fieldName: 'dob',
                                fieldLabel: 'Ngày sinh',
                                currentValue: user?.dob || '',
                                fieldType: 'date'
                            })}
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </div>
                    <p className="font-medium">{user?.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : '--/--/----'}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                            Số điện thoại
                            {user?.isVerified && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-normal">
                                    <CheckCircle2 className="h-3 w-3" /> Đã xác thực
                                </Badge>
                            )}
                        </p>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => setEditingField({
                                fieldName: 'phone_number',
                                fieldLabel: 'Số điện thoại',
                                currentValue: user?.phone_number || '',
                                fieldType: 'tel',
                                placeholder: 'Nhập số điện thoại'
                            })}
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </div>
                    <p className="font-medium">{user?.phone_number ? `${user.phone_code}${user.phone_number}` : 'Chưa cập nhật'}</p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
               
                {/* Email */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                            Email
                            {user?.isVerified && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-normal">
                                    <CheckCircle2 className="h-3 w-3" /> Đã xác thực
                                </Badge>
                            )}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{user?.email || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                </div>

                {/* Facebook */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Facebook</p>
                        <div className="flex items-center gap-2 text-primary font-medium cursor-pointer hover:underline">
                            <Plus className="h-4 w-4" /> Thêm liên kết
                        </div>
                    </div>
                </div>

                {/* Google */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Google</p>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{user?.name || 'Chưa liên kết'}</p>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Driver License */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h6 className="font-bold flex items-center gap-2">
                            Giấy phép lái xe
                            {user?.driver_license_code ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-normal">
                                    <CheckCircle2 className="h-3 w-3" /> Đã xác thực
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="font-normal gap-1">
                                    <AlertCircle className="h-3 w-3" /> Chưa xác thực
                                </Badge>
                            )}
                        </h6>
                    </div>
                    <Button size="sm" variant="outline">Chỉnh sửa</Button>
                </div>

                <div className="p-4">
                    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900 mb-4">
                        <p>
                            Khách thuê cần xác thực GPLX <span className="font-bold">chính chủ</span> đồng thời phải là người <span className="font-bold">trực tiếp</span> làm thủ tục khi nhận xe.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user?.driver_license_code ? (
                            <div className="col-span-2 bg-green-50 p-4 rounded-lg border border-green-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">Họ và tên</span>
                                        <span className="font-medium text-gray-900">{user.driver_license_name || user.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Số GPLX</span>
                                        <span className="font-medium text-gray-900">
                                            {(() => {
                                                const code = user.driver_license_code;
                                                if (!code) return '---';
                                                if (code.length < 6) return code;
                                                return `${code.slice(0, 3)}xxxx${code.slice(-3)}`;
                                            })()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Ngày sinh</span>
                                        <span className="font-medium text-gray-900">
                                            {user.driver_license_dob ? new Date(user.driver_license_dob).toLocaleDateString('vi-VN') : '---'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center text-gray-400">
                                        <p className="text-sm font-medium">Ảnh mặt trước</p>
                                    </div>
                                </div>
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center text-gray-400">
                                        <p className="text-sm font-medium">Ảnh mặt sau (nếu có)</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Dialog */}
            <EditProfileDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                currentUser={userProfile}
                onSuccess={fetchUserProfile}
            />

            {/* Edit Field Dialog */}
            {editingField && (
                <EditFieldDialog
                    open={!!editingField}
                    onOpenChange={(open) => !open && setEditingField(null)}
                    fieldName={editingField.fieldName}
                    fieldLabel={editingField.fieldLabel}
                    currentValue={editingField.currentValue}
                    onSuccess={fetchUserProfile}
                    fieldType={editingField.fieldType}
                    placeholder={editingField.placeholder}
                />
            )}
        </div>
    )
}
