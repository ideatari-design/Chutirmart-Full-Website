import { Product } from '@/types';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter(p => p.isFeatured);
  },

  async getFlashSaleProducts(): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter(p => p.isFlashSale);
  },

  async getNewArrivalProducts(): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter(p => p.isNewArrival);
  },

  async getBestSellingProducts(): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter(p => p.isBestSelling);
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

      if (!response.ok) {
        throw new Error(data.message || `Add Failed (${response.status})`);
      }
      return data;
    } catch (error: any) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      console.log(`Sending PATCH request for product ${id}`, product);
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

      if (!response.ok) {
        console.error(`Product update failed with status ${response.status}:`, data);
        throw new Error(data.message || `Update Failed (${response.status})`);
      }
      
      console.log('Product updated successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      const lowerQuery = query.toLowerCase();
      return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  async addReview(productId: string, review: { userName: string; rating: number; comment: string }): Promise<any> {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (!response.ok) throw new Error('Failed to add review');
      return await response.json();
    } catch (error) {
      console.error('Error adding review:', error);
      return null;
    }
  },

  async bulkAction(ids: string[], action: 'delete' | 'update', data?: any): Promise<boolean> {
    try {
      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, action, data })
      });
      return response.ok;
    } catch (error) {
      console.error('Bulk action failed:', error);
      return false;
    }
  }
};
