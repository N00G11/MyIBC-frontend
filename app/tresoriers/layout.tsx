"use client";
import { CmciLogo } from "@/components/cmci-logo";
import { LogOut, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTresorier } from "@/hooks/use-tresorier";
import React from "react";

export default function TresoriersLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, error } = useTresorier();

  // Fallback user data for loading state
  const displayUser = user || {
    username: "Trésorier",
    pays: "Côte d'Ivoire",
    telephone: "+225 00 00 00 00 00",
    role: "Utilisateur",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tresorierCode");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <CmciLogo className="h-25 w-auto" />
            <span className="text-2xl font-bold text-[#001F5B]">Espace Trésorier</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full" disabled={loading}>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {loading ? "..." : getInitials(displayUser.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-3 p-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white font-semibold text-lg">
                        {loading ? "..." : getInitials(displayUser.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">
                        {loading ? "Chargement..." : displayUser.username}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Utilisateur</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {loading ? "Chargement..." : (user?.pays || "Côte d'Ivoire")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {loading ? "Chargement..." : displayUser.telephone}
                      </span>
                    </div>
                    {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center">{children}</main>
    </div>
  );
}