import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Crown, Calendar, CreditCard, Package, AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from '@/services/authService';
import PlanChangeDialog from '@/components/PlanChangeDialog';
import { useNavigate } from 'react-router-dom';

interface SubscriptionData {
  has_subscription: boolean;
  plan_name: string | null;
  plan_price: number | null;
  currency: string;
  subscription_expiry_date: string | null;
  days_remaining: number | null;
  features: string[];
  can_renew: boolean;
}

interface PaymentHistoryItem {
  id: number;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  payment_date: string;
}

const SubscriptionSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
    
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const Subscriptions = () => {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planChangeDialogOpen, setPlanChangeDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const subscriptionResult = await authService.getSubscription();
      if (subscriptionResult.success && subscriptionResult.data) {
        // Map the backend response to our frontend interface
        const mappedData: SubscriptionData = {
          has_subscription: subscriptionResult.data.has_subscription,
          plan_name: subscriptionResult.data.plan_name,
          plan_price: subscriptionResult.data.plan_price,
          currency: subscriptionResult.data.currency,
          subscription_expiry_date: subscriptionResult.data.expiry_date,
          days_remaining: subscriptionResult.data.remaining_days,
          features: subscriptionResult.data.features || [],
          can_renew: subscriptionResult.data.is_active,
        };
        setSubscriptionData(mappedData);
      }
      
      const historyResult = await authService.getPaymentHistory();
      if (historyResult.success && historyResult.data) {
        setPaymentHistory(historyResult.data);
      }
    } catch (err) {
      setError('Abonelik bilgileri yüklenirken bir hata oluştu.');
      console.error('Subscription data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlanChanged = () => {
    // Refresh subscription data after plan change
    fetchData();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <SubscriptionSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Tamamlandı', variant: 'default' as const },
      pending: { label: 'Beklemede', variant: 'secondary' as const },
      failed: { label: 'Başarısız', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Modern Back Button */}
      <div className="mb-8">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20">
          <CardContent className="py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/editor')}
              className="flex items-center gap-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-all duration-200 text-base font-medium"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span>Editor'e Geri Dön</span>
              <Home className="h-4 w-4 ml-auto opacity-60" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Aboneliklerim</h1>
        <p className="text-gray-600 dark:text-gray-400">Abonelik planınızı ve ödeme geçmişinizi yönetin</p>
      </div>

      {/* Current Subscription */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Mevcut Planınız
          </CardTitle>
          <CardDescription>
            {subscriptionData?.has_subscription 
              ? "Aktif abonelik planınızın detayları" 
              : "Henüz aktif bir aboneliğiniz bulunmuyor"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {subscriptionData?.has_subscription ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plan Adı</p>
                  <p className="font-semibold text-lg">{subscriptionData.plan_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Aylık Ücret</p>
                  <p className="font-semibold text-lg">
                    {subscriptionData.plan_price} {subscriptionData.currency}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bitiş Tarihi</p>
                <p className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {subscriptionData.subscription_expiry_date && formatDate(subscriptionData.subscription_expiry_date)}
                  {subscriptionData.days_remaining !== null && (
                    <Badge variant={subscriptionData.days_remaining > 7 ? "default" : "destructive"}>
                      {subscriptionData.days_remaining} gün kaldı
                    </Badge>
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Plan Özellikleri</p>
                <ul className="space-y-2">
                  {subscriptionData.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Henüz bir abonelik planınız yok</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="gap-2">
          <Button onClick={() => setPlanChangeDialogOpen(true)}>
            {subscriptionData?.has_subscription ? 'Plan Değiştir' : 'Plan Seç'}
          </Button>
          {subscriptionData?.has_subscription && subscriptionData?.can_renew && (
            <Button variant="outline">
              Yenile
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Ödeme Geçmişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.plan_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(payment.payment_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount} {payment.currency}</p>
                    <Badge variant={getStatusBadge(payment.status).variant}>
                      {getStatusBadge(payment.status).label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Henüz ödeme geçmişiniz bulunmuyor</p>
            </div>
          )}
        </CardContent>
      </Card>

      <PlanChangeDialog 
        open={planChangeDialogOpen}
        onOpenChange={setPlanChangeDialogOpen}
        onPlanChanged={handlePlanChanged}
        currentPlan={subscriptionData?.plan_name || undefined}
      />
    </div>
  );
};

export default Subscriptions;
