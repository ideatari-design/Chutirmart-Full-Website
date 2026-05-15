import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/dialog'; // Actually uses standard select usually, but checking availability
// Wait, I'll use standard button-based filters for more control and "ojala" style

import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // States for filtering & sorting
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 200000 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['All', ...new Set(cats)];
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Search Query Filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Sorting Logic
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.stars || 0) - (a.stars || 0));
        break;
      default: // newest
        result.sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0));
    }

    return result;
  }, [products, categoryFilter, searchQuery, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setCategoryFilter('All');
    setSortBy('newest');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 200000 });
    setSearchParams({});
  };

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-12 mt-12">
        {/* Sidebar Filters - Desktop */}
        <aside className="w-full lg:w-64 shrink-0 space-y-12">
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" /> Filter By
            </h3>
            
            <div className="space-y-8">
              {/* Search Within Catalog */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Search Products</label>
                <div className="relative">
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search..."
                    className="bg-secondary/50 border-none rounded-lg md:rounded-xl h-12 text-sm pl-4 pr-10"
                  />
                  <Search className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground/50" />
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Categories</label>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setCurrentPage(1);
                        setSearchParams({ category: cat });
                      }}
                      className={`text-left px-4 py-2 rounded-lg md:rounded-xl text-xs font-bold uppercase transition-all ${categoryFilter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary/30 hover:bg-secondary text-muted-foreground'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Price Range (৳)</label>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="h-10 rounded-lg md:rounded-xl text-xs font-bold bg-secondary/30 border-none"
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground text-xs font-bold">TO</span>
                    <Input 
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                      className="h-10 rounded-lg md:rounded-xl text-xs font-bold bg-secondary/30 border-none"
                      placeholder="Max"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[5000, 10000, 50000, 100000].map(val => (
                      <button
                        key={val}
                        onClick={() => setPriceRange(prev => ({ ...prev, max: val }))}
                        className="flex-grow py-1.5 rounded-lg bg-secondary/20 hover:bg-secondary/50 text-[10px] font-bold transition-colors"
                      >
                        ৳{val / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-secondary/20 p-6 rounded-xl md:rounded-[2rem] border border-secondary/30">
            <div className="flex items-center gap-4">
               <p className="text-xs font-bold text-muted-foreground uppercase">
                 Showing <span className="text-foreground">{paginatedProducts.length}</span> of {filteredProducts.length} items
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
               <div className="flex items-center gap-2 bg-background/50 p-1.5 rounded-full border">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
               </div>

               <div className="flex-grow sm:flex-grow-0 min-w-[160px]">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-background border rounded-lg md:rounded-2xl h-11 px-4 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="rating">Top Rated</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(categoryFilter !== 'All' || searchQuery || priceRange.min > 0 || priceRange.max < 200000) && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground italic">Applied Filters:</p>
              {categoryFilter !== 'All' && (
                <Badge variant="secondary" className="gap-2 rounded-lg md:rounded-full px-4 py-2 bg-accent/10 border-accent text-accent">
                   {categoryFilter} <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter('All')} />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-2 rounded-lg md:rounded-full px-4 py-2">
                   "{searchQuery}" <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
              {(priceRange.min > 0 || priceRange.max < 200000) && (
                <Badge variant="secondary" className="gap-2 rounded-lg md:rounded-full px-4 py-2 bg-primary/10 border-primary text-primary">
                   ৳{priceRange.min} - ৳{priceRange.max} <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange({ min: 0, max: 200000 })} />
                </Badge>
              )}
              <Button variant="link" size="sm" className="text-[10px] font-bold uppercase text-muted-foreground ml-auto" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-0">
               {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center gap-6 bg-secondary/10 rounded-xl md:rounded-[3rem] border border-dashed">
               <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground opacity-30" />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase italic">No items found</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
               </div>
               <Button onClick={clearFilters} variant="outline" className="rounded-full px-10 uppercase font-black text-xs transition-all hover:bg-secondary border-2">Reset View</Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-0" : "flex flex-col gap-8"}>
               {paginatedProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-12">
               <Button 
                 variant="outline" 
                 size="icon" 
                 className="rounded-2xl h-12 w-12 border-2 disabled:opacity-30"
                 disabled={currentPage === 1}
                 onClick={() => handlePageChange(currentPage - 1)}
               >
                 <ChevronLeft className="h-5 w-5" />
               </Button>

               <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        className={`h-12 w-12 rounded-2xl font-black text-sm transition-all ${currentPage === pageNum ? 'shadow-xl shadow-primary/20 scale-110' : 'hover:bg-secondary'}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
               </div>

               <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl md:rounded-2xl h-12 w-12 border-2 disabled:opacity-30"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
               >
                 <ChevronRight className="h-5 w-5" />
               </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
