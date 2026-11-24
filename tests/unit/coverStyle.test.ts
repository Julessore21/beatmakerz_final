import { describe, expect, it } from "vitest";
import { coverStyleOf, seedOf } from "@/lib/coverStyle";

describe("style des pochettes", () => {
  it("reconnaît les genres et leurs variantes", () => {
    const id = (g: string[]) => coverStyleOf(g).id;
    expect(id(["UK Drill"])).toBe("drill");
    expect(id(["Trap"])).toBe("trap");
    expect(id(["Lo-fi"])).toBe("lofi");
    expect(id(["Lofi"])).toBe("lofi");
    expect(id(["RnB"])).toBe("rnb");
    expect(id(["R&B"])).toBe("rnb");
    expect(id(["Old School"])).toBe("boombap");
    expect(id(["Boom bap"])).toBe("boombap");
    expect(id(["Afro trap"])).toBe("afro");
    expect(id(["Cloud"])).toBe("cloud");
    expect(id(["Rage"])).toBe("rage");
  });

  it("le premier genre décide (« Emo, Trap » est emo ; « Trap, Emo » est trap)", () => {
    expect(coverStyleOf(["Emo", "Trap"]).id).toBe("emo");
    expect(coverStyleOf(["Trap", "Emo"]).id).toBe("trap");
  });

  it("sans genre connu, le style de la marque", () => {
    expect(coverStyleOf([]).id).toBe("default");
    expect(coverStyleOf(undefined).id).toBe("default");
    expect(coverStyleOf(["Expérimental"]).id).toBe("default");
  });

  it("chaque prod a sa variante, toujours la même", () => {
    expect(seedOf("b1")).toBe(seedOf("b1"));
    expect(seedOf("b1")).not.toBe(seedOf("b2"));
    expect(seedOf("b1")).toBeGreaterThanOrEqual(0);
    expect(seedOf("b1")).toBeLessThan(1);
  });
});
