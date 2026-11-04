"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { contactSchema, type ContactInput } from "@/schemas/forms/contactSchema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { PageHeader, PageShell } from "@/components/ui/page";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_FORM: ContactInput = { name: "", email: "", subject: "", message: "" };

// Sujets préremplis via ?subject=… (ex. lien « Supprimer mon compte » de la page compte)
const PRESET_SUBJECTS: Record<string, string> = {
  "suppression-compte": "Demande de suppression de compte",
};

const Contact: React.FC = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ContactInput>({
    ...EMPTY_FORM,
    subject: PRESET_SUBJECTS[searchParams.get("subject") ?? ""] ?? "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof ContactInput]) {
      const result = contactSchema.safeParse({ ...formData, [name]: value });
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === name);
        setFieldErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
      } else {
        setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === name);
      setFieldErrors((prev) => ({ ...prev, [name]: issue?.message ?? "" }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errs: Partial<Record<keyof ContactInput, string>> = {};
      result.error.issues.forEach((i) => {
        const key = i.path[0] as keyof ContactInput;
        if (key && !errs[key]) errs[key] = i.message;
      });
      setFieldErrors(errs);
      setTouched({ name: true, email: true, subject: true, message: true });
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Une erreur est survenue. Réessaie plus tard.");
        return;
      }

      setStatus("success");
      setFormData(EMPTY_FORM);
      setFieldErrors({});
      setTouched({});
    } catch {
      setStatus("error");
      setErrorMsg("Impossible de contacter le serveur. Vérifie ta connexion.");
    }
  };

  const field = (name: keyof ContactInput, label: string, props: { type?: string; placeholder: string }) => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={props.type ?? "text"}
        value={formData[name] ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        disabled={status === "loading"}
      />
      {fieldErrors[name] && <p className="mt-1 text-xs text-rose-400">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <PageShell size="md">
      <PageHeader
        title="Nous contacter"
        subtitle="Une question, une collaboration, un souci avec une commande ? On te répond rapidement."
      />

      {status === "success" ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-medium">Message envoyé !</p>
          <p className="mt-2 text-sm text-zinc-400">On a bien reçu ton message et on te répondra dans les meilleurs délais.</p>
          <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
            Envoyer un autre message
          </Button>
        </Card>
      ) : (
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Nom", { placeholder: "Ton nom" })}
              {field("email", "Email", { type: "email", placeholder: "toi@exemple.fr" })}
            </div>
            {field("subject", "Sujet", { placeholder: "Sujet (optionnel)" })}
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ton message"
                rows={6}
                disabled={status === "loading"}
              />
              {fieldErrors.message && <p className="mt-1 text-xs text-rose-400">{fieldErrors.message}</p>}
            </div>

            {status === "error" && (
              <p className="rounded-xl bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{errorMsg}</p>
            )}

            <Button type="submit" size="lg" fullWidth disabled={status === "loading"}>
              {status === "loading" ? "Envoi en cours…" : "Envoyer"}
            </Button>
          </form>
        </Card>
      )}
    </PageShell>
  );
};

export default Contact;
