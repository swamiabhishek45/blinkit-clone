'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, updateQuantity, selectCartItems } from '@/store/cartSlice';
import Image from 'next/image';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);

    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
            })
        );
    };

    const handleIncrement = () => {
        dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }));
    };

    const handleDecrement = () => {
        dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }));
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full group">
            <div className="relative bg-pink-50 p-6 flex items-center justify-center">
                <Image
                    src={product.image}
                    alt={product.title}
                    width={200}
                    height={200}
                    className="object-contain max-w-full max-h-[160px] transition-transform duration-300"
                />
                {product.rating.rate >= 4 && (
                    <span className="absolute top-3 left-3 bg-orange-300 text-[#333] px-3 py-1 rounded-[20px] text-[0.7rem] font-bold">
                         Best Seller
                    </span>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1 gap-2">
                <span className="text-[0.7rem] uppercase text-[#0C831F] font-semibold tracking-wide">
                    {product.category}
                </span>
                <h3 className="text-[0.95rem] font-semibold text-[#1a1a1a] line-clamp-2 leading-snug">
                    {product.title}
                </h3>
                <p className="text-[0.8rem] text-[#666] line-clamp-2 leading-normal">
                    {product.description}
                </p>

                <div className="mt-auto pt-2">
                    <span className="text-[0.8rem] text-[#555] font-medium">
                        ⭐ {product.rating.rate} ({product.rating.count})
                    </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#f0f0f0] mt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-[#1a1a1a]">
                            ₹{product.price.toFixed(2)}
                        </span>
                        <span className="text-[0.8rem] text-[#999] line-through">
                            ₹{(product.price * 1.2).toFixed(2)}
                        </span>
                        <span className="bg-[#e8f5e9] text-[#0C831F] px-2 py-0.5 rounded text-[0.65rem] font-bold">
                            20% OFF
                        </span>
                    </div>

                    {quantity === 0 ? (
                        <button
                            onClick={handleAddToCart}
                            className="bg-white text-[#0C831F] border-2 border-[#0C831F] px-6 py-2 rounded-lg font-bold text-sm cursor-pointer transition-all duration-200 hover:bg-[#0C831F] hover:text-white"
                        >
                            ADD
                        </button>
                    ) : (
                        <div className="flex items-center bg-[#0C831F] rounded-lg overflow-hidden">
                            <button
                                onClick={handleDecrement}
                                className="bg-transparent border-none text-white px-3 py-2 text-base font-bold cursor-pointer transition-colors duration-200"
                            >
                                −
                            </button>
                            <span className="text-white font-bold px-3 text-sm">{quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="bg-transparent border-none text-white px-3 py-2 text-base font-bold cursor-pointer transition-colors duration-200"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}