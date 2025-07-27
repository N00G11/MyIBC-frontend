"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, CheckCircle } from "lucide-react";
import axiosInstance from "@/components/request/reques";

interface Tresorier {
  id: number;
  username: string;
  email: string;
}

interface FormErrors {
  username?: string;
  email?: string;
}

export function EditTresorierDialog({
  tresorier,
  onSuccess,
}: {
  tresorier: Tresorier;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [username, setUsername] = useState(tresorier.username);
  const [email, setEmail] = useState(tresorier.email);

  const resetForm = () => {
    setUsername(tresorier.username);
    setEmail(tresorier.email);
    setErrors({});
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!username.trim()) newErrors.username = "Nom requis.";
    if (!email.trim()) newErrors.email = "Email requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Format d'email invalide.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await axiosInstance.put(`/tresorier/update/${tresorier.id}`, {
        username,
        email,
      });
      setShowSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setOpen(false);
        setShowSuccess(false);
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Erreur lors de la modification du trésorier:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      resetForm();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#001F5B]">
            <Edit className="h-5 w-5" />
            Modifier le trésorier
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du trésorier puis validez.
          </DialogDescription>
        </DialogHeader>

        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Trésorier modifié avec succès !
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Nom complet"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={errors.username ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.username && (
              <span className="text-xs text-red-600">{errors.username}</span>
            )}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-xs text-red-600">{errors.email}</span>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#c09c31] text-white"
              disabled={isLoading || showSuccess}
            >
                Modifier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
            </Dialog>
          );
      }