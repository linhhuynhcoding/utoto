import prisma from "@/database";
import { Prisma } from "@/prisma/client";
import { PaymentStatus } from "@utoto/shared";

export class PaymentRepository {
  /**
   * Create a new payment record
   */
  async create(data: {
    payment_id: bigint;
    trip_id: string;
    amount: Prisma.Decimal;
    status: PaymentStatus;
  }) {
    return prisma.payments.create({
      data: {
        payment_id: data.payment_id,
        status: data.status,
        amount: data.amount,
        pay_at: null,
        tx_id_sepay: null,
      },
    });
  }

  /**
   * Find payment by ID
   */
  async findById(payment_id: bigint) {
    return prisma.payments.findUnique({
      where: { payment_id },
      include: {
        trips: true,
      },
    });
  }

  /**
   * Find payment by trip_id
   */
  async findByTripId(trip_id: string) {
    return prisma.payments.findFirst({
      where: {
        trips: {
          some: {
            trip_id,
          },
        },
      },
      include: {
        trips: true,
      },
    });
  }

  /**
   * Update payment status
   */
  async updateStatus(
    payment_id: bigint,
    status: PaymentStatus,
    tx_id_sepay?: string,
  ) {
    return prisma.payments.update({
      where: { payment_id },
      data: {
        status,
        tx_id_sepay: tx_id_sepay || undefined,
        pay_at: status === "SUCCESS" ? new Date() : undefined,
      },
    });
  }

  /**
   * Find pending payments (for cron job)
   * Get payments that are PENDING and older than specified time
   */
  async findPendingPayments(createdBefore: Date) {
    // Note: payments table doesn't have created_at field
    // We'll need to add it or use pay_at for checking
    // For now, return all PENDING payments
    return prisma.payments.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        trips: true,
      },
    });
  }

  /**
   * Find payments by status
   */
  async findByStatus(status: PaymentStatus) {
    return prisma.payments.findMany({
      where: { status },
      include: {
        trips: true,
      },
    });
  }

  /**
   * Check if payment exists
   */
  async exists(payment_id: bigint): Promise<boolean> {
    const count = await prisma.payments.count({
      where: { payment_id },
    });
    return count > 0;
  }
}
