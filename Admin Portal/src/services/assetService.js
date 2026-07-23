import { api, normalizeApiError } from "./api";

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
};