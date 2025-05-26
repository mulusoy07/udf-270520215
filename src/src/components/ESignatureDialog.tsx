
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileSignature, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  adpu: z.string().min(1, 'ADPU durumu seçiniz'),
  card: z.string().min(1, 'Kart seçiniz'),
  signer: z.string()
    .min(3, 'İmzalayan en az 3 karakter olmalıdır')
    .max(50, 'İmzalayan en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞIÖÇ\s]+$/, 'Sadece harf ve boşluk kullanılabilir'),
});

interface ESignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ESignatureDialog: React.FC<ESignatureDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adpu: '',
      card: '',
      signer: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('E-signature data:', values);
    toast({
      title: "Belge İmzalandı",
      description: "Belge başarıyla e-imza ile imzalandı.",
    });
    onOpenChange(false);
    form.reset();
  };

  const refreshList = () => {
    toast({
      title: "Liste Yenilendi",
      description: "E-imza kartları listesi başarıyla yenilendi.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-w-[95vw] mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <FileSignature size={20} className="text-green-600 dark:text-green-400" />
            E-İmza ile İmzala
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="adpu"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">ADPU Durumu</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={`transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${fieldState.error ? "border-red-500 focus:border-red-500" : "focus:border-green-500 dark:focus:border-green-400"}`}>
                        <SelectValue placeholder="ADPU durumu seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="active" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">Etkin</SelectItem>
                      <SelectItem value="inactive" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">Pasif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="card"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">Kart</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={`transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${fieldState.error ? "border-red-500 focus:border-red-500" : "focus:border-green-500 dark:focus:border-green-400"}`}>
                        <SelectValue placeholder="Kart seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <SelectItem value="card1" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">E-İmza Kartı 1</SelectItem>
                      <SelectItem value="card2" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">E-İmza Kartı 2</SelectItem>
                      <SelectItem value="card3" className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">E-İmza Kartı 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signer"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 dark:text-gray-300">İmzalayan</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="İmzalayan kişi adı" 
                      {...field}
                      className={`transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${fieldState.error ? "border-red-500 focus:border-red-500" : "focus:border-green-500 dark:focus:border-green-400"}`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-colors">
                <FileSignature size={16} className="mr-2" />
                Belgeyi İmzala
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={refreshList}
                className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw size={16} className="mr-2" />
                Yenile
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ESignatureDialog;
