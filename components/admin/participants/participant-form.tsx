"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/components/request/reques";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  UserPlus,
  MapPin,
  Phone,
  Calendar,
  User,
  Mail,
  Globe,
  Building2,
  Truck,
  AlertCircle,
} from "lucide-react";

type Participant = {
  id: number;
  username: string;
  email: string;
};

type camp = {
  trancheAge: string;
};

const countriesData: Record<string, { villes: Record<string, string[]> }> = {
  Cameroun: {
    villes: {
      Yaoundé: ["Délégation du Centre", "Délégation Nkolbisson", "Délégation Mvog-Ada"],
      Douala: ["Délégation Bonaberi", "Délégation Akwa", "Délégation Deïdo"],
      Bafoussam: ["Délégation Bapi", "Délégation Tamdja", "Délégation Kamkop"],
      Garoua: ["Délégation Plateau", "Délégation Poumpoumré", "Délégation Ngaoundéré"],
      Maroua: ["Délégation Domayo", "Délégation Kongola", "Délégation Hardé"],
    },
  },
  France: {
    villes: {
      Paris: ["Délégation Nord", "Délégation Sud", "Délégation Centre"],
      Lyon: ["Croix-Rousse", "Part-Dieu", "Gerland"],
      Marseille: ["Castellane", "Noailles", "La Joliette"],
      Toulouse: ["Compans", "Mirail", "Saint-Cyprien"],
    },
  },
};

function calculateAge(dateString: string): number {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

const TRANSPORT_PRICE = 10000;

export function ParticipantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campId = searchParams.get("id");
  const email = searchParams.get("email");

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sexe, setSexe] = useState("Masculin");
  const [telephone, setTelephone] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [pays, setPays] = useState("");
  const [ville, setVille] = useState("");
  const [delegation, setDelegation] = useState("");

  const [villes, setVilles] = useState<string[]>([]);
  const [delegations, setDelegations] = useState<string[]>([]);

  const [age, setAge] = useState<number | null>(null);
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);

  const [payTransport, setPayTransport] = useState(false);

  useEffect(() => {
    if (email) fetchUser();
    if (campId) fetchTrancheAge(campId);
  }, [email, campId]);

  useEffect(() => {
    if (pays && countriesData[pays]) {
      setVilles(Object.keys(countriesData[pays].villes));
      setVille("");
      setDelegation("");
      setDelegations([]);
    }
  }, [pays]);

  useEffect(() => {
    if (pays && ville && countriesData[pays]?.villes[ville]) {
      setDelegations(countriesData[pays].villes[ville]);
      setDelegation("");
    }
  }, [ville, pays]);

  const fetchTrancheAge = async (id: string) => {
    try {
      setError(null);
      const response = await axiosInstance.get<camp>(`/camp/${id}`);
      const [min, max] = response.data.trancheAge.split("-").map(Number);
      setMinAge(min);
      setMaxAge(max);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données du camp.");
    }
  };

  const fetchUser = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get(`/participant/email/${email}`);
      setParticipant(response.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement de vos informations.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!telephone || !dateNaissance || !pays || !ville || !delegation) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    const calculatedAge = calculateAge(dateNaissance);
    setAge(calculatedAge);

    if (minAge && maxAge && (calculatedAge < minAge || calculatedAge > maxAge)) {
      setError(`L'âge doit être entre ${minAge} et ${maxAge} ans.`);
      return;
    }

    try {
      await axiosInstance.post(`/inscription/add/${email}/${campId}`, {
        sexe,
        telephone,
        dateNaissance,
        ville,
        pays,
        delegation,
        payTransport,
      });
      router.push(`/participant/dashboard?email=${email}`);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen bg-myibc-light p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader className="bg-myibc-blue text-white rounded-t-md">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <UserPlus className="h-5 w-5" />
              Inscription au camp
            </CardTitle>
            {minAge && maxAge && (
              <p className="mt-1 text-sm text-white/80">
                Tranche d'âge autorisée : {minAge} à {maxAge} ans
              </p>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom et Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Nom complet" icon={User} value={participant?.username || ""} disabled />
                <InputGroup label="Email" icon={Mail} value={participant?.email || ""} disabled />
              </div>

              {/* Genre */}
              <div>
                <Label className="text-myibc-blue font-medium">Genre</Label>
                <RadioGroup value={sexe} onValueChange={setSexe} className="flex gap-6 mt-2">
                  <RadioGroupItem value="Masculin" id="male" />
                  <Label htmlFor="male">Masculin</Label>
                  <RadioGroupItem value="Feminin" id="female" />
                  <Label htmlFor="female">Féminin</Label>
                </RadioGroup>
              </div>

              {/* Date naissance & Téléphone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup
                  label="Date de naissance"
                  icon={Calendar}
                  type="date"
                  value={dateNaissance}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDateNaissance(e.target.value);
                    setAge(calculateAge(e.target.value));
                  }}
                />
                <InputGroup
                  label="Téléphone"
                  icon={Phone}
                  placeholder="+237 6 XX XX XX"
                  value={telephone}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setTelephone(e.target.value)}
                />
              </div>

              {/* Localisation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectGroup
                  label="Pays"
                  value={pays}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPays(e.target.value)}
                  options={Object.keys(countriesData)}
                />
                <SelectGroup
                  label="Ville"
                  value={ville}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setVille(e.target.value)}
                  options={villes}
                  disabled={!pays}
                />
                <SelectGroup
                  label="Délégation"
                  value={delegation}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDelegation(e.target.value)}
                  options={delegations}
                  disabled={!ville}
                />
              </div>

              {/* Transport */}
              <div className="border border-yellow-100 rounded-md p-4 bg-yellow-50">
                <Label className="flex items-center gap-2 text-myibc-gold font-semibold">
                  <Truck className="h-4 w-4" />
                  Transport (Facultatif)
                </Label>
                <p className="text-sm text-myibc-graytext mt-2">
                  Frais : {TRANSPORT_PRICE.toLocaleString()} FCFA — depuis votre délégation.
                </p>
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="transport"
                    checked={payTransport}
                    onChange={(e) => setPayTransport(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="transport" className="text-myibc-blue font-medium cursor-pointer">
                    Je souhaite bénéficier du transport
                  </Label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-myibc-blue hover:bg-[#001942] text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Confirmer l’inscription
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InputGroup({ label, icon: Icon, ...props }: any) {
  return (
    <div>
      <Label className="flex items-center gap-1 text-myibc-blue font-medium">
        <Icon className="h-4 w-4" />
        {label}
      </Label>
      <Input className="mt-1" {...props} />
    </div>
  );
}

function SelectGroup({ label, options, ...props }: any) {
  return (
    <div>
      <Label className="text-myibc-blue font-medium">{label}</Label>
      <select
        className="w-full mt-1 border border-gray-300 rounded-md p-2"
        {...props}
      >
        <option value="">-- Sélectionner --</option>
        {options?.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
