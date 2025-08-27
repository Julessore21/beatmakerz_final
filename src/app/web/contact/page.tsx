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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-16 px-4">
      {/* Header */}
      <div className="max-w-3xl w-full text-center mb-5">
        <h1 className="text-6xl font-bold mb-4">NOUS CONTACTER</h1>
        <p className="text-l text-gray-400 -mt-1">
          Nous serions ravis de te lire. Contacte-nous pour toute question ou
          collaboration.
        </p>
      </div>

      {/* Formulaire de contact */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-black/80 border border-white/30 rounded-xl p-8 space-y-5"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold uppercase mb-2"
          >
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            className="w-full p-3 rounded-full bg-black border border-gray-600 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold uppercase mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Votre email"
            className="w-full p-3 rounded-full bg-black border border-gray-600 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-bold uppercase mb-2"
          >
            Sujet
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Sujet"
            className="w-full p-3 rounded-full bg-black border border-gray-600 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-bold uppercase mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Votre message"
            rows={5}
            className="w-full p-3 rounded-xl bg-black border border-gray-600 focus:outline-none focus:border-white transition-colors resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#2c1f57] text-white font-bold uppercase rounded-full hover:bg-[#1d143a] transition-colors duration-300"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Contact;
