import { z } from "zod";

/**
 * SePay Transaction Response Schema
 * Response from SePay API: GET /userapi/transactions/list
 */
export const SepayTransactionSchema = z.object({
  id: z.string(),
  transaction_date: z.string(), // "2023-05-04 11:59:47"
  account_number: z.string(),
  sub_account: z.string().nullable(),
  amount_in: z.string(), // Decimal as string: "19689000.00"
  amount_out: z.string(), // Decimal as string: "0.00"
  accumulated: z.string().nullable(),
  code: z.string().nullable(),
  transaction_content: z.string(),
  reference_number: z.string(),
  bank_brand_name: z.string(),
  bank_account_id: z.string(),
});

export type SepayTransaction = z.infer<typeof SepayTransactionSchema>;

/**
 * SePay API Response Schema
 */
export const SepayApiResponseSchema = z.object({
  status: z.number(),
  error: z.any().nullable(),
  messages: z.object({
    success: z.boolean(),
  }),
  transactions: z.array(SepayTransactionSchema).optional(),
  transaction: SepayTransactionSchema.optional(),
});

export type SepayApiResponse = z.infer<typeof SepayApiResponseSchema>;

/**
 * Payment Status Enum
 */
export const PaymentStatusSchema = z.enum([
  "PENDING",
  "SUCCESS",
  "FAILED",
  "EXPIRED",
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

/**
 * Create Payment Request Schema
 */
export const CreatePaymentSchema = z.object({
  trip_id: z.string().max(20),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;

/**
 * Payment Response Schema (to Frontend)
 */
export const PaymentResponseSchema = z.object({
  payment_id: z.string(),
  trip_id: z.string(),
  status: PaymentStatusSchema,
  amount: z.number(),
  qr_code: z.string(), // VietQR URL
  bank_account: z.string(),
  bank_name: z.string(),
  transfer_content: z.string(), // "UTOTO-{trip_id}"
  expires_at: z.string(), // ISO timestamp (15 minutes from now)
  created_at: z.string(),
});

export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;

/**
 * Payment Verification Result
 */
export const PaymentVerificationSchema = z.object({
  success: z.boolean(),
  status: PaymentStatusSchema,
  message: z.string(),
  tx_id_sepay: z.string().optional(),
  verified_at: z.string().optional(),
});

export type PaymentVerification = z.infer<typeof PaymentVerificationSchema>;

/**
 * Update Payment Status Schema
 */
export const UpdatePaymentStatusSchema = z.object({
  status: PaymentStatusSchema,
  tx_id_sepay: z.string().optional(),
});

export type UpdatePaymentStatus = z.infer<typeof UpdatePaymentStatusSchema>;
