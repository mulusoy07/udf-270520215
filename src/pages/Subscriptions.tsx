
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Calendar, CheckCircle } from 'lucide-react';

const SubscriptionsPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState({
    planName: 'Premium Plan',
    expiryDate: '2024-06-15',
    remainingDays: 21,
    isActive: true,
    price: '29.99',
    currency: 'TL'
  });
  const [isRenewing, setIsRenewing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/editor');
      return;
    }

    // Here you would fetch subscription data from API
    // For now, we'll use mock data
  }, [isAuthenticated, isLoading, navigate]);

  const handleRenewSubscription = async () => {
    setIsRenewing(true);
    
    try {
      // Here you would make the API call to renew subscription
      // This might involve redirecting to a payment gateway
      setTimeout(() => {
        toast({
          title: "Abonelik Yenileme",
          description: "Ödeme sayfasına yönlendiriliyorsunuz..."
        });
        setIsRenewing(false);
        // In a real app, you would redirect to payment gateway here
      }, 1000);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Abonelik yenilenirken bir hata oluştu.",
        variant: "destructive"
      });
      setIsRenewing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (remainingDays: number) => {
    if (remainingDays > 30) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (remainingDays > 7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
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
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/editor')}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Editöre Dön
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Aboneliklerim</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Abonelik durumunuzu ve ödeme bilgilerinizi görüntüleyin</p>
        </div>

        <div className="grid gap-6">
          {/* Current Subscription */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-500" />
                    Aktif Abonelik
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Mevcut plan durumunuz
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(subscriptionData.remainingDays)}>
                  {subscriptionData.isActive ? 'Aktif' : 'Pasif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan Adı</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{subscriptionData.planName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Aylık Ücret</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {subscriptionData.price} {subscriptionData.currency}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bitiş Tarihi</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(subscriptionData.expiryDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Kalan Süre</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {subscriptionData.remainingDays} gün
                    </p>
                  </div>
                </div>
              </div>
              
              {subscriptionData.remainingDays <= 7 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Aboneliğiniz yakında sona erecek. Kesintisiz hizmet almak için lütfen yenileyin.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                onClick={handleRenewSubscription}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isRenewing}
              >
                {isRenewing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} className="mr-2" />
                    Aboneliği Yenile
                  </>
                )}
              </Button>
              <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                Plan Değiştir
              </Button>
            </CardFooter>
          </Card>

          {/* Plan Features */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Plan Özellikleri</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Premium planınıza dahil olan özellikler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Sınırsız belge oluşturma</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">E-İmza desteği</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Mobil İmza desteği</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">10 GB bulut depolama</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Öncelikli müşteri desteği</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Gelişmiş şablonlar</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Ödeme Geçmişi</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Son ödeme işlemleriniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Premium Plan - Mayıs 2024</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">15 Mayıs 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">29.99 TL</p>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Ödendi
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Premium Plan - Nisan 2024</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">15 Nisan 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">29.99 TL</p>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Ödendi
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
