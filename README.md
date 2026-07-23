# Brainstorm Club — Design System

Sistema visivo dell'**associazione ludica faentina**, ricavato interamente dal logo
(`sito/logo.jpg`): nero carbone, rosso mattone della macchina da scrivere, il
cervello-doodle e il suo lampo.

## File

| File | Cosa contiene |
|------|---------------|
| `brainstorm.css` | **Entry-point unico**: importa font + `tokens.css` + `components.css`. In un'app basta questo. |
| `tokens.css` | Fonte di verità CSS: colori, tipografia, spazio, raggi, marchio, alias di tema. |
| `tokens.js` | Gli stessi token in **JavaScript/TS** (`bsc`, `cssVar()`, `getTheme()`, `setTheme()`) — per grafici, canvas, stili dinamici. |
| `theme.js` | **Switch del tema unificato** per tutte le app. Tri-stato di scelta esplicita: **scuro → chiaro → auto** (segue l'OS), default scuro. `initTheme()` (auto-wire + ciclo), `cycleTheme()`/`getThemePref()`/`setThemePref()` per il tri-stato, `toggleTheme()`/`getTheme()`/`setTheme()` per il bi-stato. La preferenza vive in `bsc-theme-pref`; il tema *effettivo* (sempre `dark`/`light`) in `bsc-theme` → le app bi-stato non regrediscono. |
| `ui.js` | **Comportamenti UI condivisi**: `initUI()` (tema + nav + dropdown + lingua + copertine + **bottom sheet**), hamburger responsivo, dropdown/menu, switch lingua (`getLang()`/`setLang()`, evento `bsc:langchange`), **copertina con sinossi** (`initCovers()`), **bottom sheet** (`initSheets()`/`openSheet()`/`closeSheet()`), **toast** (`bscToast()`). |
| `components.css` | Componenti `.bsc-` (bottoni, badge, card, form, **select/switch/checkbox**, **selettore segmentato**, **stat block**, **tabella**, **tab**, **bottom sheet**, **toast**, alert, box informativo, link a pillola, skip-link, code block). |
| `index.html` | Living style guide navigabile — la vetrina + la sezione **Sviluppo** con snippet copiabili (GitHub Pages / Artifact). |
| `assets/favicon.svg` | Favicon **vettoriale** (cervello): scalabile e nitido — da preferire, PNG come fallback. |
| `assets/favicon.png` | Favicon PNG: cervello bianco su carbone, angoli arrotondati (fallback per browser datati). |
| `assets/brain-mark.png` | Marchio compatto come **maschera** (alfa) — si ricolora con `currentColor`. |

## Uso rapido

```html
<head>
  <!-- 1. web font (produzione) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
  <!-- 2. favicon (SVG scalabile, PNG di fallback) -->
  <link rel="icon" type="image/svg+xml" href="design-system/assets/favicon.svg">
  <link rel="icon" type="image/png"     href="design-system/assets/favicon.png">
  <!-- 3. design system -->
  <link rel="stylesheet" href="design-system/tokens.css">
  <link rel="stylesheet" href="design-system/components.css">
</head>
<body class="bsc-body">
  <button class="bsc-btn">prenota un tavolo</button>
  <!-- marchio compatto: il cervello si ricolora col tema -->
  <span class="bsc-wordmark"><span class="bsc-brandmark" aria-hidden="true"></span><span class="bsc-r">brainstorm</span>club</span>
</body>
```

> **Nota:** `--bsc-brand-mark` e il favicon puntano a `assets/…` **relativi a `components.css`**.
> Se importi il CSS da un percorso diverso, aggiorna i path o ridefinisci `--bsc-brand-mark`.

## Uso nelle app del club

Le app (character builder, Harp Forge, tracker) consumano il sistema in un import solo.

**CDN via GitHub Pages** — nessuna installazione:

```html
<link rel="stylesheet" href="https://brainstorm-club.github.io/design-system/brainstorm.css">
```

**Progetto Vite / Vue / TS** — come git submodule o pacchetto:

```js
import '@brainstorm/design-system/brainstorm.css'
import { bsc, cssVar, setTheme } from '@brainstorm/design-system/tokens.js'

ctx.fillStyle = bsc.color.rosso            // '#C2332B' (colori dei grafici: bsc.chart)
el.style.color = cssVar('--bsc-primary')   // valore risolto col tema attivo
setTheme('light')                          // 'dark' | 'light'
```

Componenti pensati per le schede: `.bsc-field` + `.bsc-select` / `.bsc-switch` / `.bsc-checkbox`,
`.bsc-stat` (punteggio + modificatore), `.bsc-table`, `.bsc-tabs` / `.bsc-tab`. Il markup pronto è
nella sezione **Sviluppo** della style guide (ogni riquadro si copia).

### Tema: uno switch per tutte le app

Lo switch carbone ⇄ carta è **unico**, in `theme.js`: default scuro, la scelta si ricorda
(`localStorage`, chiave `bsc-theme`). Un pulsante + una chiamata:

```html
<!-- 1. anti-flash: nell'<head>, PRIMA del CSS (risolve anche 'auto') -->
<script>try{var p=localStorage.getItem('bsc-theme-pref')||localStorage.getItem('bsc-theme')||'dark',e=p==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):p,d=document.documentElement;d.setAttribute('data-theme',e);d.setAttribute('data-theme-pref',p)}catch(e){}</script>
<!-- 2. il pulsante (uno o più, ovunque) -->
<!-- vuoto: initTheme() inietta le icone luna/sole/auto -->
<button class="bsc-theme-toggle" data-bsc-theme-toggle></button>
```

```js
// 3. avvia una volta
import { initTheme } from '@brainstorm/design-system/theme.js'
initTheme()
// In Vue/React: getTheme() / setTheme() / toggleTheme() + evento document 'bsc:themechange'
```

### Navigazione, hamburger e lingua

`ui.js` dà una sola chiamata per tutto (tema incluso): hamburger responsivo, dropdown/menu,
switch lingua. Comportamento a **delega** (funziona anche in SPA), markup con attributi `data-bsc-*`.

```js
import { initUI } from '@brainstorm/design-system/ui.js'
initUI()  // tema + nav + dropdown + lingua
// L'i18n resta dell'app: ascolta l'evento e imposta la tua libreria
document.addEventListener('bsc:langchange', e => { i18n.locale = e.detail.lang })
```

- **Hamburger / nav**: `<button class="bsc-hamburger" data-bsc-nav-toggle aria-controls="main-nav">` +
  `<nav class="bsc-nav" id="main-nav" data-bsc-nav>`. Orizzontale su desktop, a tendina sotto 720px.
- **Dropdown**: `.bsc-dropdown` con `[data-bsc-dropdown-trigger]` e `.bsc-dropdown__menu`.
- **Switch lingua**: dropdown i cui item hanno `data-bsc-lang="it|en"`; `[data-bsc-lang-current]`
  mostra la lingua attiva. Persistenza `localStorage` (`bsc-lang`), default `it`.

Markup completo e demo interattiva nella sezione **Sviluppo** della style guide.

## Fondamentali

- **Temi.** Default = *carbone* (scuro, il vero brand). Il tema *carta* (chiaro, stile
  manuale di gioco) si attiva con `data-theme="light"` su `<html>`.
- **Rosso = un accento solo.** Si spende una volta per schermata, sull'azione principale.
- **Marchio sempre minuscolo**, in typewriter (`--bsc-font-display`).
- **Bordo firma.** `--bsc-radius-sketch` = il bordo "disegnato a mano" che richiama il
  tratto del cervello. Per i contenuti che devono sembrare scritti a penna.
- **Il lampo** (SVG nella style guide) è il motivo grafico: marcatore di sezione,
  separatore, accento sui numeri.
- **Sfondo preferito = carbone.** Il ground del brand è il nero del logo (`--bsc-carbone`,
  di default via `--bsc-bg`). Per una sezione sempre scura anche in tema carta usa `.bsc-carbone`.
- **Griglia a quadretti (hero).** Carta millimetrata di linee tenui: `.bsc-grid` (con
  `--bsc-grid-line` / `--bsc-grid-size`); `.bsc-grid--hero` la fa sfumare ai bordi come nella hero.
- **Marchio compatto & favicon.** Quando non c'è spazio per la scritta, usa il cervello:
  `.bsc-brandmark` (maschera ricolorabile) accanto al nome, o il favicon nella scheda.
- **Componenti da sito** ora nel sistema: badge `--flag` (etichetta piena, es. "Omnibus")
  e `--done` ("concluso"), indicatore `.bsc-live` (puntino che pulsa), `.bsc-card--soon`
  ("in arrivo"), `.bsc-sysbox` (box informativo con accento) + `.bsc-pill` / `.bsc-pill--tool`
  (link a pillola, la ★ marca gli strumenti della community), `.bsc-skip` (salta-al-contenuto).

## Palette

| Nome | Hex | Uso |
|------|-----|-----|
| Carbone | `#181617` | Fondo brand |
| Rosso mattone | `#C2332B` | Primario / accento |
| Bianco caldo | `#F4F1EC` | Testo su scuro |
| Carta | `#EFEAE1` | Fondo tema chiaro |
