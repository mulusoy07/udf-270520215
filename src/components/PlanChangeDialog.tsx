
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_days: number;
  features: string[];
  is_popular: boolean;
}

interface PlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanChanged: () => void;
  currentPlan?: string;
}

const PlanChangeDialog = ({ open, onOpenChange, onPlanChanged, currentPlan }: PlanChangeDialogProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [changingPlan, setChangingPlan] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const result = await authService.getSubscriptionPlans();
      if (result.success && result.data) {
        setPlans(result.data);
      } else {
        toast({
          title: "Hata",
          description: "Planlar yüklenirken hata oluştu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Planlar yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planId: number) => {
    setChangingPlan(planId);
    try {
      const result = await authService.changePlan(planId);
      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Planınız başarıyla değiştirildi."
        });
        onPlanChanged();
        onOpenChange(false);
      } else {
        toast({
          title: "Hata",
          description: result.errors?.message || "Plan değiştirme sırasında hata oluştu.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Plan değiştirme sırasında hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setChangingPlan(null);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Plan Değiştir</DialogTitle>
            <DialogDescription>
              Yeni bir plan seçin
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plan Değiştir</DialogTitle>
          <DialogDescription>
            Yeni bir plan seçin ve hemen geçiş yapın
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.name === currentPlan 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : plan.is_popular 
                    ? 'border-blue-500 transform scale-105' 
                    : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.name === currentPlan && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white">
                    <Crown size={12} className="mr-1" />
                    Mevcut Plan
                  </Badge>
                </div>
              )}
              
              {plan.is_popular && plan.name !== currentPlan && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-blue-500 text-white">
                    <Star size={12} className="mr-1" />
                    Popüler
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-lg font-medium ml-1">{plan.currency}</span>
                  <span className="text-gray-500 ml-2">/ aylık</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                {plan.name === currentPlan ? (
                  <Button disabled className="w-full">
                    Mevcut Planınız
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handlePlanChange(plan.id)}
                    disabled={changingPlan !== null}
                    className={`w-full ${
                      plan.is_popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    {changingPlan === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Değiştiriliyor...
                      </>
                    ) : (
                      'Bu Plana Geç'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanChangeDialog;
