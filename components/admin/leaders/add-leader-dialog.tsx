"use client";

import type React from "react";
import { useState } from "react";
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
import axiosInstance from "@/components/request/reques";

interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  telephone?: string;
  ville?: string;
  pays?: string;
  delegation?: string;
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

    // Validation côté client
    const newErrors: FormErrors = {};
    if (!username.trim()) newErrors.username = "Nom requis.";
    if (!password.trim()) newErrors.password = "Mot de passe requis.";
    if (!email.trim()) newErrors.email = "Email requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Format d'email invalide.";
    if (!telephone.trim()) newErrors.telephone = "Téléphone requis.";
    if (!ville.trim()) newErrors.ville = "Ville requise.";
    if (!pays.trim()) newErrors.pays = "Pays requis.";
    if (!delegation.trim()) newErrors.delegation = "Centre requis.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

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
      // Gestion des erreurs backend (ex: erreurs de validation)
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
            Remplissez tous les champs obligatoires (*) pour ajouter un nouveau
            dirigeant.
          </DialogDescription>
        </DialogHeader>

        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Dirigeant ajouté avec succès ! Le dialog va se fermer
              automatiquement.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Prénom Nom"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={errors.username ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="......"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ex: 0s8oG@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-sm font-medium">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telephone"
                  name="telephone"
                  placeholder="+33 1 23 45 67 89"
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  className={errors.telephone ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.telephone && (
                  <p className="text-sm text-red-500">{errors.telephone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville" className="text-sm font-medium">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ville"
                  name="ville"
                  placeholder="Paris"
                  value={ville}
                  onChange={e => setVille(e.target.value)}
                  className={errors.ville ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.ville && (
                  <p className="text-sm text-red-500">{errors.ville}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pays" className="text-sm font-medium">
                  Pays <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pays"
                  name="pays"
                  placeholder="France"
                  value={pays}
                  onChange={e => setPays(e.target.value)}
                  className={errors.pays ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.pays && (
                  <p className="text-sm text-red-500">{errors.pays}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delegation" className="text-sm font-medium">
                Centre de rattachement <span className="text-red-500">*</span>
              </Label>
              <Input
                id="delegation"
                name="delegation"
                placeholder="Centre Évangélique"
                value={delegation}
                onChange={e => setDelegation(e.target.value)}
                className={errors.delegation ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.delegation && (
                <p className="text-sm text-red-500">{errors.delegation}</p>
              )}
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
