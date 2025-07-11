"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // nouveau hook dans app dir
import axiosInstance from "./request/reques";

export default function AuthCallbackComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await axiosInstance.get("/auth/success");
        const { token, name, email, role, isNew } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);

        if (isNew) {
          router.push("/inscription");
        } else {
          switch (role) {
            case "ROLE_PARTICIPANT":
              router.push("/participant/dashboard");
              break;
            case "ROLE_DIRIGEANT":
              router.push("/leader/dashboard");
              break;
            case "ROLE_ADMIN":
              router.push("/admin/dashboard");
              break;
            default:
              alert("Rôle utilisateur inconnu.");
              router.push("/");
          }
        }
      } catch (error) {
        console.error("Erreur OAuth2:", error);
        alert(error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Connexion en cours...</p>;
  }

  return null;
}
