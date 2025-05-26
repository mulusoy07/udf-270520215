
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock payment history data
  const [paymentHistory] = useState([
    { id: 1, description: 'Premium Plan - Mayıs 2024', date: '2024-05-15', amount: '29.99', status: 'Ödendi' },
    { id: 2, description: 'Premium Plan - Nisan 2024', date: '2024-04-15', amount: '29.99', status: 'Ödendi' },
    { id: 3, description: 'Premium Plan - Mart 2024', date: '2024-03-15', amount: '29.99', status: 'Ödendi' },
    { id: 4, description: 'Premium Plan - Şubat 2024', date: '2024-02-15', amount: '29.99', status: 'Ödendi' },
    { id: 5, description: 'Premium Plan - Ocak 2024', date: '2024-01-15', amount: '29.99', status: 'Ödendi' },
    { id: 6, description: 'Premium Plan - Aralık 2023', date: '2023-12-15', amount: '29.99', status: 'Ödendi' },
    { id: 7, description: 'Premium Plan - Kasım 2023', date: '2023-11-15', amount: '29.99', status: 'Ödendi' },
    { id: 8, description: 'Premium Plan - Ekim 2023', date: '2023-10-15', amount: '29.99', status: 'Ödendi' },
  ]);

  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = paymentHistory.slice(startIndex, endIndex);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/editor');
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleRenewSubscription = async () => {
    setIsRenewing(true);
    
    try {
      setTimeout(() => {
        toast({
          title: "Abonelik Yenileme",
          description: "Ödeme sayfasına yönlendiriliyorsunuz..."
        });
        setIsRenewing(false);
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
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/editor')}
            className="mb-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" />
            Editöre Dön
          </Button>
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
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plan Adı</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{subscriptionData.planName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aylık Ücret</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {subscriptionData.price} {subscriptionData.currency}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bitiş Tarihi</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(subscriptionData.expiryDate)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Kalan Süre</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {subscriptionData.remainingDays} gün
                    </p>
                  </div>
                </div>
              </div>
              
              {subscriptionData.remainingDays <= 7 && (
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
                <Button variant="outline" className="border-gray-300 dark:border-gray-600 flex-1">
                  Plan Değiştir
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Plan Features */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-gray-100">Plan Özellikleri</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Premium planınıza dahil olan özellikler
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Sınırsız belge oluşturma',
                  'E-İmza desteği',
                  'Mobil İmza desteği',
                  '10 GB bulut depolama',
                  'Öncelikli müşteri desteği',
                  'Gelişmiş şablonlar'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
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
                  {currentPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-gray-200 dark:border-gray-700">
                      <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                        {payment.description}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                        {payment.amount} TL
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
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
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
