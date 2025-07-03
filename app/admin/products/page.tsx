"use client"

import type React from "react"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, PackagePlus, Edit, Trash2, KeyRound } from "lucide-react"
import Image from "next/image"
import { useProducts } from "@/contexts/products-context"
import { useToast } from "@/hooks/use-toast"
import { getImageUrl } from "@/lib/utils"
import type { Product } from "@/lib/api"

const productCategories = ["بطاقات الألعاب", "اشتراكات الترفيه", "برامج وتطبيقات", "أخرى"]

// Local interface for the admin form
interface AdminProductForm {
  name: string
  image: string | File
  price: number
  category: string
  description: string
}

export default function ProductManagementPage() {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<AdminProductForm>({
    name: "",
    image: "/placeholder.svg?width=300&height=350",
    price: 0,
    category: productCategories[0],
    description: "",
  })
  const [initialCodes, setInitialCodes] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProductForm | null>(null)
  const [editProductId, setEditProductId] = useState<string | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة والسعر يجب أن يكون أكبر من صفر",
        variant: "destructive"
      })
      return
    }

    // Check if we have a valid image file
    const imageFile = newProduct.image instanceof File ? newProduct.image : undefined

    const productData = {
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      description: newProduct.description,
      productType: 'digital' as const,
      image: imageFile
    }

    const result = await addProduct(productData)

    if (result.success) {
      // Reset form
      setNewProduct({
        name: "",
        image: "/placeholder.svg?width=300&height=350",
        price: 0,
        category: productCategories[0],
        description: "",
      })
      setInitialCodes("")
      setImagePreview(null)
      setIsAddProductDialogOpen(false)

      toast({
        title: "تم إضافة المنتج بنجاح",
        description: `تم إضافة المنتج ${productData.name} بنجاح`,
      })
    } else {
      toast({
        title: "خطأ في إضافة المنتج",
        description: result.message || "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProduct = (productId: string, productName: string) => {
    deleteProduct(productId)
    toast({
      title: "تم حذف المنتج",
      description: `تم حذف المنتج ${productName} بنجاح`,
    })
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      setNewProduct({ ...newProduct, image: file })
    } else {
      setImagePreview(null)
      // setNewProduct({ ...newProduct, imageFile: null });
      setNewProduct({ ...newProduct, image: "/placeholder.svg?width=300&height=350" })
    }
  }

  const handleEditProductClick = (product: Product) => {
    setEditProduct({
      name: product.name,
      image: product.images?.[0]?.url || "/placeholder.svg",
      price: product.price,
      category: typeof product.category === 'string' ? product.category : product.category.name,
      description: product.description,
    })
    setEditProductId(product._id)
    setEditImagePreview(product.images?.[0]?.url || null)
    setIsEditDialogOpen(true)
  }

  const handleEditImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setEditImagePreview(URL.createObjectURL(file))
      setEditProduct(editProduct => editProduct ? { ...editProduct, image: file } : null)
    }
  }

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProductId || !editProduct) return
    // Assume updateProduct exists in context
    const imageFile = editProduct.image instanceof File ? editProduct.image : undefined
    const result = await updateProduct(editProductId, {
      name: editProduct.name,
      price: editProduct.price,
      category: editProduct.category,
      description: editProduct.description,
      image: imageFile
    })
    if (result.success) {
      setIsEditDialogOpen(false)
      toast({ title: "تم تحديث المنتج بنجاح" })
    } else {
      toast({ title: "خطأ في تحديث المنتج", description: result.message || "حدث خطأ أثناء تحديث المنتج", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة المنتجات والأكواد</CardTitle>
          <CardDescription>عرض، إضافة، وتعديل المنتجات وإدارة مخزون الأكواد الرقمية.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <Input
              placeholder="ابحث باسم المنتج أو الفئة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mr-auto">
                  <PackagePlus className="h-4 w-4 ml-2" />
                  إضافة منتج جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                {" "}
                {/* Increased width for more fields */}
                <DialogHeader>
                  <DialogTitle>إضافة منتج جديد</DialogTitle>
                  <DialogDescription>أدخل تفاصيل المنتج والأكواد الأولية.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProduct}>
                  <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productName" className="text-right col-span-1">
                        اسم المنتج
                      </Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productPrice" className="text-right col-span-1">
                        السعر (ر.س)
                      </Label>
                      <Input
                        id="productPrice"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })
                        }
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productCategory" className="text-right col-span-1">
                        الفئة
                      </Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر فئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="productDescription" className="text-right col-span-1 pt-2">
                        الوصف
                      </Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="col-span-3 min-h-[80px]"
                        placeholder="وصف قصير للمنتج..."
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="productImageFile" className="text-right col-span-1 pt-2">
                        صورة المنتج
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="productImageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="col-span-3"
                        />
                        {imagePreview && (
                          <div className="mt-2 relative w-32 h-32 border rounded-md overflow-hidden">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="معاينة الصورة"
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="initialCodes" className="text-right col-span-1 pt-2">
                        الأكواد الأولية
                        <span className="block text-xs text-muted-foreground">(كل كود في سطر)</span>
                      </Label>
                      <Textarea
                        id="initialCodes"
                        value={initialCodes}
                        onChange={(e) => setInitialCodes(e.target.value)}
                        className="col-span-3 min-h-[100px]"
                        placeholder="CODE123&#10;CODE456&#10;CODE789"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        إلغاء
                      </Button>
                    </DialogClose>
                    <Button type="submit">إضافة المنتج</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead className="hidden sm:table-cell">الفئة</TableHead>
                  <TableHead className="hidden md:table-cell">الأكواد المتوفرة</TableHead>
                  <TableHead>
                    <span className="sr-only">إجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-slate-100 rounded-md overflow-hidden">
                          <Image src={getImageUrl(product.images?.[0]?.url)} alt={product.name} fill style={{ objectFit: "cover" }} />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.price.toFixed(2)}ل.س</TableCell>
                    <TableCell className="hidden sm:table-cell">{product.category.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.stock || 0} متوفر
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">قائمة الإجراءات</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>إجراءات المنتج</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditProductClick(product)}>
                            <Edit className="h-3.5 w-3.5 mr-2 opacity-70" />
                            تعديل المنتج
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <KeyRound className="h-3.5 w-3.5 mr-2 opacity-70" />
                            إدارة الأكواد
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="text-red-600 focus:text-white focus:bg-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2 opacity-70" />
                            حذف المنتج
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Add pagination component here */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>تعديل المنتج</DialogTitle>
                <DialogDescription>قم بتعديل بيانات المنتج ثم احفظ التغييرات.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditProductSubmit}>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductName" className="text-right col-span-1">اسم المنتج</Label>
                    <Input id="editProductName" value={editProduct?.name || ""} onChange={e => setEditProduct(editProduct => editProduct ? { ...editProduct, name: e.target.value } : null)} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductPrice" className="text-right col-span-1">السعر (ر.س)</Label>
                    <Input id="editProductPrice" type="number" step="0.01" value={editProduct?.price || 0} onChange={e => setEditProduct(editProduct => editProduct ? { ...editProduct, price: Number.parseFloat(e.target.value) || 0 } : null)} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editProductCategory" className="text-right col-span-1">الفئة</Label>
                    <Select value={editProduct?.category || ""} onValueChange={value => setEditProduct(editProduct => editProduct ? { ...editProduct, category: value } : null)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر فئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="editProductDescription" className="text-right col-span-1 pt-2">الوصف</Label>
                    <Textarea id="editProductDescription" value={editProduct?.description || ""} onChange={e => setEditProduct(editProduct => editProduct ? { ...editProduct, description: e.target.value } : null)} className="col-span-3 min-h-[80px]" placeholder="وصف قصير للمنتج..." />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="editProductImageFile" className="text-right col-span-1 pt-2">صورة المنتج</Label>
                    <div className="col-span-3">
                      <Input id="editProductImageFile" type="file" accept="image/*" onChange={handleEditImageChange} className="col-span-3" />
                      {editImagePreview && <div className="mt-2 relative w-32 h-32 border rounded-md overflow-hidden"><Image src={editImagePreview} alt="معاينة الصورة" layout="fill" objectFit="contain" /></div>}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                  <Button type="submit">حفظ التغييرات</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
