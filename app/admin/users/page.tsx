"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, FileDown, UserPlus, Users, Trash2, Edit, UserCheck, UserX } from "lucide-react"
import { useAdmin } from "@/contexts/admin-context"
import { useToast } from "@/hooks/use-toast"

export default function UserManagementPage() {
  const { getAllUsers, addUser, updateUser, deleteUser, suspendUser, activateUser } = useAdmin()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" })

  const allUsers = getAllUsers()
  
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExportEmails = () => {
    const emails = filteredUsers.map((user) => user.email).join("\n")
    const blob = new Blob([emails], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "sadiq_user_emails.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "تم تصدير قائمة الإيميلات",
      description: `تم تصدير ${filteredUsers.length} إيميل بنجاح`,
    })
  }

  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      })
      return
    }

    addUser({
      name: newUser.name,
      email: newUser.email,
      status: "active",
    })

    setNewUser({ name: "", email: "", password: "" })
    setIsAddUserDialogOpen(false)
    
    toast({
      title: "تم إضافة المستخدم بنجاح",
      description: `تم إضافة المستخدم ${newUser.name} بنجاح`,
    })
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    deleteUser(userId)
    toast({
      title: "تم حذف المستخدم",
      description: `تم حذف المستخدم ${userName} بنجاح`,
    })
  }

  const handleSuspendUser = (userId: string, userName: string) => {
    suspendUser(userId)
    toast({
      title: "تم تعليق المستخدم",
      description: `تم تعليق المستخدم ${userName}`,
    })
  }

  const handleActivateUser = (userId: string, userName: string) => {
    activateUser(userId)
    toast({
      title: "تم تفعيل المستخدم",
      description: `تم تفعيل المستخدم ${userName}`,
    })
  }

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-red-100 text-red-800 border-red-200"
  }

  const getStatusText = (status: string) => {
    return status === "active" ? "نشط" : "معلق"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">إجمالي المستخدمين</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{allUsers.length.toLocaleString("ar-SA")} مستخدم</p>
          <p className="text-sm text-muted-foreground">إجمالي عدد الحسابات المسجلة في الموقع.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>عرض، بحث، وإدارة جميع المستخدمين المسجلين.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <Input
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2 mr-auto">
              <Button onClick={handleExportEmails} variant="outline">
                <FileDown className="h-4 w-4 ml-2" />
                تصدير قائمة الإيميلات
              </Button>
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 ml-2" />
                    إضافة مستخدم جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                    <DialogDescription>أدخل بيانات المستخدم الجديد هنا.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddNewUser}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right col-span-1">
                          الاسم
                        </Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right col-span-1">
                          البريد
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right col-span-1">
                          كلمة المرور
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="col-span-3"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">إضافة المستخدم</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>
                    <span className="sr-only">إجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      لا توجد مستخدمين
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/40?u=${user.id}`} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-slate-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                      </TableCell>
                      <TableCell>{user.totalOrders}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusText(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 ml-2" />
                              تعديل المستخدم
                            </DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem onClick={() => handleSuspendUser(user.id, user.name)}>
                                <UserX className="h-4 w-4 ml-2" />
                                تعليق المستخدم
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivateUser(user.id, user.name)}>
                                <UserCheck className="h-4 w-4 ml-2" />
                                تفعيل المستخدم
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 ml-2" />
                                  حذف المستخدم
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    سيتم حذف المستخدم {user.name} نهائياً. لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length > 0 && (
            <div className="mt-4 text-sm text-slate-500 text-center">
              عرض {filteredUsers.length} من {allUsers.length} مستخدم
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
