const API_BASE = '/api';

export interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  type: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export const bannerService = {
  async getAllBanners(): Promise<Banner[]> {
    const res = await fetch(`${API_BASE}/banners`);
    if (!res.ok) throw new Error('Failed to fetch banners');
    return res.json();
  },

  async addBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    const res = await fetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banner),
    });
    if (!res.ok) throw new Error('Failed to add banner');
    return res.json();
  },

  async updateBanner(id: string, updates: Partial<Banner>): Promise<void> {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update banner');
  },

  async deleteBanner(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete banner');
  }
};
