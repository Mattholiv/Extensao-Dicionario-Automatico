# Dicionário Automático

Extensão de navegador que mostra a definição de palavras em inglês diretamente no texto da página, sem precisar sair do site.

prints do projeto: https://drive.google.com/drive/folders/1i1JIyd5wwEiufkGq9f0LYGi6mzKhmOoO
## Funcionalidades

- Detecta palavras ao passar o mouse sobre o texto
- Exibe a definição em um tooltip flutuante
- Tradução automática para português
- Funciona em qualquer página web
- Desenvolvida como extensão do Chrome/Chromium

## Como instalar

1. Baixe ou clone este repositório.
2. Abra o navegador Chrome/Edge com base em Chromium.
3. Acesse `chrome://extensions`.
4. Ative o modo de desenvolvedor.
5. Clique em "Carregar sem compactação".
6. Selecione a pasta do projeto.

## Como usar

- Navegue em qualquer página da web.
- Passe o mouse sobre uma palavra em inglês.
- A extensão exibirá a definição e a tradução em um popup sobre a página.

## Arquivos principais

- `manifest.json` — configuração da extensão
- `content.js` — detecção de palavras e exibição do tooltip
- `background.js` — serviço em segundo plano da extensão
- `popup.html` — popup da extensão
- `popup.css` — estilos do popup

## Tecnologias

- JavaScript
- HTML
- CSS
- Manifest V3
- Dictionary API
- MyMemory Translation API

## Observações

A extensão precisa de acesso às páginas para detectar o texto e de permissões à API de dicionário e tradução.

## Licença

Este projeto está disponível para fins didáticos e pessoais.
