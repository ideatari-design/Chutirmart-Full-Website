import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="group bg-white flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#00458f]/10 rounded-3xl border border-slate-100 w-full relative overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted/20 shrink-0">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <img 
            src={convertGoogleDriveLink(product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800')} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
            }}
          />
        </Link>
        
        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-primary border-none rounded-full px-3 py-1 text-[10px] font-bold shadow-sm">
              -{discount}%
            </Badge>
          </div>
        )}

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <Button 
            onClick={toggleWishlist}
            variant="secondary" 
            size="icon" 
            className={`rounded-full h-10 w-10 backdrop-blur-md shadow-2xl transition-all ${isInWishlist(product.id) ? 'bg-accent text-accent-foreground' : 'bg-white/70 hover:bg-white text-foreground'}`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow items-start text-left space-y-2 md:space-y-3 p-3 md:p-5 pt-4 min-h-0">
        <Link to={`/product/${product.id}`} className="w-full transition-colors group/title">
          <h3 className="text-sm md:text-base font-bold line-clamp-2 leading-snug md:leading-relaxed min-h-[2.5rem] group-hover/title:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-3">
          {product.oldPrice && (
            <span className="text-[10px] md:text-sm text-muted-foreground font-bold line-through">
              {product.oldPrice.toLocaleString()} ৳
            </span>
          )}
          <span className="text-lg md:text-2xl font-black text-primary">
            {product.price.toLocaleString()} <span className="text-accent">৳</span>
          </span>
        </div>

        {/* Action Buttons - Pushed to bottom */}
        <div className="w-full flex flex-col gap-2 md:gap-3 pt-2 md:pt-4 mt-auto">
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
            className="w-full h-10 md:h-14 rounded-xl md:rounded-2xl border md:border-2 border-accent/20 text-accent hover:bg-accent hover:text-white hover:border-accent hover:scale-[1.02] font-bold text-[10px] md:text-sm flex items-center justify-center gap-1.5 md:gap-3 transition-all active:scale-95 px-2 md:px-6 shadow-sm"
          >
            Add to cart
            <ShoppingCart className="w-3.5 h-3.5 md:w-5 h-5" />
          </Button>
          <Button 
            onClick={handleBuyNow}
            className="w-full h-10 md:h-14 rounded-xl md:rounded-2xl bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] font-bold text-[10px] md:text-sm transition-all active:scale-95 border-none shadow-lg shadow-primary/20"
          >
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
