const tooltip = document.createElement("div");
tooltip.style.position = "fixed";
tooltip.style.zIndex = "2147483647";
tooltip.style.maxWidth = "280px";
tooltip.style.padding = "6px 10px";
tooltip.style.background = "rgba(32, 32, 32, 0.96)";
tooltip.style.color = "#fff";
tooltip.style.borderRadius = "8px";
tooltip.style.fontSize = "13px";
tooltip.style.lineHeight = "1.4";
tooltip.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";
tooltip.style.pointerEvents = "none";
tooltip.style.display = "none";
tooltip.style.whiteSpace = "pre-wrap";
tooltip.style.opacity = "0";
tooltip.style.transition = "opacity 0.12s ease";
document.body.appendChild(tooltip);

let currentWord = "";
let hoverTimeout = null;
let lastPosition = { x: 0, y: 0 };

function getWordAtPoint(x, y) {
  let range;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    if (pos) {
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.setEnd(pos.offsetNode, pos.offset);
    }
  }

  if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) {
    return null;
  }

  const text = range.startContainer.data;
  let offset = range.startOffset;
  if (offset > 0 && offset >= text.length) {
    offset = text.length - 1;
  }

  if (!text || offset < 0 || offset >= text.length || !/[A-Za-z]/.test(text[offset])) {
    return null;
  }

  let start = offset;
  let end = offset;
  while (start > 0 && /[A-Za-z]/.test(text[start - 1])) {
    start -= 1;
  }
  while (end < text.length - 1 && /[A-Za-z]/.test(text[end + 1])) {
    end += 1;
  }

  const word = text.slice(start, end + 1).trim();
  return word.length > 1 && word.length < 40 ? word : null;
}

async function translateText(text) {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt-BR`
    );
    if (!res.ok) return text;
    const data = await res.json();
    return data?.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

function positionTooltip(x, y) {
  tooltip.style.opacity = "1";
  const rect = tooltip.getBoundingClientRect();
  let left = x - rect.width / 2;
  let top = y - rect.height - 14;

  if (left < 8) left = 8;
  if (left + rect.width > window.innerWidth - 8) {
    left = window.innerWidth - rect.width - 8;
  }
  if (top < 8) {
    top = y + 18;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

async function showDefinition(word, x, y) {
  tooltip.textContent = "Buscando...";
  tooltip.style.display = "block";
  positionTooltip(x, y);

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    if (!res.ok) {
      tooltip.textContent = "Não encontrado";
      positionTooltip(x, y);
      return;
    }

    const data = await res.json();
    const definition =
      data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
      "Não encontrado";
    const translatedWord = await translateText(word);
    const translatedDefinition = await translateText(definition);
    tooltip.textContent = `${word} — ${translatedWord}\n\n${translatedDefinition}`;
    positionTooltip(x, y);
  } catch {
    tooltip.textContent = "Erro ao buscar definição";
    positionTooltip(x, y);
  }
}

function hideTooltip() {
  tooltip.style.opacity = "0";
  setTimeout(() => {
    if (tooltip.style.opacity === "0") {
      tooltip.style.display = "none";
    }
  }, 150);
}

function isIgnoredElement(target) {
  return target.closest("input, textarea, select, button, a, script, style, iframe") !== null;
}

function handleMouseMove(event) {
  if (isIgnoredElement(event.target)) {
    hideTooltip();
    currentWord = "";
    return;
  }

  lastPosition.x = event.clientX;
  lastPosition.y = event.clientY;
  const word = getWordAtPoint(event.clientX, event.clientY);
  if (!word) {
    hideTooltip();
    currentWord = "";
    return;
  }

  if (word === currentWord) return;

  currentWord = word;
  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => showDefinition(word, lastPosition.x, lastPosition.y), 300);
}

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseleave", hideTooltip);
