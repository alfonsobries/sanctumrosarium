import type { PrayerText } from '../types';

const compendium = {
  name: 'Compendio del Catecismo de la Iglesia Católica, apéndice A (oraciones comunes)',
  url: 'https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_lt.html',
} as const;

/**
 * Latin texts of the Rosary in common devotional use. The Holy See publishes the Rosary in several
 * languages here, but this index does not print every Latin text: these are the traditional forms,
 * and each one still has to be checked against a printed source before the audio is recorded.
 */
const traditional = {
  name: 'Rosario tradicional, texto latino de uso devocional común (pendiente de cotejo impreso)',
  url: 'https://www.vatican.va/special/rosary/index_rosary.htm',
} as const;

export const latinPrayers: readonly PrayerText[] = [
  {
    id: 'signum-crucis',
    locale: 'la',
    title: 'Signum Crucis',
    lines: ['In nomine Patris, et Filii, et Spiritus Sancti.', 'Amen.'],
    source: compendium,
  },
  {
    id: 'credo',
    locale: 'la',
    title: 'Symbolum Apostolorum',
    lines: [
      'Credo in Deum, Patrem omnipotentem, Creatorem caeli et terrae,',
      'et in Iesum Christum, Filium eius unicum, Dominum nostrum,',
      'qui conceptus est de Spiritu Sancto, natus ex Maria Virgine,',
      'passus sub Pontio Pilato, crucifixus, mortuus, et sepultus,',
      'descendit ad inferos, tertia die resurrexit a mortuis,',
      'ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis,',
      'inde venturus est iudicare vivos et mortuos.',
      'Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam,',
      'sanctorum communionem, remissionem peccatorum,',
      'carnis resurrectionem, vitam aeternam.',
      'Amen.',
    ],
    source: compendium,
  },
  {
    id: 'pater-noster',
    locale: 'la',
    title: 'Pater Noster',
    lines: [
      'Pater noster, qui es in caelis:',
      'sanctificetur Nomen Tuum;',
      'adveniat Regnum Tuum;',
      'fiat voluntas Tua, sicut in caelo, et in terra.',
      'Panem nostrum quotidianum da nobis hodie;',
      'et dimitte nobis debita nostra,',
      'sicut et nos dimittimus debitoribus nostris;',
      'et ne nos inducas in tentationem;',
      'sed libera nos a Malo.',
      'Amen.',
    ],
    responseFrom: 4,
    source: compendium,
  },
  {
    id: 'ave-maria',
    locale: 'la',
    title: 'Ave Maria',
    lines: [
      'Ave, Maria, gratia plena, Dominus tecum.',
      'Benedicta tu in mulieribus,',
      'et benedictus fructus ventris tui, Iesus.',
      'Sancta Maria, Mater Dei,',
      'ora pro nobis peccatoribus,',
      'nunc et in hora mortis nostrae.',
      'Amen.',
    ],
    responseFrom: 3,
    source: compendium,
  },
  {
    id: 'gloria-patri',
    locale: 'la',
    title: 'Gloria Patri',
    lines: [
      'Gloria Patri, et Filio, et Spiritui Sancto.',
      'Sicut erat in principio, et nunc et semper,',
      'et in saecula saeculorum.',
      'Amen.',
    ],
    responseFrom: 1,
    source: compendium,
  },
  {
    id: 'oratio-fatimae',
    locale: 'la',
    title: 'Oratio Fatimae',
    lines: [
      'Domine Iesu, dimitte nobis debita nostra,',
      'salva nos ab igne inferiori,',
      'perduc in caelum omnes animas,',
      'praesertim eas, quae misericordiae tuae maxime indigent.',
      'Amen.',
    ],
    source: traditional,
  },
  {
    id: 'salve-regina',
    locale: 'la',
    title: 'Salve Regina',
    lines: [
      'Salve, Regina, Mater misericordiae,',
      'vita, dulcedo et spes nostra, salve.',
      'Ad te clamamus, exsules filii Evae.',
      'Ad te suspiramus, gementes et flentes in hac lacrimarum valle.',
      'Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte.',
      'Et Iesum, benedictum fructum ventris tui, nobis, post hoc exsilium, ostende.',
      'O clemens, o pia, o dulcis Virgo Maria!',
    ],
    source: compendium,
  },
  {
    id: 'versiculum-salve',
    locale: 'la',
    title: 'Versiculum post Salve Regina',
    lines: [
      'Ora pro nobis, sancta Dei Genetrix.',
      'Ut digni efficiamur promissionibus Christi.',
    ],
    responseFrom: 1,
    source: traditional,
  },
  {
    id: 'oratio-litaniarum',
    locale: 'la',
    title: 'Oratio post Litanias',
    lines: [
      'Concede nos famulos tuos, quaesumus, Domine Deus,',
      'perpetua mentis et corporis sanitate gaudere:',
      'et gloriosa beatae Mariae semper Virginis intercessione,',
      'a praesenti liberari tristitia, et aeterna perfrui laetitia.',
      'Per Christum Dominum nostrum.',
      'Amen.',
    ],
    source: compendium,
  },
  {
    id: 'oratio-finalis',
    locale: 'la',
    title: 'Oratio ad finem Rosarii',
    lines: [
      'Deus, cuius Unigenitus per vitam, mortem et resurrectionem suam',
      'nobis salutis aeternae praemia comparavit,',
      'concede, quaesumus: ut haec mysteria sacratissimo beatae Mariae Virginis Rosario recolentes,',
      'et imitemur quod continent, et quod promittunt assequamur.',
      'Per Christum Dominum nostrum.',
      'Amen.',
    ],
    source: traditional,
  },
  {
    id: 'sub-tuum',
    locale: 'la',
    title: 'Sub tuum praesidium',
    lines: [
      'Sub tuum praesidium confugimus, sancta Dei Genetrix;',
      'nostras deprecationes ne despicias in necessitatibus;',
      'sed a periculis cunctis libera nos semper,',
      'Virgo gloriosa et benedicta.',
    ],
    source: compendium,
  },
  {
    id: 'sancte-michael',
    locale: 'la',
    title: 'Oratio ad Sanctum Michaelem',
    lines: [
      'Sancte Michael Archangele, defende nos in proelio;',
      'contra nequitiam et insidias diaboli esto praesidium.',
      'Imperet illi Deus, supplices deprecamur:',
      'tuque, Princeps militiae caelestis,',
      'Satanam aliosque spiritus malignos,',
      'qui ad perditionem animarum pervagantur in mundo,',
      'divina virtute in infernum detrude.',
      'Amen.',
    ],
    source: traditional,
  },
  {
    id: 'deus-in-adiutorium',
    locale: 'la',
    title: 'Deus, in adiutorium',
    lines: ['Deus, in adiutorium meum intende.', 'Domine, ad adiuvandum me festina.'],
    responseFrom: 1,
    source: {
      name: 'Rosarium Virginis Mariae 37 (inicio con el Salmo 69, uso dominicano)',
      url: 'https://www.vatican.va/content/john-paul-ii/es/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
    },
  },
] as const;
