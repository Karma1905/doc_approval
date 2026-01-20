import { describe, it, expect } from "vitest";
import { parseFile } from "../services/parser.service.js";

describe("Parser Service", () => {
  it("extracts image, title and content correctly", async () => {
    const fakeFile = {
      mimetype: "text/plain",
      buffer: Buffer.from(
        "![cover](image.png)\nMy Title\nThis is the document body."
      ),
    };

    const result = await parseFile(fakeFile);

    expect(result.imageUrl).toBe("![cover](image.png)");
    expect(result.title).toBe("My Title");
    expect(result.content).toBe("This is the document body.");
  });

  it("throws error for empty file", async () => {
    const fakeFile = {
      mimetype: "text/plain",
      buffer: Buffer.from(""),
    };

    await expect(parseFile(fakeFile)).rejects.toThrow();
  });
});
