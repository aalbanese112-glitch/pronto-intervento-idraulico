import { describe, expect, it } from "vitest";
import {
  buildRequestMessage,
  buildWhatsappMessage,
  business,
  GENERIC_IMPIANTO,
  getTelephoneUrl,
  getWhatsappUrl,
  normalizePhone,
  services,
  towns,
  validateRequest,
} from "@/lib/plumber";

describe("WhatsApp demo links", () => {
  it("uses the click-to-chat link without any recipient", () => {
    const url = new URL(getWhatsappUrl(buildWhatsappMessage({ impianto: "la caldaia" })));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/");
    expect(url.href).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(url.href).not.toMatch(/wa\.me\/\d/);
  });

  it("keeps the standard sentence as the pre-written message", () => {
    const text = new URL(
      getWhatsappUrl(buildWhatsappMessage({ town: "Modugno" })),
    ).searchParams.get("text");
    expect(text).toBe(
      "Buongiorno, ho un problema con l’impianto idraulico a Modugno. Potete intervenire oggi?",
    );
  });

  it("writes the message exactly as supplied by the business", () => {
    expect(buildWhatsappMessage({ impianto: "la caldaia", town: "Brescia" })).toBe(
      "Buongiorno, ho un problema con la caldaia a Brescia. Potete intervenire oggi?",
    );
  });

  it("falls back to the generic plant and to Bari", () => {
    expect(buildWhatsappMessage()).toBe(
      "Buongiorno, ho un problema con l’impianto idraulico a Bari. Potete intervenire oggi?",
    );
    expect(buildWhatsappMessage({ impianto: "  ", town: "" })).toContain(GENERIC_IMPIANTO);
  });

  it("leaves the recipient empty even when the message holds a phone number", () => {
    const href = getWhatsappUrl(buildRequestMessage({ ...request }));
    expect(href.split("?")[0]).toBe("https://wa.me/");
    expect(new URL(href).pathname).toBe("/");
  });
});

describe("Form request", () => {
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
  it("produces clickable telephone links with the Italian prefix", () => {
    expect(getTelephoneUrl("080 123 4567")).toBe("tel:+390801234567");
    expect(normalizePhone("0039 080 123 4567")).toBe("390801234567");
    expect(normalizePhone("+39 333 123 4567")).toBe("393331234567");
  });

  it("does not invent a contact number when it is missing", () => {
    expect(getTelephoneUrl("")).toBeUndefined();
    expect(business.phone).toBe("");
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

const request = {
  name: " Alessio ",
  phone: "333 123 4567",
  problem: " Perde acqua sotto il lavello della cucina ",
  town: "Modugno",
  impianto: "una perdita d’acqua",
};
