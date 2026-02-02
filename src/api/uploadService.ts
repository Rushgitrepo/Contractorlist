import api from './api';

export interface UploadResponse {
    success: boolean;
    message: string;
    url: string;
}

export const uploadService = {
    uploadImage: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    }
};
