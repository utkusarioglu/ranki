import { readFileSync } from "node:fs";
import { Parser } from "./parser.mts";
import { rankiDefaults } from "../config/config.mts";
import type { WindowRankiConfig } from "../config/config.d.mjs";

const ul = readFileSync("./assets/test/ul.txt", { encoding: "utf-8" });

const rankiConfig: Omit<WindowRankiConfig, "content"> = {
  ...rankiDefaults,
  version: "v1",
  card: {
    deck: "deck",
    subdeck: "subdeck",
    tags: "tags",
    type: "type",
    flag: "flag",
    card: "card",
  },
};

describe("ul", () => {
  it("ul", () => {
    const parser = new Parser({
      ...rankiConfig,
      // @ts-ignore
      content: {
        "Front-Prompt-Pre": ul,
      },
    });

    const parsed = parser.parseFields([{ name: "Front-Prompt-Pre" }]);

    expect(parsed.length).toBe(1);
    expect(parsed[0].list.length).toBe(1);
    expect(parsed[0].list[0].kind).toBe("ul");
    expect(parsed[0].list[0].content.length).toBe(3);
    // expect(JSON.stringify(parsed[0].list, null, 2)).toBe("s");
  });
});

describe("paragraph", () => {
  const endingExpectations = (parsed) => {
    expect(parsed[0].list.length).toBe(1);
    expect(parsed[0].list[0].kind).toBe("paragraph");
    expect(parsed[0].list[0].content.length).toBe(1);
    // expect(parsed[0].list[0].content[0].parts.length).toBe(3);
    expect(
      parsed[0].list[0].content[0].parts.filter((v) => v.flavor === "frame")
        .length,
    ).toBe(1);
    expect(
      parsed[0].list[0].content[0].parts.filter((v) => v.flavor === "frame")[0]
        .part,
    ).toBe(":::code; bash; echo 'hi':::");
    expect(
      parsed[0].list[0].content[0].parts.filter((v) => v.flavor === "frame")[0]
        .content.lines.length,
    ).toBe(1);
    expect(
      parsed[0].list[0].content[0].parts.filter((v) => v.flavor === "frame")[0]
        .content.lines[0],
    ).toBe("echo 'hi'");
    expect(
      parsed[0].list[0].content[0].parts.filter((v) => v.flavor === "frame")[0]
        .content.params.length,
    ).toBe(1);
    expect(
      parsed[0].list[0].content[0].parts.filter((v) => v.flavor === "frame")[0]
        .content.params[0],
    ).toBe("bash");
  };

  describe("inline frame", () => {
    it("Accepts '::: ' ending", () => {
      const parser = new Parser({
        ...rankiConfig,
        content: {
          cat: `
          This has code :::code; bash; echo 'hi'::: within.
          `,
        },
      });
      const parsed = parser.parseFields([{ name: "cat" }]);
      endingExpectations(parsed);
    });

    it("Accepts ':::?' ending", () => {
      const parser = new Parser({
        ...rankiConfig,
        content: {
          cat: `
          This ends with a code and a question :::code; bash; echo 'hi':::?.
          `,
        },
      });
      const parsed = parser.parseFields([{ name: "cat" }]);
      endingExpectations(parsed);
    });

    it("Accepts ':::!' ending", () => {
      const parser = new Parser({
        ...rankiConfig,
        content: {
          cat: `
          This ends with a code and an exclamation :::code; bash; echo 'hi':::!.
          `,
        },
      });
      const parsed = parser.parseFields([{ name: "cat" }]);
      endingExpectations(parsed);
    });

    it("Accepts ':::.' ending", () => {
      const parser = new Parser({
        ...rankiConfig,
        content: {
          cat: `
          This ends with a code and a period :::code; bash; echo 'hi':::..
          `,
        },
      });
      const parsed = parser.parseFields([{ name: "cat" }]);
      endingExpectations(parsed);
    });
  });
});

describe("Frame without ending", () => {
  it("code", () => {
    const parser = new Parser({
      ...rankiConfig,
      // @ts-ignore
      content: {
        "Front-Prompt-Pre": [":::code; bash", 'echo "$cat"'].join("\n"),
      },
    });

    const parsed = parser.parseFields([{ name: "Front-Prompt-Pre" }]);

    expect(parsed[0].list[0].kind).toBe("code");
    expect(parsed[0].list[0].isComplete).toBe(false);
  });

  it("pre code", () => {
    const parser = new Parser({
      ...rankiConfig,
      // @ts-ignore
      content: {
        "Front-Prompt-Pre": [":::pre code; bash", 'echo "$cat"'].join("\n"),
      },
    });

    const parsed = parser.parseFields([{ name: "Front-Prompt-Pre" }]);

    expect(parsed[0].list[0].kind).toBe("pre code");
    expect(parsed[0].list[0].isComplete).toBe(false);
  });

  describe.only("Ignored frame", () => {
    it("RANKI_IGNORE 1", () => {
      const content = ["% RANKI_IGNORE", "the rest", "another rest"].join("\n");
      const parser = new Parser({
        ...rankiConfig,
        content: {
          // @ts-ignore
          F: content,
        },
      });
      const parsed = parser.parseFields([{ name: "F" }]);
      console.log(content);
      console.log(JSON.stringify(parsed, null, 2));
      expect(parsed.length).toBe(1);
      expect(parsed[0].type).toBe("ignore");
      expect(parsed[0].kind).toBe("ignore");
      expect(parsed[0].list).toBe(content);
    });
  });
});
