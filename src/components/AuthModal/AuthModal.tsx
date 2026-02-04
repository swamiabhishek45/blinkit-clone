'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    selectIsAuthModalOpen,
    selectOtpSent,
    selectPendingMobile,
    closeAuthModal,
    setOtpSent,
    setUser,
} from '@/store/authSlice';

export default function AuthModal() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(selectIsAuthModalOpen);

    const otpSent = useAppSelector(selectOtpSent);


    const pendingMobile = useAppSelector(selectPendingMobile);

    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setMobile('');
            setOtp(['', '', '', '', '', '']);
            setError('');
            setResendTimer(0);
        }
    }, [isOpen]);

    const handleClose = () => {
        dispatch(closeAuthModal());
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobile(value);
        setError('');
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        setError('');

        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(setOtpSent(mobile));
        setResendTimer(30);
        setLoading(false);

        setTimeout(() => {
            otpInputRefs.current[0]?.focus();
        }, 100);
    };

    const handleOtpChange = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(
            setUser({
                id: `user_${Date.now()}`,
                mobile: pendingMobile!,
                name: `User ${pendingMobile?.slice(-4)}`,
            })
        );

        setLoading(false);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 z-[2000] animate-fade-in"
                onClick={handleClose}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-2xl p-8 z-[2001] animate-scale-in-center">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#f5f5f5] border-none rounded-full text-[#666] text-base cursor-pointer transition-all duration-200 hover:bg-[#e0e0e0] hover:text-[#333]"
                >
                    ✕
                </button>

                <div className="text-center mb-7">
                    
                    <h2 className="text-[1.4rem] font-bold text-[#1a1a1a] mb-2">
                        {otpSent ? 'Verify OTP' : 'Login / Sign Up'}
                    </h2>
                    <p className="text-sm text-[#666]">
                        {otpSent
                            ? `Enter the OTP sent to +91 ${pendingMobile}`
                            : 'Enter your mobile number to continue'}
                    </p>
                </div>

                {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                        <div className="flex items-center border-2 border-[#e0e0e0] rounded-[10px] overflow-hidden transition-colors duration-200 focus-within:border-[#0c831f]">
                        
                            <input
                                type="tel"
                                value={mobile}
                                onChange={handleMobileChange}
                                placeholder="Enter mobile number"
                                className="flex-1 py-3.5 px-3 border-none text-base outline-none tracking-wide placeholder:text-[#aaa]"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-[#e53935] text-sm text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || mobile.length !== 10}
                            className="p-3.5 bg-[#0c831f] text-white border-none rounded-[10px] text-base font-bold cursor-pointer transition-all duration-200 flex items-center justify-center min-h-[52px]"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin-fast" />
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                        <div className="flex gap-2.5 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { otpInputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-[1.4rem] font-bold border-2 border-[#e0e0e0] rounded-[10px] outline-none transition-all duration-200"
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-[#e53935] text-sm text-center -mt-2">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otp.join('').length !== 6}
                            className="p-3.5 bg-[#0c831f] text-white border-none rounded-[10px] text-base font-bold cursor-pointer transition-all duration-200 flex items-center justify-center min-h-[52px]"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin-fast" />
                            ) : (
                                'Verify & Login'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
