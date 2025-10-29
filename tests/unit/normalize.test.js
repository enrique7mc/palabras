import { describe, it, expect } from "vitest";
import { normalize } from "../../script.js";

describe("normalize", () => {
  it("removes accents from Spanish characters", () => {
    expect(normalize("café")).toBe("CAFE");
    expect(normalize("NIÑO")).toBe("NINO");
    expect(normalize("María")).toBe("MARIA");
    expect(normalize("José")).toBe("JOSE");
    expect(normalize("Ángel")).toBe("ANGEL");
  });

  it("converts to uppercase", () => {
    expect(normalize("mundo")).toBe("MUNDO");
    expect(normalize("perro")).toBe("PERRO");
    expect(normalize("GATO")).toBe("GATO");
  });

  it("handles mixed case and accents", () => {
    expect(normalize("CaSa")).toBe("CASA");
    expect(normalize("árBOL")).toBe("ARBOL");
  });

  it("preserves Ñ character", () => {
    expect(normalize("NIÑO")).toBe("NINO");
    expect(normalize("año")).toBe("ANO");
  });

  it("handles empty string", () => {
    expect(normalize("")).toBe("");
  });
});
