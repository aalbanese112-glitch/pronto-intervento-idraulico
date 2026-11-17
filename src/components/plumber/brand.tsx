import { Droplets } from "lucide-react";
import { business } from "@/lib/plumber";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#inizio"
      className={`brand${footer ? " footer-brand" : ""}`}
      aria-label={`${business.name}, inizio pagina`}
    >
      <span className="brand-mark">
        <Droplets className="size-6" strokeWidth={1.8} />
      </span>
      <span>
        <span className="brand-name block">{business.name}</span>
        <span className="brand-tagline block">Il tuo idraulico di fiducia</span>
      </span>
    </a>
  );
}
