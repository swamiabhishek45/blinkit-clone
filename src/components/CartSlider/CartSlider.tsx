'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    selectCartItems,
    selectCartIsOpen,
    selectCartSubtotal,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
} from '@/store/cartSlice';
import { selectIsAuthenticated, openAuthModal } from '@/store/authSlice';
import Image from 'next/image';

type CheckoutStep = 'cart' | 'details' | 'success';

interface UserDetails {
    name: string;
    phone: string;
    address: string;
    pincode: string;
}

export default function CartSlider() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    
    const [step, setStep] = useState<CheckoutStep>('cart');
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: '',
        phone: '',
        address: '',
        pincode: '',
    });
    
    const isOpen = useAppSelector(selectCartIsOpen);
    const subtotal = useAppSelector(selectCartSubtotal);
    const deliveryFee = subtotal > 200 ? 0 : 30;
    const total = subtotal + deliveryFee;

    const handleClose = () => {
        dispatch(closeCart());
        setStep('cart');
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            dispatch(openAuthModal());
            return;
        }
        setStep('details');
    };

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('success');
        setTimeout(() => {
            dispatch(clearCart());
            handleClose();
        }, 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-[1000] animate-fade-in"
                onClick={handleClose}
            />
            <div className="fixed top-0 right-0 w-full max-w-[420px] h-screen bg-white z-[1001] flex flex-col animate-slide-in shadow-[-4px_0_20px_rgba(0,0,0,0.15)]">
                <div className="flex justify-between items-center p-5 border-b border-[#eee] bg-[#0c831f] text-white">
                    <h2 className="text-xl font-bold">
                        {step === 'cart' && '🛒 My Cart'}
                        {step === 'details' && '📋 Delivery Details'}
                        {step === 'success' && '✅ Order Placed!'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="w-9 h-9 flex items-center justify-center bg-white/20 border-none rounded-full text-white text-xl cursor-pointer transition-colors duration-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {step === 'cart' && (
                        <>
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                                    <span className="text-6xl opacity-50">🛒</span>
                                    <h3 className="text-xl text-[#333]">Your cart is empty</h3>
                                    <p className="text-[#666] text-sm">Add items to get started</p>
                                    <button
                                        onClick={handleClose}
                                        className="mt-4 px-8 py-3 bg-[#0c831f] text-white border-none rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0a6918]"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 p-3 bg-[#f9f9f9] rounded-xl transition-transform duration-200 hover:-translate-x-1"
                                        >
                                            <div className="w-[60px] h-[60px] bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={60}
                                                    height={60}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-[#333] mb-1 line-clamp-2">
                                                    {item.title}
                                                </h4>
                                                <span className="text-sm text-[#0c831f] font-semibold">
                                                    ₹{item.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center bg-[#0c831f] rounded-md overflow-hidden">
                                                    <button
                                                        onClick={() =>
                                                            dispatch(
                                                                updateQuantity({
                                                                    id: item.id,
                                                                    quantity: item.quantity - 1,
                                                                })
                                                            )
                                                        }
                                                        className="w-7 h-7 border-none bg-transparent text-white text-base cursor-pointer transition-colors duration-200 hover:bg-black/10"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-3 font-semibold text-white text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            dispatch(
                                                                updateQuantity({
                                                                    id: item.id,
                                                                    quantity: item.quantity + 1,
                                                                })
                                                            )
                                                        }
                                                        className="w-7 h-7 border-none bg-transparent text-white text-base cursor-pointer transition-colors duration-200 hover:bg-black/10"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    className="bg-none border-none text-[#e53935] text-xs cursor-pointer p-1 hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {step === 'details' && (
                        <form onSubmit={handleSubmitOrder} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-sm font-semibold text-[#333]">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={userDetails.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="p-3 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-colors duration-200 font-inherit focus:outline-none focus:border-[#0c831f]"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="phone" className="text-sm font-semibold text-[#333]">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={userDetails.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    required
                                    className="p-3 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-colors duration-200 font-inherit focus:outline-none focus:border-[#0c831f]"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="address" className="text-sm font-semibold text-[#333]">
                                    Delivery Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={userDetails.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your complete address"
                                    rows={3}
                                    required
                                    className="p-3 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-colors duration-200 font-inherit resize-none focus:outline-none focus:border-[#0c831f]"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="pincode" className="text-sm font-semibold text-[#333]">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={userDetails.pincode}
                                    onChange={handleInputChange}
                                    placeholder="Enter pincode"
                                    className="p-3 border-2 border-[#e0e0e0] rounded-lg text-[0.95rem] transition-colors duration-200 font-inherit focus:outline-none focus:border-[#0c831f]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="p-3.5 bg-[#0c831f] text-white border-none rounded-lg text-base font-bold cursor-pointer transition-colors duration-200 mt-2 hover:bg-[#0a6918]"
                            >
                                Place Order • ₹{total.toFixed(2)}
                            </button>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <div className="text-7xl animate-bounce-once">🎉</div>
                            <h3 className="text-xl text-[#0c831f]">Order Placed Successfully!</h3>
                            <p className="text-[#666]">Your order will be delivered in 10 minutes</p>
                            <div className="flex gap-3 mt-5 text-4xl">
                                <span className="animate-move-right">🏍️</span>
                                <span className="animate-move-left">📦</span>
                            </div>
                        </div>
                    )}
                </div>

                {step === 'cart' && cartItems.length > 0 && (
                    <div className="p-5 border-t border-[#eee] bg-[#fafafa]">
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-[#333] mb-3">Bill Details</h4>
                            <div className="flex justify-between text-sm text-[#666] mb-2">
                                <span>Item Total</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#666] mb-2">
                                <span>Delivery Fee</span>
                                <span className={deliveryFee === 0 ? 'text-[#0c831f] font-semibold' : ''}>
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </span>
                            </div>
                            {deliveryFee === 0 && (
                                <p className="text-xs text-[#0c831f] mb-2">
                                    Free delivery on orders above ₹200
                                </p>
                            )}
                            <div className="flex justify-between font-bold text-[#333] text-base pt-2 border-t border-dashed border-[#ddd] mt-2">
                                <span>Grand Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full p-3.5 bg-[#0c831f] text-white border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-200"
                        >
                            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </button>
                    </div>
                )}

                {step === 'details' && (
                    <button
                        type="button"
                        onClick={() => setStep('cart')}
                        className="absolute bottom-5 left-5 bg-none border-none text-[#666] text-sm cursor-pointer py-2 hover:text-[#0c831f]"
                    >
                        Back to Cart
                    </button>
                )}
            </div>
        </>
    );
}
