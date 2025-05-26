import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield, Crown, Settings, UserX, ArrowLeft } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  totalDocuments: number;
  totalMonthlyCreatedDocuments: number;
  subscription?: {
    expiry_date: string;
    plan: {
      name: string;
      description: string;
      features: string[];
      price: string;
    };
  };
  is_active: boolean;
}

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const result = await authService.getProfile();
      if (result.success && result.data) {
        setProfileData(result.data);
        setFormData(prev => ({
          ...prev,
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          email: result.data.email
        }));
      } else {
        setError('Profil bilgileri yüklenirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Profil bilgileri yüklenirken bir hata oluştu.');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
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
    setSavingProfile(true);
    
    try {
      const result = await authService.updatePersonalInfo({
        first_name: formData.firstName,
        last_name: formData.lastName
      });

      if (result.success) {
        toast({
          title: "Profil güncellendi!",
          description: "Profil bilgileriniz başarıyla güncellendi.",
        });
        fetchProfileData(); // Refresh profile data
      } else {
        toast({
          title: "Hata!",
          description: "Profil güncellenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Hata!",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    
    try {
      const result = await authService.updatePassword({
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword
      });

      if (result.success) {
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
      } else {
        toast({
          title: "Hata!",
          description: "Şifre güncellenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Hata!",
        description: "Şifre güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setSavingPassword(false);
    }
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

  if (error || !profileData) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-8">
          <p className="text-red-500">{error || 'Profil bilgileri yüklenemedi.'}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getUserStatus = () => {
    if (profileData.subscription?.plan?.name) {
      return {
        label: profileData.subscription.plan.name,
        icon: Crown,
        variant: "default" as const
      };
    }
    return {
      label: "Ziyaretçi",
      icon: UserX,
      variant: "secondary" as const
    };
  };

  const userStatus = getUserStatus();
  const StatusIcon = userStatus.icon;

  const getPlanStatus = () => {
    if (profileData.subscription?.plan?.name) {
      return profileData.is_active ? 'Aktif' : 'Pasif';
    }
    return 'Pasif';
  };

  const getPlanStatusVariant = () => {
    if (profileData.subscription?.plan?.name) {
      return profileData.is_active ? "default" as const : "destructive" as const;
    }
    return "destructive" as const;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/editor')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Editor'e Geri Dön
        </Button>
      </div>

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
                {profileData.first_name.charAt(0)}{profileData.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profileData.first_name} {profileData.last_name}</h2>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {profileData.email}
              </p>
              <Badge className="mt-2" variant={userStatus.variant}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {userStatus.label}
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
                  disabled={savingProfile}
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
                  disabled={savingProfile}
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
                  disabled
                />
              </div>
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Güncelleniyor..." : "Bilgileri Güncelle"}
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
                  disabled={savingPassword}
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
                  disabled={savingPassword}
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
                  disabled={savingPassword}
                />
              </div>
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? "Güncelleniyor..." : "Şifreyi Değiştir"}
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
              <p className="text-2xl font-bold">{profileData.totalDocuments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bu Ay Oluşturulan</p>
              <p className="text-2xl font-bold">{profileData.totalMonthlyCreatedDocuments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Abonelik Bitiş</p>
              <p className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {profileData.subscription?.expiry_date ? formatDate(profileData.subscription.expiry_date) : 'Yok'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plan Durumu</p>
              <Badge className="text-lg px-3 py-1" variant={getPlanStatusVariant()}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {getPlanStatus()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
