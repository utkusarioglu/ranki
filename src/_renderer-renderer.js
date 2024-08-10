import {
  createElement,
  attachError,
  sanitizeLanguage,
  sanitizeCodeContent
} from "./_renderer-utils.js";
import hljs from "./_renderer-highlight.min.js";
import {registerTerraform} from "./_renderer-hljs-terraform.js";

registerTerraform(hljs);

export class Renderer {
  centerThreshold = 50;
  blockToken = '"""';
  sectionSplitter = "\n\n";

  constructor({version, features, card, content }) {
    this.version = version;
    this.features = features;
    this.card = card;
    this.content = content;
  }

  /**
   * @dev
   * #1 1 for start, 1 for end, 1 for single line of code, if it's more than 3,
   * then it means it's multiline.
   * 
   * #2 Multiline <code> blocks aren't legible, so the code doesn't allow their
   * use.
   */
  _parseSections(pre) {
    const raw = pre.split(this.sectionSplitter);
    const groups = [];
    raw.forEach((group) => { 
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
          })
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
        })
      }

      if (!blockStart && blockEnd) {
        groups[groups.length - 1].content += this.sectionSplitter + content;
        groups[groups.length - 1].complete += true;
      }
    });

    const blocks = groups.map(({type, content, complete}) => { 
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
      const firstLine = blockLines[0].split(",").map((i) => i.trim());
      const isMultiline = blockLines.length > 3; // #1
      const flavor = firstLine.length > 1 ? firstLine[0] : undefined;
      const flavorType = firstLine.length > 1 ? firstLine[1] : undefined;
      
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
            content
          }

        case "ts":
        case "js":
        case "python":
        case "hcl":

        case "pre.code":
          return {
            type,
            flavor,
            language: sanitizeLanguage(flavorType),
            content
          }

        default:
          return {
            type,
            flavor: "pre",
            content,
          }
          // attachError(`Unrecognized block flavor: ${blockFlavor}`);
      }
      
    });

    return blocks;
  }

  _renderSection({type, flavor, content, language}) {
    switch (flavor) {
      case "paragraph":
        return createElement("p", { format: "html", content })

      case "centered":
        return createElement("div", { format: "html", content });

      case "code":
        return createElement("code", {
          format: "text",
          content: sanitizeCodeContent(content)
        });

      case "pre.code":
        const pre = createElement("pre");
        // const raw = content.split("\n");
        // const codeContent = raw
        //   .slice(1, -1)
        //   .join("\n")
        //   .trim()
        //   .replace("&lt;", "<")
        //   .replace("&gt;", ">");
        const langLabelElem = createElement("span", {
          format: "text",
          content: language,
          className: "language-label",
        });
        pre.appendChild(langLabelElem);
        const highlighted = hljs.highlight(
          sanitizeCodeContent(content),
          // codeContent,
          { language }
        ).value;
        const code = createElement("code", {
          format: "html",
          content: highlighted
        });
        pre.appendChild(code);
        return pre;
      
      case "pre":
        return createElement("pre", { format: "html", content })

      case "table":
        const table = createElement("table");
        const tbody = createElement("tbody");
        table.appendChild(tbody);
        const tr = createElement("tr");
        tbody.appendChild(tr);
        const td1 = createElement("td", { format: "text", content: "cat" });
        const td2 = createElement("td", { format: "text", content: "dog" });
        tr.appendChild(td1);
        tr.appendChild(td2);
        return table;
      
      case "dl":
        return;
      
      case "ul":
        return;
      
      case "ol":
        return;
      
      default:
        attachError(`Unknown section type ${type}`);
    }
  }

  _pres() {
    const sections = {}
    for (const [key, content] of Object.entries(this.content)) {
      sections[key] = this._parseSections(content);
    }

    const renders = {};
    for (const [key, section] of Object.entries(sections)) {
      const container = createElement("div");
      for (const line of section) {
        container.appendChild(this._renderSection(line));
      }
      renders[key] = container;
    }

    return renders;
  }

  render(side)
  {
    const renders = this._pres(this.content);

    switch (side) {
      case "front":
        const front = document.createElement("div");
        front.appendChild(renders["Question-Start-Pre"]);
        front.appendChild(renders["Front-Prompt-Pre"]);
        front.appendChild(renders["Question-End-Pre"]);
        return front;

      case "back":
        const back = document.createElement("div");
        back.appendChild(renders["Answer-Start-Pre"]);
        back.appendChild(renders["Back-Prompt-Pre"]);
        back.appendChild(renders["Answer-End-Pre"]);
        return back;

      default:
        attachError(`Error: Unknown side: ${side}`);
        return null;
    }
  }
}
