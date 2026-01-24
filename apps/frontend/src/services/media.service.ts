import { UploadImageResType } from "@utoto/shared";
import api from "./api";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadImageResType>(
    "/media/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return (response as any).data; // URL of the uploaded image
};
