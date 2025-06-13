"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCircle, Loader2, CheckCircle } from "lucide-react";
import axiosInstance from "../request/reques";
import { useSearchParams } from "next/navigation";

interface Dirigeant {
  id: number;
  username: string;
  pays?: string | null;
  ville?: string | null;
  delegation?: string | null;
}

interface FormErrors {
  name?: string;
  password?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  center?: string;
}

export function AddLeaderDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");
  const [delegation, setDelegation] = useState("");
  const [dirigeant, setDirigeant] = useState<Dirigeant | null>(null);

  const emailParam = useSearchParams().get("email");

  useEffect(() => {
    if (!emailParam) return;

    async function fetchData() {
      try {
        const resDirigeant = await axiosInstance.get<Dirigeant>(
          `/statistique/dirigeant/email/${emailParam}`
        );
        const data = resDirigeant.data;
        setDirigeant(data);
        setVille(data.ville || "");
        setPays(data.pays || "");
        setDelegation(data.delegation || "");
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    }

    fetchData();
  }, [emailParam]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.name = "Le nom complet est obligatoire";
    } else if (username.trim().split(" ").length < 2) {
      newErrors.name = "Veuillez saisir le prénom et le nom";
    }

    if (!email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est obligatoire";
    }

    if (!telephone.trim()) {
      newErrors.phone = "Le téléphone est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setTelephone("");
    setVille("");
    setPays("");
    setDelegation("");
    setErrors({});
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await axiosInstance.post("/dirigeant/add", {
        username,
        password,
        email,
        telephone,
        pays,
        ville,
        delegation,
      });

      setShowSuccess(true);
      setTimeout(() => {
        resetForm();
        setOpen(false);
      }, 2000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Erreur lors de l'ajout du dirigeant:", error);
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
          Ajouter un dirigeant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#001F5B]">
            <UserCircle className="h-5 w-5" />
            Ajouter un nouveau dirigeant
          </DialogTitle>
          <DialogDescription>
            Remplissez tous les champs <span className="text-red-500">*</span> obligatoires.
          </DialogDescription>
        </DialogHeader>

        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Dirigeant ajouté avec succès ! Le dialogue va se fermer automatiquement.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nom complet */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                value={username}
                placeholder="Nom complet"
                onChange={(e) => setUsername(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="ex: password123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Email et Téléphone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex: 3oR6M@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telephone"
                  value={telephone}
                  placeholder="+237 691 645 842"
                  onChange={(e) => setTelephone(e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Ville et Pays */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ville"
                  value={ville}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pays">
                  Pays <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pays"
                  value={pays}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Centre */}
            <div className="space-y-2">
              <Label htmlFor="delegation">
                Centre de rattachement <span className="text-red-500">*</span>
              </Label>
              <Input
                id="delegation"
                value={delegation}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
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
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ajouté !
                </>
              ) : (
                "Ajouter le dirigeant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
