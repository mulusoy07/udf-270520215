
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Personal information form
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/editor');
      return;
    }

    if (user) {
      setPersonalData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || ''
      });
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPersonal(true);

    try {
      const result = await authService.updatePersonalInfo({
        first_name: personalData.firstName,
        last_name: personalData.lastName
      });

      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Kişisel bilgileriniz güncellendi."
        });
      } else {
        toast({
          title: "Hata",
          description: result.errors?.message || "Kişisel bilgiler güncellenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kişisel bilgiler güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    try {
      // Validate password fields
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: "Hata",
          description: "Yeni şifreler eşleşmiyor.",
          variant: "destructive"
        });
        setIsUpdatingPassword(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast({
          title: "Hata", 
          description: "Şifre en az 6 karakter olmalıdır.",
          variant: "destructive"
        });
        setIsUpdatingPassword(false);
        return;
      }

      if (!passwordData.currentPassword) {
        toast({
          title: "Hata",
          description: "Mevcut şifrenizi girmelisiniz.",
          variant: "destructive"
        });
        setIsUpdatingPassword(false);
        return;
      }

      const result = await authService.updatePassword({
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      });

      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Şifreniz güncellendi."
        });
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast({
          title: "Hata",
          description: result.errors?.message || "Şifre güncellenirken bir hata oluştu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Şifre güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/editor')}
            className="mb-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" />
            Editöre Dön
          </Button>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profilim</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Kişisel bilgilerinizi ve güvenlik ayarlarınızı yönetin</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <User size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Kişisel Bilgiler</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Ad, soyad bilgilerinizi güncelleyin
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">Ad</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={personalData.firstName}
                        onChange={handlePersonalDataChange}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">Soyad</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={personalData.lastName}
                        onChange={handlePersonalDataChange}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">E-posta Adresi</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalData.email}
                      className="bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                      disabled
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Lock size={12} />
                      E-posta adresi güvenlik nedeniyle değiştirilemez
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <Button 
                  type="submit" 
                  onClick={handlePersonalInfoSubmit}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8"
                  disabled={isUpdatingPersonal}
                >
                  {isUpdatingPersonal ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Güncelleniyor...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Kişisel Bilgileri Güncelle
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Premium Üye</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="mt-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Lock size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Güvenlik Ayarları</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300 font-medium">Mevcut Şifre</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordDataChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 pr-10"
                      placeholder="Mevcut şifrenizi girin"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 p-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300 font-medium">Yeni Şifre</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordDataChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 pr-10"
                      placeholder="En az 6 karakter"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">Yeni Şifre Tekrar</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordDataChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 pr-10"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <Button 
                type="submit" 
                onClick={handlePasswordSubmit}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <Lock size={16} className="mr-2" />
                    Şifreyi Güncelle
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
