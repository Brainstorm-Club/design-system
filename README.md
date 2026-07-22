# Brainstorm Club — Design System

Sistema visivo dell'**associazione ludica faentina**, ricavato interamente dal logo
(`sito/logo.jpg`): nero carbone, rosso mattone della macchina da scrivere, il
cervello-doodle e il suo lampo.

## File

| File | Cosa contiene |
|------|---------------|
| `brainstorm.css` | **Entry-point unico**: importa font + `tokens.css` + `components.css`. In un'app basta questo. |
| `tokens.css` | Fonte di verità CSS: colori, tipografia, spazio, raggi, marchio, alias di tema. |
| `tokens.js` | Gli stessi token in **JavaScript/TS** (`bsc`, `cssVar()`, `setTheme()`) — per grafici, canvas, stili dinamici. |
| `components.css` | Componenti `.bsc-` (bottoni, badge, card, form, **select/switch/checkbox**, **stat block**, **tabella**, **tab**, alert, box informativo, link a pillola, skip-link, code block). |
| `index.html` | Living style guide navigabile — la vetrina + la sezione **Sviluppo** con snippet copiabili (GitHub Pages / Artifact). |
| `assets/favicon.png` | Favicon: cervello bianco su carbone, angoli arrotondati. |
| `assets/brain-mark.png` | Marchio compatto come **maschera** (alfa) — si ricolora con `currentColor`. |

## Uso rapido

```html
<head>
  <!-- 1. web font (produzione) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
  <!-- 2. favicon -->
  <link rel="icon" type="image/png" href="design-system/assets/favicon.png">
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
