export const business = {
  name: "IDRO BARI",
  city: "Bari",
  phone: "",
  phoneDisplay: "080 XXX XXXX",
  vat: "00000000000",
  regularHours: "Lun–Sab · 8:00–19:00",
  emergencyHours: "Pronto intervento · 24 ore su 24",
} as const;

export const towns = [
  "Modugno",
  "Bitonto",
  "Bitritto",
  "Valenzano",
  "Triggiano",
  "Capurso",
  "Adelfia",
  "Noicattaro",
  "Rutigliano",
  "Mola di Bari",
  "Giovinazzo",
  "Palo del Colle",
] as const;

export const services = [
  {
    id: "perdite",
    title: "Riparazione perdite",
    description:
      "Rubinetti che gocciolano, tubi rotti e infiltrazioni. Troviamo la perdita e la fermiamo.",
    price: 60,
    icon: "droplet",
    impianto: "una perdita d’acqua",
  },
  {
    id: "scarichi",
    title: "Disostruzione scarichi",
    description:
      "Lavandino, doccia o WC intasato? Liberiamo lo scarico e rimettiamo tutto in funzione.",
    price: 80,
    icon: "waves",
    impianto: "uno scarico intasato",
  },
  {
    id: "rubinetti",
    title: "Rubinetti e miscelatori",
    description:
      "Sostituzione e riparazione di rubinetti in cucina e in bagno, senza perdite e sprechi.",
    price: 50,
    icon: "wrench",
    impianto: "un rubinetto che perde",
  },
  {
    id: "caldaie",
    title: "Caldaie e scaldabagni",
    description:
      "Acqua fredda o caldaia in blocco? Controllo del guasto e ripristino dell’acqua calda.",
    price: 90,
    icon: "flame",
    impianto: "la caldaia",
  },
  {
    id: "sanitari",
    title: "Sanitari e cassette WC",
    description: "Ripariamo scarichi che continuano a scorrere e sostituiamo sanitari e cassette.",
    price: 70,
    icon: "bath",
    impianto: "la cassetta del WC",
  },
  {
    id: "impianti",
    title: "Impianti e manutenzione",
    description:
      "Piccoli e grandi lavori su impianti idraulici, termosifoni e collegamenti della casa.",
    price: 100,
    icon: "settings",
    impianto: "l’impianto idraulico di casa",
  },
] as const;

export const reviews = [
  {
    name: "Maria P.",
    initials: "MP",
    town: "Bari · Poggiofranco",
    text: "Una perdita sotto il lavello, proprio di domenica. È arrivato in poco tempo, mi ha spiegato il problema e sistemato tutto. Cucina lasciata pulita. Grazie!",
  },
  {
    name: "Giuseppe L.",
    initials: "GL",
    town: "Modugno",
    text: "Avevo lo scarico della doccia bloccato da giorni. Lavoro fatto bene e prezzo concordato prima di iniziare, senza sorprese. Lo richiamerò sicuramente.",
  },
  {
    name: "Anna R.",
    initials: "AR",
    town: "Valenzano",
    text: "Mi ha sostituito il miscelatore e riparato la cassetta del WC. Puntuale, gentile e preciso. Finalmente un artigiano che risponde al telefono.",
  },
] as const;

/** Frase usata quando l’impianto non è stato scelto: "ho un problema con l’impianto idraulico a Bari". */
export const GENERIC_IMPIANTO = "l’impianto idraulico";

export type ContactRequest = {
  name: string;
  phone: string;
  problem: string;
  town?: string;
  impianto?: string;
};
export type ContactErrors = Partial<Record<"name" | "phone" | "problem", string>>;

/** Restituisce il numero in sole cifre con prefisso 39, vuoto se non riconosciuto. */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8) return "";
  if (trimmed.startsWith("00")) return digits.slice(2);
  if (trimmed.startsWith("+")) return digits;
  return `39${digits}`;
}

export function isValidWhatsappNumber(phone: string): boolean {
  return /^39\d{8,13}$/.test(normalizePhone(phone));
}

export function getTelephoneUrl(phone: string): string | undefined {
  const number = normalizePhone(phone);
  return number ? `tel:+${number}` : undefined;
}

/**
 * Unico formato per tutti i link WhatsApp del sito:
 * https://wa.me/39NUMERO?text=... con il numero in sole cifre.
 */
export function getWhatsappUrl(phone: string, message: string): string | undefined {
  if (!isValidWhatsappNumber(phone)) return undefined;
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

/** Messaggio standard: "Buongiorno, ho un problema con [impianto] a [paese]. Potete intervenire oggi?" */
export function buildWhatsappMessage({
  impianto,
  town,
}: { impianto?: string | undefined; town?: string | undefined } = {}): string {
  const system = impianto?.trim() || GENERIC_IMPIANTO;
  const place = town?.trim() || business.city;
  return `Buongiorno, ho un problema con ${system} a ${place}. Potete intervenire oggi?`;
}

/** Messaggio del modulo: la frase standard in cima, poi i dati scritti dal cliente. */
export function buildRequestMessage(request: ContactRequest): string {
  const lines = [
    buildWhatsappMessage({ impianto: request.impianto, town: request.town }),
    "",
    `Nome: ${request.name.trim()}`,
    `Telefono: ${request.phone.trim()}`,
  ];
  const details = request.problem.trim();
  if (details) lines.push(`Dettagli: ${details}`);
  return lines.join("\n");
}

export function validateRequest(request: ContactRequest): ContactErrors {
  const errors: ContactErrors = {};
  if (request.name.trim().length < 2) errors.name = "Inserisci il tuo nome.";
  const phone = request.phone.replace(/[\s()+.-]/g, "");
  if (!/^\d{6,15}$/.test(phone)) errors.phone = "Inserisci un numero di telefono valido.";
  if (request.problem.trim().length < 5) errors.problem = "Raccontaci brevemente il problema.";
  return errors;
}
