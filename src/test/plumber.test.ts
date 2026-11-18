import { describe, expect, it } from "vitest";
import {
  buildRequestMessage,
  buildWhatsappMessage,
  business,
  GENERIC_IMPIANTO,
  getTelephoneUrl,
  getWhatsappUrl,
  isValidWhatsappNumber,
  normalizePhone,
  services,
  towns,
  validateRequest,
} from "@/lib/plumber";

describe("WhatsApp links", () => {
  it("builds the standard message with the plant and the town", () => {
    expect(buildWhatsappMessage({ impianto: "la caldaia", town: "Modugno" })).toBe(
      "Buongiorno, ho un problema con la caldaia a Modugno. Potete intervenire oggi?",
    );
  });

  it("falls back to the generic plant and to Bari", () => {
    expect(buildWhatsappMessage()).toBe(
      "Buongiorno, ho un problema con l’impianto idraulico a Bari. Potete intervenire oggi?",
    );
    expect(buildWhatsappMessage({ impianto: "  ", town: "" })).toContain(GENERIC_IMPIANTO);
  });

  it("uses wa.me/39NUMERO?text= with the number in digits only", () => {
    const url = new URL(
      getWhatsappUrl("+39 080 123 4567", buildWhatsappMessage({ town: "Bitonto" })) || "",
    );
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/390801234567");
    expect(url.pathname).toMatch(/^\/39\d+$/);
    expect(url.searchParams.get("text")).toBe(
      "Buongiorno, ho un problema con l’impianto idraulico a Bitonto. Potete intervenire oggi?",
    );
  });

  it("normalizes every written form to digits with the 39 prefix", () => {
    expect(normalizePhone("333 123 4567")).toBe("393331234567");
    expect(normalizePhone("+39 333 123 4567")).toBe("393331234567");
    expect(normalizePhone("0039 080 123 4567")).toBe("390801234567");
    expect(normalizePhone("(080) 123-4567")).toBe("390801234567");
    expect(isValidWhatsappNumber("39 333 123 4567")).toBe(true);
  });

  it("does not build a WhatsApp link without a real number", () => {
    expect(getWhatsappUrl("", buildWhatsappMessage())).toBeUndefined();
    expect(getWhatsappUrl("080 XXX XXXX", buildWhatsappMessage())).toBeUndefined();
    expect(isValidWhatsappNumber("12345")).toBe(false);
  });
});

describe("Form request", () => {
  const request = {
    name: " Alessio ",
    phone: "333 123 4567",
    problem: " Perde acqua sotto il lavello della cucina ",
    town: "Modugno",
    impianto: "una perdita d’acqua",
  };

  it("opens with the standard sentence and keeps the customer data", () => {
    expect(buildRequestMessage(request)).toBe(
      "Buongiorno, ho un problema con una perdita d’acqua a Modugno. Potete intervenire oggi?\n" +
        "\n" +
        "Nome: Alessio\n" +
        "Telefono: 333 123 4567\n" +
        "Dettagli: Perde acqua sotto il lavello della cucina",
    );
  });

  it("uses Bari and the generic plant when nothing was picked", () => {
    const message = buildRequestMessage({
      name: request.name,
      phone: request.phone,
      problem: request.problem,
    });
    expect(message.startsWith("Buongiorno, ho un problema con l’impianto idraulico a Bari.")).toBe(
      true,
    );
  });
});

describe("Plumber site data", () => {
  const request = {
    name: " Alessio ",
    phone: "333 123 4567",
    problem: " Perdita sotto il lavello ",
    town: "Modugno",
  };

  it("produces clickable telephone links with the Italian prefix", () => {
    expect(getTelephoneUrl("080 123 4567")).toBe("tel:+390801234567");
  });

  it("does not invent a contact number when it is missing", () => {
    expect(getTelephoneUrl("")).toBeUndefined();
  });

  it("requires a name before preparing the request", () => {
    expect(validateRequest({ ...request, name: "" }).name).toBeDefined();
    expect(validateRequest(request).name).toBeUndefined();
  });

  it("rejects invalid telephone numbers", () => {
    expect(validateRequest({ ...request, phone: "abc" }).phone).toBeDefined();
    expect(validateRequest({ ...request, phone: "+39 080 1234567" }).phone).toBeUndefined();
  });

  it("requires a problem description", () => {
    expect(validateRequest({ ...request, problem: "" }).problem).toBeDefined();
    expect(validateRequest(request).problem).toBeUndefined();
  });

  it("shows the eleven-digit VAT number supplied by the business", () => {
    expect(business.vat).toBe("00000000000");
    expect(/^\d{11}$/.test(business.vat)).toBe(true);
  });

  it("offers exactly six services, each with a plant phrase and a starting price", () => {
    expect(services).toHaveLength(6);
    expect(services.every((service) => service.price > 0)).toBe(true);
    expect(services.every((service) => service.impianto.length > 3)).toBe(true);
  });

  it("offers exactly twelve distinct nearby towns", () => {
    expect(towns).toHaveLength(12);
    expect(new Set(towns).size).toBe(12);
  });
});
