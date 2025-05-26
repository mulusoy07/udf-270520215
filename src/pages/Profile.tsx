
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield, Crown, Settings } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardHeader>
    </Card>

    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profil güncellendi!",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      });
    }, 1500);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Şifre güncellendi!",
        description: "Şifreniz başarıyla değiştirildi.",
      });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 1500);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profilim</h1>
        <p className="text-gray-600 dark:text-gray-400">Hesap bilgilerinizi yönetin</p>
      </div>

      {/* Profile Overview */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback className="text-lg">
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {formData.email}
              </p>
              <Badge className="mt-2">
                <Crown className="h-3 w-3 mr-1" />
                Pro Üye
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Kişisel Bilgiler
            </CardTitle>
            <CardDescription>
              Adınızı, soyadınızı ve e-posta adresinizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700"
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Güncelleniyor..." : "Bilgileri Güncelle"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Şifre Değiştir
            </CardTitle>
            <CardDescription>
              Hesabınızın güvenliği için şifrenizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700"
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Güncelleniyor..." : "Şifreyi Değiştir"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Hesap İstatistikleri
          </CardTitle>
          <CardDescription>
            Hesap aktiviteleriniz ve kullanım bilgileriniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Toplam Belge</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bu Ay Oluşturulan</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hesap Oluşturma</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                2024
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plan Durumu</p>
              <Badge className="text-lg px-3 py-1">
                <Crown className="h-4 w-4 mr-1" />
                Aktif
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
