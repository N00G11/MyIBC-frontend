"use client";

import { Button } from "@/components/ui/button";
import { CmciLogo } from "@/components/cmci-logo";
import { LogOut, User, Users, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LeaderHeader() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-4">
          <CmciLogo className="h-12 w-auto" />
          <div>
            <h1 className="text-xl  font-bold text-[#001F5B]">
            </h1>
          </div>
        </div>
         <div className="ml-auto flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </div>
    </header>
  );
}
