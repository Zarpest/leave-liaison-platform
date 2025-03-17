
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { User, updateUserPassword } from "@/services/adminService";

interface PasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedUser: User | null;
}

// Schema for password change form
const passwordSchema = z.object({
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type PasswordValues = z.infer<typeof passwordSchema>;

const PasswordDialog = ({ isOpen, setIsOpen, selectedUser }: PasswordDialogProps) => {
  const { toast } = useToast();

  // Form setup
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        password: "",
      });
    }
  }, [isOpen, form]);

  // Handle form submission
  const onSubmit = async (data: PasswordValues) => {
    if (!selectedUser) return;
    
    try {
      await updateUserPassword(selectedUser.id, data.password);
      
      toast({
        title: "Éxito",
        description: "Contraseña actualizada correctamente",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para {selectedUser?.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                Guardar Contraseña
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
