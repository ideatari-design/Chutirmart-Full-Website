import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Phone, 
  ChevronDown, 
  Truck, 
  Clock, 
  BadgeCheck, 
  ThumbsUp,
  Mail,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  HelpCircle,
  MessageSquare,
  MapPin,
  ShoppingBag,
  Heart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';
import AdminLayout from '@/pages/AdminLayout';
import Catalog from '@/pages/Catalog';
import Cart from '@/pages/Cart';
import { useCart } from '@/context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import { useWishlist } from '@/context/WishlistContext';
import { useSettings } from '@/context/SettingsContext';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { convertGoogleDriveLink } from '@/lib/imageUtils';
import LiveChat from '@/components/LiveChat';

const TopHeader = () => (
  <div className="bg-background border-b py-2 text-xs text-muted-foreground hidden lg:block">
    <div className="max-w-[1140px] mx-auto px-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3" />
          <span>Contact us 24/7: <span className="text-foreground font-bold">(+880) 1700-000000</span></span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
          <img src="https://flagcdn.com/us.svg" alt="US" className="w-5 h-auto object-contain" />
          <span>English</span>
          <ChevronDown className="h-3 w-3" />
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-primary font-medium">
          <span>৳ BDT</span>
          <ChevronDown className="h-3 w-3" />
        </div>
        <Link to="/admin" className="flex items-center gap-2 cursor-pointer hover:text-primary">
          <User className="h-4 w-4" />
          <span>Admin</span>
        </Link>
      </div>
    </div>
  </div>
);

const Logo = ({ className = "", invert = false }: { className?: string, invert?: boolean }) => {
  const { settings } = useSettings();
  const [error, setError] = React.useState(false);

  if (settings.logo && !error) {
    return (
      <img 
        src={convertGoogleDriveLink(settings.logo)} 
        alt={settings.shopName || "Logo"} 
        className={cn(invert ? "brightness-0 invert" : "", className)}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className={cn("text-2xl md:text-3xl font-black flex items-center text-primary uppercase whitespace-nowrap", className)}>
      {settings.shopName || 'OJALA'}
      <span className="w-1.5 h-1.5 bg-accent rounded-full ml-1 self-end mb-1 md:mb-1.5" />
    </div>
  );
};

const MainHeader = () => {
  const { itemCount, cartTotal, cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { settings } = useSettings();
  const [isBumping, setIsBumping] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (itemCount === 0) return;
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 300);
    return () => clearTimeout(timer);
  }, [itemCount]);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setIsLoadingSuggestions(false);
        return;
      }
      
      setIsLoadingSuggestions(true);
      const results = await productService.searchProducts(searchQuery);
      setSuggestions(results.slice(0, 6));
      setIsLoadingSuggestions(false);
      setSelectedIndex(-1);
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigate(`/product/${suggestions[selectedIndex].id}`);
        setSearchQuery('');
        setIsSearchFocused(false);
      } else if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        setIsSearchFocused(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };
  
  const searchRef = React.useRef<HTMLDivElement>(null);
  const mobileSearchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isMobileSearchFocused, setIsMobileSearchFocused] = React.useState(false);

  return (
    <div className="bg-background border-b py-5 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1140px] mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
        <Link to="/" className="flex items-center shrink-0 transition-transform active:scale-95 group">
          <Logo className="h-10 md:h-12 w-auto object-contain" />
        </Link>
        
        <div className="flex-grow max-w-2xl hidden md:block relative" ref={searchRef}>
          <div className="flex items-center bg-secondary rounded-full overflow-hidden px-4 border border-transparent focus-within:border-primary/20 transition-all">
            {isLoadingSuggestions ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
            ) : (
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
            )}
            <Input 
              placeholder="Search for products..." 
              className="border-none bg-transparent focus-visible:ring-0 text-sm h-11" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Search Suggestions */}
          {isSearchFocused && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {isLoadingSuggestions ? (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-bold uppercase">Searching products...</span>
                  </div>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase border-b mb-1">
                    Suggestions
                  </div>
                  {suggestions.map((product, idx) => (
                    <div 
                      key={product.id}
                      className={`p-3 cursor-pointer flex items-center gap-3 transition-colors ${selectedIndex === idx ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setSearchQuery('');
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                        <img 
                          src={convertGoogleDriveLink(product.images[0])} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{product.category}</p>
                      </div>
                      <div className="ml-auto text-right shrink-0">
                        <p className="text-sm font-black text-primary">৳{product.price.toLocaleString()}</p>
                        {product.discountPrice && (
                          <p className="text-[10px] text-muted-foreground line-through">৳{product.discountPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div 
                    className="p-4 bg-secondary/30 hover:bg-secondary/50 cursor-pointer text-center transition-colors border-t"
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                      setSearchQuery('');
                    }}
                  >
                    <p className="text-xs font-bold text-primary flex items-center justify-center gap-2">
                      View all results for "{searchQuery}" <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-bold uppercase">No products found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          {/* Wishlist Trigger */}
          <Sheet>
            <SheetTrigger nativeButton={false} render={<div className="hidden sm:flex items-center gap-2 cursor-pointer group" />}>
              <div className="relative">
                <Heart className="h-6 w-6 transition-colors group-hover:text-accent" />
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-background">
                  {wishlist.length}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold leading-none mb-1">Wishlist</p>
                <p className="text-sm font-bold text-foreground">Saved</p>
              </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-xl font-bold flex items-center gap-3">
                  <Heart className="h-6 w-6 text-accent fill-accent" /> My wishlist ({wishlist.length})
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-grow p-6">
                {wishlist.length === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <Heart className="h-16 w-16 opacity-10" />
                    <p className="text-sm font-bold">No items saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {wishlist.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                        <Link to={`/product/${item.id}`} className="w-20 h-20 bg-secondary rounded-2xl overflow-hidden flex-shrink-0">
                          <img 
                            src={convertGoogleDriveLink(item.images[0])} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        </Link>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-sm truncate">{item.name}</h4>
                          <p className="text-primary font-bold mt-1">৳ {item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <Link to={`/product/${item.id}`}>
                              <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold">View product</Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors ml-auto" onClick={() => removeFromWishlist(item.id)}><X className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="p-6 border-t bg-secondary/30">
                <p className="text-[10px] text-center font-bold text-muted-foreground">Saved for later</p>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger nativeButton={false} render={<div className="flex items-center gap-3 cursor-pointer group" />}>
                <motion.div 
                  animate={isBumping ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                   <ShoppingCart className={`h-6 w-6 md:h-7 md:w-7 transition-colors ${isBumping ? 'text-accent' : 'group-hover:text-accent'}`} />
                   <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 md:h-5 md:w-5 flex items-center justify-center rounded-full ring-2 ring-background">
                    {itemCount}
                  </span>
                </motion.div>
                <div className="hidden sm:block">
                  <p className="text-[10px] text-muted-foreground font-bold leading-none mb-1">Shopping cart</p>
                  <p className="text-sm font-bold">৳ {cartTotal.toLocaleString()}</p>
                </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0 overflow-hidden">
              <SheetHeader className="p-4 md:p-6 border-b shrink-0 flex flex-row items-center justify-between">
                <SheetTitle className="text-xl font-bold flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-primary" /> My cart ({itemCount})
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-grow min-h-0 p-4 md:p-6">
                {cart.length === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <ShoppingBag className="h-16 w-16 opacity-10" />
                    <p className="text-sm font-bold">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6 pb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-2xl overflow-hidden flex-shrink-0">
                          <img 
                            src={convertGoogleDriveLink(item.images[0])} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-sm truncate">{item.name}</h4>
                          <p className="text-primary font-bold mt-1">৳ {item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center bg-secondary rounded-lg p-0.5 border">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-6 w-6 rounded-md hover:bg-white"
                                 onClick={() => updateQuantity(item.id, item.quantity - 1)}
                               >
                                 <Minus className="h-3 w-3" />
                               </Button>
                               <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-6 w-6 rounded-md hover:bg-white"
                                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
                               >
                                 <Plus className="h-3 w-3" />
                               </Button>
                            </div>
                            <Link to={`/product/${item.id}`} onClick={() => document.body.click()}>
                              <Button variant="outline" size="sm" className="h-7 md:h-8 rounded-lg text-[9px] md:text-[10px] font-bold">View product</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <SheetFooter className="p-4 md:p-6 pb-6 md:pb-8 border-t bg-secondary/30 flex flex-col gap-2 md:gap-4 mt-0 shrink-0">
                <div className="flex justify-between items-center font-bold text-base md:text-xl mb-1">
                  <span>Subtotal</span>
                  <span className="text-primary">৳ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Link to="/cart" className="block w-full" onClick={() => {
                    setIsSearchFocused(false);
                    document.body.click();
                  }}>
                    <Button variant="outline" className="h-10 md:h-12 w-full text-[10px] font-bold uppercase rounded-xl border-2 hover:bg-secondary transition-all shadow-sm">
                      View Full Cart
                    </Button>
                  </Link>
                  <Button 
                    className="h-11 md:h-14 w-full text-sm font-bold uppercase rounded-xl md:rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all" 
                    disabled={cart.length === 0}
                    onClick={() => {
                      document.body.click();
                      navigate('/checkout');
                    }}
                  >
                    Proceed to checkout
                  </Button>
                </div>
                <p className="hidden md:block text-[9px] md:text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest mt-1">Secure checkout via SSL</p>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger nativeButton={false} render={<div className="lg:hidden h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-secondary rounded-lg transition-colors" />}>
              <Menu className="h-7 w-7" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle>
                  <Logo className="h-8 w-auto object-contain" />
                </SheetTitle>
              </SheetHeader>
              <div className="p-4 border-b">
                 <div className="relative" ref={mobileSearchRef}>
                    <div className="flex items-center bg-secondary rounded-xl overflow-hidden px-4 border border-transparent focus-within:border-primary/20 transition-all">
                      {isLoadingSuggestions ? (
                        <Loader2 className="h-4 w-4 text-primary animate-spin mr-2" />
                      ) : (
                        <Search className="h-4 w-4 text-muted-foreground mr-2" />
                      )}
                      <Input 
                        placeholder="Search products..." 
                        className="border-none bg-transparent focus-visible:ring-0 text-sm h-10" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsMobileSearchFocused(true)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                    {isMobileSearchFocused && searchQuery.trim().length >= 2 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-lg overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                        {isLoadingSuggestions ? (
                          <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Searching...</div>
                        ) : suggestions.length > 0 ? (
                          suggestions.map(product => (
                            <div 
                              key={product.id}
                              className="p-3 hover:bg-secondary cursor-pointer flex items-center gap-3 border-b last:border-0"
                              onClick={() => {
                                navigate(`/product/${product.id}`);
                                setSearchQuery('');
                                setIsMobileSearchFocused(false);
                              }}
                            >
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-8 h-8 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate">{product.name}</p>
                                <p className="text-[10px] text-primary font-black">৳{product.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs text-muted-foreground">No products found</div>
                        )}
                        <div 
                          className="p-3 bg-secondary/30 text-center cursor-pointer border-t"
                          onClick={() => {
                            if (searchQuery.trim()) {
                              navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                              setSearchQuery('');
                              setIsMobileSearchFocused(false);
                            }
                          }}
                        >
                          <p className="text-[10px] font-bold text-primary">View all results</p>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
              <div className="flex-grow overflow-y-auto p-6">
                <nav className="flex flex-col gap-6 text-sm font-bold uppercase">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
                  <Link to="/products" className="hover:text-primary transition-colors">Categories</Link>
                  <Link to="/track" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Track order</Link>
                  <Link to="/about" className="hover:text-primary transition-colors">About us</Link>
                  <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                  <Link to="/discount" className="flex items-center gap-2 text-accent">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    Special offers
                  </Link>
                </nav>
              </div>
              <div className="p-6 border-t mt-auto space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-bold leading-none">(+880) 1700-000000</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                    <Link key={i} to="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                      <Icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

const NavHeader = () => (
  <div className="bg-background border-b py-3 hidden lg:block sticky top-[89px] z-40">
    <div className="max-w-[1140px] mx-auto px-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-8 text-[13px] font-bold uppercase">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
          <Link to="/products" className="flex items-center gap-1 hover:text-primary group">Categories <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform" /></Link>
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <Link to="/discount" className="flex items-center gap-2 text-accent animate-pulse">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            Special Offers
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/track" target="_blank" rel="noopener noreferrer" className="text-xs font-bold border rounded-full px-4 py-1.5 hover:bg-secondary transition-colors uppercase">Track Order</Link>
      </div>
    </div>
  </div>
);

const Features = () => (
  <div className="border-b bg-background py-8">
    <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { title: "Fast & Free Shipping", desc: "On orders over $50", icon: <Truck className="h-6 w-6" /> },
        { title: "Next Day Delivery", desc: "Fastest turnaround time", icon: <Clock className="h-6 w-6" /> },
        { title: "Price Match Guarantee", desc: "We offer the best prices", icon: <BadgeCheck className="h-6 w-6" /> },
        { title: "Quality Guarantee", desc: "100% genuine products", icon: <ThumbsUp className="h-6 w-6" /> },
      ].map((f, i) => (
        <div key={i} className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            {f.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold">{f.title}</h4>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer className="bg-[#111] text-white pt-20 pb-10">
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12 mb-20">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/">
              <Logo className="h-10 md:h-12 w-auto object-contain mb-6 md:mb-8" invert />
            </Link>
            <div className="space-y-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground/60 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-muted-foreground/60 shrink-0" />
              <span>support@ojalashop.com</span>
            </div>
            <div className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-muted-foreground/60 shrink-0" />
              <span className="text-2xl font-bold text-primary-foreground leading-none">(+880) 1700-000000</span>
            </div>
          </div>
        </div>
        
        {[
          { 
            title: "Shopping", 
            links: ["Wishlist", "Browse Brands", "Offers", "Track Order", "Buying Guide"] 
          },
          { 
            title: "Information", 
            links: ["Order Tracking", "Shipping & Return", "About Us", "Help", "Gift Cards"] 
          },
          { 
            title: "Account", 
            links: ["Cart", "My Profile", "My Orders", "Affiliate Program"] 
          }
        ].map((col, i) => (
          <div key={i}>
            <h4 className="font-bold text-[11px] uppercase mb-8">{col.title}</h4>
            <ul className="space-y-4 text-[13px] text-muted-foreground">
              {col.links.map((link, j) => (
                <li key={j}><Link to="#" className="hover:text-primary transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-3 lg:col-span-2">
           <h4 className="font-bold text-[10px] md:text-[11px] uppercase mb-6 md:mb-8 tracking-widest text-[#555]">Follow Us</h4>
            <div className="relative">
               <Input 
                 placeholder="Enter your email" 
                 className="bg-secondary border-none h-12 pr-12 text-foreground placeholder:text-muted-foreground rounded-none" 
               />
               <ArrowRight className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            </div>
            <div className="flex gap-2 mt-8">
               {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                 <Link key={i} to="#" className="h-10 w-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                   <Icon className="h-4 w-4" />
                 </Link>
               ))}
            </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-between items-center py-10 border-t border-gray-800 gap-10 lg:gap-12 text-center lg:text-left">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12">
            {[
              { icon: <Phone className="h-6 w-6 text-primary" />, title: "Can't find what you're looking for?", link: "Contact Us" },
              { icon: <HelpCircle className="h-6 w-6 text-primary" />, title: "How can we help?", link: "Help Center" },
              { icon: <MessageSquare className="h-6 w-6 text-primary" />, title: "Tell us what you think!", link: "Give Feedback" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                {item.icon}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">{item.title}</p>
                  <p className="text-sm font-medium hover:text-primary cursor-pointer transition-colors leading-none mt-1">{item.link}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-6 text-[10px] text-muted-foreground uppercase font-bold border-t border-border pt-10">
        <p>Copyright © {new Date().getFullYear()} {settings.shopName || 'OJALA SHOP'}. All rights reserved.</p>
        <div className="flex items-center gap-4">
           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer dark:invert" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer dark:invert" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer dark:invert" />
        </div>
      </div>
    </div>
  </footer>
  );
};

export default function App() {
  const location = useLocation();
  const isAdminPath = React.useMemo(() => location.pathname.match(/^\/admin(\/|$)/), [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent/20 relative">
      {!isAdminPath && <TopHeader />}
      {!isAdminPath && <MainHeader />}
      {!isAdminPath && <NavHeader />}
      <main className="flex-grow w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <LiveChat />}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
