"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ici tu pourras brancher ton API d’envoi (EmailJS, API backend, etc.)
    alert("Message envoyé !");
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* halos subtils en arrière-plan */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.12),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-2xl" />

      <div className="relative z-10 flex flex-col items-center pt-28 pb-16 px-4">
        {/* Header */}
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Nous contacter
          </h1>
          <p className="mt-3 text-neutral-400">
            Nous serions ravis de te lire. Contacte-nous pour toute question ou collaboration.
          </p>
        </div>

        {/* Formulaire de contact */}
        <form
          onSubmit={handleSubmit}
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
              placeholder="Votre nom"
              className="w-full h-11 md:h-12 rounded-xl bg-white/[0.04] text-white placeholder:text-neutral-500/80 px-4 md:px-5 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none transition"
              required
            />
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
              placeholder="Votre email"
              className="w-full h-11 md:h-12 rounded-xl bg-white/[0.04] text-white placeholder:text-neutral-500/80 px-4 md:px-5 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-neutral-300">
              Sujet
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Sujet"
              className="w-full h-11 md:h-12 rounded-xl bg-white/[0.04] text-white placeholder:text-neutral-500/80 px-4 md:px-5 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none transition"
              required
            />
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
              placeholder="Votre message"
              rows={5}
              className="w-full min-h-[7rem] rounded-xl bg-white/[0.04] text-white placeholder:text-neutral-500/80 px-4 md:px-5 py-3 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none transition resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 md:h-12 rounded-full bg-white text-black font-medium tracking-wide hover:bg-neutral-200 active:scale-[.99] transition ring-1 ring-inset ring-white/20 shadow-[0_10px_30px_-15px_rgba(255,255,255,0.4)]"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
