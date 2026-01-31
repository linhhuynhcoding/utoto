import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  RefreshCw,
} from "lucide-react";
import { PaymentResponse } from "@utoto/shared";
import { usePaymentStatus, useVerifyPayment } from "@/hooks/usePayment";
import { toast } from "sonner";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentResponse | null;
  onSuccess?: () => void;
  onExpired?: () => void;
  onCancel?: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  payment,
  onSuccess,
  onExpired,
  onCancel,
}: PaymentDialogProps) {
  const [countdown, setCountdown] = useState<string>("15:00");
  const [isExpired, setIsExpired] = useState(false);

  const verifyPaymentMutation = useVerifyPayment();

  // Poll payment status every 2 seconds
  const { data: statusData } = usePaymentStatus(
    payment?.payment_id || null,
    {
      enabled: open && !isExpired,
      onSuccess: (data) => {
        if (data.status === "SUCCESS") {
          toast.success("🎉 Thanh toán thành công!");
          setTimeout(() => {
            onSuccess?.();
            onOpenChange(false);
          }, 1500);
        }
      },
      onExpired: () => {
        setIsExpired(true);
        onExpired?.();
      },
    }
  );

  // Countdown timer (15 minutes)
  useEffect(() => {
    if (!payment?.expires_at || !open) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiresAt = new Date(payment.expires_at).getTime();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setCountdown("00:00");
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [payment?.expires_at, open]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const handleManualVerify = () => {
    if (!payment?.trip_id) return;
    verifyPaymentMutation.mutate(payment.trip_id);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  if (!payment) return null;

  const isPending = statusData?.status === "PENDING" || !statusData;
  const isSuccess = statusData?.status === "SUCCESS";
  const isFailed = statusData?.status === "FAILED" || statusData?.status === "EXPIRED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold">
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán chuyến đi"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Mã GD: <span className="font-mono font-semibold">#{payment.trip_id.slice(-6).toUpperCase()}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Status Badge */}
          <div className="flex justify-center">
            {isPending && (
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-xs">
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                Đang chờ thanh toán
              </Badge>
            )}
            {isSuccess && (
              <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1.5" />
                Đã thanh toán
              </Badge>
            )}
            {isFailed && (
              <Badge className="bg-red-50 text-red-700 border-red-200 px-3 py-1 text-xs">
                <XCircle className="h-3 w-3 mr-1.5" />
                Thanh toán thất bại
              </Badge>
            )}
          </div>

          {/* QR Code */}
          {!isSuccess && !isFailed && (
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed">
              <img
                src={payment.qr_code}
                alt="QR Code thanh toán"
                className="w-48 h-48 object-contain"
              />
            </div>
          )}

          {isSuccess && (
            <div className="flex justify-center p-6 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          )}

          <Separator className="my-2" />

          {/* Payment Info */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Số tiền:</span>
              <span className="text-xl font-black text-primary">
                {payment.amount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-600">Ngân hàng:</span>
              <div className="text-right">
                <p className="font-semibold text-sm">{payment.bank_name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-mono text-xs">{payment.bank_account}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleCopyText(payment.bank_account, "số tài khoản")}
                  >
                    <Copy className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-600">Nội dung CK:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-red-600 text-xs">
                  {payment.transfer_content}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() =>
                    handleCopyText(payment.transfer_content, "nội dung chuyển khoản")
                  }
                >
                  <Copy className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Important Note */}
          {!isSuccess && !isFailed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              <p className="text-[10px] text-yellow-800 leading-tight">
                <strong>⚠️ Lưu ý:</strong> Chuyển khoản đúng nội dung{" "}
                <span className="font-mono font-bold">{payment.transfer_content}</span> để tự động xác nhận.
              </p>
            </div>
          )}

          {/* Countdown Timer */}
          {!isSuccess && !isFailed && (
            <div className="flex items-center justify-center gap-1.5 text-xs">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600">Thanh toán trong</span>
              <span
                className={`font-bold text-base ${
                  isExpired ? "text-red-600" : "text-primary"
                }`}
              >
                {countdown}
              </span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="text-center space-y-1">
              <p className="text-green-700 font-semibold text-sm">
                Thanh toán của bạn đã được xác nhận!
              </p>
              <p className="text-xs text-gray-600">
                Chủ xe sẽ sớm liên hệ với bạn để xác nhận chuyến đi.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-3">
          {!isSuccess && !isFailed && (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto h-9 text-sm"
              >
                Hủy
              </Button>
              <Button
                onClick={handleManualVerify}
                disabled={verifyPaymentMutation.isPending}
                className="w-full sm:w-auto h-9 text-sm"
              >
                {verifyPaymentMutation.isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Tôi đã thanh toán
                  </>
                )}
              </Button>
            </>
          )}
          {(isSuccess || isFailed) && (
            <Button onClick={() => onOpenChange(false)} className="w-full h-9 text-sm">
              Đóng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
