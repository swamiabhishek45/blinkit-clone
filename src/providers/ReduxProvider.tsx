'use client';


import { Provider } from 'react-redux';
import { store } from '@/store';

import { useEffect } from 'react'

import { initializeCart } from '@/store/cartSlice';

function CartInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = store.dispatch;

    useEffect(() => {
        dispatch(initializeCart());
    }, [dispatch]);

    return <>{children}</>;
}

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <CartInitializer>{children}</CartInitializer>
        </Provider>
    );
}