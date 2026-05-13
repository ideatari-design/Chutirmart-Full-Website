import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Truck, 
  Clock, 
  BadgeCheck, 
  ThumbsUp, 
  Star, 
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  MapPin,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import Breadcrumbs from '@/components/Breadcrumbs';
import { bannerService, Banner } from '@/services/bannerService';
import { convertGoogleDriveLink } from '@/lib/imageUtils';

const Features = () => (
  <div className="bg-background py-12 border-b">
    <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { title: "Fast & Free Delivery", desc: "On orders over ৳ 1000", icon: <Truck className="h-7 w-7" /> },
        { title: "24/7 Support", desc: "Professional assistance", icon: <Clock className="h-7 w-7" /> },
        { title: "Best Price Guarantee", desc: "We offer competitive prices", icon: <BadgeCheck className="h-7 w-7" /> },
        { title: "Quality Guarantee", desc: "100% genuine products", icon: <ThumbsUp className="h-7 w-7" /> },
      ].map((f, i) => (
        <div key={i} className="flex items-center gap-5 group cursor-pointer hover:translate-y-[-2px] transition-all">
          <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
            {f.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold">{f.title}</h4>
            <p className="text-[11px] text-muted-foreground font-bold mt-0.5">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategoryCircles = () => {
  const categories = [
    { name: "Smartphone", icon: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=300" },
    { name: "Home & Decor", icon: "https://images.unsplash.com/photo-1513519245088-0e12902e3a38?auto=format&fit=crop&q=80&w=300" },
    { name: "Makeup", icon: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=300" },
    { name: "Autoparts", icon: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=300" },
    { name: "Laptop", icon: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=300" },
    { name: "Fashion", icon: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=300" },
    { name: "Headphones", icon: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300" },
    { name: "Handbags", icon: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=300" },
  ];

  // Triple categories to ensure no gap on very wide screens and smooth loop
  const allCategories = [...categories, ...categories, ...categories];

  return (
    <div className="py-16 overflow-hidden bg-background/50">
      <div className="max-w-[1140px] mx-auto px-4 relative overflow-hidden">
        <motion.div 
          className="flex gap-12 w-max"
          animate={{ x: [0, -1408] }} // 8 items * (128w + 48gap) = 1408px
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {allCategories.map((c, i) => (
            <Link 
              key={i} 
              to={`/products?category=${c.name}`} 
              className="flex flex-col items-center gap-4 shrink-0 group cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-background border-2 border-border group-hover:border-primary transition-all p-2 bg-secondary/30 relative">
                <img 
                  src={convertGoogleDriveLink(c.icon)} 
                  alt={c.name} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300';
                  }}
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all rounded-full" />
              </div>
              <p className="text-[11px] font-bold text-center group-hover:text-primary transition-colors">{c.name}</p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const FlashDeals = ({ products, loading }: { products: Product[], loading: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({ h: 11, m: 41, s: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-12 md:py-20 max-w-[1140px] mx-auto px-0 sm:px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-secondary/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-border mx-4 sm:mx-0">
        <div className="flex flex-col items-center lg:items-start lg:flex-row lg:gap-12 w-full">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Flash sale</h2>
            <p className="text-[11px] md:text-xs font-semibold text-muted-foreground mt-1 md:mt-2">Don't miss the current deals!</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground">Ends in:</span>
            <div className="flex gap-2">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-accent text-accent-foreground w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-bold rounded-xl shadow-lg shadow-accent/20">
                    {t.toString().padStart(2, '0')}
                  </div>
                  <span className="text-[9px] font-bold mt-1 text-muted-foreground">{i === 0 ? 'Hrs' : i === 1 ? 'Min' : 'Sec'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link to="/products" className="w-full lg:w-auto">
          <Button variant="outline" className="w-full lg:w-auto rounded-xl md:rounded-2xl px-10 h-12 md:h-14 font-black text-[13px] md:text-[15px] leading-[18px] border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all shadow-sm hover:shadow-md no-underline uppercase tracking-tight">
            See all products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-0">
        {loading ? (
          [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        ) : (
           <div className="col-span-full py-10 text-center">
             <p className="text-muted-foreground italic">No flash deals at the moment.</p>
           </div>
        )}
      </div>
    </div>
  );
};


const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getAllBanners();
        setSlides(data.filter(b => b.status === 'active' && b.type === 'hero'));
      } catch (err) {
        console.error("Failed to fetch banners");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000); // Slower interval for better reading
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]); // Added currentSlide to reset timer on manual move

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    } else {
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    })
  };

  if (loading) {
    return <div className="h-full w-full bg-secondary/20 animate-pulse rounded-[1.5rem]" />;
  }

  if (slides.length === 0) {
    return (
      <div className="h-full w-full bg-secondary/20 flex items-center justify-center rounded-[1.5rem] border-2 border-dashed border-border">
        <div className="text-center">
          <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground font-bold text-sm">No active banners to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[1.5rem] group bg-secondary shadow-2xl">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 350, damping: 35 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.5 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {slides[currentSlide].link ? (
            <Link to={slides[currentSlide].link} className="block w-full h-full">
              <img 
                src={convertGoogleDriveLink(slides[currentSlide].image)} 
                alt={slides[currentSlide].title}
                className="w-full h-full object-fill md:object-cover select-none pointer-events-none" 
                referrerPolicy="no-referrer"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1600'; // Generic high quality store image
                }}
              />
            </Link>
          ) : (
            <img 
              src={convertGoogleDriveLink(slides[currentSlide].image)} 
              alt={slides[currentSlide].title}
              className="w-full h-full object-fill md:object-cover select-none pointer-events-none" 
              referrerPolicy="no-referrer"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1600';
              }}
            />
          )}
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1);
                setCurrentSlide(i);
              }}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-500 shadow-sm ${
                i === currentSlide 
                ? 'w-8 md:w-12 bg-white' 
                : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 h-8 w-8 md:h-14 md:w-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/20 z-30 border border-white/20"
          >
            <ChevronLeft className="h-4 w-4 md:h-8 md:w-8" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 h-8 w-8 md:h-14 md:w-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white/20 z-30 border border-white/20"
          >
            <ChevronRight className="h-4 w-4 md:h-8 md:w-8" />
          </button>
        </>
      )}
    </div>
  );
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Fashion', 'Smartphone', 'Home & Decor', 'Beauty'];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = React.useMemo(() => {
    const newArrivals = products.filter(p => p.isNewArrival);
    if (activeTab === 'All') return newArrivals;
    return newArrivals.filter(p => p.category === activeTab);
  }, [products, activeTab]);

  const flashSaleProducts = React.useMemo(() => {
    return products.filter(p => p.isFlashSale);
  }, [products]);

  const bestSellingProducts = React.useMemo(() => {
    return products.filter(p => p.isBestSelling);
  }, [products]);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-background py-4 md:py-8 lg:py-10">
        <div className="max-w-[1140px] mx-auto px-4">
          <div className="relative aspect-[21/10] sm:aspect-[16/7] md:aspect-[21/9] lg:h-[520px] w-full">
             <BannerSlider />
          </div>
        </div>
      </section>

      {/* Removed Features section per user request and selector */}
      
      <CategoryCircles />
      
      <div className="max-w-[1140px] mx-auto px-4">
         <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl">
            <p className="text-[11px] text-center font-bold text-muted-foreground">
               Super discount for your <span className="text-accent font-bold">first purchase</span> — Use code <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded ml-1">COUPON25</span>
            </p>
         </div>
      </div>

      <FlashDeals products={flashSaleProducts} loading={loading} />
      
      {/* New Arrivals */}
      <section className="py-12 md:py-20 max-w-[1140px] mx-auto px-0 md:px-4 border-t">
        <div className="flex flex-col items-center mb-8 md:mb-12 gap-8 px-4 md:px-0">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">New arrivals</h2>
            <div className="w-full flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 px-2">
              <div className="flex items-center gap-8 md:gap-10 mx-auto">
                {tabs.map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`text-[11px] md:text-xs font-black uppercase tracking-widest transition-all relative py-2 whitespace-nowrap ${activeTab === tab ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab}
                    {activeTab === tab && <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/products" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-accent flex items-center gap-2 transition-colors group">
              See all <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-0">
           {loading ? (
             [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
           ) : (
             <AnimatePresence mode="popLayout">
               {filteredProducts.slice(0, 8).map((p) => (
                 <motion.div
                   key={p.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.3 }}
                 >
                   <ProductCard product={p} />
                 </motion.div>
               ))}
               {filteredProducts.length === 0 && !loading && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="col-span-full py-20 text-center"
                 >
                   <div className="bg-secondary/30 rounded-3xl p-12 inline-block">
                     <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                     <p className="text-muted-foreground font-bold">No products found in this category</p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           )}
        </div>
      </section>

      {/* Best Selling */}
      <section className="py-16 md:py-24 bg-secondary/30">
         <div className="max-w-[1140px] mx-auto px-0 md:px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 px-4 md:px-0">
               <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center md:text-left">Best selling</h2>
               <Link to="/products" className="w-full md:w-auto">
                 <Button variant="outline" className="w-full md:w-auto h-12 md:h-auto rounded-full px-8 py-2.5 bg-white border-border/50 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent hover:border-accent transition-all shadow-sm">
                   See all products
                 </Button>
               </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 px-4 sm:px-0">
               {loading ? (
                 [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
               ) : bestSellingProducts.length > 0 ? (
                 bestSellingProducts.slice(0, 4).map((p) => (
                   <ProductCard key={p.id} product={p} />
                 ))
               ) : (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-muted-foreground italic">No best selling products at the moment.</p>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* From Our Blog */}
      <section className="py-16 md:py-20 max-w-[1140px] mx-auto px-4 border-t">
         <h2 className="text-3xl font-bold mb-12 text-center md:text-left">From our blog</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { category: "Beauty & fashion", title: "Weekday Outfit Inspiration", author: "Mirtul Mina", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600" },
              { category: "Cosmetics", title: "Pure & Natural Essential Oil", author: "Mirtul Mina", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600" },
              { category: "Electronics", title: "Tips for Cleaning Hardware", author: "Mirtul Mina", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600" },
            ].map((blog, i) => (
              <div key={i} className="group cursor-pointer">
                  <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] mb-6 shadow-xl shadow-foreground/5">
                    <img 
                      src={blog.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      loading="lazy" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </div>
                 <div className="space-y-3 md:space-y-4 px-2">
                    <div className="flex items-center gap-4 text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                       <span className="text-primary">{blog.category}</span>
                       <span className="w-1 h-1 rounded-full bg-border" />
                       <span>By <span className="text-foreground">{blog.author}</span></span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors leading-tight">{blog.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">High quality products and expert advice for your everyday needs.</p>
                    <Button variant="outline" className="w-full md:w-auto h-11 md:h-12 text-[10px] md:text-[11px] font-black uppercase tracking-widest px-8 rounded-xl md:rounded-2xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">Read more</Button>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Middle Search banner */}
      <section className="bg-primary py-16 md:py-24 text-white overflow-hidden relative">
         <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">Looking for <br /> something else?</h2>
            <div className="relative mb-8 group">
               <Input placeholder="Search for products..." className="h-14 md:h-16 pr-14 md:pr-16 rounded-full text-xs md:text-sm text-center border-none bg-white/10 backdrop-blur-xl text-white placeholder:text-white/40 focus-visible:ring-white/20" />
               <Button className="absolute right-1.5 md:right-2 top-1.5 md:top-2 h-11 w-11 md:h-12 md:w-12 rounded-full bg-white text-primary hover:bg-white/90 shadow-xl transition-all active:scale-95"><Search className="h-4 w-4 md:h-5 md:w-5" /></Button>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-white/70">
               {["Smartphone", "Tablet", "Furniture", "Laptop", "Fashion", "Home & decor", "Camera"].map(tag => (
                 <span key={tag} className="hover:text-white cursor-pointer transition-colors hover:scale-110 transform duration-300">{tag}</span>
               ))}
            </div>
         </div>
         <div className="absolute top-1/2 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      </section>
    </div>
  );
};

export default Home;
