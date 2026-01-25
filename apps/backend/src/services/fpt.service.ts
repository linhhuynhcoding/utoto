import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import envConfig from "@/config";

export interface DrivingLicenseResponse {
  errorCode: number;
  errorMessage: string;
  data: {
      id: string;
      id_prob: string;
      name: string;
      name_prob: string;
      dob: string;
      dob_prob: string;
      sex: string;
      sex_prob: string;
      nation: string; // was nationality
      nation_prob: string;
      class: string;
      class_prob: string;
      date: string; // Issue date
      date_prob: string;
      doe: string; // expiry date (date_off)
      doe_prob: string;
      address: string;
      address_prob: string;
      place_issue: string;
      place_issue_prob: string;
    }[];
}

class FptService {
  private readonly baseUrl = "https://api.fpt.ai/vision/dlr/vnm";

  async extractDrivingLicense(imagePath: string): Promise<DrivingLicenseResponse["data"][0]> {
    if (!envConfig.FPT_AI_API_KEY) {
      throw new Error("FPT_AI_API_KEY is not configured");
    }

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    try {
      const response = await axios.post<DrivingLicenseResponse>(
        this.baseUrl,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "api-key": envConfig.FPT_AI_API_KEY,
          },
        }
      );

      if (response.data.errorCode !== 0 || !response.data.data || response.data.data.length === 0) {
        throw new Error(response.data.errorMessage || "Failed to extract driving license data");
      }

      return response.data.data[0];
    } catch (error: any) {
      console.error("FPT AI Error:", error.response?.data || error.message);
      throw new Error("Failed to process image with FPT AI");
    }
  }
}

export const fptService = new FptService();
