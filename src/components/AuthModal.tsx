
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Giriş başarılı!",
        description: "Editöre yönlendiriliyorsunuz.",
      });
      onOpenChange(false);
    } else {
      if (result.errors) {
        if ('success' in result.errors && !result.errors.success) {
          // Single error message
          toast({
            title: "Hata",
            description: result.errors.message,
            variant: "destructive"
          });
        } else {
          // Validation errors
          setValidationErrors(result.errors);
        }
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('registerEmail') as string;
    const password = formData.get('registerPassword') as string;

    const result = await register(firstName, lastName, email, password);
    
    if (result.success) {
      toast({
        title: "Kayıt işlemi başarılı!",
        description: "Editöre yönlendiriliyorsunuz.",
      });
      onOpenChange(false);
    } else {
      if (result.errors) {
        if ('success' in result.errors && !result.errors.success) {
          // Single error message
          toast({
            title: "Hata",
            description: result.errors.message,
            variant: "destructive"
          });
        } else {
          // Validation errors
          setValidationErrors(result.errors);
        }
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    navigate('/');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-2rem)] max-w-[420px] mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-gray-900 dark:text-gray-100">UDF Editör'e Giriş</DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            Devam etmek için giriş yapın veya yeni hesap oluşturun
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 dark:bg-gray-700">
            <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-700 dark:text-gray-300">Giriş Yap</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-700 dark:text-gray-300">Kayıt Ol</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="test@mail.com" 
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400" 
                    required 
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.email[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="123456"
                    className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400" 
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.password[0]}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">Ad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                    <Input 
                      id="firstName" 
                      name="firstName"
                      type="text" 
                      className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400" 
                      required 
                    />
                  </div>
                  {validationErrors.first_name && (
                    <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.first_name[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Soyad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                    <Input 
                      id="lastName" 
                      name="lastName"
                      type="text" 
                      className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400" 
                      required 
                    />
                  </div>
                  {validationErrors.last_name && (
                    <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.last_name[0]}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerEmail" className="text-gray-700 dark:text-gray-300">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <Input 
                    id="registerEmail" 
                    name="registerEmail"
                    type="email" 
                    placeholder="ornek@mail.com" 
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400" 
                    required 
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.email[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerPassword" className="text-gray-700 dark:text-gray-300">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <Input 
                    id="registerPassword" 
                    name="registerPassword"
                    type={showPassword ? "text" : "password"} 
                    className="pl-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400" 
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.password[0]}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Kaydınız Oluşturuluyor..." : "Kayıt Ol"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
