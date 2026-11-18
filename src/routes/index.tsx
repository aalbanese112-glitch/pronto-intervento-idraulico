import { createFileRoute } from "@tanstack/react-router";
import { useState, type MouseEvent, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Bath,
  Check,
  CheckCheck,
  Clock3,
  Copy,
  Droplet,
  Flame,
  Info,
  MapPin,
  Phone,
  Settings2,
  ShieldCheck,
  Star,
  Wrench,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/plumber/brand";
import { WhatsappIcon } from "@/components/plumber/whatsapp-icon";
import { WorkGallery } from "@/components/plumber/work-gallery";
import { RequestForm } from "@/components/plumber/request-form";
import {
  business,
  buildRequestMessage,
  buildWhatsappMessage,
  GENERIC_IMPIANTO,
  getTelephoneUrl,
  getWhatsappUrl,
  reviews,
  services,
  towns,
  type ContactRequest,
} from "@/lib/plumber";
import heroImage from "@/assets/idraulico-lavoro.webp";
import heroMobileImage from "@/assets/idraulico-lavoro-mobile.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${business.name} | Idraulico a Bari — Pronto intervento 24h` },
      {
        name: "description",
        content:
          "Idraulico a Bari e nei paesi vicini. Riparazione perdite, disostruzione scarichi, caldaie e sanitari. Prezzi indicativi chiari e richieste su WhatsApp.",
      },
      {
        property: "og:title",
        content: `${business.name} — Idraulico a Bari, pronto intervento 24h`,
      },
      {
        property: "og:description",
        content:
          "Perdite, scarichi intasati o acqua fredda? Interventi idraulici a Bari e dintorni, con prezzo concordato prima del lavoro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const iconMap = {
  droplet: Droplet,
  waves: Waves,
  wrench: Wrench,
  flame: Flame,
  bath: Bath,
  settings: Settings2,
};

function Index() {
  const [selectedTown, setSelectedTown] = useState("Bari");
  const [initialImpianto, setInitialImpianto] = useState<string>(GENERIC_IMPIANTO);
  const [dialog, setDialog] = useState<"contact" | "privacy" | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const telephoneUrl = getTelephoneUrl(business.phone);

  function missingContact(event?: MouseEvent<HTMLAnchorElement>) {
    event?.preventDefault();
    setCopied(false);
    setDraftMessage("");
    setDialog("contact");
  }

  function selectTown(town: string) {
    setSelectedTown(town);
    document.getElementById("contatti")?.scrollIntoView({ behavior: "instant", block: "start" });
  }

  function selectService(service: (typeof services)[number]) {
    setInitialImpianto(service.impianto);
    document.getElementById("contatti")?.scrollIntoView({ behavior: "instant", block: "start" });
    document.getElementById("request-problem")?.focus({ preventScroll: true });
  }

  function submitRequest(request: ContactRequest) {
    const message = buildRequestMessage(request);
    const url = getWhatsappUrl(business.phone, message);
    if (!url) {
      setDraftMessage(message);
      setCopied(false);
      setDialog("contact");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(draftMessage);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function ContactLink({
    type,
    children,
    variant,
    className,
    impianto,
  }: {
    type: "call" | "whatsapp";
    children: ReactNode;
    variant: "call" | "whatsapp" | "heroOutline";
    className?: string;
    impianto?: string;
  }) {
    const whatsappUrl = getWhatsappUrl(
      business.phone,
      buildWhatsappMessage({ impianto, town: selectedTown }),
    );
    const href = telephoneUrl
      ? type === "call"
        ? telephoneUrl
        : whatsappUrl || "#contatti"
      : "#contatti";
    const ready = type === "call" ? Boolean(telephoneUrl) : Boolean(whatsappUrl);
    return (
      <Button asChild variant={variant} size="contact" className={className}>
        <a
          href={href}
          onClick={ready ? undefined : missingContact}
          target={type === "whatsapp" && whatsappUrl ? "_blank" : undefined}
          rel={type === "whatsapp" && whatsappUrl ? "noopener noreferrer" : undefined}
        >
          {type === "call" ? <Phone /> : <WhatsappIcon />}
          {children}
        </a>
      </Button>
    );
  }

  return (
    <>
      <a href="#contenuto" className="skip-link">
        Vai al contenuto
      </a>
      <header id="inizio" className="bg-background">
        <div className="site-container header-layout">
          <Brand />
          <nav className="header-navigation" aria-label="Navigazione principale">
            <a href="#servizi">Servizi e prezzi</a>
            <a href="#zona">Dove interveniamo</a>
            <a href="#lavori">I nostri lavori</a>
          </nav>
          <div className="header-contact">
            <a
              className="header-phone"
              href={telephoneUrl || "#contatti"}
              onClick={telephoneUrl ? undefined : missingContact}
              aria-label={`Chiama ${business.name}: ${business.phoneDisplay}`}
            >
              <Phone className="size-5" strokeWidth={2.3} />
              {business.phoneDisplay}
            </a>
            <span className="availability">
              <span className="availability-dot" />
              Pronto intervento 24h
            </span>
          </div>
        </div>
      </header>

      <main id="contenuto">
        <section aria-labelledby="hero-title">
          <div className="hero">
            <picture>
              <source media="(max-width: 767px)" srcSet={heroMobileImage} />
              <img
                className="hero-photo"
                src={heroImage}
                alt="Idraulico al lavoro su tubazioni e valvole in un’abitazione, immagine illustrativa"
                width={1600}
                height={920}
                fetchPriority="high"
              />
            </picture>
            <div className="site-container hero-content">
              <p className="hero-eyebrow">
                <MapPin className="size-3.5" />
                Bari e provincia. Ci siamo, quando serve.
              </p>
              <h1 id="hero-title" className="hero-title">
                Idraulico a Bari<span className="sr-only"> — </span>
                <br />
                intervento in
                <br />
                <span className="text-amber">60 minuti.</span>
              </h1>
              <p className="hero-description">
                Una perdita, uno scarico bloccato, l’acqua fredda?
                <br className="hidden md:block" /> Ci pensiamo noi. Lavori fatti bene e prezzi
                chiari.
              </p>
              <div className="hero-actions">
                <ContactLink type="whatsapp" variant="call">
                  Scrivici su WhatsApp
                  <ArrowRight className="size-4" />
                </ContactLink>
                <ContactLink type="call" variant="heroOutline" className="hidden md:inline-flex">
                  Chiama adesso
                </ContactLink>
              </div>
              <p className="hero-reassurance hidden md:flex">
                <ShieldCheck className="size-4 text-amber shrink-0" />
                Il prezzo lo concordiamo prima di iniziare. Sempre.
              </p>
              <p className="mt-3 max-w-105 text-xs text-on-ink-muted">
                Arrivo in 60 minuti indicativo, da confermare per zona e disponibilità.
              </p>
            </div>
            <span className="hero-caption">Immagine illustrativa</span>
          </div>
          <div className="trust-strip">
            <div className="site-container trust-items">
              <div className="trust-item">
                <Clock3 className="trust-icon" />
                <div>
                  <strong>Disponibili 24 ore su 24</strong>
                  <span>Anche di notte e nei festivi</span>
                </div>
              </div>
              <div className="trust-item">
                <CheckCheck className="trust-icon" />
                <div>
                  <strong>Prezzi chiari, da subito</strong>
                  <span>Nessuna sorpresa a fine lavoro</span>
                </div>
              </div>
              <div className="trust-item">
                <Wrench className="trust-icon" />
                <div>
                  <strong>Un lavoro fatto come si deve</strong>
                  <span>Rispetto per te e per la tua casa</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="servizi" className="section-space" aria-labelledby="services-title">
          <div className="site-container">
            <p className="section-kicker">Come possiamo aiutarti</p>
            <h2 id="services-title" className="section-heading">
              Il problema è tuo. La soluzione è nostra.
            </h2>
            <p className="section-description">
              Dalle piccole riparazioni alle urgenze. Ecco i lavori che facciamo tutti i giorni, con
              un’idea del prezzo di partenza.
            </p>
            <div className="service-grid">
              {services.map((service) => {
                const Icon = iconMap[service.icon];
                return (
                  <article key={service.id} className="service-card">
                    <span className="service-icon">
                      <Icon className="size-6" strokeWidth={1.7} />
                    </span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="service-card-bottom">
                      <span className="service-price">
                        da <strong>{service.price} €</strong>
                      </span>
                      <Button
                        variant="service"
                        size="smallIcon"
                        aria-label={`Richiedi: ${service.title}`}
                        title={`Richiedi ${service.title.toLowerCase()}`}
                        onClick={() => selectService(service)}
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="price-note">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Prezzi orientativi da confermare. Ricambi, IVA e maggiorazioni notturne o festive da
                definire nel preventivo.
              </span>
            </p>
          </div>
        </section>

        <section id="zona" className="area-section section-space" aria-labelledby="area-title">
          <div className="site-container area-layout">
            <div>
              <p className="section-kicker">Vicini a casa tua</p>
              <h2 id="area-title" className="section-heading">
                A Bari e nei paesi qui intorno.
              </h2>
              <p className="section-description">
                Interveniamo in tutti i quartieri di Bari, da Palese a Torre a Mare, e nei comuni
                vicini. Dicci dove sei: ti confermiamo subito quando possiamo arrivare.
              </p>
              <p className="area-note">
                <MapPin className="size-4 shrink-0 text-whatsapp" />
                La tua zona non è nell’elenco? Chiedici comunque.
              </p>
            </div>
            <div className="town-grid" aria-label="Paesi coperti">
              {towns.map((town) => (
                <Button key={town} variant="town" size="town" onClick={() => selectTown(town)}>
                  {town}
                  <ArrowRight className="size-3.5 shrink-0" />
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section id="lavori" className="section-space" aria-labelledby="works-title">
          <div className="site-container">
            <p className="section-kicker">Meno parole, più fatti</p>
            <h2 id="works-title" className="section-heading">
              Il nostro lavoro, da vicino.
            </h2>
            <p className="section-description">
              Tubazioni in ordine, finiture curate e la casa pulita quando andiamo via. È così che
              ci piace lavorare.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Foto illustrative in attesa delle foto dei lavori reali dell’attività.
            </p>
            <WorkGallery />
          </div>
        </section>

        <section
          id="recensioni"
          className="reviews-section section-space"
          aria-labelledby="reviews-title"
        >
          <div className="site-container">
            <p className="section-kicker">La fiducia si guadagna</p>
            <h2 id="reviews-title" className="section-heading">
              Le parole di chi ci ha chiamato.
            </h2>
            <p className="mt-3 text-xs text-muted-foreground">
              Testimonianze d’esempio, da sostituire con recensioni autentiche prima della
              pubblicazione.
            </p>
            <div className="review-grid">
              {reviews.map((review) => (
                <article className="review-card" key={review.name}>
                  <div className="review-stars" aria-label="5 stelle, recensione d’esempio">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="review-quote">“{review.text}”</blockquote>
                  <div className="review-person">
                    <span className="review-avatar" aria-hidden="true">
                      {review.initials}
                    </span>
                    <div>
                      <strong>{review.name}</strong>
                      <small>{review.town}</small>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contatti" className="section-space" aria-labelledby="contact-title">
          <div className="site-container contact-layout">
            <div>
              <p className="section-kicker">Parliamone, senza impegno</p>
              <h2 id="contact-title" className="section-heading">
                Raccontaci cosa succede.
                <br />
                Al resto pensiamo noi.
              </h2>
              <p className="section-description">
                Lascia il tuo nome, il numero e due righe sul problema. Ti rispondiamo su WhatsApp
                con disponibilità e un primo preventivo.
              </p>
              <ul className="contact-points">
                <li>
                  <Check className="size-4 text-whatsapp shrink-0" />
                  Nessun impegno, nessuna sorpresa
                </li>
                <li>
                  <Check className="size-4 text-whatsapp shrink-0" />
                  Puoi mandarci anche una foto su WhatsApp
                </li>
                <li>
                  <Check className="size-4 text-whatsapp shrink-0" />
                  Per un’urgenza, meglio una telefonata
                </li>
              </ul>
              <a
                className="contact-phone"
                href={telephoneUrl || "#contatti"}
                onClick={telephoneUrl ? undefined : missingContact}
              >
                <Phone className="size-6" />
                {business.phoneDisplay}
              </a>
              {!telephoneUrl && (
                <p className="text-xs text-muted-foreground">Numero dell’attività da inserire.</p>
              )}
            </div>
            <RequestForm
              town={selectedTown}
              initialImpianto={initialImpianto}
              onSubmit={submitRequest}
            />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-container">
          <div className="footer-layout">
            <div>
              <Brand footer />
              <p className="footer-text mt-4">
                Bari e provincia.
                <br />
                Artigiani nel lavoro, persone nel servizio.
              </p>
            </div>
            <div>
              <h2 className="footer-title">Quando ci trovi</h2>
              <p className="footer-text">
                {business.regularHours}
                <br />
                <span className="text-amber">Pronto intervento 24h · Tutti i giorni</span>
                <br />
                <span className="text-xs">Orari ordinari da confermare</span>
              </p>
            </div>
            <div>
              <h2 className="footer-title">Parla direttamente con noi</h2>
              <a
                href={telephoneUrl || "#contatti"}
                onClick={telephoneUrl ? undefined : missingContact}
                className="flex items-center gap-2 text-lg font-bold"
              >
                <Phone className="size-4" />
                {business.phoneDisplay}
              </a>
              <p className="footer-text mt-2">P.IVA: {business.vat}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 {business.name} · Nome e dati attività provvisori</span>
            <Button variant="footer" onClick={() => setDialog("privacy")}>
              Informativa privacy
            </Button>
          </div>
        </div>
      </footer>

      <nav className="mobile-contact-bar" aria-label="Contatti rapidi">
        <ContactLink type="call" variant="call">
          Chiama ora
        </ContactLink>
        <ContactLink type="whatsapp" variant="whatsapp">
          WhatsApp
        </ContactLink>
      </nav>

      <Dialog.Root
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="lightbox-overlay" />
          <Dialog.Content className="lightbox-content">
            <Dialog.Title className="lightbox-heading pr-12">
              {dialog === "privacy" ? "Informativa privacy" : "Recapito da confermare"}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-base text-muted-foreground">
              {dialog === "privacy"
                ? "I dati inseriti nel modulo vengono usati esclusivamente per comporre il messaggio da inviare su WhatsApp. Questo sito non li archivia e non li invia automaticamente. Sei tu a decidere se inviare il messaggio."
                : "Il numero di telefono dell’attività non è stato ancora inserito. Chiamate e invio su WhatsApp saranno disponibili appena verrà confermato."}
            </Dialog.Description>
            {dialog === "privacy" && (
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>
                  Aprendo WhatsApp si applicano l’informativa e le condizioni del servizio. I
                  caratteri del sito vengono caricati da Google Fonts, che riceve i dati tecnici
                  necessari alla richiesta.
                </p>
                <p>
                  Titolare e recapiti per le richieste relative ai dati: da completare con i dati
                  effettivi dell’attività prima della pubblicazione.
                </p>
              </div>
            )}
            {dialog === "contact" && draftMessage && (
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold">Il tuo messaggio è pronto</h3>
                  <Button
                    variant="outline"
                    size="smallIcon"
                    onClick={copyMessage}
                    aria-label={copied ? "Messaggio copiato" : "Copia messaggio"}
                    title={copied ? "Copiato" : "Copia messaggio"}
                  >
                    {copied ? <Check /> : <Copy />}
                  </Button>
                </div>
                <p className="mt-3 whitespace-pre-wrap border-l-2 border-primary pl-4 text-sm">
                  {draftMessage}
                </p>
                {copied && (
                  <p role="status" className="mt-2 text-xs text-whatsapp">
                    Messaggio copiato.
                  </p>
                )}
              </div>
            )}
            <Dialog.Close asChild>
              <Button
                variant="lightbox"
                size="smallIcon"
                className="lightbox-close"
                aria-label="Chiudi finestra"
              >
                <X />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
