
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import { authService } from '@/services/authService';
import PlanChangeDialog from '@/components/PlanChangeDialog';

interface SubscriptionData {
  has_subscription: boolean;
  plan_name: string | null;
  plan_price: number | null;
  currency: string;
  expiry_date: string | null;
  remaining_days: number;
  is_active: boolean;
  features: string[];
}

interface PaymentData {
  orders: Array<{
    id: number;
    description: string;
    plan_name: string;
    date: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
  }>;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const SubscriptionsPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentData | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/editor');
      return;
    }
    
    if (isAuthenticated) {
      fetchSubscriptionData();
      fetchPaymentHistory(1);
    }
  }, [isAuthenticated, isLoading, navigate]);

  const fetchSubscriptionData = async () => {
    try {
      const result = await authService.getSubscription();
      if (result.success && result.data) {
        setSubscriptionData(result.data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchPaymentHistory = async (page: number) => {
    try {
      const result = await authService.getPaymentHistory(page, itemsPerPage);
      if (result.success && result.data) {
        setPaymentHistory(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchSubscriptionData(),
        fetchPaymentHistory(currentPage)
      ]);
      toast({
        title: "Başarılı",
        description: "Veriler güncellendi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Veriler güncellenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRenewSubscription = async () => {
    setIsRenewing(true);
    try {
      const result = await authService.renewSubscription();
      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Aboneliğiniz başarıyla yenilendi."
        });
        await fetchSubscriptionData();
      } else {
        toast({
          title: "Hata",
          description: result.errors?.message || "Abonelik yenilenirken hata oluştu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Abonelik yenilenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ödendi';
      case 'pending':
        return 'Bekliyor';
      case 'failed':
        return 'Başarısız';
      case 'cancelled':
        return 'İptal';
      default:
        return status;
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
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/editor')}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft size={16} className="mr-2" />
              Editöre Dön
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="ml-auto"
            >
              <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Güncelleniyor...' : 'Yenile'}
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Aboneliklerim</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Abonelik durumunuzu ve ödeme bilgilerinizi görüntüleyin</p>
        </div>

        <div className="grid gap-6">
          {/* Current Subscription */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-500" />
                    {subscriptionData?.has_subscription ? 'Aktif Abonelik' : 'Abonelik Bulunamadı'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {subscriptionData?.has_subscription ? 'Mevcut plan durumunuz' : 'Henüz aktif bir aboneliğiniz yok'}
                  </CardDescription>
                </div>
                {subscriptionData?.has_subscription && (
                  <Badge className={getStatusColor(subscriptionData.remaining_days)}>
                    {subscriptionData.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            {subscriptionData?.has_subscription ? (
              <>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plan Adı</h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{subscriptionData.plan_name}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aylık Ücret</h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {subscriptionData.plan_price} {subscriptionData.currency}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bitiş Tarihi</h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Calendar size={16} />
                          {subscriptionData.expiry_date ? formatDate(subscriptionData.expiry_date) : 'Bilinmiyor'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Kalan Süre</h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {subscriptionData.remaining_days} gün
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {subscriptionData.remaining_days <= 7 && (
                    <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          Aboneliğiniz yakında sona erecek. Kesintisiz hizmet almak için lütfen yenileyin.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex gap-3 w-full">
                    <Button 
                      onClick={handleRenewSubscription}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
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
                    <Button 
                      variant="outline" 
                      className="border-gray-300 dark:border-gray-600 flex-1"
                      onClick={() => setShowPlanDialog(true)}
                    >
                      Plan Değiştir
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Henüz aktif bir aboneliğiniz bulunmuyor. Planlarımızı inceleyerek size uygun olanı seçebilirsiniz.
                  </p>
                  <Button 
                    onClick={() => setShowPlanDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Planları Görüntüle
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Plan Features */}
          {subscriptionData?.has_subscription && subscriptionData.features.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-gray-900 dark:text-gray-100">Plan Özellikleri</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {subscriptionData.plan_name} planınıza dahil olan özellikler
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptionData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          {paymentHistory && paymentHistory.orders.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-gray-900 dark:text-gray-100">Ödeme Geçmişi</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Son ödeme işlemleriniz
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-gray-700">
                      <TableHead className="text-gray-700 dark:text-gray-300">Açıklama</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Tarih</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Tutar</TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.orders.map((payment) => (
                      <TableRow key={payment.id} className="border-gray-200 dark:border-gray-700">
                        <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                          {payment.description}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {formatDate(payment.date)}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                          {payment.amount} {payment.currency}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {getPaymentStatusText(payment.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {paymentHistory.pagination.last_page > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (paymentHistory.pagination.current_page > 1) {
                                fetchPaymentHistory(paymentHistory.pagination.current_page - 1);
                              }
                            }}
                            className={paymentHistory.pagination.current_page <= 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: paymentHistory.pagination.last_page }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                fetchPaymentHistory(page);
                              }}
                              isActive={paymentHistory.pagination.current_page === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (paymentHistory.pagination.current_page < paymentHistory.pagination.last_page) {
                                fetchPaymentHistory(paymentHistory.pagination.current_page + 1);
                              }
                            }}
                            className={paymentHistory.pagination.current_page >= paymentHistory.pagination.last_page ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <PlanChangeDialog
        open={showPlanDialog}
        onOpenChange={setShowPlanDialog}
        onPlanChanged={() => {
          fetchSubscriptionData();
          fetchPaymentHistory(1);
        }}
        currentPlan={subscriptionData?.plan_name || undefined}
      />
    </div>
  );
};

export default SubscriptionsPage;
