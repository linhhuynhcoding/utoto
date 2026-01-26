import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { UserResponse, UpdateProfile } from "@utoto/shared"
import { userService } from "@/services/user.service"
import toast from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentUser: UserResponse | null
    onSuccess: () => void
}

export function EditProfileDialog({ open, onOpenChange, currentUser, onSuccess }: EditProfileDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<UpdateProfile>({
        name: "",
        dob: "",
        phone_number: "",
        phone_code: "+84",
    })

    useEffect(() => {
        if (currentUser && open) {
            setFormData({
                name: currentUser.name || "",
                dob: currentUser.dob || "",
                phone_number: currentUser.phone_number || "",
                phone_code: currentUser.phone_code || "+84",
            })
        }
    }, [currentUser, open])

    // Check if any field has changed
    const hasChanges = 
        formData.name !== (currentUser?.name || "") ||
        formData.dob !== (currentUser?.dob || "") ||
        formData.phone_number !== (currentUser?.phone_number || "") ||
        formData.phone_code !== (currentUser?.phone_code || "+84")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Prepare data (only send changed fields)
        const updateData: UpdateProfile = {}
        
        if (formData.name && formData.name !== currentUser?.name) {
            updateData.name = formData.name
        }
        if (formData.dob && formData.dob !== currentUser?.dob) {
            updateData.dob = formData.dob
        }
        if (formData.phone_number && formData.phone_number !== currentUser?.phone_number) {
            updateData.phone_number = formData.phone_number
        }
        if (formData.phone_code && formData.phone_code !== currentUser?.phone_code) {
            updateData.phone_code = formData.phone_code
        }

        // If no changes
        if (Object.keys(updateData).length === 0) {
            toast.info("Không có thay đổi nào")
            return
        }

        try {
            setIsSubmitting(true)
            await userService.updateProfile(updateData)
            toast.success("Cập nhật thông tin thành công")
            onSuccess()
            onOpenChange(false)
        } catch (error: any) {
            toast.error("Cập nhật thất bại", error?.response?.data?.message || "Vui lòng thử lại")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin cá nhân của bạn. Nhấn lưu khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nhập họ và tên"
                            minLength={1}
                            maxLength={50}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dob">Ngày sinh</Label>
                        <Input
                            id="dob"
                            type="date"
                            value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                        
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <div className="flex gap-2">
                            <Input
                                id="phone_code"
                                value={formData.phone_code}
                                onChange={(e) => setFormData({ ...formData, phone_code: e.target.value })}
                                placeholder="+84"
                                className="w-20"
                                maxLength={5}
                            />
                            <Input
                                id="phone"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                placeholder="Nhập số điện thoại"
                                maxLength={20}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu thay đổi
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
