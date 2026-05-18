"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { contactSchema, type ContactInput } from "@/schemas/forms/contactSchema";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_FORM: ContactInput = { name: "", email: "", subject: "", message: "" };

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactInput>(EMPTY_FORM);
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

  const inputClass = "w-full h-11 md:h-12 rounded-xl bg-white/[0.04] text-white placeholder:text-neutral-500/80 px-4 md:px-5 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none transition";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.12),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-2xl" />

      <div className="relative z-10 flex flex-col items-center pt-28 pb-16 px-4">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Nous contacter
          </h1>
          <p className="mt-3 text-neutral-400">
            Nous serions ravis de te lire. Contacte-nous pour toute question ou collaboration.
          </p>
        </div>

        {status === "success" ? (
          <div className="mt-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
            <p className="text-lg font-medium text-white">Message envoyé !</p>
            <p className="mt-2 text-neutral-400 text-sm">
              On a bien reçu ton message et on te répondra dans les meilleurs délais.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 px-6 h-10 rounded-full border border-white/20 text-sm text-white hover:bg-white/10 transition"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-neutral-300">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Votre nom"
                className={inputClass}
                disabled={status === "loading"}
              />
              {fieldErrors.name && <p className={errorClass}>{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-neutral-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Votre email"
                className={inputClass}
                disabled={status === "loading"}
              />
              {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-neutral-300">
                Sujet
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Sujet"
                className={inputClass}
                disabled={status === "loading"}
              />
              {fieldErrors.subject && <p className={errorClass}>{fieldErrors.subject}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-neutral-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Votre message"
                rows={5}
                className="w-full min-h-[7rem] rounded-xl bg-white/[0.04] text-white placeholder:text-neutral-500/80 px-4 md:px-5 py-3 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none transition resize-none"
                disabled={status === "loading"}
              />
              {fieldErrors.message && <p className={errorClass}>{fieldErrors.message}</p>}
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-11 md:h-12 rounded-full bg-white text-black font-medium tracking-wide hover:bg-neutral-200 active:scale-[.99] transition ring-1 ring-inset ring-white/20 shadow-[0_10px_30px_-15px_rgba(255,255,255,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {status === "loading" ? "Envoi en cours…" : "Envoyer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
