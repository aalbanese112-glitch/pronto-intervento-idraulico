export const business = {
  name: "IDRO BARI",
  city: "Bari",
  phone: "",
  phoneDisplay: "080 XXX XXXX",
  vat: "Da inserire",
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
  },
  {
    id: "scarichi",
    title: "Disostruzione scarichi",
    description:
      "Lavandino, doccia o WC intasato? Liberiamo lo scarico e rimettiamo tutto in funzione.",
    price: 80,
    icon: "waves",
  },
  {
    id: "rubinetti",
    title: "Rubinetti e miscelatori",
    description:
      "Sostituzione e riparazione di rubinetti in cucina e in bagno, senza perdite e sprechi.",
    price: 50,
    icon: "wrench",
  },
  {
    id: "caldaie",
    title: "Caldaie e scaldabagni",
    description:
      "Acqua fredda o caldaia in blocco? Controllo del guasto e ripristino dell’acqua calda.",
    price: 90,
    icon: "flame",
  },
  {
    id: "sanitari",
    title: "Sanitari e cassette WC",
    description: "Ripariamo scarichi che continuano a scorrere e sostituiamo sanitari e cassette.",
    price: 70,
    icon: "bath",
  },
  {
    id: "impianti",
    title: "Impianti e manutenzione",
    description:
      "Piccoli e grandi lavori su impianti idraulici, termosifoni e collegamenti della casa.",
    price: 100,
    icon: "settings",
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

export type ContactRequest = { name: string; phone: string; problem: string; town?: string };
export type ContactErrors = Partial<Record<"name" | "phone" | "problem", string>>;

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (phone.trim().startsWith("00")) return digits.slice(2);
  if (phone.trim().startsWith("+")) return digits;
  return `39${digits}`;
}

export function getTelephoneUrl(phone: string): string | undefined {
  const number = normalizePhone(phone);
  return number ? `tel:+${number}` : undefined;
}

export function getWhatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function buildRequestMessage(request: ContactRequest): string {
  return [
    `Buongiorno, sono ${request.name.trim()}.`,
    `Vorrei richiedere un intervento idraulico a ${request.town || business.city}.`,
    `Il mio numero è ${request.phone.trim()}.`,
    `Problema: ${request.problem.trim()}`,
    "Potete indicarmi disponibilità e costo indicativo? Grazie.",
  ].join("\n");
}

export function validateRequest(request: ContactRequest): ContactErrors {
  const errors: ContactErrors = {};
  if (request.name.trim().length < 2) errors.name = "Inserisci il tuo nome.";
  const phone = request.phone.replace(/[\s()+.-]/g, "");
  if (!/^\d{6,15}$/.test(phone)) errors.phone = "Inserisci un numero di telefono valido.";
  if (request.problem.trim().length < 5) errors.problem = "Raccontaci brevemente il problema.";
  return errors;
}
