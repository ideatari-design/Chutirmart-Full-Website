import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Star, 
  Phone,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  User,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  // Review states
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', userName: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await productService.getProductById(id);
      if (data) {
        setProduct(data);
        // Fetch related products
        const allProducts = await productService.getAllProducts();
        setRelatedProducts(allProducts.filter(p => p.category === data.category && p.id !== data.id).slice(0, 6));
      } else {
        // Mock fallback
        const mockProduct: Product = {
          id: id,
          name: 'Premium Smart Watch Pro',
          nameBn: 'প্রিমিয়াম স্মার্ট ওয়াচ প্রো',
          price: 3500,
          category: 'Gadgets',
          images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1508685096489-7aac29145fe0?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1544117518-2b462fca5591?auto=format&fit=crop&q=80&w=800',
          ],
          stock: 12,
          description: 'This is a premium smart watch with heart rate monitoring, GPS, and long battery life. Imported directly from high-end China manufacturers.',
          stars: 4.8,
          specs: {
            'Display': '1.5-inch AMOLED',
            'Battery': '400mAh (7 Days)',
            'Water Resistance': 'IP68',
            'Connectivity': 'Bluetooth 5.2'
          }
        };
        setProduct(mockProduct);
        setRelatedProducts([mockProduct, mockProduct, mockProduct].map((p, i) => ({ ...p, id: `rel-${i}` })));
      }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = (directBuy = false) => {
    if (!product) return;
    addToCart(product);
    if (directBuy) {
      navigate('/checkout');
    } else {
      toast.success(`${product.name} added to cart`, {
        description: 'You can continue shopping or go to checkout.',
        action: {
          label: 'Checkout',
          onClick: () => navigate('/checkout'),
        },
      });
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim() || !newReview.userName.trim() || !product) return;
    
    setSubmittingReview(true);
    const added = await productService.addReview(product.id, {
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment
    });

    if (added) {
      setProduct(prev => prev ? {
        ...prev,
        reviews: [added, ...(prev.reviews || [])]
      } : null);
      setNewReview({ rating: 5, comment: '', userName: '' });
      toast.success('Review submitted successfully!');
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="max-w-[1140px] mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  const reviews = product.reviews || [];

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-8">
        {/* Images */}
        <div className="space-y-6">
          <div className="relative group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              className="aspect-square bg-secondary/30 rounded-[2rem] overflow-hidden border border-border shadow-xl shadow-secondary/50 relative cursor-crosshair"
            >
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className={`w-full h-full object-contain p-8 mix-blend-multiply transition-all duration-700 ${zoom ? 'opacity-0' : 'opacity-100'}`}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              {zoom && (
                <div 
                  className="absolute inset-0 bg-no-repeat pointer-events-none"
                  style={{
                    backgroundImage: `url(${product.images[selectedImage]})`,
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                    backgroundSize: '200%',
                  }}
                />
              )}
            </motion.div>

            {/* Navigation Arrows */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedImage(prev => (prev + 1) % product.images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center justify-center">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === i ? 'border-primary ring-4 ring-primary/10' : 'border-border opacity-60 hover:opacity-100 hover:border-primary/30'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                {product.category}
              </span>
              <h1 className="text-[36px] font-bold leading-[33.8px] text-foreground pt-4">
                {product.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  <span className="ml-2 text-sm font-bold text-foreground">{product.stars || 5.0}</span>
               </div>
               <Separator orientation="vertical" className="h-4" />
               <span className="text-muted-foreground text-xs font-bold">12 customer reviews</span>
            </div>

            <div className="flex items-baseline gap-4">
               <p className="text-[43px] font-bold text-primary">৳ {product.price.toLocaleString()}</p>
               {product.oldPrice && (
                 <p className="text-xl text-muted-foreground/30 font-bold line-through">৳ {product.oldPrice.toLocaleString()}</p>
               )}
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground leading-relaxed font-medium text-lg line-clamp-3">
                {product.description}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => handleAddToCart(true)}
                size="lg" 
                className="h-16 rounded-2xl text-sm font-bold gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-2xl shadow-accent/20 transition-all active:scale-95"
              >
                Buy it now
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleAddToCart(false)}
                  size="lg" 
                  variant="outline"
                  className="h-16 flex-grow rounded-2xl text-sm font-bold gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to cart
                </Button>
                <Button 
                  onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                  size="icon" 
                  variant="outline"
                  className={`h-16 w-16 rounded-2xl transition-all active:scale-95 ${isInWishlist(product.id) ? 'bg-accent/10 border-accent text-accent' : 'border-2'}`}
                >
                  <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              className="w-full h-16 rounded-2xl text-sm font-bold gap-2 bg-[#11bb99] hover:opacity-90 text-white shadow-2xl shadow-accent/20 transition-all active:scale-95"
              onClick={() => window.open(`tel:01700000000`)}
            >
              <Phone className="h-5 w-5 fill-current" /> Call to order
            </Button>

            <div className="pt-6 space-y-4 border-t border-dashed">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-secondary/50 text-[9px] font-bold uppercase rounded-md px-2 py-0.5">{product.category}</Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-[9px] font-bold uppercase rounded-md px-2 py-0.5">Shop</Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-[9px] font-bold uppercase rounded-md px-2 py-0.5">Premium</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Share:</span>
                <div className="flex gap-4">
                  {['facebook', 'twitter', 'instagram'].map((social) => (
                    <button key={social} className="text-muted-foreground hover:text-primary transition-colors">
                      <div className="h-4 w-4 bg-muted-foreground/10 rounded-full flex items-center justify-center p-0.5">
                         <span className="sr-only">{social}</span>
                         <div className="w-full h-full bg-current rounded-full opacity-20" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-5 p-5 bg-secondary rounded-[1.5rem] border border-border group hover:bg-background hover:shadow-xl transition-all">
                <div className="h-12 w-12 bg-background rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-[11px]">Fast shipping</p>
                  <p className="text-[10px] text-muted-foreground font-bold">3-5 days nationwide</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 bg-secondary rounded-[1.5rem] border border-border group hover:bg-background hover:shadow-xl transition-all">
                <div className="h-12 w-12 bg-background rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all" >
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-[11px]">Secure payment</p>
                  <p className="text-[10px] text-muted-foreground font-bold">SSL secured gateway</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <section className="mt-24">
        <div className="flex flex-col items-center">
          <div className="flex bg-secondary/50 p-1.5 rounded-[1.5rem] gap-1 mb-16 shadow-inner">
            {(['description', 'additional', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3.5 rounded-[1.2rem] text-sm font-bold capitalize transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white text-primary shadow-xl shadow-primary/5' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'additional' ? 'Additional Information' : tab}
                {tab === 'reviews' && reviews.length > 0 && ` (${reviews.length})`}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
          >
            {activeTab === 'description' && (
              <div className="space-y-6 text-center">
                <h3 className="text-2xl font-bold mb-4">Description:</h3>
                <p className="text-muted-foreground text-lg leading-loose max-w-3xl mx-auto">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
                  <div className="p-8 bg-secondary/20 rounded-[2rem] border border-border/50">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" /> Why choose us?
                    </h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#11bb99]" /> Fully genuine products</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#11bb99]" /> 7-day easy return policy</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#11bb99]" /> Best price in Bangladesh</li>
                    </ul>
                  </div>
                  <div className="p-8 bg-secondary/20 rounded-[2rem] border border-border/50">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" /> Delivery Info
                    </h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#11bb99]" /> Inside Dhaka: 24-48 hours</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#11bb99]" /> Outside Dhaka: 3-5 days</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#11bb99]" /> Cash on delivery available</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                  <CheckCircle2 className="h-7 w-7 text-primary" /> Specifications
                </h3>
                {product.specs ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-6 bg-secondary/30 rounded-[1.5rem] border border-border hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all group">
                        <span className="text-sm text-muted-foreground font-bold group-hover:text-primary">{key}:</span>
                        <span className="font-bold text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 text-muted-foreground italic">
                    No additional specifications found for this product.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-3xl font-bold">Reviews ({reviews.length})</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">Based on verified purchases</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-6">
                    {reviews.length > 0 ? reviews.map(review => (
                      <div key={review.id} className="p-8 bg-white rounded-[2rem] border border-border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary/40">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-bold">{review.userName || 'Anonymous'}</h4>
                              <p className="text-[10px] text-muted-foreground font-bold">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">"{review.comment}"</p>
                      </div>
                    )) : (
                      <div className="text-center p-16 bg-secondary/20 rounded-[2rem] border border-dashed">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground font-bold">No reviews yet. Be the first to review!</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-border p-8 rounded-[2rem] shadow-xl h-fit">
                    <h4 className="font-bold text-xs mb-8 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" /> Write a review
                    </h4>
                    <form onSubmit={submitReview} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Name</label>
                          <Input 
                            value={newReview.userName}
                            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                            className="bg-secondary/50 border-none rounded-2xl h-12 text-sm"
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Rating</label>
                          <div className="flex gap-2">
                             {[1, 2, 3, 4, 5].map(star => (
                               <button 
                                 key={star} 
                                 type="button"
                                 onClick={() => setNewReview({ ...newReview, rating: star })}
                                 className={`transition-all hover:scale-110 active:scale-95 ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                               >
                                  <Star className={`h-7 w-7 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                               </button>
                             ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">Message</label>
                          <textarea 
                            rows={4}
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full bg-secondary/50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                            placeholder="Share your thoughts about this product..."
                            required
                          />
                        </div>
                        <Button type="submit" disabled={submittingReview} className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-xs gap-2 shadow-lg shadow-primary/20">
                           {submittingReview ? 'Submitting...' : 'Submit Review'} <Send className="h-4 w-4" />
                        </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-40 pb-20 border-t pt-24">
           <div className="text-center mb-16 space-y-4">
              <h3 className="text-4xl font-bold text-foreground">Related Products</h3>
              <p className="text-muted-foreground font-medium">These products may also interest to you!</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : (
                relatedProducts.slice(0, 4).map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))
              )}
           </div>
           <div className="flex justify-center mt-12">
             <Link to="/products">
               <Button variant="outline" className="h-12 px-10 rounded-full font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                 View all products
               </Button>
             </Link>
           </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
