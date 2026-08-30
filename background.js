chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SEARCH") {
    const word = msg.payload;
    (async () => {
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );

        if (!res.ok) {
          sendResponse({ result: "Não encontrado" });
          return;
        }

        const data = await res.json();
        const definition =
          data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
          "Não encontrado";

        sendResponse({ result: definition });
      } catch (e) {
        sendResponse({ result: "Erro ao buscar definição" });
      }
    })();

    return true; 
  }
});