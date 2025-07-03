"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useOrders } from "@/contexts/orders-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Save, 
  Edit, 
  Mail, 
  Calendar,
  Shield,
  Bell,
  Key,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  Star,
  Clock
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usersAPI } from "@/lib/api"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user, updateUser } = useAuth()
  const { orders } = useOrders()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        address: user.address || ""
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "خطأ",
        description: "الاسم مطلوب",
        variant: "destructive"
      })
      return
    }

    if (!formData.email.trim()) {
      toast({
        title: "خطأ",
        description: "البريد الإلكتروني مطلوب",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await usersAPI.updateProfile({
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        address: formData.address.trim()
      })
      
      if (response.success && response.data) {
        // Update local state with the response from the database
        updateUser(response.data)
        setIsEditing(false)
        toast({
          title: "تم التحديث",
          description: "تم تحديث معلوماتك بنجاح"
        })
      } else {
        toast({
          title: "خطأ",
          description: response.error || "حدث خطأ أثناء تحديث المعلومات",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المعلومات",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      address: user?.address || ""
    })
    setIsEditing(false)
  }

  // Calculate user statistics
  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + order.pricing.total, 0)
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : "غير محدد"

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">الملف الشخصي</h1>
          <p className="text-slate-600">إدارة معلومات حسابك الشخصية</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 ml-2" />
                  معلومات الحساب
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">الاسم الكامل</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 font-medium mt-1">{user?. fullName|| "غير محدد"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 font-medium mt-1">{user?.email || "غير محدد"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم هاتفك"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 font-medium mt-1">{user?.phoneNumber || "غير محدد"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">العنوان</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="أدخل عنوانك"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 font-medium mt-1">{user?.address || "غير محدد"}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>تاريخ إنشاء الحساب</Label>
                    <p className="text-slate-600 mt-1">{memberSince}</p>
                  </div>

                  <div>
                    <Label>آخر تحديث</Label>
                    <p className="text-slate-600 mt-1">
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ar-SA') : "غير محدد"}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4 border-t border-slate-200">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 ml-2" />
                      {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 ml-2" />
                  إحصائيات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                    <p className="text-sm text-slate-600">إجمالي الطلبات</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalSpent.toFixed(2)}ل.س</div>
                    <p className="text-sm text-slate-600">إجمالي الإنفاق</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{averageOrderValue.toFixed(2)}ل.س</div>
                    <p className="text-sm text-slate-600">متوسط قيمة الطلب</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">إعدادات الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <Key className="h-4 w-4 text-slate-600 ml-2" />
                    <div>
                      <h4 className="font-medium">تغيير كلمة المرور</h4>
                      <p className="text-sm text-slate-600">تحديث كلمة المرور الخاصة بك</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    تغيير
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 text-slate-600 ml-2" />
                    <div>
                      <h4 className="font-medium">إعدادات الإشعارات</h4>
                      <p className="text-sm text-slate-600">إدارة إعدادات الإشعارات</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    إعدادات
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-slate-600 ml-2" />
                    <div>
                      <h4 className="font-medium">الأمان</h4>
                      <p className="text-sm text-slate-600">إعدادات الأمان والخصوصية</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    إعدادات
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">حالة الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">حالة الحساب</span>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    نشط
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">نوع العضوية</span>
                  <Badge variant="outline">عضو عادي</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">تاريخ انتهاء العضوية</span>
                  <span className="text-sm font-medium">غير محدد</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {/* <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 ml-2" />
                  طرق الدفع المحفوظة
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 ml-2" />
                  العناوين المحفوظة
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 ml-2" />
                  المنتجات المفضلة
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 ml-2" />
                  سجل النشاط
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}


