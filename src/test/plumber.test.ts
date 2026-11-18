import { describe, expect, it } from "vitest";
import {
  buildRequestMessage,
  business,
  getTelephoneUrl,
  getWhatsappUrl,
  normalizePhone,
  services,
  towns,
  validateRequest,
} from "@/lib/plumber";

describe("Plumber contact actions", () => {
  const request = {
    name: " Alessio ",
    phone: "333 123 4567",
    problem: " Perdita sotto il lavello ",
    town: "Modugno",
  };

  it("prepares a WhatsApp message with name, telephone and problem", () => {
    const message = buildRequestMessage(request);
    const url = new URL(getWhatsappUrl("+39 080 123 4567", message));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/390801234567");
    expect(url.searchParams.get("text")).toBe(
      "Buongiorno, sono Alessio.\nVorrei richiedere un intervento idraulico a Modugno.\nIl mio numero è 333 123 4567.\nProblema: Perdita sotto il lavello\nPotete indicarmi disponibilità e costo indicativo? Grazie.",
    );
  });

  it("uses Bari if no other town was selected", () => {
    expect(
      buildRequestMessage({ name: request.name, phone: request.phone, problem: request.problem }),
    ).toContain("intervento idraulico a Bari.");
  });

  it("produces clickable telephone links with the Italian prefix", () => {
    expect(getTelephoneUrl("080 123 4567")).toBe("tel:+390801234567");
    expect(normalizePhone("0039 080 123 4567")).toBe("390801234567");
    expect(normalizePhone("+39 333 123 4567")).toBe("393331234567");
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

  it("offers exactly six services with a starting price", () => {
    expect(services).toHaveLength(6);
    expect(services.every((service) => service.price > 0)).toBe(true);
  });

  it("offers exactly twelve distinct nearby towns", () => {
    expect(towns).toHaveLength(12);
    expect(new Set(towns).size).toBe(12);
  });
});
