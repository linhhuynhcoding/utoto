import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { CreatePayment, PaymentResponse, PaymentVerification } from "@utoto/shared";
import { toast } from "sonner";

/**
 * Create payment mutation
 * Creates payment for a trip and returns QR code
 */
export function useCreatePayment() {
  return useMutation<PaymentResponse, Error, CreatePayment>({
    mutationFn: (data: CreatePayment) => paymentService.createPayment(data),
    onError: (error) => {
      toast.error("Không thể tạo thanh toán", {
        description: error.message,
      });
    },
  });
}

/**
 * Verify payment mutation
 * Manually triggers payment verification with SePay API
 */
export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation<PaymentVerification, Error, string>({
    mutationFn: (trip_id: string) => paymentService.verifyPayment(trip_id),
    onSuccess: (data) => {
      if (data.success && data.status === "SUCCESS") {
        toast.success("Thanh toán thành công!", {
          description: "Chuyến đi của bạn đã được xác nhận",
        });
        // Invalidate trips query to refresh list
        queryClient.invalidateQueries({ queryKey: ["trips"] });
      } else if (data.status === "EXPIRED") {
        toast.error("Thanh toán đã hết hạn", {
          description: "Vui lòng thử lại",
        });
      } else {
        toast.warning("Chưa nhận được thanh toán", {
          description: "Vui lòng kiểm tra lại giao dịch",
        });
      }
    },
    onError: (error) => {
      toast.error("Không thể xác minh thanh toán", {
        description: error.message,
      });
    },
  });
}

/**
 * Poll payment status
 * Auto-refetch every 2 seconds until payment is SUCCESS or EXPIRED
 */
export function usePaymentStatus(
  payment_id: string | null,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: PaymentVerification) => void;
    onExpired?: () => void;
  }
) {
  return useQuery<PaymentVerification, Error>({
    queryKey: ["payment-status", payment_id],
    queryFn: () => paymentService.getPaymentStatus(payment_id!),
    enabled: !!payment_id && (options?.enabled ?? true),
    refetchInterval: (query) => {
      // Add null safety check
      if (!query?.state?.data) {
        return 2000; // Continue polling if no data yet
      }
      
      const data = query.state.data;
      
      // Stop polling if payment is SUCCESS or EXPIRED
      if (data?.status === "SUCCESS" || data?.status === "EXPIRED" || data?.status === "FAILED") {
        if (data.status === "SUCCESS" && options?.onSuccess) {
          options.onSuccess(data);
        }
        if ((data.status === "EXPIRED" || data.status === "FAILED") && options?.onExpired) {
          options.onExpired();
        }
        return false;
      }
      
      // Continue polling every 2 seconds
      return 2000;
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Get payment by trip_id
 */
export function usePaymentByTripId(trip_id: string | null, enabled = true) {
  return useQuery({
    queryKey: ["payment", trip_id],
    queryFn: () => paymentService.getPaymentByTripId(trip_id!),
    enabled: !!trip_id && enabled,
  });
}
