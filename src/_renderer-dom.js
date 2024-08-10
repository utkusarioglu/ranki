import { createElement, attachError, stripHtmlEncoding } from "./_renderer-utils.js";
import hljs from "./_renderer-highlight.min.js";
import {registerTerraform} from "./_renderer-hljs-terraform.js";

registerTerraform(hljs);

export class Dom {
  childToken = "/";

  constructor(parent) {
    this.parent = parent;
  }

  getFields(_card, side) {
    switch (side) {
      case "front":
        return [
          "Question-Start-Pre",
          "Front-Prompt-Pre",
          "Question-End-Pre",
        ];
      
      case "back":
        return [
          "Answer-Start-Pre",
          "Back-Prompt-Pre",
          "Answer-End-Pre",
        ]
      
      default:
        return [];
    }
  }

  _multiWrap(tags, {format, content} = {}) {
    const list = tags.split(this.childToken).map((v) => v.trim());
    const root = createElement(list[0]);
    const rest = list.slice(1);

    let leaf = root;
    for (const e of rest) {
      const child = createElement(e);
      leaf.appendChild(child);
      leaf = child;
    }
    
    if (content) {
      switch (format) {
        case "html":
          leaf.innerHTML = stripHtmlEncoding(content);
          break;
        
        case "text":
          leaf.innerText = content;
          break;
      }
    }

    return {
      root, 
      leaf
    };
  }

  _p(content) {
    return createElement("p", { format: "html", content })
  }

  _div(content) {
    return createElement("div", { format: "html", content });
  }

  _code(content) {
    return createElement("code", { format: "text", content });
  }

  _preCode(content, language) {
    const pre = createElement("pre");
    const langLabelElem = createElement("span", {
      format: "text",
      content: language,
      className: "language-label",
    });
    pre.appendChild(langLabelElem);

    const highlighted = hljs.highlight(content, { language }).value;
    const code = createElement("code", {
      format: "html",
      content: highlighted
    });
    pre.appendChild(code);

    return pre;
  }

  _pre(content) {
    return createElement("pre", { format: "html", content })
  }

  _table({body, head, foot}) {
    const table = createElement("table");
    
    const createTablePart = (tag, rows) => {
      const part = createElement(tag);
      
      for (const row of rows) {
        const tr = createElement("tr");
        part.appendChild(tr);
        
        for (const {tag, content} of row) {
          const { root } = this._multiWrap(tag, { format: "html", content });
          tr.appendChild(root);
        }
      }
      return part
    }

    if (head.length) {
      table.appendChild(createTablePart("thead", head));
    }
    
    table.appendChild(createTablePart("tbody", body));
    
    if (foot.length) {
      table.appendChild(createTablePart("tfoot", foot));
    }

    return table;
  }

  _list(tag, content) {
    const list = createElement(tag);
    for (const {tag, value} of content) {
      const { root, leaf } = this._multiWrap(tag);
      for (const v of value) {
        const p = createElement("p", { format: "html", content: v });
        leaf.appendChild(p);
      }
      list.appendChild(root);
    }
    return list;
  }

  _dl(content) {
    const dl = createElement("dl");
    for (const { dts, dd } of content) {
      for (const dt of dts) {
        dl.appendChild(createElement("dt", {
          format: "html",
          content: dt
        }));
      }
      const div = createElement("div");
      dl.appendChild(div);
      for (const line of dd) {
        div.appendChild(createElement("p", {
          format: "html",
          content: line
        }));
      }
    }
    return dl
  }

  _renderBlock({type, flavor, content, language}) {
    switch (flavor) {
      case "paragraph":
        return this._p(content);

      case "centered":
        return this._div(content);

      case "code":
        return this._code(content)

      case "pre > code":
        return this._preCode(content, language);
      
      case "pre":
        return this._pre(content);

      case "table":
        return this._table(content);

      case "ol":
      case "ul":
        return this._list(flavor, content);
      
      case "dl":
        return this._dl(content);
      
      default:
        attachError(`Unknown section type ${type}`);
    }
  }
  

  render(sections) {
    const renders = [];
    for (const section of sections) {
      const container = createElement("section", {
        className: section.field
      });
      for (const block of section.list) {
        container.appendChild(this._renderBlock(block));
      }
      renders.push(container);
    }

    renders.forEach((render) => {
      this.parent.appendChild(render);
    })
  }
}
