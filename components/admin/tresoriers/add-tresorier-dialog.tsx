"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCircle, CheckCircle } from "lucide-react";
import axiosInstance from "@/components/request/reques";

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
}

export function AddTresorierDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setErrors({});
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!username.trim()) newErrors.username = "Nom requis.";
    if (!password.trim()) newErrors.password = "Mot de passe requis.";
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
      await axiosInstance.post("/tresorier/add", {
        username,
        password,
        email,
      });
      setShowSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        resetForm();
        setOpen(false);
      }, 2000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Erreur lors de l'ajout du trésorier:", error);
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
        <Button className="bg-[#D4AF37] hover:bg-[#c09c31] text-white">
          <UserCircle className="h-4 w-4 mr-2" />
          Ajouter un trésorier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#001F5B]">
            <UserCircle className="h-5 w-5" />
            Ajouter un nouveau trésorier
          </DialogTitle>
          <DialogDescription>
            Remplissez tous les champs obligatoires (*) pour ajouter un nouveau trésorier.
          </DialogDescription>
        </DialogHeader>

        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Trésorier ajouté avec succès ! Le dialog va se fermer automatiquement.
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
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={errors.password ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="text-xs text-red-600">{errors.password}</span>
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
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}