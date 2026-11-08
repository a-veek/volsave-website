# volumesave.de

Website for [VolSave](https://github.com/a-veek/VolSave), built with
[Eleventy](https://www.11ty.dev/) 3. German, English and Spanish.

## Development

```sh
npm install
npm start        # http://localhost:8080
npm run build    # output in _site/
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/_data/site.json` | Domain, languages, download link, contact email |
| `src/_data/i18n/{de,en,es}.json` | All texts, one file per language |
| `src/pages/*.njk` | One template per page; each is generated for every language (`/de/…`, `/en/…`, `/es/…`) |
| `src/_includes/` | Layout and partials (header, comparison table, legal texts) |
| `src/assets/css/main.css` | Styles; design tokens with contrast ratios at the top |
| `src/index.njk` | `/` sends visitors to their browser language (German otherwise) |

Pages: home, `pro`, `faq`, `legal` (Impressum), `privacy` (Datenschutz).
URLs are the same in every language, so the language switch always lands
on the same page.

Adding a language: add its code to `languages`, `languageNames` and
`locales` in `site.json` and copy `src/_data/i18n/en.json` to the new code.

## Before going live

- Fill in the placeholders in `legal` and `privacy` (name, address, hosting
  provider) in all three language files.
- `contactEmail` in `site.json` must exist.
- `downloadUrl` points to the VolSave releases on GitHub; that repository
  must be public for visitors to download.
