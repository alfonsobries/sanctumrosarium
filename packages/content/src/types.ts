/**
 * Everything the app prays. No UI, no platform, no framework.
 *
 * Rule: no text lives here without a `source`. See docs/referencias/rosario-doctrina.md.
 */

/** Language plus regional variant. The way the Rosary is prayed changes by region. */
export type Locale = 'es-MX' | 'es-ES' | 'en-US' | 'la';

export type Language = 'es' | 'en' | 'la';

/** Stable identifiers. Never renamed: audio files and saved sessions depend on them. */
export type PrayerId =
  | 'signum-crucis'
  | 'per-signum-crucis'
  | 'credo'
  | 'pater-noster'
  | 'ave-maria'
  | 'gloria-patri'
  | 'oratio-fatimae'
  | 'salve-regina'
  | 'versiculum-salve'
  | 'oratio-finalis'
  | 'sub-tuum'
  | 'sancte-michael'
  | 'deus-in-adiutorium'
  | 'domine-labia'
  | 'actus-contritionis'
  | 'oblatio'
  | 'iaculatoria-mariae'
  | 'ave-maria-purissima'
  | 'salve-hija-de-dios-padre'
  | 'salve-madre-de-dios-hijo'
  | 'salve-esposa-del-espiritu-santo'
  | 'templo-y-sagrario'
  | 'litaniae-lauretanae'
  | 'oratio-litaniarum'
  | 'oratio-pro-papa';

export type MysterySetId = 'gaudiosa' | 'luminosa' | 'dolorosa' | 'gloriosa';

export type FormId = 'roman' | 'es-MX' | 'es-ES' | 'dominican';

/** Where a text comes from. Mandatory: a prayer without a source does not ship. */
export type Source = {
  /** Human readable, e.g. "Compendio del Catecismo, apéndice A". */
  readonly name: string;
  readonly url?: string;
};

/**
 * One prayer in one locale.
 *
 * `lines` is how the text is shown and spoken (split by breath, not by grammar).
 * `lead`/`response` is where it breaks when two voices pray it: the guide says the first
 * half, everyone answers the second.
 */
export type PrayerText = {
  readonly id: PrayerId;
  readonly locale: Locale;
  readonly title: string;
  readonly lines: readonly string[];
  /** Index into `lines`: the first line of the response. Undefined when not prayed in two voices. */
  readonly responseFrom?: number;
  readonly source: Source;
};

export type MysteryId = `${MysterySetId}-${1 | 2 | 3 | 4 | 5}`;

/** Localized bits of a mystery. The scripture text may be empty while its licence is undecided. */
export type MysteryText = {
  readonly title: string;
  /** Fruit of the mystery. Catechetical tradition, not defined doctrine: it varies by country. */
  readonly fruit: string;
  /**
   * One or two lines to situate the mystery before the decade.
   *
   * These are written by the editor, not quoted: they carry no authority and must never be shown
   * as if they came from the magisterium. Quoted meditations with their attribution are pending
   * (task 003).
   */
  readonly intro?: string;
  /** The phrase added after the name of Jesus in each Hail Mary (DPPL 201). */
  readonly clause?: string;
};

/** A public-domain work shown with the mystery. Never generated; never a Vatican Museums photo. */
export type ArtworkLicense = 'CC0' | 'PD-Art';

export type Artwork = {
  readonly file: string;
  readonly title: string;
  readonly artist: string;
  readonly year: string;
  readonly museum: string;
  readonly license: ArtworkLicense;
  readonly source: Source;
};

export type Mystery = {
  readonly id: MysteryId;
  readonly set: MysterySetId;
  /** 1 to 5. */
  readonly order: number;
  /** Book chapter:verses, e.g. "Lc 1,26-38". The text itself depends on the translation licence. */
  readonly scriptureRef: string;
  readonly text: Readonly<Record<Language, MysteryText>>;
  readonly source: Source;
};

/** A step of the Rosary as the form describes it, before the engine expands the decades. */
export type FormStep =
  | { readonly kind: 'prayer'; readonly prayer: PrayerId; readonly optional?: boolean }
  | {
      readonly kind: 'prayer-times';
      readonly prayer: PrayerId;
      readonly times: number;
      readonly optional?: boolean;
    }
  /** The five decades. Expanded by the engine. */
  | { readonly kind: 'decades' }
  | { readonly kind: 'litany'; readonly optional?: boolean };

/** What a decade is made of, in this form. */
export type DecadeShape = {
  /** Announce the mystery before the Our Father. False only where the mystery goes inside the Hail Mary. */
  readonly announce: boolean;
  /** Read the scripture passage after announcing (RVM 30). Optional everywhere. */
  readonly reading: boolean;
  readonly opening: readonly FormStep[];
  /** After the ten Hail Marys and the Glory Be. */
  readonly closing: readonly FormStep[];
};

/**
 * A regional way of praying the Rosary.
 *
 * What is essential (mystery, Our Father, ten Hail Marys, Glory Be) is not configurable and lives
 * in the engine. Everything else is here, and it changes by region (RVM 37).
 */
export type RosaryForm = {
  readonly id: FormId;
  readonly name: string;
  readonly locales: readonly Locale[];
  readonly opening: readonly FormStep[];
  readonly decade: DecadeShape;
  readonly closing: readonly FormStep[];
  readonly source: Source;
};
