'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCartCount, openCart } from '@/store/cartSlice';
import { selectIsAuthenticated, selectUser, openAuthModal, logout } from '@/store/authSlice';

export default function Header() {
    const dispatch = useAppDispatch();
    const cartCount = useAppSelector(selectCartCount);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-green-800 py-3">
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between gap-8 flex-wrap md:flex-nowrap">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 ml-10">
                        <span className="text-[1.75rem] font-extrabold text-white">blinkit</span>
                    </div>
                    <div className="hidden md:flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-[#FFEB3B]">Delivery in 10 minutes</span>
                        <span className="text-xs text-white/85">📍 Pune</span>
                    </div>
                </div>

                <div className="flex-1 max-w-[500px] order-3 md:order-none w-full md:w-auto">
                    <div className="flex items-center bg-white rounded-xl px-4 py-2.5">
                        <span className="mr-3">🔍</span>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="flex-1 border-none outline-none text-sm bg-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className="text-white font-medium text-sm hidden sm:inline">
                                👤 {user?.name || user?.mobile}
                            </span>
                            <button
                                onClick={() => dispatch(logout())}
                                className="bg-white/15 text-white border border-white/30 px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:bg-white/25"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => dispatch(openAuthModal())}
                            className="bg-white text-[#0C831F] border-none p-6 rounded-[10px] font-semibold text-sm cursor-pointer transition-all duration-200"
                        >
                            Login
                        </button>
                    )}

                    <button
                        onClick={() => dispatch(openCart())}
                        className="flex items-center gap-2 bg-[#1a9c2f] text-white border-none px-5 py-2.5 rounded-[10px] font-semibold text-sm cursor-pointer relative transition-all duration-200"
                    >
                        <span className="text-lg">🛒</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#FFEB3B] text-[#0C831F] text-[0.7rem] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span> 
                        )}
                        <span className="ml-1 hidden sm:inline">Cart</span>
                    </button>
                </div>
            </div>
        </header>
    );
}