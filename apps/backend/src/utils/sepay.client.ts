import axios, { AxiosInstance } from "axios";
import envConfig from "@/config";
import { SepayApiResponse, SepayApiResponseSchema } from "@utoto/shared";

/**
 * SePay API Client
 * Handles all communication with SePay API
 * Documentation: https://my.sepay.vn/userapi
 */
export class SepayClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: envConfig.SEPAY_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envConfig.SEPAY_API_KEY}`,
      },
      timeout: 10000, // 10 seconds
    });
  }

  /**
   * GET /userapi/transactions/list
   * Lấy danh sách giao dịch với filters
   */
  async getTransactionList(params?: {
    account_number?: string;
    transaction_date_min?: string; // yyyy-mm-dd HH:mm:ss
    transaction_date_max?: string; // yyyy-mm-dd HH:mm:ss
    since_id?: string;
    limit?: number;
    reference_number?: string;
    amount_in?: number;
    amount_out?: number;
  }): Promise<SepayApiResponse> {
    try {
      const response = await this.client.get("/transactions/list", {
        params: {
          ...params,
          account_number: params?.account_number || envConfig.SEPAY_ACCOUNT_NUMBER,
        },
      });

      // Validate response with Zod
      return SepayApiResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `SePay API Error: ${error.response?.data?.error || error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * GET /userapi/transactions/details/{transaction_id}
   * Lấy chi tiết một giao dịch
   */
  async getTransactionDetails(
    transaction_id: string,
  ): Promise<SepayApiResponse> {
    try {
      const response = await this.client.get(
        `/transactions/details/${transaction_id}`,
      );

      return SepayApiResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `SePay API Error: ${error.response?.data?.error || error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * GET /userapi/transactions/count
   * Đếm số lượng giao dịch
   */
  async getTransactionCount(params?: {
    account_number?: string;
    transaction_date_min?: string;
    transaction_date_max?: string;
    since_id?: string;
  }): Promise<number> {
    try {
      const response = await this.client.get("/transactions/count", {
        params: {
          ...params,
          account_number: params?.account_number || envConfig.SEPAY_ACCOUNT_NUMBER,
        },
      });

      return response.data.count_transactions || 0;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `SePay API Error: ${error.response?.data?.error || error.message}`,
        );
      }
      throw error;
    }
  }

  /**
   * Search for transaction by transfer content and amount
   * Lấy 5 giao dịch gần nhất để check payment
   * Note: MBBank removes special characters (-, spaces) from transfer content
   */
  async findTransactionByContent(
    transferContent: string,
    expectedAmount: number,
  ): Promise<SepayApiResponse["transactions"]> {
    try {
      // Lấy 5 giao dịch gần nhất
      const response = await this.getTransactionList({
        limit: 5,
      });

      if (!response.transactions) {
        return [];
      }

      // Normalize: remove dashes, spaces, uppercase
      const normalizeContent = (str: string) => 
        str.replace(/[-\s]/g, '').toUpperCase();
      
      const normalizedSearch = normalizeContent(transferContent);

      console.log('🔍 SePay Search:', {
        originalContent: transferContent,
        normalizedContent: normalizedSearch,
        expectedAmount,
        transactionsCount: response.transactions.length
      });

      // Filter by transfer content and amount
      const filtered = response.transactions.filter((tx) => {
        const normalizedTxContent = normalizeContent(tx.transaction_content || '');
        const contentMatch = normalizedTxContent.includes(normalizedSearch);
        
        const txAmount = parseFloat(tx.amount_in || '0');
        const amountMatch = Math.abs(txAmount - expectedAmount) < 0.01;
        
        const isAmountOut = parseFloat(tx.amount_out || '0') === 0;

        console.log(`  TX ${tx.id}:`, {
          content: tx.transaction_content?.substring(0, 50),
          contentMatch,
          amount: tx.amount_in,
          amountMatch,
          matched: contentMatch && amountMatch && isAmountOut
        });

        return contentMatch && amountMatch && isAmountOut;
      });

      console.log('✅ Found:', filtered.length);
      return filtered;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }

  /**
   * Format date for SePay API (yyyy-mm-dd HH:mm:ss)
   */
  private formatDateTime(date: Date): string {
    return date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
  }
}

// Export singleton instance
export const sepayClient = new SepayClient();
