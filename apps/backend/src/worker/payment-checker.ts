import { PaymentService } from "@/services/payment.service";
import { PaymentRepository } from "@/repositories/payment.repository";

/**
 * Payment Checker Worker
 * Polls SePay API every 1.5s to check pending payments
 * Automatically updates payment and trip status on success
 */

const paymentService = new PaymentService();
const paymentRepository = new PaymentRepository();

// Polling interval (1.5 seconds = 1500ms)
const POLL_INTERVAL = 1500;

// Maximum age for pending payments (15 minutes)
const MAX_PENDING_AGE = 15 * 60 * 1000;

/**
 * Check all pending payments
 */
async function checkPendingPayments() {
  try {
    // Get all pending payments
    const cutoffTime = new Date(Date.now() - MAX_PENDING_AGE);
    const pendingPayments = await paymentRepository.findPendingPayments(
      cutoffTime,
    );

    if (pendingPayments.length === 0) {
      return;
    }

    console.log(
      `[Payment Checker] Checking ${pendingPayments.length} pending payments...`,
    );

    // Check each payment
    for (const payment of pendingPayments) {
      try {
        const result = await paymentService.checkPaymentStatus(
          payment.payment_id,
        );

        if (result.status === "SUCCESS") {
          console.log(
            `[Payment Checker] ✅ Payment ${payment.payment_id} verified successfully!`,
          );
          console.log(`   - Transaction ID: ${result.tx_id_sepay}`);
          console.log(`   - Verified at: ${result.verified_at}`);
        } else if (result.status === "EXPIRED") {
          console.log(
            `[Payment Checker] ⏰ Payment ${payment.payment_id} expired`,
          );
        }
      } catch (error) {
        console.error(
          `[Payment Checker] Error checking payment ${payment.payment_id}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error("[Payment Checker] Error in checkPendingPayments:", error);
  }
}

/**
 * Start the payment checker worker
 */
export function startPaymentChecker() {
  console.log(
    `[Payment Checker] Starting... (polling every ${POLL_INTERVAL}ms)`,
  );

  // Run immediately on start
  checkPendingPayments();

  // Then run on interval
  setInterval(() => {
    checkPendingPayments();
  }, POLL_INTERVAL);
}

/**
 * Stop the payment checker (for graceful shutdown)
 */
let intervalId: NodeJS.Timeout | null = null;

export function startPaymentCheckerWithHandle() {
  console.log(
    `[Payment Checker] Starting... (polling every ${POLL_INTERVAL}ms)`,
  );

  checkPendingPayments();

  intervalId = setInterval(() => {
    checkPendingPayments();
  }, POLL_INTERVAL);

  return intervalId;
}

export function stopPaymentChecker() {
  if (intervalId) {
    clearInterval(intervalId);
    console.log("[Payment Checker] Stopped");
  }
}

// Auto-start if this file is run directly
if (require.main === module) {
  startPaymentChecker();
}
