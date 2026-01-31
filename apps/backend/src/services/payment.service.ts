import { PaymentRepository } from "@/repositories/payment.repository";
import { TripRepository } from "@/repositories/trip.repository";
import { sepayClient } from "@/utils/sepay.client";
import envConfig from "@/config";
import { Prisma } from "@/prisma/client";
import {
  PaymentResponse,
  PaymentVerification,
  PaymentStatus,
} from "@utoto/shared";

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private tripRepository: TripRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.tripRepository = new TripRepository();
  }

  /**
   * Create payment for a trip
   * Generates QR code and payment instructions
   */
  async createPayment(trip_id: string): Promise<PaymentResponse> {
    // 1. Validate trip exists and get details
    const trip = await this.tripRepository.findById(trip_id);
    if (!trip) {
      throw new Error("Trip not found");
    }

    // 2. Check if payment already exists for this trip
    const existingPayment = await this.paymentRepository.findByTripId(trip_id);
    if (existingPayment && existingPayment.status === "SUCCESS") {
      throw new Error("Payment already completed for this trip");
    }
    if (existingPayment && existingPayment.status === "PENDING") {
      // Return existing pending payment
      return this.mapToPaymentResponse(existingPayment, trip_id);
    }

    // 3. Generate payment_id (timestamp-based)
    const payment_id = BigInt(Date.now());

    // 4. Create payment record
    const amount = new Prisma.Decimal(trip.rent_amount.toString());
    const payment = await this.paymentRepository.create({
      payment_id,
      trip_id,
      amount,
      status: "PENDING",
    });

    // 5. Link payment to trip
    await this.tripRepository.update(trip_id, {
      payment_id: Number(payment_id),
    });

    // 6. Return payment response with QR code
    return this.mapToPaymentResponse(payment, trip_id);
  }

  /**
   * Check payment status with SePay API
   * Verifies if payment has been made
   */
  async checkPaymentStatus(
    payment_id: bigint,
  ): Promise<PaymentVerification> {
    // 1. Get payment from DB
    const payment = await this.paymentRepository.findById(payment_id);
    if (!payment) {
      throw new Error("Payment not found");
    }

    // If already SUCCESS, return immediately
    if (payment.status === "SUCCESS") {
      return {
        success: true,
        status: "SUCCESS",
        message: "Payment already verified",
        tx_id_sepay: payment.tx_id_sepay || undefined,
        verified_at: payment.pay_at?.toISOString(),
      };
    }

    // 2. Get trip_id from payment
    const trip = payment.trips?.[0];
    if (!trip) {
      throw new Error("Trip not found for payment");
    }

    // 3. Generate transfer content
    const transferContent = this.generateTransferContent(trip.trip_id);

    // 4. Check with SePay API
    const expectedAmount = parseFloat(payment.amount?.toString() || "0");
    const transactions = await sepayClient.findTransactionByContent(
      transferContent,
      expectedAmount,
    );

    // 5. If transaction found, mark as SUCCESS
    if (transactions && transactions.length > 0) {
      const sepayTx = transactions[0]; // Take first match

      await this.paymentRepository.updateStatus(
        payment_id,
        "SUCCESS",
        sepayTx.id,
      );

      // Update trip status to APPROVED
      await this.tripRepository.update(trip.trip_id, {
        status: "APPROVED",
      });

      return {
        success: true,
        status: "SUCCESS",
        message: "Payment verified successfully",
        tx_id_sepay: sepayTx.id,
        verified_at: new Date().toISOString(),
      };
    }

    // 6. Check if payment expired (15 minutes)
    const createdAt = payment.pay_at || new Date(); // Fallback if no created_at
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    if (diffMinutes > 15) {
      await this.paymentRepository.updateStatus(payment_id, "EXPIRED");
      await this.tripRepository.update(trip.trip_id, {
        status: "CANCELLED",
      });

      return {
        success: false,
        status: "EXPIRED",
        message: "Payment expired (15 minutes timeout)",
      };
    }

    // 7. Still pending
    return {
      success: false,
      status: "PENDING",
      message: "Payment not yet received",
    };
  }

  /**
   * Verify payment manually (triggered by user)
   */
  async verifyPayment(trip_id: string): Promise<PaymentVerification> {
    const payment = await this.paymentRepository.findByTripId(trip_id);
    if (!payment) {
      throw new Error("Payment not found for this trip");
    }

    return this.checkPaymentStatus(payment.payment_id);
  }

  /**
   * Generate transfer content for payment
   * Format: "UTOTO{trip_id}" (no dash - MBBank removes special characters)
   */
  private generateTransferContent(trip_id: string): string {
    return `UTOTO${trip_id}`;
  }

  /**
   * Generate VietQR code URL
   * QR code for Vietnamese banking apps
   */
  private generateQRCode(
    accountNumber: string,
    bankName: string,
    amount: number,
    content: string,
  ): string {
    // VietQR format: https://img.vietqr.io/image/{bank}-{account}-{template}.png?amount={amount}&addInfo={content}
    const bankCode = this.getBankCode(bankName);
    const encodedContent = encodeURIComponent(content);

    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodedContent}`;
  }

  /**
   * Get bank code for VietQR
   */
  private getBankCode(bankName: string): string {
    const bankCodes: Record<string, string> = {
      MBBank: "MB",
    };

    return bankCodes[bankName] || "MB";
  }

  /**
   * Map payment entity to response DTO
   */
  private mapToPaymentResponse(
    payment: any,
    trip_id: string,
  ): PaymentResponse {
    const amount = parseFloat(payment.amount?.toString() || "0");
    const transferContent = this.generateTransferContent(trip_id);
    const qrCode = this.generateQRCode(
      envConfig.SEPAY_ACCOUNT_NUMBER,
      "MBBank",
      amount,
      transferContent,
    );

    // Calculate expiration (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    return {
      payment_id: payment.payment_id.toString(),
      trip_id,
      status: payment.status as PaymentStatus,
      amount,
      qr_code: qrCode,
      bank_account: envConfig.SEPAY_ACCOUNT_NUMBER,
      bank_name: "MBBank",
      transfer_content: transferContent,
      expires_at: expiresAt.toISOString(),
      created_at: payment.pay_at?.toISOString() || new Date().toISOString(),
    };
  }

  /**
   * Get payment by trip_id
   */
  async getPaymentByTripId(trip_id: string) {
    return this.paymentRepository.findByTripId(trip_id);
  }
}
