import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import tapImage from "@/assets/lavoro-rubinetto.webp";
import boilerImage from "@/assets/lavoro-caldaia.webp";
import drainImage from "@/assets/lavoro-scarico.webp";
import toiletImage from "@/assets/lavoro-sanitari.webp";
import showerImage from "@/assets/lavoro-doccia.webp";
import manifoldImage from "@/assets/lavoro-collettore.webp";

const works = [
  {
    image: tapImage,
    title: "Sostituzione miscelatore",
    place: "Bagno · rubinetteria",
    alt: "Miscelatore cromato montato su un lavabo bianco",
  },
  {
    image: boilerImage,
    title: "Installazione caldaia",
    place: "Acqua calda · collegamenti",
    alt: "Caldaia a parete con collegamenti in rame ordinati",
  },
  {
    image: drainImage,
    title: "Riparazione scarico cucina",
    place: "Cucina · sifone e tubazioni",
    alt: "Sifone e flessibili sotto il lavello della cucina",
  },
  {
    image: toiletImage,
    title: "Montaggio sanitari",
    place: "Bagno · WC sospeso",
    alt: "WC sospeso bianco su parete piastrellata",
  },
  {
    image: showerImage,
    title: "Rifacimento doccia",
    place: "Bagno · doccia e sigillature",
    alt: "Doccia con asta cromata, vetro e piastrelle chiare",
  },
  {
    image: manifoldImage,
    title: "Collettore riscaldamento",
    place: "Impianto · distribuzione",
    alt: "Collettore di riscaldamento con valvole rosse e blu",
  },
];

export function WorkGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const active = selected === null ? undefined : works[selected];

  return (
    <>
      <div className="gallery-grid">
        {works.map((work, index) => (
          <figure key={work.title}>
            <Button
              variant="photo"
              size="photo"
              onClick={() => setSelected(index)}
              aria-label={`Ingrandisci: ${work.title}`}
            >
              <span className="work-image-wrap block">
                <img
                  src={work.image}
                  alt={work.alt}
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="work-image"
                />
                <span className="work-open">
                  <ArrowUpRight className="size-4" />
                </span>
              </span>
            </Button>
            <figcaption>
              <span className="work-title">{work.title}</span>
              <span className="work-location">
                <MapPin className="size-3 shrink-0" />
                {work.place}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <Dialog.Root
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="lightbox-overlay" />
          <Dialog.Content className="lightbox-content">
            {active && (
              <>
                <img
                  src={active.image}
                  alt={active.alt}
                  width={640}
                  height={640}
                  className="lightbox-image"
                />
                <Dialog.Title className="lightbox-heading">{active.title}</Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  Foto illustrativa: sarà sostituita con un lavoro autentico dell’attività.
                </Dialog.Description>
              </>
            )}
            <Dialog.Close asChild>
              <Button
                variant="lightbox"
                size="smallIcon"
                className="lightbox-close"
                aria-label="Chiudi foto"
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
