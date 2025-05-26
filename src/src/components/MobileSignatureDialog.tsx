
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  operator: z.string().min(1, 'GSM operatörü seçiniz'),
  phoneNumber: z.string()
    .min(10, 'Telefon numarası en az 10 haneli olmalıdır')
    .max(11, 'Telefon numarası en fazla 11 haneli olabilir')
    .regex(/^[0-9]+$/, 'Sadece rakam girilmelidir')
    .refine((val) => val.startsWith('5'), 'Numara 5 ile başlamalıdır'),
  signatureServer: z.string().min(1, 'İmza sunucusu seçiniz'),
});

interface MobileSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileSignatureDialog: React.FC<MobileSignatureDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operator: '',
      phoneNumber: '',
      signatureServer: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Mobile signature data:', values);
    toast({
      title: "İmza İşlemi Başlatıldı",
      description: "Mobil imza işlemi başarıyla başlatıldı. Telefonunuza gelen SMS ile işlemi tamamlayabilirsiniz.",
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-w-[95vw] mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Smartphone size={20} className="text-blue-600 dark:text-blue-400" />
            Mobil İmza ile İmzala
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="operator"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">GSM Operatörleri</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={`transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${fieldState.error ? "border-red-500 focus:border-red-500" : "focus:border-blue-500 dark:focus:border-blue-400"}`}>
                        <SelectValue placeholder="Operatör seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="turkcell" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">Turkcell</SelectItem>
                      <SelectItem value="vodafone" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">Vodafone</SelectItem>
                      <SelectItem value="turktelekom" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">Türk Telekom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">GSM Numarası</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="5XX XXX XX XX" 
                      {...field}
                      maxLength={11}
                      className={`transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${fieldState.error ? "border-red-500 focus:border-red-500" : "focus:border-blue-500 dark:focus:border-blue-400"}`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signatureServer"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">İmza Sunucuları</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={`transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${fieldState.error ? "border-red-500 focus:border-red-500" : "focus:border-blue-500 dark:focus:border-blue-400"}`}>
                        <SelectValue placeholder="İmza sunucusu seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="turkiye-bilisim" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">Türkiye Bilişim Vakfı</SelectItem>
                      <SelectItem value="e-tugra" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">E-Tuğra</SelectItem>
                      <SelectItem value="kamusm" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">KamuSM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <div className="flex justify-center pt-4">
              <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition-colors">
                <Smartphone size={16} className="mr-2" />
                Belgeyi İmzala
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MobileSignatureDialog;
