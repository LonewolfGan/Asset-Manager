import React from "react";
import { SITE_CONFIG } from "@/config/site.config";
import { useLocale } from "@/hooks/use-locale";
import { CopyButton } from "@/components/ui/copy-button";
import { Mail, ShieldCheck, Lock, ArrowUpRight } from "lucide-react";

interface ChannelItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  email: string;
}

export function ContactDirectChannels() {
  const { isFr } = useLocale();

  const channels: ChannelItem[] = [
    {
      icon: Mail,
      title: isFr ? "Support & Retours" : "Support & Feedback",
      description: isFr
        ? "Questions sur un convertisseur, bugs rencontrés ou suggestions de fonctionnalités."
        : "Questions about any converter, bug reports, or feature suggestions.",
      email: SITE_CONFIG.emails.contact,
    },
    {
      icon: ShieldCheck,
      title: isFr ? "Sécurité & Vulnérabilités" : "Security & Vulnerabilities",
      description: isFr
        ? "Signalement responsable d'anomalie de sécurité conformément au standard RFC 9116."
        : "Responsible vulnerability disclosure aligned with RFC 9116 standard.",
      email: SITE_CONFIG.emails.security,
    },
    {
      icon: Lock,
      title: isFr ? "Vie Privée & RGPD" : "Privacy & Data Protection",
      description: isFr
        ? "Exercice de vos droits d'accès, de rectification ou interrogations sur nos flux de données."
        : "Exercising your privacy rights, data inquiries, or compliance questions.",
      email: SITE_CONFIG.emails.privacy,
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-2">
          {isFr ? "Canaux d'accès direct" : "Direct Channels"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isFr
            ? "Vous préférez votre client de messagerie habituel ? Écrivez-nous directement sur le canal dédié."
            : "Prefer your own email client? Reach out directly using our dedicated addresses."}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.email}
              className="group flex flex-col gap-2 pb-6 border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    {channel.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`mailto:${channel.email}`}
                    className="inline-flex items-center justify-center size-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title={isFr ? "Ouvrir dans votre messagerie" : "Open in mail client"}
                    aria-label={isFr ? `Écrire à ${channel.email}` : `Email ${channel.email}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                  <CopyButton
                    text={channel.email}
                    variant="ghost"
                    size="icon"
                    className="size-8"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pl-10.5">
                {channel.description}
              </p>

              <div className="pl-10.5">
                <a
                  href={`mailto:${channel.email}`}
                  className="font-mono text-xs text-foreground/80 hover:text-[var(--accent)] transition-colors underline-offset-2 hover:underline"
                >
                  {channel.email}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
