"use client";
import { CmciLogo } from "@/components/cmci-logo";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";

export default function TresoriersLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <CmciLogo className="h-16 w-auto" />
            <span className="text-2xl font-bold text-[#001F5B]">Espace Trésorier</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-6 w-6" />
                <span className="sr-only">Menu utilisateur</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-5 w-5 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center">{children}</main>
    </div>
  );
}