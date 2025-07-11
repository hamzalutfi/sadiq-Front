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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

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
    id: "credit_card",
    name: "بطاقة ائتمان",
    icon: CreditCard,
  },
  {
    id: "transfer",
    name: "الهرم او الفؤاد",
    icon: CreditCard,
  },
  {
    id: "whatsapp",
    name: "واتساب",
    icon: CreditCard,
  },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { createOrder, completeOrder } = useOrders();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(paymentMethods[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.fullName?.split(" ")[0] || "",
    lastName: user?.fullName?.split(" ").slice(1).join(" ") || "",
  });
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferImage, setTransferImage] = useState<File | null>(null);
  const [transferImagePreview, setTransferImagePreview] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems.length, router]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.fullName?.split(" ")[0] || "",
        lastName: user.fullName?.split(" ").slice(1).join(" ") || "",
      }));
    }
  }, [user]);

  // Show dialog when transfer is selected
  useEffect(() => {
    if (selectedPaymentMethod === "transfer") {
      setShowTransferDialog(true);
    } else {
      setShowTransferDialog(false);
    }
  }, [selectedPaymentMethod]);

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.price || (typeof item.product === 'object' ? item.product.price : 0) || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
  const shipping = 0; // For digital products
  const total: number = subtotal + shipping;

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

  // Handle image upload
  const handleTransferImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTransferImage(file);
    setTransferImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;
    if (!user) {
      toast({
        title: "خطأ في المصادقة",
        description: "يرجى تسجيل الدخول لإتمام عملية الشراء",
        variant: "destructive"
      });
      return;
    }

    // Check if cart has items
    if (cartItems.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات إلى السلة قبل إتمام عملية الشراء",
        variant: "destructive"
      });
      router.push("/cart");
      return;
    }

    // If transfer is selected, require image
    if (selectedPaymentMethod === "transfer" && !transferImage) {
      toast({
        title: "صورة التحويل مطلوبة",
        description: "يرجى رفع صورة إيصال التحويل قبل إتمام الطلب.",
        variant: "destructive"
      });
      setShowTransferDialog(true);
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderData = {
        shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.email}`,
        billingAddress: `${formData.firstName} ${formData.lastName}, ${formData.email}`,
        paymentMethod: selectedPaymentMethod,
        paymentDetails: {
          method: selectedPaymentMethod,
          email: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`
        }
      };

      console.log('Creating order with data:', orderData);
      const orderResult = await createOrder(orderData);

      if (!orderResult.success || !orderResult.order) {
        throw new Error(orderResult.message || 'فشل إنشاء الطلب');
      }

      const newOrder = orderResult.order;

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete the order and generate delivery codes
      completeOrder(newOrder._id);

      // Clear cart
      clearCart();

      // Show success message
      toast({
        title: "تم إتمام الطلب بنجاح!",
        description: `تم إنشاء طلبك برقم: ${newOrder._id}`,
      });

      // Redirect based on payment method
      if (selectedPaymentMethod === "whatsapp") {
        window.location.href = "https://wa.link/new9me";
        return;
      }
      // Redirect to order success page
      router.push(`/order-success/${newOrder._id}`);

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطأ في الدفع",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
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
        <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>رفع صورة إيصال التحويل</DialogTitle>
              <DialogDescription>
                يرجى رفع صورة إيصال التحويل البنكي لإتمام الطلب.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleTransferImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {transferImagePreview && (
                <img
                  src={transferImagePreview}
                  alt="معاينة صورة التحويل"
                  className="rounded-md border w-40 h-40 object-contain"
                />
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setShowTransferDialog(false)}
                disabled={!transferImage}
              >
                تم
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                            key={item._id}
                            className="flex items-center gap-3"
                          >
                            <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                              <Image
                                src={item.image || (typeof item.product === 'object' && typeof item.product.image === 'string' ? item.product.image : "/placeholder.svg")}
                                alt={item.name || (typeof item.product === 'object' ? item.product.name : 'Product')}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-medium text-slate-700 leading-tight">
                                {item.name || (typeof item.product === 'object' ? item.product.name : 'Product')}
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
                              {((item.price || (typeof item.product === 'object' ? item.product.price : 0) || 0) * item.quantity).toFixed(2)}ل.س
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
                    <span>{subtotal.toFixed(2)}ل.س</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>الشحن</span>
                    <span>
                      {shipping === 0
                        ? "مجاني (منتجات رقمية)"
                        : `${shipping.toFixed(2)}ل.س`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>الإجمالي للدفع</span>
                    <span>{total.toFixed(2)}ل.س</span>
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
                      placeholder="حمزه"
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
                        className={`flex items-center gap-3 space-x-3 space-x-reverse p-4 border rounded-lg cursor-pointer transition-all
                                          ${selectedPaymentMethod === method.id
                            ? "border-primary ring-2 ring-primary bg-primary/5"
                            : "border-slate-200 hover:border-slate-300"
                          }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="h-6 w-6 text-slate-600" />
                        <span className="font-medium text-slate-700">
                          {method.name}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                  {selectedPaymentMethod === "credit_card" && (
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
                  : `إتمام الدفع (${total.toFixed(2)}ل.س)`}
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
