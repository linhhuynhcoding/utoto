import { UploadImageResType } from "@utoto/shared";
import apiClient from "@/lib/axios";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadImageResType>(
    "/media/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data; // URL of the uploaded image
};
