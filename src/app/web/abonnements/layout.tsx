import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abonnements",
  description: "Accès mensuel à nos prods, économise avec les formules INFINI.",
  alternates: { canonical: "/web/abonnements" },
  openGraph: {
    title: "Abonnements | Beatmakerz",
    url: "/web/abonnements",
  },
};

// Prix identiques à ceux affichés sur la page (page.tsx).
const PLANS = [
  { name: "INFINI", monthly: "19.99", yearly: "199.99", prods: 4 },
  { name: "INFINI +", monthly: "39.99", yearly: "399.99", prods: 10 },
  { name: "INFINI X", monthly: "59.99", yearly: "599.99", prods: 15 },
];

const structuredData = PLANS.map((plan) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: `Abonnement ${plan.name}`,
  description: `${plan.prods} prods par mois, 100% royalty free.`,
  brand: { "@type": "Brand", name: "Beatmakerz" },
  offers: [
    {
      "@type": "Offer",
      name: `${plan.name} mensuel`,
      price: plan.monthly,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: `${plan.name} annuel`,
      price: plan.yearly,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  ],
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
