"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import Header from "@/components/Header/Header";
import ProductCard from "@/components/ProductCard/ProductCard";
import CartSlider from "@/components/CartSlider";
import AuthModal from "@/components/AuthModal";

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

const categories = [
  { id: "all", name: "All Products", icon: "🛒" },
  { id: "men's clothing", name: "Men's Fashion", icon: "👔" },
  { id: "women's clothing", name: "Women's Fashion", icon: "👗" },
  { id: "jewelery", name: "Jewelry", icon: "💎" },
  { id: "electronics", name: "Electronics", icon: "📱" },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
        setError(null);
        
      } catch (err) {
        setError("failed to fetch products try again");
        console.error("Error fetching products:", err);
      }
    };
    
    fetchProducts();
  }, []);

  console.log(products);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <section className="bg-green-500 py-16 px-6 text-white flex flex-col items-center gap-10 md:py-10 md:px-4">
          <div className="text-center max-w-150">
            <h1 className="text-4xl md:text-3xl font-extrabold  leading-tight">
              Groceries delivered in{" "}
              <span className="text-yellow-300">10 minutes</span>
            </h1>
            <p className="text-lg">
              Fresh vegetables, fruits, dairy & more at your doorstep
            </p>
          </div>
          <div className="flex gap-12 md:gap-8 flex-wrap justify-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-2xl font-bold">10+</span>
              <span className="text-sm opacity-85">Categories</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-2xl font-bold">1000+</span>
              <span className="text-sm opacity-85">Products</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-2xl font-bold">10 min</span>
              <span className="text-sm opacity-85">Delivery</span>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 px-6 bg-white md:py-6 md:px-4">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">
            Shop by Category
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-2 py-4 px-6 bg-[#f5f5f5] border-2 border-transparent rounded-xl cursor-pointer transition-all duration-200 min-w-[120px] flex-shrink-0 md:py-3 md:px-4 md:min-w-[100px] hover:bg-[#e8f5e9] hover:border-[#0c831f] ${
                  selectedCategory === category.id
                    ? "bg-[#e8f5e9] border-[#0c831f] shadow-[0_4px_12px_rgba(12,131,31,0.15)]"
                    : ""
                }`}
              >
                <span className="text-3xl md:text-2xl">{category.icon}</span>
                <span className="text-sm font-semibold text-[#333] whitespace-nowrap">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 px-6 bg-[#f8f8f8] md:py-6 md:px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-sm text-[#666]">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <CartSlider />
      <AuthModal />
    </div>
  );
}
