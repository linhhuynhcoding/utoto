import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Pencil, CheckCircle2, AlertCircle, XCircle, Plus } from "lucide-react"
import { useAuth } from "@/contexts"

export function AccountInfo() {
    const { user } = useAuth()

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
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>0 chuyến</span>
                </div>
            </div>

            {/* User Profile Summary */}
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border shadow-sm text-center">
                <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md">
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </div>
                <h2 className="text-xl font-bold mb-1">{user?.name || 'User'}</h2>
                <p className="text-sm text-muted-foreground mb-4">Tham gia: {user?.joinedDate || '--/--/----'}</p>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium">
                    <span>{user?.points || 0} điểm</span>
                </div>
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Ngày sinh</p>
                    <p className="font-medium">{user?.dateOfBirth || '--/--/----'}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Giới tính</p>
                    <p className="font-medium">{user?.gender || 'Chưa cập nhật'}</p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                            Số điện thoại
                            {user?.verified?.phone && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-normal">
                                    <CheckCircle2 className="h-3 w-3" /> Đã xác thực
                                </Badge>
                            )}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Pencil className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                            Email
                            {user?.verified?.email && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-normal">
                                    <CheckCircle2 className="h-3 w-3" /> Đã xác thực
                                </Badge>
                            )}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{user?.email || 'Chưa cập nhật'}</p>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Pencil className="h-3 w-3" />
                            </Button>
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
                            {user?.verified?.driverLicense ? (
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
                        {user?.verified?.driverLicense ? (
                            <div className="col-span-2 bg-green-50 p-4 rounded-lg border border-green-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">Họ và tên</span>
                                        <span className="font-medium text-gray-900">{(user as any).driver_license_name || user.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Số GPLX</span>
                                        <span className="font-medium text-gray-900">
                                            {(() => {
                                                const code = (user as any).driver_license_code;
                                                if (!code) return '---';
                                                if (code.length < 6) return code;
                                                return `${code.slice(0, 3)}xxxx${code.slice(-3)}`;
                                            })()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Hạng</span>
                                        <span className="font-medium text-gray-900">{(user as any).driver_license_class || '---'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Ngày hết hạn</span>
                                        <span className="font-medium text-gray-900">{(user as any).driver_license_expiry_date || '---'}</span>
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
        </div>
    )
}
