import React from 'react';
import { ShoppingCart, Star, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { convertGoogleDriveLink } from '@/lib/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = React.useState(1);
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const navigate = useNavigate();
  
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  const handleBuyNow = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
    navigate('/checkout');
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="group bg-white flex flex-col h-full md:transition-all md:duration-300 md:hover:shadow-2xl md:hover:shadow-[#00458f]/10 rounded-lg md:rounded-3xl border border-slate-100 w-full relative overflow-hidden [contain:content]">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 shrink-0 [transform:translateZ(0)] flex items-center justify-center">
        {!isImageLoaded && (
          <Skeleton className="absolute inset-0 z-0 bg-slate-200/50" />
        )}
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <img 
            src={convertGoogleDriveLink(product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800')} 
            alt={product.name} 
            className={`w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
              setIsImageLoaded(true);
            }}
          />
        </Link>
        
        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
            <Badge variant="secondary" className="bg-white md:bg-white/90 md:backdrop-blur-md text-primary border border-slate-100 md:border-none rounded-lg md:rounded-full px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-bold shadow-sm">
              -{discount}%
            </Badge>
          </div>
        )}

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 md:transition-all duration-500">
          <Button 
            onClick={toggleWishlist}
            variant="secondary" 
            size="icon" 
            className={`rounded-full h-10 w-10 bg-white shadow-2xl transition-all ${isInWishlist(product.id) ? 'bg-accent text-accent-foreground' : 'hover:bg-white text-foreground'}`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow items-start text-left space-y-1.5 md:space-y-3 p-3.5 md:p-6 pt-4 min-h-0">
        <Link to={`/product/${product.id}`} className="w-full transition-colors group/title">
          <h3 className="text-[13px] md:text-base font-bold line-clamp-2 leading-tight md:leading-relaxed min-h-[2.4rem] md:min-h-[2.8rem] group-hover/title:text-primary transition-colors text-left">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-baseline gap-x-2 gap-y-0.5 w-full">
          <div className="flex items-baseline gap-2">
            <span className="text-base md:text-2xl font-black text-primary whitespace-nowrap flex items-center gap-0.5">
              {product.price.toLocaleString()} <span className="text-accent text-[10px] md:text-xl">৳</span>
            </span>
            {product.oldPrice && (
              <span className="text-[10px] md:text-xs text-muted-foreground font-bold line-through whitespace-nowrap opacity-60">
                {product.oldPrice.toLocaleString()} ৳
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons - Pushed to bottom */}
        <div className="w-full flex flex-col gap-2 md:gap-3 lg:gap-4 pt-3 md:pt-4 mt-auto">
          <Button 
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart`, {
                description: 'You can continue shopping or go to checkout.',
                duration: 5000,
                action: {
                  label: 'Checkout',
                  onClick: () => navigate('/checkout'),
                },
                actionButtonStyle: {
                  backgroundColor: '#00458F',
                  color: 'white',
                  fontWeight: '900',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  textTransform: 'uppercase',
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                }
              });
            }}
            variant="outline" 
            className="w-full h-11 md:h-14 rounded-lg md:rounded-2xl border border-slate-200 md:border-2 border-accent/10 text-accent md:hover:bg-accent md:hover:text-white md:hover:border-accent md:hover:scale-[1.02] font-bold text-[11px] md:text-sm flex items-center justify-center gap-2 md:gap-3 transition-opacity md:transition-all active:opacity-80 md:active:scale-95 px-2 md:px-6 shadow-sm"
          >
            Add to cart
            <ShoppingCart className="w-3.5 h-3.5 md:w-5 h-5" />
          </Button>
          <Button 
            onClick={handleBuyNow}
            className="w-full h-11 md:h-14 rounded-lg md:rounded-2xl bg-primary text-primary-foreground md:hover:opacity-95 md:hover:scale-[1.02] font-black text-[11px] md:text-sm transition-opacity md:transition-all active:opacity-80 md:active:scale-95 border-none shadow-md md:shadow-lg shadow-primary/20 uppercase tracking-wider"
          >
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
