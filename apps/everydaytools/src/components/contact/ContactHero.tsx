import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { PageTitle, PageSubtitle } from "@/components/Typography";
import { useLocale } from "@/hooks/use-locale";

export function ContactHero() {
  const { isFr } = useLocale();

  const title = isFr ? "Contact & Assistance" : "Contact & Support";
  const description = isFr
    ? "Une question sur un outil, une suggestion d'amélioration ou un problème rencontré ? Écrivez-nous directement, nous vous répondons sous 24h ouvrées."
    : "Have a question about a tool, a feature request, or an issue to report? Reach out directly and we will get back to you within 24 business hours.";

  return (
    <>
      <Breadcrumb items={[isFr ? "Accueil" : "home", "Contact"]} />
      <div className="mt-4 mb-12 sm:mb-14 lg:mb-16">
        <PageTitle>{title}</PageTitle>
        <PageSubtitle>{description}</PageSubtitle>
      </div>
    </>
  );
}
