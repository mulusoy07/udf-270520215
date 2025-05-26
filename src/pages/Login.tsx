import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DarkModeProvider } from '@/contexts/DarkModeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Giriş başarılı!",
        description: "UDF Editör'e hoş geldiniz.",
      });
      navigate('/editor');
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Kayıt işlemi başarılı!",
        description: "UDF Editör'e hoş geldiniz.",
      });
      navigate('/editor');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `${provider} ile giriş başarılı!`,
        description: "UDF Editör'e hoş geldiniz.",
      });
      navigate('/editor');
    }, 1500);
  };

  return (
    <DarkModeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-8 px-4">
          <div className="container max-w-md w-full">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-700 dark:text-gray-400">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-700 dark:text-gray-400">Kayıt Ol</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-gray-800 dark:text-gray-100">Hesabınıza Giriş Yapın</CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                      UDF Editör'e giriş yaparak belgelerinizi düzenlemeye başlayın.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">E-posta</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="ornek@mail.com" 
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Şifre</Label>
                            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              Şifremi Unuttum
                            </a>
                          </div>
                          <Input 
                            id="password" 
                            type="password" 
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            required 
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" disabled={isLoading}>
                          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                        </Button>
                        
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">veya</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocialLogin('Google')}
                            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                            disabled={isLoading}
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                              />
                            </svg>
                            Google
                          </Button>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocialLogin('Microsoft')}
                            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                            disabled={isLoading}
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00A4EF"/>
                            </svg>
                            Microsoft
                          </Button>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocialLogin('Facebook')}
                            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                            disabled={isLoading}
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" fill="#1877F2"/>
                            </svg>
                            Facebook
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-gray-800 dark:text-gray-100">Yeni Hesap Oluşturun</CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                      UDF Editör'e kaydolarak tüm özelliklere erişin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister}>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">Ad</Label>
                            <Input 
                              id="firstName" 
                              type="text" 
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              required 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Soyad</Label>
                            <Input 
                              id="lastName" 
                              type="text" 
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              required 
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="registerEmail" className="text-gray-700 dark:text-gray-300">E-posta</Label>
                          <Input 
                            id="registerEmail" 
                            type="email" 
                            placeholder="ornek@mail.com" 
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="registerPassword" className="text-gray-700 dark:text-gray-300">Şifre</Label>
                          <Input 
                            id="registerPassword" 
                            type="password" 
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Şifre Tekrar</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password" 
                            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            required 
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" disabled={isLoading}>
                          {isLoading ? "Kaydınız Oluşturuluyor..." : "Kayıt Ol"}
                        </Button>
                        
                        <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">veya</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocialLogin('Google')}
                            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                            disabled={isLoading}
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                              />
                            </svg>
                            Google
                          </Button>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocialLogin('Microsoft')}
                            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                            disabled={isLoading}
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00A4EF"/>
                            </svg>
                            Microsoft
                          </Button>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleSocialLogin('Facebook')}
                            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                            disabled={isLoading}
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" fill="#1877F2"/>
                            </svg>
                            Facebook
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Kaydolarak <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Kullanım Şartları</a> ve <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  );
};

export default LoginPage;
