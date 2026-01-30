import api from "./api";
import {
  PaymentResponse,
  PaymentVerification,
  CreatePayment,
} from "@utoto/shared";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class PaymentService {
  /**
   * POST /payment/create - Create payment for trip
   */
  async createPayment(data: CreatePayment): Promise<PaymentResponse> {
    const response = await api.post<any, ApiResponse<PaymentResponse>>(
      "/payment/create",
      data
    );
    return response.data;
  }

  /**
   * GET /payment/verify/:trip_id - Manually verify payment
   */
  async verifyPayment(trip_id: string): Promise<PaymentVerification> {
    const response = await api.get<any, ApiResponse<PaymentVerification>>(
      `/payment/verify/${trip_id}`
    );
    return response.data;
  }

  /**
   * GET /payment/status/:payment_id - Get payment status (for polling)
   */
  async getPaymentStatus(payment_id: string): Promise<PaymentVerification> {
    const response = await api.get<any, ApiResponse<PaymentVerification>>(
      `/payment/status/${payment_id}`
    );
    return response.data;
  }

  /**
   * GET /payment/trip/:trip_id - Get payment details by trip_id
   */
  async getPaymentByTripId(trip_id: string): Promise<any> {
    const response = await api.get<any, ApiResponse<any>>(
      `/payment/trip/${trip_id}`
    );
    return response.data;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
