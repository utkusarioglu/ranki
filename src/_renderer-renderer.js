import {
  attachError,
  sanitizeLanguage,
  sanitizeCodeContent,
  getBlockLines,
} from "./_renderer-utils.js";

export class Renderer {
  centerThreshold = 50;
  blockToken = ":::";
  sectionSplitter = "\n\n";
  childToken = "/";
  assignmentToken = ":";
  newLineToken = ";";
  paramToken = ",";
  commentToken = "#";
  listStartToken = "-";

  constructor({version, features, card, content }) {
    this.version = version;
    this.features = features;
    this.card = card;
    this.content = content;
  }

  _assign(name) {
    return `${name}${this.assignmentToken}`;
  }

  /**
   * @dev
   * #1 Currently this only parses single line headers, it should be possible
   * to parse multiline headers using ";" as the line separator.
   * #2 means that the line is a comment.
   * #3 This is intentionally untrimmed.
   */
  _parseTable(content) {
    const multilineParser = (line) => line
      .split(this.assignmentToken)[1]
      .split(this.newLineToken)
      .map((l) => l.split(this.paramToken).map((v) => v.trim()));

    const singleLineParser = (line) => line
      .split(this.paramToken)
      .map((v) => v.trim());
    
    const tagWrapper = (values, tags) => {
      const merged = [];
      for (let ri = 0; ri < values.length; ri++) {
        const row = [];
        for (let ci = 0; ci < values[0].length; ci++) {
          row.push({
            tag: tags[ri][ci],
            content: values[ri][ci]
          })        
        }
        merged.push(row);      
      }
      return merged;
    }

    const checkInconsistentColumnLength = (partName, part) => {
      if (part.some((row) => row.length !== part[0].length)) {
        throw new Error(`Inconsistent sized columns in ${partName}`);
      }
    }

    const tagExpander = (values, tags, defaultTag) => {
      if (values.length !== tags.length && tags.length > 1) {
        throw new Error(`Tag row length in consistent`, values, tags);
      }
      
      if (tags.length > 0 && values[0].length !== tags[0].length && tags[0].length !== 1) {
        throw new Error(`Tag column length in consistent`, values[0], tags[0]);
      }

      if (tags.length === 0) {
        return values.map((r) => r.map((_) => defaultTag));
      }

      if (tags.length === 1) {
        if (tags[0].length === 1) {
          return Array(values.length).fill(Array(values[0].length).fill(tags[0][0]));
        } else {
          return Array(values.length).fill(tags[0]);
        }
      }
    }

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
    }

    for (const line of getBlockLines(content)) {
      const trimmed = line.trim();
      if (trimmed === "") {
        continue;
      }
      if (trimmed.startsWith(this.commentToken)) { // #2
        continue;
      }

      if (trimmed.startsWith(this._assign("BODY_TAGS"))) {
        parts.body.tags = multilineParser(line);
      } else if (trimmed.startsWith(this._assign("HEAD_TAGS"))) {
        parts.head.tags = multilineParser(line);
      } else if (trimmed.startsWith(this._assign("FOOT_TAGS"))) {
        parts.foot.tags = multilineParser(line);
        //#1
      } else if (trimmed.startsWith(this._assign("HEADS"))) {
        parts.head.values = multilineParser(line);
      } else if (trimmed.startsWith(this._assign("FOOTS"))) {
        parts.foot.values = multilineParser(line);
      } else {
        parts.body.values.push(singleLineParser(line)); // #3
      }
    }
    
    Object.entries(parts).forEach(([name, {values, tags}]) => {
      checkInconsistentColumnLength(`${name}.values`, values);
      checkInconsistentColumnLength(`${name}.tags`, tags);
    });
    
    const parsedTable = Object
      .entries(parts)
      .reduce((acc, [name, { tags, values, defaultTag }]) => {
        if (!values.length) {
          acc[name] = [];
          return acc;
        }
        const expandedTags = tagExpander(values, tags, defaultTag);
        acc[name] = tagWrapper(values, expandedTags);
        return acc;
      }, {});

    return parsedTable;
  }

  _parseList(content)
  {
    let tag = "li";
    const items = [];
    for (const line of getBlockLines(content)) {
      const trimmed = line.trim();
      if (trimmed === "") {
        continue;
      }
      if (trimmed.startsWith(this.commentToken)) { // #2
        continue;
      }

      if (trimmed.startsWith(this._assign("LI_TAGS"))) {
        tag = trimmed.split(this.assignmentToken)[1].trim();
      } else if (trimmed.startsWith(this.listStartToken)) {
        items.push({
          value: [trimmed.slice(1).trim()]
        });
      } else if(items.length){
        items[items.length - 1].value.push(trimmed);
      }
    }

    return items.map(({ value }) => ({ tag, value }));
  }

  _parseDl(content) {
    const items = []
    for (const line of getBlockLines(content)) {
      const trimmed = line.trim();
      if (trimmed === "") {
        continue;
      }
      if (trimmed.startsWith(this.commentToken)) { // #2
        continue;
      }

      if (trimmed.includes(this.assignmentToken)) {
        const dts = trimmed
          .split(this.assignmentToken)[0]
          .split(this.paramToken)
          .map((v) => v.trim());

        console.log(dts);
        
        items.push({
          dts,
          dd: [],
        });
      } else {
        items[items.length - 1].dd.push(trimmed)
      }
    }

    return items;
  }

  /**
   * @dev
   * #1 1 for start, 1 for end, 1 for single line of code, if it's more than 3,
   * then it means it's multiline.
   * #2 Multiline <code> blocks aren't legible, so the code doesn't allow their
   * use.
   */
  _parseGroups(field)
  {
    const raw = this.content[field].split(this.sectionSplitter);
    const groups = [];
    
    raw.forEach((group) =>
    {
      const blockStart = group.startsWith(this.blockToken);
      const blockEnd = group.endsWith(this.blockToken);
      const notBlock = !blockStart && !blockEnd;
      let content = group.trim();

      if (notBlock) {
        if (
          groups.length > 0
          && groups[groups.length - 1].type == "block" &&
          !groups[groups.length - 1].complete
        ) {
          groups[groups.length - 1].content += this.sectionSplitter + content;
        } else {
          groups.push({
            type: "text",
            content,
            complete: true,
          });
        }
        return;
      }

      if (blockStart) {
        content = content.slice(this.blockToken.length);
      }
      if (blockEnd) {
        content = content.slice(0, -1 * this.blockToken.length);
      }
      if (blockStart) {
        groups.push({
          type: "block",
          content: content,
          complete: blockEnd
        });
      }

      if (!blockStart && blockEnd) {
        groups[groups.length - 1].content += this.sectionSplitter + content;
        groups[groups.length - 1].complete += true;
      }
    });

    return {
      field,
      list: groups
    };
  }

  _parseBlocks(groups) {
    const blocks = groups.list.map(({type, content, complete}) => { 
      if (type === "text") {
        if (content.length < this.centerThreshold) {
          return {
            type,
            flavor: "centered",
            content,
          }
        } else {
          return {
            type,
            flavor: "paragraph",
            content,
          }
        }
      }

      if (!complete) {
        return attachError(`Incomplete block reached final render stage:\n ${content}`)
      }
      
      const blockLines = content.split("\n");
      let [flavor, flavorType] = blockLines[0].split(this.newLineToken).map((i) => i.trim());
      const isMultiline = blockLines.length > 3; // #1
      flavor = flavor
        .split(this.childToken)
        .map((v) => v.trim()).join(" > ");
      
      // #2
      if (isMultiline && flavor === "code") {
        const message = `Multiline <code> blocks aren't legible:\n ${content}`;
        attachError(message);
        throw new Error(message);
      }
      
      switch (flavor) {
        case "code":
          return {
            type,
            flavor,
            language: sanitizeLanguage(flavorType),
            content: sanitizeCodeContent(content),
          }

        case "pre > code":
          return {
            type,
            flavor,
            language: sanitizeLanguage(flavorType),
            content: sanitizeCodeContent(content),
          }
        
        case "table":
          return {
            type,
            flavor,
            content: this._parseTable(content),
          }
        
        case "ol":
        case "ul":
          return {
            type,
            flavor,
            content: this._parseList(content),
          }
        
        case "dl":
          return {
            type,
            flavor,
            content: this._parseDl(content),
          }

        default:
          return {
            type,
            flavor: "pre",
            content,
          }
      }
    });

    return {
      field: groups.field,
      list: blocks
    };
  } 

  parse(fields) {
    return fields.map((field) => {
      const groups = this._parseGroups(field);
      return this._parseBlocks(groups);
    });
  }
}
