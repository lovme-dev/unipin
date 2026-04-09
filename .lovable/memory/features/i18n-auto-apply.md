---
name: Auto-apply i18n to all new features
description: Every new UI text must use translation keys from src/i18n/translations.ts, never hardcoded strings
type: preference
---
All user-visible text in the app MUST use translation keys from `src/i18n/translations.ts`.
Never hardcode English or any language strings directly in components.
When creating new features:
1. Add new translation keys to the `Translations` interface
2. Add translations for all existing languages (EN, UR, ID, AR, PT, DE, FR, ES, JA, ZH, KO, TH, VI, TR, RU, IT, MS, NL, PL)
3. Use `t.keyName` in components
Pakistan (PK) default language is UR (Urdu), not EN.
