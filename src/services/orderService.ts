import { Order } from '@/types';

export const orderService = {
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>, draftId?: string | null): Promise<Order | null> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, draftId })
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(id)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  },

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  },

  async saveIncompleteOrder(data: any): Promise<{ id: string } | null> {
    try {
      const response = await fetch('/api/incomplete-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error saving incomplete order:', error);
      return null;
    }
  },

  async getAllIncompleteOrders(): Promise<any[]> {
    try {
      const response = await fetch('/api/incomplete-orders');
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching incomplete orders:', error);
      return [];
    }
  },

  async recoverIncompleteOrder(id: string): Promise<{ success: boolean; orderId?: string }> {
    try {
      const response = await fetch(`/api/incomplete-orders/${encodeURIComponent(id)}/recover`, {
        method: 'PATCH'
      });
      return await response.json();
    } catch (error) {
      console.error('Error recovering order:', error);
      return { success: false };
    }
  },

  async getRecoveryStats(): Promise<any> {
    try {
      const response = await fetch('/api/incomplete-orders/stats');
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching recovery stats:', error);
      return null;
    }
  }
};
