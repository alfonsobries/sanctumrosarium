// Hermes ships without Intl.PluralRules: without this, plurals fail in silence
// (.agents/stack.md). Imported before anything renders.
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/es';
import '@formatjs/intl-pluralrules/locale-data/en';
