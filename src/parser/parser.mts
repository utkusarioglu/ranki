import type {
  CollectionRenderFields,
  FieldList,
} from "../types/collection.mjs";
import type { WindowRankiConfig } from "../config/config.d.mjs";
import type {
  ParserPartWoContent,
  ParserField,
  ParserKind,
  Stack,
  ParserGroup,
  ParserGroupFrame,
  ParserKindFrame,
  Tags,
  ParserKindFrameTableContent,
  ParserKindFrameDlContent,
  ParserKindFrameListContent,
  ParserKindTextWoParts,
  ParseFieldLineParams1,
  ParserPart,
  ParserKindText,
  ParserPartFlavorFrame,
  ContentCommon,
  TableParts,
  ContentCommonWoParts,
  TableComplete,
  DlItemRawOnly,
  DlItemWithParts,
  DlItemWithTags,
  ListItemsRaw,
  ListItemsComplete,
  TableHeaderOrData,
} from "./parser.types.mts";

/**
 * @dev
 * Fields are the text areas in anki
 * `groups` are the larger structures in a field, like a code block or a line of text.
 * `group line` is a single line that goes inside a group.
 */
export class Parser {
  private ranki: WindowRankiConfig;

  constructor(ranki: WindowRankiConfig) {
    this.ranki = ranki;
  }

  /**
   * @dev
   * #1 Checks if the trimmed line starts with a frame token but doesn't
   * contain another token to close the frame. If it has a second frame token
   * that closes the frame, then it would be an inline frame, which is dealt
   * with after the lines are parsed into sections.
   *
   * #2 A trimmed line being empty doesn't necessarily mean that the line is
   * empty. It may have spaces and this may be relevant. Maybe for warning the
   * user that there are redundant spaces in the field.
   *
   * #3 This level ignores comments inside frames. These are parsed by the
   * relevant frame parser.
   */
  _parseFieldLine({ stack, groups }: ParseFieldLineParams1, line: string) {
    const tokens = this.ranki.tokens;
    const isStackEmpty = stack.length === 0;
    const prev = [...groups].reverse().find((s) => s.type !== "comment");
    const hasPrev = prev !== undefined;

    if (!hasPrev && !isStackEmpty) {
      throw new Error("Has no prev section but has stack");
    }

    const trimmed = line.trim();
    const isEmpty = trimmed === "";
    const isComment = trimmed.startsWith(tokens.comment);
    const frameStart =
      trimmed.startsWith(tokens.frame) &&
      trimmed.length > tokens.frame.length &&
      null ===
        trimmed.match(
          new RegExp([tokens.frame, "(.*?)", tokens.frame].join(""), "g"),
        ); // #1
    const frameEnd = trimmed === tokens.frame;
    const listSeparated = trimmed === tokens.listItemSeparator;

    if (isComment) {
      // #3
      if (!isStackEmpty) {
        if (!prev) {
          throw new Error(
            "There is no previous entry but the stack is not empty",
          );
        }
        prev.lines.push(line);
      } else {
        groups.push({
          type: "comment",
          lines: [line],
        });
      }
    } else if (isEmpty) {
      if (!isStackEmpty) {
        if (!prev) {
          throw new Error(
            "There is no previous entry but the stack is not empty",
          );
        }
        prev.lines.push("");
      } else {
        groups.push({
          type: "empty",
          lines: [line], // #2
        });
      }
    } else if (frameStart) {
      if (!isStackEmpty) {
        throw new Error("Frame start before the previous has ended");
      }

      const frameLine = trimmed.slice(tokens.frame.length);
      const frameDescription = frameLine.split(tokens.terminator);

      if (frameDescription.length > 2) {
        throw new Error(
          [
            "Frame description line can at most contain two parts.",
            "One for frame type and one for frame flavor. Ex: coding language.",
          ].join(""),
        );
      }

      const [rawTags, rawParams] = frameDescription;
      const tags = rawTags
        .trim()
        .split(tokens.child)
        .map((v) => v.trim());
      const params = rawParams
        ? rawParams
            .trim()
            .split(tokens.parameter)
            .map((v) => v.trim())
        : [];
      stack.push(tags.join(" "));
      groups.push({
        type: "frame",
        tags,
        params,
        isComplete: false,
        lines: [],
      });
    } else if (frameEnd) {
      if (isStackEmpty) {
        throw new Error("Frame end received before frame start");
      }
      if (!prev) {
        throw new Error(
          "There is no previous entry but the stack is not empty",
        );
      }
      stack.pop();
      // @ts-ignore: trivial state
      prev.isComplete = true;
    } else if (listSeparated) {
      if (isStackEmpty) {
        throw new Error("List separator received while not in frame");
      }
      if (!hasPrev) {
        throw new Error(
          "List separator given while a list isn't being being populated.",
        );
      }

      const isLastOfListType = ["ol", "ul"].includes(stack.at(-1) as string);
      if (!isLastOfListType) {
        throw new Error("Current stack is not a list");
      }

      prev.lines.push(line);
    } else if (!isStackEmpty) {
      if (!prev) {
        throw new Error(
          "There is no previous entry but the stack is not empty",
        );
      }
      prev.lines.push(line);
    } else if (prev && prev.type === "text") {
      prev.lines.push(line);
    } else {
      groups.push({
        type: "text",
        lines: [line],
      });
    }

    return { stack, groups };
  }

  /**
   * Replaces phrases defined in `config.replacements` with the given
   * replacement strings.
   *
   * This was designed for replacing html encoding such as `&lt;` with `<` but
   * was expanded in purpose for any string sequence that may need to be
   * replaced
   */
  _replaceStrings(line: string): string {
    for (const [find, replace] of this.ranki.replacements) {
      line = line.replaceAll(find, replace);
    }
    return line;
  }

  /**
   * @dev
   * #1 Type `FieldName` needs to be reevaluated once more card types are
   * introduced.
   */
  _parseFieldAsGroup(field: FieldList): ParserGroup[] {
    const fieldName = field.name;
    // @ts-ignore: #1
    const fieldContent: string = this.ranki.content[fieldName];

    const lines = fieldContent.split("\n");
    let stack: Stack = [];
    let groups: ParserGroup[] = [];

    const customError = (e: Error, line: string) => {
      e.message = [
        e.message,
        "Line:",
        line,
        "Stack:",
        JSON.stringify(stack, null, 2),
        "current sections:",
        JSON.stringify(groups, null, 2),
      ].join("\n");

      return e;
    };

    for (const line of lines) {
      try {
        ({ stack, groups } = this._parseFieldLine({ stack, groups }, line));
      } catch (e) {
        throw customError(e as Error, line);
      }
    }

    return groups;
  }

  /**
   * @dev
   * #1 h1, h2 etc
   *
   * #2 Designed this way to give easier access for previous following groups.
   */
  _parseTextGroup(group: ParserGroup): ParserKindText[] {
    const tokens = this.ranki.tokens;

    // const type = group.type
    const astPartial: ParserKindTextWoParts[] = [];

    for (let li = 0; li < group.lines.length; li++) {
      // #2
      const line = this._replaceStrings(group.lines[li]);
      const trimmed = line.trim();

      const headingIndex = trimmed.indexOf(tokens.heading);
      const headingLevel = headingIndex + 1; // #1
      const isHeading = headingLevel > 0 && headingLevel < 7;

      if (isHeading) {
        const headless = trimmed.slice(
          headingIndex + tokens.heading.length - 1,
        );
        const isCentered = headless.startsWith(tokens.centeredText);
        astPartial.push({
          type: "text",
          kind: "heading",
          content: [
            {
              params: {
                level: headingLevel,
                isCentered,
              },
              raw: headless.trim(),
            },
          ],
        });
      } else {
        const isCentered = line.startsWith(tokens.centeredText);
        const prev = astPartial.at(-1);
        const isPrevParagraph = prev && prev.kind === "paragraph";

        if (isPrevParagraph) {
          prev.content.push({
            params: {
              isCentered: false,
            },
            raw: "\n",
          });
          prev.content.push({
            params: {
              isCentered,
            },
            raw: trimmed,
          });
        } else {
          astPartial.push({
            type: "text",
            kind: "paragraph",
            content: [
              {
                params: {
                  isCentered,
                },
                raw: trimmed,
              },
            ],
          });
        }
      }
    }

    const ast = astPartial as ParserKindText[];
    for (const { content } of ast) {
      for (const line of content) {
        line.parts = this._parseLines(line);
      }
    }

    return ast;
  }

  _parseLines(line: ContentCommonWoParts) {
    const partsWoContent = this._parseLineParts(
      line.raw,
    ) as ParserPartWoContent[];
    const parts = partsWoContent as ParserPart[];
    for (let pi = 0; pi < parts.length; pi++) {
      if (parts[pi].flavor === "frame") {
        parts[pi].content = this._parseInlineFrame(parts[pi].part);
      } else {
        parts[pi].content = parts[pi].part;
      }
    }

    return parts;
  }

  /**
   * Parses inline text, distinguishes between frames and plain text.
   * You need to call _parseInlineFrame on the frame flavors to parse the frames
   */
  _parseLineParts(raw: string): ParserPartWoContent[] {
    const tokens = this.ranki.tokens;
    const trimmed = raw.trim();
    const matches = ` ${trimmed} `.match(
      new RegExp(
        [
          " ",
          tokens.frame,
          "(.*?)",
          tokens.frame,
          `[${tokens.inlineFrameAllowedEndCharacters.join("")}]`,
        ].join(""),
        "g",
      ),
    );

    if (!matches) {
      return [
        {
          flavor: "plain",
          part: raw,
          // content: raw,
        },
      ];
    }

    const parts: ParserPartWoContent[] = [];
    let curr = raw;
    matches.forEach((match) => {
      const trimmedMatch = match.slice(1, -1);
      const pre = curr.slice(0, curr.indexOf(trimmedMatch));
      const after = curr.slice(pre.length + trimmedMatch.length);
      curr = after;

      if (pre.trim() !== "") {
        parts.push({
          flavor: "plain",
          part: pre,
          // content: pre,
        });
      }

      parts.push({
        flavor: "frame",
        part: trimmedMatch,
        // content: null,
      });
    });

    if (curr.trim() !== "") {
      parts.push({
        flavor: "plain",
        part: curr,
        // content: curr,
      });
    }

    return parts;
  }

  _parseInlineFrame(frame: ParserPartFlavorFrame["part"]) {
    const tokens = this.ranki.tokens;
    const raw = frame.slice(tokens.frame.length, -tokens.frame.length);
    const split = raw.split(tokens.terminator);

    const getTags = (str: string) =>
      str
        .trim()
        .split(tokens.child)
        .map((v) => v.trim());
    const getParams = (str: string) =>
      str
        .trim()
        .split(tokens.parameter)
        .map((v) => v.trim());
    const getContent = (str: string) => str.trim();

    switch (split.length) {
      case 2:
        return {
          tags: getTags(split[0]),
          params: [],
          isComplete: true,
          lines: [getContent(split[1])],
        };

      case 3:
        return {
          tags: getTags(split[0]),
          params: getParams(split[1]),
          isComplete: true,
          lines: [getContent(split[2])],
        };

      default:
        throw new Error(
          [
            "Inline frame requires 2 or 3 sections: ",
            "type",
            "params (optional)",
            "content",
          ].join("\n"),
        );
    }
  }

  _getAssignmentString(str: string) {
    return `${str}${this.ranki.tokens.assignment}`;
  }

  _getAssignment(tokenName: keyof typeof this.ranki.tokens) {
    const tokens = this.ranki.tokens;
    return [tokens[tokenName], tokens.assignment, " "].join("");
  }

  _parseCsv(line: string) {
    const tokens = this.ranki.tokens;

    return line
      .split(tokens.assignment)[1]
      .trim()
      .split(tokens.terminator)
      .map((l) =>
        l.split(tokens.parameter).map((v) => ({
          raw: v.trim(),
        })),
      );
  }

  _parseTag(line: string) {
    const tokens = this.ranki.tokens;

    return this._parseCsv(line).map((r) =>
      r.map((c) => c.raw.split(tokens.child).map((v) => v.trim())),
    );
  }
  /**
   * @dev
   * #1 This uses `any` because the type does not matter. But it does matter
   * that it's a 2D array;
   */
  _parseTableFrameGroup(group: ParserGroup): ParserKindFrameTableContent {
    const tokens = this.ranki.tokens;

    const parseSingleLine = (line: string) =>
      line.split(tokens.parameter).map((v) => v.trim());

    const checkInconsistentColumnLength = (
      partName: string,
      // #1
      part: any[][],
    ) => {
      if (part.some((row) => row.length !== part[0].length)) {
        throw new Error(`Inconsistent sized columns in ${partName}`);
      }
    };

    const expandTags = (
      values: ContentCommon[][],
      tags: Tags[][],
      defaultTag: string,
    ): Tags[][] => {
      if (values.length !== tags.length && tags.length > 1) {
        throw new Error(
          [
            `Tag row length inconsistent`,
            "Values:",
            JSON.stringify(values),
            "Tags:",
            JSON.stringify(values),
          ].join("\n"),
        );
      }

      if (
        tags.length > 0 &&
        values[0].length !== tags[0].length &&
        tags[0].length !== 1
      ) {
        throw new Error(
          [
            `Tag column length inconsistent`,
            "Values:",
            JSON.stringify(values[0], null, 2),
            "Tags:",
            JSON.stringify(tags[0], null, 2),
          ].join("\n"),
        );
      }

      if (tags.length === 0) {
        return values.map((r) => r.map((_) => [defaultTag]));
      }

      if (tags.length === 1) {
        if (tags[0].length === 1) {
          return Array(values.length).fill(
            Array(values[0].length).fill(tags[0][0]),
          );
        } else {
          return Array(values.length).fill(tags[0]);
        }
      } else {
        return tags;
      }
    };

    const wrapTags = (
      values: ContentCommon[][],
      tags: Tags[][],
    ): TableHeaderOrData[][] => {
      const merged = [];
      for (let ri = 0; ri < values.length; ri++) {
        const row = [];
        for (let ci = 0; ci < values[0].length; ci++) {
          row.push({
            tag: tags[ri][ci],
            ...values[ri][ci],
          });
        }
        merged.push(row);
      }
      return merged;
    };

    const parts: TableParts = {
      head: {
        defaultTag: "th",
        tags: [],
        values: [],
      },
      body: {
        defaultTag: "td",
        tags: [],
        values: [],
      },
      foot: {
        defaultTag: "th",
        tags: [],
        values: [],
      },
    };

    for (const line of group.lines.map((l) => this._replaceStrings(l))) {
      const trimmed = line.trim();
      const isEmpty = trimmed === "";
      const isComment = trimmed.startsWith(tokens.comment);

      if (isEmpty || isComment) {
        continue;
      } else if (trimmed.startsWith(this._getAssignment("tableHeads"))) {
        parts.head.values = this._parseCsv(trimmed);
      } else if (trimmed.startsWith(this._getAssignment("tableHeadTags"))) {
        parts.head.tags = this._parseTag(trimmed);
      } else if (trimmed.startsWith(this._getAssignment("tableFoots"))) {
        parts.foot.values = this._parseCsv(trimmed);
      } else if (trimmed.startsWith(this._getAssignment("tableFootTags"))) {
        parts.foot.tags = this._parseTag(trimmed);
      } else if (trimmed.startsWith(this._getAssignment("tableBodyTags"))) {
        parts.body.tags = this._parseTag(trimmed);
      } else {
        parts.body.values.push(
          parseSingleLine(trimmed).map((raw) => ({ raw })),
        );
      }
    }

    Object.entries(parts).forEach(([name, { values, tags }]) => {
      checkInconsistentColumnLength(`${name}.values`, values);
      checkInconsistentColumnLength(`${name}.tags`, tags);
    });

    const complete = parts as TableComplete;
    [complete.foot.values, complete.body.values, complete.head.values].forEach(
      (items) => {
        for (let ri = 0; ri < items.length; ri++) {
          const row = items[ri];

          for (let ci = 0; ci < row.length; ci++) {
            items[ri][ci].parts = this._parseLines(items[ri][ci]);
          }
        }
      },
    );

    const parsedTable = Object.entries(complete).reduce(
      (acc, [name, { tags, values, defaultTag }]) => {
        type Name = keyof typeof complete;
        if (!values.length) {
          acc[name as Name] = [];
          return acc;
        }
        const expandedTags = expandTags(values, tags, defaultTag);
        acc[name as Name] = wrapTags(values, expandedTags);
        return acc;
      },
      {} as ParserKindFrameTableContent,
    );

    return parsedTable;
  }

  _parseListFrameGroup(group: ParserGroup): ParserKindFrameListContent[] {
    const tokens = this.ranki.tokens;
    let tag: Tags = ["li"];

    const itemsRaw: ListItemsRaw[] = [];
    for (const line of group.lines.map((l) => this._replaceStrings(l))) {
      const trimmed = line.trim();
      const isEmpty = trimmed === "";
      const isComment = trimmed.startsWith(tokens.comment);

      if (isEmpty || isComment) {
        continue;
      } else if (trimmed.startsWith(this._getAssignment("listTags"))) {
        // tag = this._parseTag(line)
        tag = trimmed
          .split(tokens.assignment)[1]
          .trim()
          .split(tokens.parameter)
          .map((v) => v.trim());
      } else if (trimmed === tokens.listItemSeparator) {
        const prev = itemsRaw.at(-1);
        if (!prev) {
          continue;
        }

        prev.isComplete = true;
        // prev.lines.push({
        //   raw: trimmed,
        // });
      } else if (trimmed.startsWith(`${tokens.listItemSeparator} `)) {
        itemsRaw.push({
          isComplete: false,
          lines: [
            {
              raw: trimmed.slice(tokens.listItemSeparator.length + 1).trim(),
            },
          ],
        });
      } else if (!itemsRaw.length) {
        itemsRaw.push({
          isComplete: false,
          lines: [
            {
              raw: trimmed,
            },
          ],
        });
      } else if (itemsRaw.length && itemsRaw.at(-1)?.isComplete === true) {
        itemsRaw.push({
          isComplete: false,
          lines: [
            {
              raw: trimmed,
            },
          ],
        });
      } else {
        const prev = itemsRaw.at(-1);
        prev?.lines.push({
          raw: trimmed,
        });
      }
    }

    const itemsComplete = itemsRaw as ListItemsComplete[];
    for (const item of itemsComplete) {
      for (const line of item.lines) {
        line.parts = this._parseLines(line);
      }
    }

    return itemsComplete.map(({ lines }) => ({ tag, lines }));
  }

  /**
   * @dev
   * #1 visit this later, it may be an oversight
   */
  _parseDlFrameGroup(group: ParserGroup): ParserKindFrameDlContent[] {
    const tokens = this.ranki.tokens;

    const itemsPartial: DlItemRawOnly[] = [];
    const tags = {
      dt: ["dt"],
      dd: ["dd"],
    };

    for (const line of group.lines.map((l) => this._replaceStrings(l))) {
      const trimmed = line.trim();
      const isEmpty = trimmed === "";
      const isComment = trimmed.startsWith(tokens.comment);

      if (isEmpty || isComment) {
        continue;
      } else if (trimmed.startsWith(tokens.dlDtTags)) {
        // tags.dt = this._parseTag(trimmed);
      } else if (trimmed.startsWith(tokens.dlDdTags)) {
        // tags.dd = this._parseTag(trimmed);
      } else if (trimmed.startsWith(tokens.heading)) {
        itemsPartial.push({
          title: [
            {
              raw: trimmed.slice(tokens.heading.length).trim(),
            },
          ],
          lines: [],
        });
      } else {
        if (!itemsPartial.length) {
          throw new Error("DD before dd");
        }

        // @ts-ignore #1
        itemsPartial.at(-1).lines.push({
          raw: trimmed,
        });
      }
    }

    for (let ii = 0; ii < itemsPartial.length; ii++) {
      itemsPartial[ii].title = itemsPartial[ii].title[0].raw
        .split(tokens.parameter)
        .map((v) => ({
          raw: v.trim(),
        }));
    }

    const itemsWithParts = itemsPartial as DlItemWithParts[];
    for (const item of itemsWithParts) {
      for (const title of item.title) {
        title.parts = this._parseLines(title);
      }
      for (const line of item.lines) {
        line.parts = this._parseLines(line);
      }
    }

    const itemsWithTags = itemsWithParts as DlItemWithTags[];
    for (const item of itemsWithTags) {
      for (const title of item.title) {
        title.tags = tags.dt;
      }
      for (const line of item.lines) {
        line.tags = tags.dd;
      }
    }

    return itemsWithTags;
  }

  _replaceStringsOnly(group: ParserGroupFrame) {
    return group.lines.map((line) => this._replaceStrings(line));
  }

  /**
   * @dev
   * #1 This algo doesn't group `<strong>` items, it just pops them side by
   * side. If this function becomes more consequential, then this algorithm can
   * be switched with one that checks if the previous char is also strong.
   */
  _parseMnemonicGroup(group: ParserGroupFrame) {
    const line = this._replaceStrings(group.lines.join(" - "));
    let parsed = "";
    for (const char of line) {
      const charCode = char.charCodeAt(0);
      if (charCode > 64 && charCode < 91) {
        parsed += `<strong>${char}</strong>`; // #1
      } else {
        parsed += char;
      }
    }
    return [parsed];
  }

  _parseAsGroup(group: ParserGroupFrame) {
    const tokens = this.ranki.tokens;
    const defaults = this.ranki.audioSynthesis.defaults;
    const parseNote = (line: string) => {
      const params = line.split(tokens.parameter).map((param) => param.trim());
      const step = parseInt(params[0]);
      const amplitude =
        params[1] !== undefined ? parseFloat(params[1]) : defaults.amplitude;
      const waveform = params[2] || defaults.waveform;

      return {
        step,
        waveform,
        amplitude,
      };
    };

    return group.lines.map((line) => parseNote(line));
  }

  /**
   * @dev
   * #1 This case falls through. this is intentional, pre code, pre and code
   * share the same logic
   */
  _parseFrameGroup(group: ParserGroupFrame): ParserKindFrame {
    const singleLineOnly = (group: ParserGroupFrame, kind: string) => {
      if (group.lines.length > 1) {
        throw new Error(`${kind} frames cannot have more than 1 line`);
      }
    };

    const kind = group.tags.join(" ");
    switch (kind) {
      case "ignore":
        return {
          ...group,
          kind,
          content: group.lines.join("\n"),
        };

      case "as":
        return {
          ...group,
          kind,
          content: this._parseAsGroup(group),
        };

      // #1
      case "code":
        singleLineOnly(group, kind);

      case "pre":
      case "pre code":
        return {
          ...group,
          kind,
          content: this._replaceStringsOnly(group),
        };

      case "ul":
      case "ol":
        return {
          ...group,
          kind,
          content: this._parseListFrameGroup(group),
        };

      case "dl":
        return {
          ...group,
          kind,
          content: this._parseDlFrameGroup(group),
        };

      case "table":
        return {
          ...group,
          kind,
          content: this._parseTableFrameGroup(group),
        };

      case "mnemonic":
        singleLineOnly(group, kind);
        return {
          ...group,
          kind,
          content: this._parseMnemonicGroup(group),
        };

      case "latex":
        return {
          ...group,
          kind,
          content: this._replaceStringsOnly(group),
        };

      case "output":
      case "note":
      case "path":

      default:
        throw new Error(`Unknown frame type: ${kind}`);
    }
  }

  _parseGroupsAsKinds(groups: ParserGroup[]): ParserKind[] {
    const ast: ParserKind[] = [];
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];

      switch (group.type) {
        case "comment":
        case "empty":
          break;

        case "frame":
          ast.push(this._parseFrameGroup(group));
          break;

        case "text":
          ast.push(...this._parseTextGroup(group));
          break;

        default:
          // @ts-ignore
          throw new Error(`Unrecognized group type: '${group.type}'`);
      }
    }

    return ast;
  }

  parseFields(fields: CollectionRenderFields): ParserField[] {
    return fields.map((field) => {
      const groups = this._parseFieldAsGroup(field);
      return {
        field: field,
        list: this._parseGroupsAsKinds(groups),
      };
    });
  }
}
