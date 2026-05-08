import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
    <div className="group bg-white flex flex-col gap-5 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00458f]/10 p-5 rounded-3xl border border-slate-100 w-full relative">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-[17px] shadow-sm bg-muted/40">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
            loading="lazy"
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
      <div className="flex flex-col items-start text-left space-y-3">
        <Link to={`/product/${product.id}`} className="w-full transition-colors group/title">
          <h3 className="text-base font-bold line-clamp-2 leading-[29px] min-h-[2.5rem] group-hover/title:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-3">
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground font-bold line-through">
              {product.oldPrice.toLocaleString()} ৳
            </span>
          )}
          <span className="text-2xl font-black text-primary">
            {product.price.toLocaleString()} <span className="text-accent">৳</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 pt-4">
          <Button 
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart`, {
                description: 'You can continue shopping or go to checkout.',
                action: {
                  label: 'Checkout',
                  onClick: () => navigate('/checkout'),
                },
              });
            }}
            variant="outline" 
            className="w-full h-14 rounded-2xl border-2 border-accent/20 text-accent hover:bg-accent hover:text-white hover:border-accent hover:scale-[1.02] font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 px-6 shadow-sm"
          >
            Add to cart
            <ShoppingCart className="w-5 h-5" />
          </Button>
          <Button 
            onClick={handleBuyNow}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] font-bold text-sm transition-all active:scale-95 border-none shadow-lg shadow-primary/20"
          >
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
