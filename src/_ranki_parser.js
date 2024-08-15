/**
 * @dev
 * Fields are the text areas in anki
 * `groups` are the larger structures in a field, like a code block or a line of text.
 * `group line` is a single line that goes inside a group.
 */
export class Parser
{
  constructor(ranki)
  {
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
  _parseFieldLine({ stack, sections }, line)
  {
    const tokens = this.ranki.tokens;
    const isStackEmpty = stack.length === 0;
    const prev = [...sections].reverse().find((s) => s.type !== "comment");
    const hasPrev = prev !== undefined;

    if (!hasPrev && !isStackEmpty) {
      throw new Error("Has no prev section but has stack");
    }

    const trimmed = line.trim();
    const isEmpty = trimmed === "";
    const isComment = trimmed.startsWith(tokens.comment);
    const frameStart = trimmed.startsWith(tokens.frame)
      && trimmed.length > tokens.frame.length
      && null === trimmed.match(new RegExp([
        tokens.frame,
        "(.*?)",
        tokens.frame,
      ].join(""), "g")); // #1
    const frameEnd = trimmed === tokens.frame;
    const listItem = trimmed.startsWith(tokens.listItem);

    if (isComment) { // #3
      if (!isStackEmpty) {
        prev.lines.push(line);
      } else {
        sections.push({
          type: "comment",
          lines: [line]
        });
      }

    } else if (isEmpty) {
      if (!isStackEmpty) {
        prev.lines.push("");
      } else {
        sections.push({
          type: "empty",
          lines: [line] // #2
        });
      }

    } else if (frameStart) {
      if (!isStackEmpty) {
        throw new Error("Frame start before the previous has ended");
      }

      const frameLine = trimmed.slice(tokens.frame.length);
      const frameDescription = frameLine.split(tokens.terminator);

      if (frameDescription.length > 2) {
        throw new Error([
          "Frame description line can at most contain two parts.",
          "One for frame type and one for frame flavor. Ex: coding language."
        ].join(""));
      }

      const [rawTags, rawParams] = frameDescription;
      const tags = rawTags.trim().split(tokens.child).map((v) => v.trim());
      const params = rawParams
        ? rawParams.trim().split(tokens.param).map((v) => v.trim())
        : [];
      stack.push(tags.join(" "));
      sections.push({
        type: "frame",
        tags,
        params,
        isComplete: false,
        lines: []
      });

    } else if (frameEnd) {
      if (isStackEmpty) {
        throw new Error("Frame end received before frame start");
      }
      stack.pop();
      prev.isComplete = true;

    } else if (listItem) {
      if (isStackEmpty) {
        throw new Error("List item received while not in frame");
      }
      if (!hasPrev) {
        throw new Error("List item defined while there is no section to put it in.");
      }

      const isLastOfListType = ["ol", "ul"].includes(stack.at(-1));
      if (!isLastOfListType) {
        throw new Error("Current stack is not a list");
      }

      prev.lines.push(line);

    } else if (!isStackEmpty) {
      prev.lines.push(line);

    } else if (prev && prev.type === "text") {
      prev.lines.push(line);

    } else {
      sections.push({
        type: "text",
        lines: [line]
      });
    }

    return { stack, sections };
  }

  _parseField(field)
  {
    const fieldContent = this.ranki.content[field];
    const lines = fieldContent.split("\n");
    let stack = [];
    let groups = [];

    const customError = (e, line) =>
    {
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
        ({ stack, sections: groups } = this._parseFieldLine({ stack, sections: groups }, line));
      } catch (e) {
        throw customError(e, line);
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
  _parseTextGroup(group)
  {
    const tokens = this.ranki.tokens;
    const type = group.type;
    const ast = [];

    for (let li = 0; li < group.lines.length; li++) { // #2
      const line = group.lines[li];
      const trimmed = line.trim();

      const headingIndex = trimmed.indexOf(tokens.heading);
      const headingLevel = headingIndex + 1; // #1
      const isHeading = headingLevel > 0 && headingLevel < 7;

      if (isHeading) {
        const headless = trimmed.slice(headingIndex + tokens.heading.length - 1);
        const isCentered = headless.startsWith(tokens.centeredText);
        ast.push({
          type,
          kind: "heading",
          content: [
            {
              params: {
                level: headingLevel,
                isCentered,
              },
              raw: headless.trim(),
            }
          ],
        });

      } else {
        const isCentered = line.startsWith(tokens.centeredText);
        const prev = ast.at(-1);
        const isPrevParagraph = prev && prev.kind === "paragraph";

        if (isPrevParagraph) {
          prev.content.push({
            params: {},
            raw: "\n",
          });
          prev.content.push({
            params: {
              isCentered,
            },
            raw: trimmed,
          });
        } else {
          ast.push({
            type,
            kind: "paragraph",
            content: [
              {
                params: {
                  isCentered
                },
                raw: trimmed,
              }
            ]
          });
        }
      }
    }

    for (const { content } of ast) {
      for (const line of content) {
        line.parts = this._parseLines(line);
      }
    }

    return ast;
  }

  _parseLines(line)
  {
    let parts = this._parseLineParts(line.raw);
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
  _parseLineParts(raw)
  {
    const tokens = this.ranki.tokens;
    const trimmed = raw.trim();
    const matches = ` ${trimmed} `.match(new RegExp([
      " ",
      tokens.frame,
      "(.*?)",
      tokens.frame,
      " ",
    ].join(""), "g"));

    if (!matches) {
      return [{
        flavor: "plain",
        part: raw,
      }];
    }

    const parts = [];
    let curr = raw;
    matches.forEach((match) =>
    {
      const trimmedMatch = match.slice(1, -1);
      const pre = curr.slice(0, curr.indexOf(trimmedMatch));
      const after = curr.slice(pre.length + trimmedMatch.length);
      curr = after;

      if (pre.trim() !== "") {
        parts.push({
          flavor: "plain",
          part: pre,
          content: pre,
        });
      }

      parts.push({
        flavor: "frame",
        part: trimmedMatch,
        content: null,
      });
    });

    if (curr.trim() !== "") {
      parts.push({
        flavor: "plain",
        part: curr,
        content: curr,
      });
    }

    return parts;
  }

  _parseInlineFrame(frame)
  {
    const tokens = this.ranki.tokens;
    const raw = frame.slice(tokens.frame.length, -tokens.frame.length);
    const split = raw.split(tokens.terminator);

    const getTags = (str) => str.trim().split(tokens.child).map((v) => v.trim());
    const getParams = (str) => str.trim().split(tokens.parameter).map((v) => v.trim());
    const getContent = (str) => str.trim();

    switch (split.length) {
      case 2:
        return {
          tags: getTags(split[0]),
          params: [],
          isComplete: true,
          lines: [
            getContent(split[1])
          ]
        };

      case 3:
        return {
          tags: getTags(split[0]),
          params: getParams(split[1]),
          isComplete: true,
          lines: [
            getContent(split[2])
          ]
        };

      default:
        throw new Error([
          "Inline frame requires 2 or 3 sections: ",
          "type",
          "params (optional)",
          "content"
        ].join("\n"));
    }
  }

  _getAssignmentString(str)
  {
    return `${str}${this.ranki.tokens.assignment}`;
  }

  _getAssignment(tokenName)
  {
    const tokens = this.ranki.tokens;
    return [tokens[tokenName], tokens.assignment, " "].join("");
  }

  _parseCsv(line)
  {
    const tokens = this.ranki.tokens;

    return line
      .split(tokens.assignment)[1]
      .trim()
      .split(tokens.terminator)
      .map((l) => l
        .split(tokens.parameter)
        .map((v) => ({
          raw: v.trim(),
        })));
  }

  _parseTag(line)
  {
    const tokens = this.ranki.tokens;

    return this._parseCsv(line)
      .map((r) => r
        .map((c) => c
          .raw
          .split(tokens.child)
          .map((v) => v.trim())
        )
      );
  }
  _parseTableFrameGroup(group)
  {
    const tokens = this.ranki.tokens;


    const parseSingleLine = (line) => line
      .split(tokens.parameter)
      .map((v) => v.trim());

    const checkInconsistentColumnLength = (partName, part) =>
    {
      if (part.some((row) => row.length !== part[0].length)) {
        throw new Error(`Inconsistent sized columns in ${partName}`);
      }
    };

    const expandTags = (values, tags, defaultTag) =>
    {
      if (values.length !== tags.length && tags.length > 1) {
        throw new Error([
          `Tag row length inconsistent`,
          "Values:",
          JSON.stringify(values),
          "Tags:",
          JSON.stringify(values),
        ].join("\n"));
      }

      if (tags.length > 0 && values[0].length !== tags[0].length && tags[0].length !== 1) {
        throw new Error([
          `Tag column length inconsistent`,
          "Values:",
          JSON.stringify(values[0], null, 2),
          "Tags:",
          JSON.stringify(tags[0], null, 2),
        ].join("\n"));
      }

      if (tags.length === 0) {
        return values.map((r) => r.map((_) => [defaultTag]));
      }

      if (tags.length === 1) {
        if (tags[0].length === 1) {
          return Array(values.length)
            .fill(Array(values[0].length).fill(tags[0][0]));
        } else {
          return Array(values.length).fill(tags[0]);
        }
      }
    };

    const wrapTags = (values, tags) =>
    {
      const merged = [];
      for (let ri = 0; ri < values.length; ri++) {
        const row = [];
        for (let ci = 0; ci < values[0].length; ci++) {
          row.push({
            tag: tags[ri][ci],
            ...values[ri][ci]
          });
        }
        merged.push(row);
      }
      return merged;
    };


    const parts = {
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

    for (const line of group.lines) {
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
        parts.body.values.push(parseSingleLine(trimmed).map((raw) => ({ raw })));
      }
    }

    Object.entries(parts).forEach(([name, { values, tags }]) =>
    {
      checkInconsistentColumnLength(`${name}.values`, values);
      checkInconsistentColumnLength(`${name}.tags`, tags);
    });

    [
      parts.foot.values,
      parts.body.values,
      parts.head.values,
    ].forEach((items) =>
    {
      for (let ri = 0; ri < items.length; ri++) {
        const row = items[ri];

        for (let ci = 0; ci < row.length; ci++) {
          items[ri][ci].parts = this._parseLines(items[ri][ci]);
        }
      }
    });

    const parsedTable = Object
      .entries(parts)
      .reduce((acc, [name, { tags, values, defaultTag }]) =>
      {
        if (!values.length) {
          acc[name] = [];
          return acc;
        }
        const expandedTags = expandTags(values, tags, defaultTag);
        acc[name] = wrapTags(values, expandedTags);
        return acc;
      }, {});

    return parsedTable;
  }

  _parseListFrameGroup(group)
  {
    const tokens = this.ranki.tokens;
    let tag = ["li"];

    const items = [];
    for (const line of group.lines) {
      const trimmed = line.trim();
      const isEmpty = trimmed === "";
      const isComment = trimmed.startsWith(tokens.comment);

      if (isEmpty || isComment) {
        continue;

      } else if (trimmed.startsWith(this._getAssignment(tokens.listTags))) {
        tag = trimmed.split(tokens.assignment)[1].trim();

      } else if (trimmed.startsWith(tokens.listItem)) {
        items.push({
          lines: [
            {
              raw: trimmed.slice(tokens.listItem.length).trim()
            }
          ]
        });

      } else if (items.length) {
        items[items.length - 1].lines.push({
          raw: trimmed
        });
      }
    }

    for (const item of items) {
      for (const line of item.lines) {
        line.parts = this._parseLines(line);
      }
    }

    return items.map(({ lines }) => ({ tag, lines }));
  }

  _parseDl(group)
  {
    const tokens = this.ranki.tokens;

    const items = [];
    const tags = {
      dt: ["dt"],
      dd: ["dd"],
    };

    for (const line of group.lines) {
      const trimmed = line.trim();
      const isEmpty = trimmed === "";
      const isComment = trimmed.startsWith(tokens.comment);

      if (isEmpty || isComment) {
        continue;
      } else if (trimmed.startsWith(tokens.dlDtTags)) {
        tags.dt = this._parseTag(trimmed);

      } else if (trimmed.startsWith(tokens.dlDdTags)) {
        tags.dd = this._parseTag(trimmed);

      } else if (trimmed.startsWith(tokens.heading)) {
        items.push({
          title: {
            raw: trimmed.slice(tokens.heading.length).trim(),
          },
          lines: []
        });

      } else {
        if (!items.length) {
          throw new Error("DD before dd");
        }

        items.at(-1).lines.push({
          raw: trimmed,
        });
      }
    }

    for (let ii = 0; ii < items.length; ii++) {
      items[ii].title = items[ii].title.raw
        .split(tokens.parameter)
        .map((v) => ({
          raw: v.trim(),
        }));
    }

    for (const item of items) {
      for (const title of item.title) {
        title.parts = this._parseLines(title);
      }
      for (const line of item.lines) {
        line.parts = this._parseLines(line);
      }
    }

    for (const item of items) {
      for (const title of item.title) {
        title.tags = tags.dt;
      }
      for (const line of item.lines) {
        line.tags = tags.dd;
      }
    }

    return items;
  }

  _parseFrameGroup(group)
  {
    const kind = group.tags.join(" ");
    switch (kind) {
      case "code":
        if (group.lines.length > 1) {
          throw new Error("Code frames cannot have more than 1 line");
        }

        return {
          ...group,
          kind,
          content: group.lines,
        };

      case "pre code":
        return {
          ...group,
          kind,
          content: group.lines
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
          content: this._parseDl(group),
        };

      case "table":
        return {
          ...group,
          kind,
          content: this._parseTableFrameGroup(group),
        };

      default:
        throw new Error(`Unknown frame type: ${kind}`);
    }
  }

  _parseGroups(groups)
  {
    const ast = [];
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];
      const prev = groups[gi - 1];
      const next = groups[gi + 1];

      switch (group.type) {
        case "comment":
        case "empty":
          break;

        case "frame":
          ast.push(this._parseFrameGroup(group));
          break;

        case "text":
          ast.push(...this._parseTextGroup(group, { prev, next }));
          break;

        default:
          throw new Error(`Unrecognized group type: '${group.type}'`);
      }
    }

    return ast;
  }

  parseFields(fields)
  {
    return fields.map((field) =>
    {
      const groups = this._parseField(field);
      return {
        field: field,
        list: this._parseGroups(groups),
      };
    });
  }
}
