import React, { useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import { SITE_CONFIG } from "@/config/site.config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BorderBeam } from "@/components/ui/border-beam";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export function ContactConsole() {
  const { isFr } = useLocale();

  const [topic, setTopic] = useState<"general" | "bug" | "other">("general");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const topics = [
    { id: "general", label: isFr ? "Question générale" : "General Inquiry" },
    { id: "bug", label: isFr ? "Signaler un bug" : "Report a Bug" },
    { id: "other", label: isFr ? "Partenariat / Autre" : "Partnership / Other" },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !message.trim()) {
      toast.error(
        isFr
          ? "Veuillez renseigner votre email et votre message."
          : "Please provide both your email and a message."
      );
      return;
    }

    // Determine target recipient based on topic
    const recipient = SITE_CONFIG.emails.contact;
    const finalSubject = `[${topic.toUpperCase()}] ${subject.trim() || (isFr ? "Demande EverydayTools" : "EverydayTools Inquiry")}`;
    const bodyContent = `${message}\n\n---\nDe: ${email}\nSujet: ${topic}`;

    // Open user's default email client
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(bodyContent)}`;
    if (typeof window !== "undefined") {
      window.location.href = mailtoUrl;
    }

    setSubmitted(true);
    toast.success(
      isFr
        ? "Votre message a été préparé dans votre messagerie !"
        : "Your inquiry was prepared in your email client!"
    );
  };

  return (
    <div className="relative w-full rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 sm:p-8 shadow-[var(--shadow-card)] overflow-hidden">
      {/* Magic UI BorderBeam accent on container edge */}
      <BorderBeam
        size={120}
        duration={8}
        colorFrom="var(--accent)"
        colorTo="var(--text-secondary)"
        borderWidth={1.5}
      />

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-1.5">
            {isFr ? "Formulaire de message direct" : "Direct Message Console"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isFr
              ? "Remplissez ce formulaire pour préparer votre demande avec les bons éléments de contexte."
              : "Complete the fields below to dispatch your inquiry directly."}
          </p>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center gap-3">
            <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              {isFr ? "Message préparé !" : "Message Prepared!"}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {isFr
                ? "Si votre client email ne s'est pas ouvert automatiquement, écrivez-nous directement à "
                : "If your email client didn't open automatically, write directly to "}
              <a
                href={`mailto:${SITE_CONFIG.emails.contact}`}
                className="underline font-mono text-foreground hover:text-[var(--accent)]"
              >
                {SITE_CONFIG.emails.contact}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setMessage("");
                setSubject("");
              }}
              className="mt-4 text-xs font-medium text-[var(--accent)] hover:underline"
            >
              {isFr ? "Envoyer un autre message" : "Send another message"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Topic selector */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground font-medium">
                {isFr ? "Objet de votre démarche" : "Reason for contact"}
              </Label>
              <div
                role="group"
                aria-label={isFr ? "Objet de votre démarche" : "Reason for contact"}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              >
                {topics.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={topic === item.id}
                    onClick={() => setTopic(item.id)}
                    className={`h-9 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer select-none text-center ${
                      topic === item.id
                        ? "bg-foreground text-background border-foreground shadow-xs"
                        : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">
                {isFr ? "Votre adresse email" : "Your email address"}
              </Label>
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                required
                className="h-10 text-sm font-sans"
              />
            </div>

            {/* Subject input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-subject">
                {isFr ? "Sujet ou outil concerné" : "Subject or related tool"}
              </Label>
              <Input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  isFr
                    ? "ex: Problème avec PDF Compress, suggestion..."
                    : "e.g. Issue with PDF Compress, feature idea..."
                }
                className="h-10 text-sm font-sans"
              />
            </div>

            {/* Message input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">
                {isFr ? "Votre message" : "Your message"}
              </Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={
                  isFr
                    ? "Expliquez précisément votre demande ou votre problème..."
                    : "Explain clearly your question or report..."
                }
                required
                className="min-h-28 text-sm font-sans resize-y"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end">
              <InteractiveHoverButton type="submit">
                {isFr ? "Envoyer le message" : "Send message"}
              </InteractiveHoverButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
