export const categoryService = {
  async getAllCategories() {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async addCategory(category: { name: string; slug?: string; image?: string }) {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      if (!response.ok) throw new Error('Failed to add category');
      return await response.json();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }
};
