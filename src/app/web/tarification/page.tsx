// src/app/web/tarification/page.tsx
import React from "react";

export default function Tarification() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Titre principal */}
        <h1 className="text-5xl font-bold text-center mt-[60px] mb-8">
          TARIFICATION
        </h1>

        {/* SECTION 1 : TARIFS UNITAIRES */}
        <Section
          title="Tarifs Des Instrumentales"
          items={[
            "Instrumentale à l'unité : 9,99€",
            "Instrumentale sur mesure : 59,99€",
            "Instrumentales via l'abonnement : sans coût supplémentaire",
          ]}
          description="Nous proposons une large gamme d'instrumentales de haute qualité adaptées à différents styles musicaux."
        />

        {/* SECTION 2 : INFINI */}
        <SubscriptionSection
          name="Infini"
          price="19,99€ / mois"
          annual="209,99€ / an"
          benefits={[
            "3 prods par mois + 1 offerte",
            "Téléchargement instantané",
            "20€ d'économie par mois",
          ]}
          reduction={null}
        />

        {/* SECTION 3 : INFINI + */}
        <SubscriptionSection
          name="Infini +"
          price="39,99€ / mois"
          annual="409,99€ / an"
          benefits={[
            "8 prods par mois + 2 offertes",
            "Téléchargement instantané",
            "Support prioritaire",
            "15% de réduction sur les prods sur mesure",
            "60€ d'économie par mois",
          ]}
        />

        {/* SECTION 4 : INFINI X */}
        <SubscriptionSection
          name="Infini X"
          price="59,99€ / mois"
          annual="599,99€ / an"
          benefits={[
            "12 prods par mois + 3 offertes",
            "Téléchargement instantané",
            "Support prioritaire",
            "30% de réduction sur les prods sur mesure",
            "90€ d'économie par mois",
          ]}
        />
      </div>
    </div>
  );
}

// 🔧 Composant Section générique
function Section({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <section className="mb-10">
      <div className="inline-block text-white py-1 rounded-full mb-4 font-bold text-2xl mt-10">
        <p className="underline">{title}</p>
      </div>
      <p className="mb-4">{description}</p>
      <ul className="list-disc list-inside ml-4 mb-4">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

// 🔧 Composant Section abonnement
function SubscriptionSection({
  name,
  price,
  annual,
  benefits,
  reduction,
}: {
  name: string;
  price: string;
  annual: string;
  benefits: string[];
  reduction?: string | null;
}) {
  return (
    <section className="mb-10">
      <div className="inline-block text-white py-1 rounded-full mb-4 font-bold text-2xl">
        <p className="underline">Abonnement Mensuel '{name}'</p>
      </div>
      <p className="mb-4">
        Pour les artistes qui souhaitent bénéficier de tarifs avantageux, nous
        offrons un abonnement mensuel appelé '{name}'.
      </p>
      <p className="mb-2 font-bold">
        – Abonnement mensuel '{name}' : {price}
      </p>
      <p className="mb-2">Les avantages de l'abonnement '{name}' incluent :</p>
      <ul className="list-disc list-inside ml-4 mb-4">
        {benefits.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <p className="font-bold mb-2">
        Comment souscrire à l'abonnement '{name}' ?
      </p>
      <ol className="list-decimal list-inside ml-4 mb-4">
        <li>Créez un compte utilisateur sur notre site.</li>
        <li>Accédez à la section Abonnement de votre compte.</li>
        <li>
          Sélectionnez l'option '{name}' et suivez les instructions pour
          compléter votre abonnement.
        </li>
      </ol>
      <p className="mb-2 font-bold">Conditions de l'abonnement</p>
      <ul className="list-disc list-inside ml-4 mb-4">
        <li>
          L'abonnement '{name}' est facturé mensuellement à hauteur de {price}{" "}
          ou annuellement {annual}.
        </li>
        <li>
          Vous pouvez annuler votre abonnement à tout moment depuis votre profil
          ou en nous contactant à{" "}
          <span className="font-bold">beatmakerz.contact@gmail.com</span>
        </li>
        <li>
          En cas d'annulation, vous continuerez à bénéficier des avantages de
          l'abonnement jusqu'à la fin de la période de facturation en cours.
        </li>
      </ul>
    </section>
  );
}
