import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { UpdateProfile } from "@utoto/shared"
import { userService } from "@/services/user.service"
import toast from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditFieldDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    fieldName: keyof UpdateProfile
    fieldLabel: string
    currentValue: string
    onSuccess: () => void
    fieldType?: "text" | "date" | "tel"
    placeholder?: string
}

export function EditFieldDialog({
    open,
    onOpenChange,
    fieldName,
    fieldLabel,
    currentValue,
    onSuccess,
    fieldType = "text",
    placeholder,
}: EditFieldDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [value, setValue] = useState("")

    useEffect(() => {
        if (open) {
            // Format date for input if it's a date field
            if (fieldType === "date" && currentValue) {
                setValue(new Date(currentValue).toISOString().split('T')[0])
            } else {
                setValue(currentValue || "")
            }
        }
    }, [open, currentValue, fieldType])

    // Check if value has changed
    const hasChanges = fieldType === "date" 
        ? value !== (currentValue ? new Date(currentValue).toISOString().split('T')[0] : "")
        : value !== (currentValue || "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (value === currentValue || (!value && !currentValue)) {
            toast.info("Không có thay đổi nào")
            return
        }

        try {
            setIsSubmitting(true)
            const updateData: UpdateProfile = {
                [fieldName]: value,
            }
            await userService.updateProfile(updateData)
            toast.success(`Cập nhật ${fieldLabel.toLowerCase()} thành công`)
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
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa {fieldLabel.toLowerCase()}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor={fieldName}>{fieldLabel}</Label>
                        <Input
                            id={fieldName}
                            type={fieldType}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                        />
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
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || !hasChanges}
                            className={hasChanges ? "bg-primary hover:bg-primary/90" : ""}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
