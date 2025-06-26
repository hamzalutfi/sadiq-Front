"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, ShieldCheck, ShoppingBag, UserCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/contexts/orders-context";
import { useToast } from "@/hooks/use-toast";

// Re-using CartItem interface from cart page
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  optionLabel?: string;
  platform?: string;
}

const paymentMethods = [
  {
    id: "credit-card",
    name: "البطاقة الائتمانية",
    icon: CreditCard,
    logos: ["Visa", "Mastercard", "Mada"],
  },
  {
    id: "apple-pay",
    name: "الهرم والفؤاد",
    icon: CreditCard,
    logos: ["الهرم والفؤاد"],
  },
  { 
    id: "stc-pay", 
    name: "واتساب", 
    icon: CreditCard, 
    logos: ["واتساب"] 
  },
];

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder, completeOrder } = useOrders();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(paymentMethods[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems.length, router]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
      });
    }
  }, [user]);

  const subtotal = getCartTotal();
  const shipping = 0; // For digital products
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    if (!isAuthenticated || !user) {
      toast({
        title: "خطأ في المصادقة",
        description: "يرجى تسجيل الدخول لإتمام عملية الشراء",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderData = {
        userId: user.id,
        items: cartItems,
        subtotal,
        total,
        status: "pending" as const,
        paymentMethod: selectedPaymentMethod,
        customerInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      };

      const newOrder = await createOrder(orderData);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete the order and generate delivery codes
      completeOrder(newOrder.id);

      // Clear cart
      clearCart();

      // Show success message
      toast({
        title: "تم إتمام الطلب بنجاح!",
        description: `تم إنشاء طلبك برقم: ${newOrder.id}`,
      });

      // Redirect to order success page
      router.push(`/order-success/${newOrder.id}`);

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Minimal Header for Checkout */}
      <header className="bg-white shadow-sm">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Sadiq Logo"
              width={100}
              height={40}
              className="h-8 md:h-10 w-auto"
            />
          </Link>
          <div className="flex items-center text-sm text-slate-600">
            <ShieldCheck className="h-5 w-5 text-primary ml-1" />
            <span>دفع آمن وموثوق</span>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Left Column: Order Summary & Payment */}
          <div className="lg:order-last">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <ShoppingBag className="h-6 w-6 text-primary ml-2" />
                  ملخص طلبك
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible defaultValue="order-items">
                  <AccordionItem value="order-items">
                    <AccordionTrigger className="text-md font-semibold hover:no-underline">
                      عرض تفاصيل المنتجات ({cartItems.length})
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill style={{ objectFit: "cover" }} />
                              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-medium text-slate-700 leading-tight">
                                {item.name}
                              </p>
                              {item.optionLabel && (
                                <p className="text-xs text-slate-500">
                                  {item.optionLabel}
                                </p>
                              )}
                              {item.platform && (
                                <p className="text-xs text-slate-500">
                                  {item.platform}
                                </p>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-slate-800">
                              {(item.price * item.quantity).toFixed(2)} ر.س
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>الإجمالي الفرعي</span>
                    <span>{subtotal.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>الشحن</span>
                    <span>
                      {shipping === 0
                        ? "مجاني (منتجات رقمية)"
                        : `${shipping.toFixed(2)} ر.س`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>الإجمالي للدفع</span>
                    <span>{total.toFixed(2)} ر.س</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Customer Info & Payment Method */}
          <div className="lg:order-first">
            <form onSubmit={handlePayment} className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <UserCircle className="h-6 w-6 text-primary ml-2" />
                    معلومات العميل
                  </CardTitle>
                  <CardDescription>
                    الرجاء إدخال بياناتك لإتمام عملية الشراء.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-10 rounded-md mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstName">
                      الاسم الأول <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="علي"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="h-10 rounded-md mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      الاسم الأخير <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="محمد"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="h-10 rounded-md mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <CreditCard className="h-6 w-6 text-primary ml-2" />
                    طريقة الدفع
                  </CardTitle>
                  <CardDescription>
                    اختر طريقة الدفع المفضلة لديك.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <Label
                        key={method.id}
                        htmlFor={method.id}
                        className={`flex items-center space-x-3 space-x-reverse p-4 border rounded-lg cursor-pointer transition-all
                                          ${
                                            selectedPaymentMethod === method.id
                                              ? "border-primary ring-2 ring-primary bg-primary/5"
                                              : "border-slate-200 hover:border-slate-300"
                                          }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="h-6 w-6 text-slate-600" />
                        <span className="font-medium text-slate-700">
                          {method.name}
                        </span>
                        <div className="mr-auto flex space-x-1 space-x-reverse">
                          {method.logos.map((logo) => (
                            <Image
                              key={logo}
                              src={`/placeholder.svg?width=30&height=20&query=${logo}+logo`}
                              alt={logo}
                              width={30}
                              height={20}
                              className="h-5 w-auto"
                            />
                          ))}
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                  {selectedPaymentMethod === "credit-card" && (
                    <div className="mt-6 p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-center text-slate-500">
                      سيتم هنا عرض نموذج إدخال بيانات البطاقة بشكل آمن (مثل
                      Stripe Elements).
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "جاري المعالجة..."
                  : `إتمام الدفع (${total.toFixed(2)} ر.س)`}
              </Button>
              <p className="text-xs text-slate-500 text-center">
                بالنقر على "إتمام الدفع"، فإنك توافق على{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  شروط الخدمة
                </Link>{" "}
                و{" "}
                <Link
                  href="/privacy-policy"
                  className="text-primary hover:underline"
                >
                  سياسة الخصوصية
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
