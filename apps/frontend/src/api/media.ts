import envConfig from "@/config";
import { UploadImageResType } from "@utoto/shared";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${envConfig.API_URL}/media/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const result: UploadImageResType = await response.json();
  return result.data; // URL of the uploaded image
};
