"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Star, ShoppingCart } from "lucide-react";

// --- Helper & Mock Components ---
// These are placeholders for your actual UI components, now styled
// with the new green (#0B8A3D) and white theme.

const useSearchParams = () => {
  // Mock implementation of Next.js useSearchParams
  const [params] = useState(new URLSearchParams());
  return params;
};

const useCart = () => {
  // Mock cart context
  return {
    addToCart: (product) => {
      console.log("Added to cart:", product.name);
      // In a real app, you would add logic here to update the cart state.
    },
  };
};

// Dummy UI Components (placeholders for shadcn/ui) - Now with Green theme
const Card = ({ children, className = "" }) => <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Button = ({ children, variant, size, className, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B8A3D] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${variant === 'default' ? 'bg-[#0B8A3D] text-white hover:bg-[#0A7A35]' : 'bg-transparent text-[#0B8A3D] hover:bg-green-50'} ${size === 'sm' ? 'h-9 px-3' : 'h-10 py-2 px-4'} ${className}`} {...props}>{children}</button>;
const Input = ({ className, ...props }) => <input className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B8A3D] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
const Select = ({ children, value, onValueChange }) => <div className="relative w-full"><select value={value} onChange={(e) => onValueChange(e.target.value)} className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-transparent pl-3 pr-8 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B8A3D] focus:ring-offset-2">{children}</select></div>;
const SelectItem = ({ children, value }) => <option value={value}>{children}</option>;


// --- Syrian-Themed Dummy Product Data ---
// The product list has been updated to be relevant to the Syrian market.
const dummyProducts = [
  {
    id: "prod_001",
    name: "بطاقة تعبئة رصيد Syriatel",
    description: "بطاقة تعبئة رصيد لشبكة Syriatel بقيمة 5000 ل.س.",
    price: 5000.00,
    category: "بطاقات شحن",
    image: "https://placehold.co/600x400/0B8A3D/ffffff?text=Syriatel",
    rating: 4.8,
  },
  {
    id: "prod_002",
    name: "بطاقة تعبئة رصيد MTN Syria",
    description: "اشحن خطك من شبكة MTN Syria بسهولة وسرعة.",
    price: 5000.00,
    category: "بطاقات شحن",
    image: "https://placehold.co/600x400/ffcb05/000000?text=MTN",
    rating: 4.7,
  },
  {
    id: "prod_003",
    name: "شدات ببجي موبايل (660 UC)",
    description: "احصل على 660 شدة (UC) للعبة ببجي موبايل.",
    price: 15000.00,
    category: "ألعاب",
    image: "https://placehold.co/600x400/f2a900/ffffff?text=PUBG+UC",
    rating: 5,
  },
  {
    id: "prod_004",
    name: "اشتراك beIN Sports Connect",
    description: "تابع الدوريات والبطولات الرياضية العالمية مباشرة على أجهزتك.",
    price: 35000.00,
    category: "خدمات بث",
    image: "https://placehold.co/600x400/6a007a/ffffff?text=beIN",
    rating: 4.5,
  },
  {
    id: "prod_005",
    name: "جواهر Free Fire (520 جوهرة)",
    description: "اشحن 520 جوهرة في حسابك بلعبة Free Fire.",
    price: 10000.00,
    category: "ألعاب",
    image: "https://placehold.co/600x400/ff6b00/ffffff?text=Free+Fire",
    rating: 4.9,
  },
  {
    id: "prod_006",
    name: "رخصة برنامج كاسبرسكي",
    description: "مفتاح تفعيل أصلي لبرنامج الحماية من الفيروسات كاسبرسكي.",
    price: 40000.00,
    category: "برامج",
    image: "https://placehold.co/600x400/009c4d/ffffff?text=Kaspersky",
    rating: 4.6,
  },
    {
    id: "prod_007",
    name: "بطاقة تسوق أمازون 10$",
    description: "بطاقة هدايا للتسوق من متجر أمازون العالمي.",
    price: 20000.00,
    category: "بطاقات تسوق",
    image: "https://placehold.co/600x400/ff9900/000000?text=Amazon",
    rating: 4.3,
  },
  {
    id: "prod_008",
    name: "اشتراك تطبيق وياك",
    description: "استمتع بمشاهدة أحدث المسلسلات والأفلام العربية والهندية.",
    price: 8000.00,
    category: "خدمات بث",
    image: "https://placehold.co/600x400/d9232d/ffffff?text=Weyyak",
    rating: 4.1,
  },
];


// --- ProductCard Component ---
function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img src={product.image} alt={product.name} className="object-cover w-full h-48" />
        <div className="absolute top-2 right-2 bg-[#0B8A3D] text-white text-xs font-bold px-2 py-1 rounded-full">{product.category}</div>
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="text-base font-bold text-gray-800 h-12">{product.name}</CardTitle>
        <p className="text-sm text-gray-500 mt-2 h-16 overflow-hidden">{product.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-extrabold text-gray-900">{product.price.toFixed(2)} ل.س</p>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold text-gray-600">{product.rating}</span>
          </div>
        </div>
        <Button className="w-full mt-4" variant="default" onClick={() => addToCart(product)}>
          <ShoppingCart className="w-4 h-4 ml-2" />
          <span>أضف للسلة</span>
        </Button>
      </CardContent>
    </Card>
  );
}


function StorePage() {
  const [products] = useState(dummyProducts);
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name, "ar");
      case "newest":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            متجر المنتجات الرقمية
          </h1>
          <p className="text-[#0B8A3D] max-w-2xl mx-auto font-semibold">
            اكتشف مجموعة واسعة من البطاقات الرقمية، اشتراكات الألعاب، وخدمات
            البث في سوريا. تسليم فوري وآمن.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ابحث عن المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category === "all" ? "جميع الفئات" : category}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectItem value="name">الاسم</SelectItem>
                    <SelectItem value="price-low">السعر: من الأقل</SelectItem>
                    <SelectItem value="price-high">السعر: من الأعلى</SelectItem>
                    <SelectItem value="newest">الأحدث</SelectItem>
                </Select>
            </div>

            {/* View Mode */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none border-l"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            تم العثور على{" "}
            <span className="font-semibold text-gray-900">
              {sortedProducts.length}
            </span>{" "}
            منتج
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">مرشحات نشطة</span>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                لم يتم العثور على منتجات
              </h3>
              <p className="text-gray-500 mb-4">
                جرب تغيير معايير البحث أو الفئة
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                إعادة تعيين المرشحات
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// The main App component that renders the StorePage
export default function App() {
  return <StorePage />;
}
