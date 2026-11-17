import { useState, type FormEvent } from "react";
import { LockKeyhole, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "./whatsapp-icon";
import { validateRequest, type ContactErrors, type ContactRequest } from "@/lib/plumber";

export function RequestForm({
  town,
  initialProblem,
  onSubmit,
}: {
  town: string;
  initialProblem: string;
  onSubmit: (request: ContactRequest) => void;
}) {
  const [errors, setErrors] = useState<ContactErrors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const request = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      problem: String(data.get("problem") || ""),
      town,
    };
    const nextErrors = validateRequest(request);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      const input = event.currentTarget.elements.namedItem(first);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    onSubmit(request);
  }

  return (
    <form className="request-form" onSubmit={submit} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="form-label" htmlFor="request-name">
            Il tuo nome
          </label>
          <input
            className="form-input"
            id="request-name"
            name="name"
            placeholder="Nome e cognome"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p className="form-error" id="name-error">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label className="form-label" htmlFor="request-phone">
            Numero di telefono
          </label>
          <input
            className="form-input"
            id="request-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="Il tuo numero"
            autoComplete="tel"
            required
            maxLength={25}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p className="form-error" id="phone-error">
              {errors.phone}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="form-label" htmlFor="request-problem">
          Che problema hai?
        </label>
        <textarea
          key={initialProblem}
          className="form-input"
          id="request-problem"
          name="problem"
          placeholder="Es. Perde acqua sotto il lavello della cucina. Sono a Bari, zona Carrassi."
          defaultValue={initialProblem}
          required
          maxLength={2000}
          rows={4}
          aria-invalid={Boolean(errors.problem)}
          aria-describedby={errors.problem ? "problem-error" : undefined}
        />
        {errors.problem && (
          <p className="form-error" id="problem-error">
            {errors.problem}
          </p>
        )}
      </div>
      {town !== "Bari" && (
        <p className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="size-4 text-whatsapp" /> Intervento a {town}
        </p>
      )}
      <Button variant="whatsapp" size="contact" type="submit" className="request-submit w-full">
        <WhatsappIcon /> Invia richiesta su WhatsApp
      </Button>
      <p className="form-note">
        <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
        <span>
          Il messaggio si apre su WhatsApp: lo controlli e lo invii tu. Non salviamo i tuoi dati sul
          sito.
        </span>
      </p>
    </form>
  );
}
