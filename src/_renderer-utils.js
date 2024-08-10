export function createElement(tag, { format, content, className } = {}) {
  const elem = document.createElement(tag);
  switch (format) {
    case "html":
      elem.innerHTML = content;
      break;

    case "text":
      elem.innerText = content;
      break;
  }

  if (className) {
    elem.className = className
  }

  return elem;
}

export function attachError(error) {
  document.body.appendChild(createElement( "div", {
    format: "text", 
    content: `Error: ${error}`,
  }));
}

export function hudContent(ankiRender)
{
  const hudClass = "hud";
  const hudScrollContainerClass = "hud-scroll-container"
  const hudItemClass = "hud-item";
  const deckGlue = "::";

  const parent = document.body;
  const existingInfoBar = parent.querySelector(`.${hudClass}`);
  if (existingInfoBar) {
    console.log("info bar already attached");
    return;
  }

  const { card, deck, type } = ankiRender.card;

  const deckElem = createElement("span", {className: hudItemClass});
  const deckSteps = deck.split(deckGlue);
  deckSteps.forEach((step, i, all) =>
  {
    const stepSpan = createElement("span", {
      format: "text",
      content: step,
      className: "hud-item-deck-step"
    });
    deckElem.appendChild(stepSpan);
    if (i < all.length - 1) {
      const stepGlue = createElement("span", {
        format: "text",
        content: deckGlue,
        className: "hud-item-deck-glue"
      });
      deckElem.appendChild(stepGlue);
    }
  });

  const cardElem = createElement("span", {
    format: "text",
    content: card,
    className: hudItemClass,
  });
  const typeElem = createElement("span", {
    format: "text",
    content: type,
    className: hudItemClass,
  });

  const hudContainer = document.createElement("div");
  hudContainer.className = hudScrollContainerClass;
  hudContainer.appendChild(deckElem);
  hudContainer.appendChild(typeElem);
  hudContainer.appendChild(cardElem);

  const hudElem = document.createElement("div");
  hudElem.className = hudClass;
  hudElem.appendChild(hudContainer);

  parent.appendChild(hudElem);
}

export function sanitizeLanguage(name)
{
  if (!name) {
    return name;
  }

  switch (name.toUpperCase()) {
    case "JS":
    case "JAVASCRIPT":
      return "javascript";
    
    case "PY":
    case "PYTHON":
      return "python";
    
    case "HCL":
    case "TERRAFORM":
    case "TF":
    case "TFVAR":
      return "hcl";
    
    default:
      return name.toLowerCase();
  }
}

export function sanitizeCodeContent(content) {
  return stripHtmlEncoding(stripBlockBoundaries(content));
}

export function stripHtmlEncoding(content) {
  console.log("content", content);
  return content
    .replace("&lt;", "<")
    .replace("&gt;", ">");
}

export function getBlockLines(content) {
  return content.split("\n").slice(1, -1)
} 

export function stripBlockBoundaries(content) {
  return getBlockLines(content).join("\n") .trim();
}
