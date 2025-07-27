// EditLeaderDialog.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import axiosInstance from "@/components/request/reques";

export function EditLeaderDialog({ leader, onSuccess }: {
  leader: any;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...leader });

  useEffect(() => {
    if (open) setForm({ ...leader });
  }, [open, leader]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/dirigeant/update/${leader.id}`, form);
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error("Erreur modification dirigeant:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Modifier
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier dirigeant</DialogTitle>
          <DialogDescription>Modifiez les informations du dirigeant.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {["username", "email", "telephone", "ville", "pays", "delegation"].map((field) => (
            <div key={field} className="space-y-1">
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
