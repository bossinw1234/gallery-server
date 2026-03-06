import type { PaginatedImagesResponse } from '../types/index';

class ImageApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || '/api') {
    this.baseUrl = baseUrl;
  }

  async getImages(params: {
    page?: number;
    limit?: number;
    tags?: string[];
  }): Promise<PaginatedImagesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.tags && params.tags.length > 0) {
      searchParams.set('tags', params.tags.join(','));
    }

    const url = `${this.baseUrl}/images?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    return response.json();
  }
}

export const imageApiService = new ImageApiService();
export default ImageApiService;
