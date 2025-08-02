export class Html {
    _assignElementContent(elem, content, format = "text") {
        if (elem && content) {
            switch (format) {
                case "html":
                    elem.innerHTML = content;
                    break;
                case "text":
                    elem.innerText = content;
                    break;
                default:
                    elem.innerHTML = content;
            }
        }
    }
    _appendElementChildren(elem, children = []) {
        if (elem && children.length) {
            for (const child of children) {
                elem.appendChild(child);
            }
        }
    }
    _assignElemClassName(elem, className) {
        if (elem && className) {
            elem.className = className;
        }
    }
    single(tag, { format, content, className, style, children, } = {}) {
        const elem = document.createElement(tag);
        this._assignElementContent(elem, content, format);
        this._assignElemClassName(elem, className);
        this._appendElementChildren(elem, children);
        if (style) {
            // @ts-ignore
            elem.style = style;
        }
        return elem;
    }
    chain(tags, { leaf, root } = {}) {
        const rootElem = this.single(tags[0]);
        const rest = tags.slice(1);
        let leafElem = rootElem;
        for (const e of rest) {
            const child = this.single(e);
            leafElem.appendChild(child);
            leafElem = child;
        }
        this._assignElementContent(leafElem, leaf?.content, leaf?.format);
        this._appendElementChildren(leafElem, leaf?.children);
        this._assignElemClassName(leafElem, leaf?.className);
        this._assignElemClassName(rootElem, root?.className);
        return {
            root: rootElem,
            leaf: leafElem,
        };
    }
    toString(html) {
        const div = document.createElement("div");
        div.appendChild(html);
        return div.innerHTML;
    }
}
