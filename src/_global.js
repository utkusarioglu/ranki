import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.10.0/es/highlight.min.js';

function hljsFeatures() {
  const featuresDefined = !!window.anki && !!window.features
  const hljsDefined = featuresDefined && !!window.anki.features.hljs;
  const hljsEnabled = !hljsDefined || window.anki.features.hljs.disabled !== true;

  console.log({
    featuresDefined,
    hljsDefined,
    hljsEnabled,
  });
  
  if (!hljsEnabled) {
    console.log("Hljs is disabled through `window.anki.hljs.disabled: true`");
    return;
  }

  const observer = new MutationObserver(() => {
    document.querySelectorAll("pre:not(.text) code:not(.language-)").forEach((codeElem) => { 
      const preElem = codeElem.parentElement;
      if (!preElem.querySelector(".language-label")) {
        hljs.highlightElement(codeElem);
        const lang = codeElem.result.language;
        const langLabelElem = document.createElement('span');
        langLabelElem.className = 'language-label';
        langLabelElem.innerText = lang;
        preElem.appendChild(langLabelElem);
      }
    });
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true
  })
}

function centerText()
{
  const texts = Array.from(document.querySelectorAll("pre.text"))
  for (const elem of texts) {
    const tooShort = elem.innerText.length < 50;
    const multiLine = elem.innerText.includes("\n");
    if(tooShort && !multiLine) {
      elem.style.textAlign = "center";
    }
  }
}

function cardInfo() {
  if (window.anki && window.anki.card) {
    console.log(window.anki)
  }
}

function hudContent()
{
  if (!window.anki || !window.anki.card) {
    return;
  }

  const hudClass = "hud";
  const hudScrollContainerClass = "hud-scroll-container"
  const elemClass = "hud-item";

  // const parent = document.querySelector("body");
  const parent = document.body;
  const existingInfoBar = parent.querySelector(`.${hudClass}`);
  if (existingInfoBar) {
    console.log("info bar already attached");
    return;
  }

  const createElem = (innerText) =>
  {
    const elem = document.createElement("span");
    elem.innerText = innerText;
    elem.className = elemClass;
    return elem;
  }

  const { card, deck, type } = window.anki.card;
  const deckElem = createElem(deck || "No Deck");
  const cardElem = createElem(card || "No Card");
  const typeElem = createElem(type || "No Type");

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

function listRenderer() {
  if (!window.anki || !window.anki.card || !window.anki.card.type) {
    return;
  }
  
  console.log("type:", window.anki.card.type);

  if (window.anki.card.type.startsWith("+List")) {
    const createItem = (tag, innerText) => { 
      const elem = document.createElement(tag);
      if (innerText) {
        elem.innerText = innerText;
      }
      return elem;
    };

    const container = document.querySelector(".side-a > .list-container");
    const headersCsv = window.anki.card.content.aTableHeadersCsv;
    const bodyCsv = window.anki.card.content.aTableBodyCsv;
    const headers = headersCsv.split(",");
    const body = bodyCsv.split("\n").map((line) => line.split(",").map(i => i.trim()));
    
    console.log({ headers, body });

    const bodyLengths = body.reduce((a, c) => { 
      if (c.length !== a.length) {
        a.consistent = false;
      }
      return a;
    }, {
      consistent: true,
      length: headers.length
    });
    if (!bodyLengths.consistent) {
      container.innerText = "Error: Inconsistent lengths";
      return;
    }

    const table = createItem("table");
    const tbody = createItem("tbody");
    for (let li = 0; li < headers.length; li++) {
      const tr = createItem("tr");
      const th = createItem("th", headers[li]);
      tr.appendChild(th);

      for (let ci = 0; ci < body[li].length; ci++) {
        const td = createItem("td", body[li][ci]);
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);
  }
}

hljsFeatures();
cardInfo();
centerText();
hudContent();
listRenderer();k
