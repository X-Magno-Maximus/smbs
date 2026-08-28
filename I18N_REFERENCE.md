# Marxia SMB i18n Reference

## Supported locales

| Code | Language | Default |
| --- | --- | --- |
| `en` | English | Yes |
| `es` | Spanish | No |

The selected locale is stored in `localStorage` under `marxia-language`, and the current locale is exposed through the document `lang` attribute.

## Source of truth

English interface copy is the source text. Spanish equivalents live in the `es` dictionary near the beginning of `app.js`. The `tr(text)` function resolves a source string, while `localize(root)` updates text nodes and the following attributes:

- `placeholder`
- `aria-label`
- `title`
- `data-tooltip`

This covers visible copy, form guidance, tooltips, and screen-reader labels.

## Adding or changing interface copy

1. Write the final English source string.
2. Add its exact Spanish equivalent to the `es` dictionary.
3. For generated values or status messages, call `tr("English source")` when creating the value.
4. For a newly rendered component, call `localize(componentRoot)` after its HTML is inserted.
5. Test English → Spanish → English. Confirm that no text remains in the previous language.
6. Check visible text, placeholders, tooltips, validation/status messages, and accessibility labels.

## Writing rules

- Use Ecuador-friendly neutral Spanish.
- Prefer natural business language over literal word-for-word translation.
- Preserve product names, people, places, SKUs, prices, dates, and business-entered branding.
- Use sentence case for buttons and headings unless the design intentionally uses uppercase.
- Keep terminology consistent: `Ajustes`, `Soporte técnico`, `Inventario`, `Logística`, `Informes`, and `PYMES`.
- Never place credentials, personal data, or translated secrets in locale storage or translation keys.

## Release checklist

- Every English UI string has a Spanish dictionary entry.
- Navigation and every click-loaded page switch languages.
- The product modal and Tech Support workflow switch languages.
- Dynamic confirmations and statuses use `tr()`.
- Tooltips, placeholders, `title`, and `aria-label` values switch languages.
- User-entered business names, mottos, emails, and product data are not translated.
- Reloading preserves the selected language.
- English and Spanish layouts remain readable on mobile, tablet, and desktop.

## Future structure

When the dictionary becomes large or a third language is introduced, move locale data into versioned files such as `locales/en.json` and `locales/es.json`. Keep stable semantic keys, for example `support.request.start`, and add an automated missing-key check in repository validation.
