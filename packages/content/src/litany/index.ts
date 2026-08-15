import type { Litany } from './types';

export * from './types';

/**
 * Litaniae Lauretanae.
 *
 * Includes the invocations added in 1980 (Mater Ecclesiae), 1995 (Regina familiae) and 2020
 * (Mater misericordiae, Mater spei, Solacium migrantium), each in the position the decree of the
 * Congregation for Divine Worship gives it.
 */
export const lauretanae: Litany = {
  id: 'lauretanae',
  lines: [
    {
      id: 'kyrie-1',
      group: 'kyrie',
      call: { la: 'Kyrie, eleison.', es: 'Señor, ten piedad.', en: 'Lord have mercy.' },
      response: 'versicle',
    },
    {
      id: 'christe-1',
      group: 'kyrie',
      call: {
        la: 'Christe, eleison.',
        es: 'Cristo, ten piedad.',
        en: 'Christ have mercy.',
      },
      response: 'versicle',
    },
    {
      id: 'kyrie-2',
      group: 'kyrie',
      call: { la: 'Kyrie, eleison.', es: 'Señor, ten piedad.', en: 'Lord have mercy.' },
      response: 'versicle',
    },
    {
      id: 'christe-audi',
      group: 'kyrie',
      call: { la: 'Christe, audi nos.', es: 'Cristo, óyenos.', en: 'Christ hear us.' },
      response: 'versicle',
    },
    {
      id: 'christe-exaudi',
      group: 'kyrie',
      call: {
        la: 'Christe, exaudi nos.',
        es: 'Cristo, escúchanos.',
        en: 'Christ graciously hear us.',
      },
      response: 'versicle',
    },
    {
      id: 'pater-de-caelis',
      group: 'trinity',
      call: {
        la: 'Pater de caelis, Deus',
        es: 'Dios, Padre celestial',
        en: 'God, the Father of heaven',
      },
      response: 'miserere',
    },
    {
      id: 'fili-redemptor',
      group: 'trinity',
      call: {
        la: 'Fili, Redemptor mundi, Deus',
        es: 'Dios, Hijo, Redentor del mundo',
        en: 'God the Son, Redeemer of the world',
      },
      response: 'miserere',
    },
    {
      id: 'spiritus-sancte',
      group: 'trinity',
      call: {
        la: 'Spiritus Sancte, Deus',
        es: 'Dios, Espíritu Santo',
        en: 'God the Holy Spirit',
      },
      response: 'miserere',
    },
    {
      id: 'sancta-trinitas',
      group: 'trinity',
      call: {
        la: 'Sancta Trinitas, unus Deus',
        es: 'Santísima Trinidad, un solo Dios',
        en: 'Holy Trinity, one God',
      },
      response: 'miserere',
    },
    {
      id: 'sancta-maria',
      group: 'marian',
      call: { la: 'Sancta Maria', es: 'Santa María', en: 'Holy Mary' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'sancta-dei-genetrix',
      group: 'marian',
      call: {
        la: 'Sancta Dei Genetrix',
        es: 'Santa Madre de Dios',
        en: 'Holy Mother of God',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'sancta-virgo-virginum',
      group: 'marian',
      call: {
        la: 'Sancta Virgo virginum',
        es: 'Santa Virgen de las vírgenes',
        en: 'Holy Virgin of virgins',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-christi',
      group: 'marian',
      call: { la: 'Mater Christi', es: 'Madre de Cristo', en: 'Mother of Christ' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-ecclesiae',
      group: 'marian',
      call: {
        la: 'Mater Ecclesiae',
        es: 'Madre de la Iglesia',
        en: 'Mother of the Church',
      },
      response: 'ora-pro-nobis',
      addedIn: 1980,
    },
    {
      id: 'mater-misericordiae',
      group: 'marian',
      call: {
        la: 'Mater misericordiae',
        es: 'Madre de la misericordia',
        en: 'Mother of Mercy',
      },
      response: 'ora-pro-nobis',
      addedIn: 2020,
    },
    {
      id: 'mater-divinae-gratiae',
      group: 'marian',
      call: {
        la: 'Mater divinae gratiae',
        es: 'Madre de la divina gracia',
        en: 'Mother of divine grace',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-spei',
      group: 'marian',
      call: { la: 'Mater spei', es: 'Madre de la esperanza', en: 'Mother of Hope' },
      response: 'ora-pro-nobis',
      addedIn: 2020,
    },
    {
      id: 'mater-purissima',
      group: 'marian',
      call: { la: 'Mater purissima', es: 'Madre purísima', en: 'Mother most pure' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-castissima',
      group: 'marian',
      call: { la: 'Mater castissima', es: 'Madre castísima', en: 'Mother most chaste' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-inviolata',
      group: 'marian',
      call: { la: 'Mater inviolata', es: 'Madre siempre virgen', en: 'Mother inviolate' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-intemerata',
      group: 'marian',
      call: { la: 'Mater intemerata', es: 'Madre inmaculada', en: 'Mother undefiled' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-amabilis',
      group: 'marian',
      call: { la: 'Mater amabilis', es: 'Madre amable', en: 'Mother most amiable' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-admirabilis',
      group: 'marian',
      call: {
        la: 'Mater admirabilis',
        es: 'Madre admirable',
        en: 'Mother most admirable',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-boni-consilii',
      group: 'marian',
      call: {
        la: 'Mater boni consilii',
        es: 'Madre del buen consejo',
        en: 'Mother of good counsel',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-creatoris',
      group: 'marian',
      call: {
        la: 'Mater Creatoris',
        es: 'Madre del Creador',
        en: 'Mother of our Creator',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'mater-salvatoris',
      group: 'marian',
      call: {
        la: 'Mater Salvatoris',
        es: 'Madre del Salvador',
        en: 'Mother of our Saviour',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'virgo-prudentissima',
      group: 'marian',
      call: {
        la: 'Virgo prudentissima',
        es: 'Virgen prudentísima',
        en: 'Virgin most prudent',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'virgo-veneranda',
      group: 'marian',
      call: {
        la: 'Virgo veneranda',
        es: 'Virgen digna de veneración',
        en: 'Virgin most venerable',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'virgo-praedicanda',
      group: 'marian',
      call: {
        la: 'Virgo praedicanda',
        es: 'Virgen digna de alabanza',
        en: 'Virgin most renowned',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'virgo-potens',
      group: 'marian',
      call: { la: 'Virgo potens', es: 'Virgen poderosa', en: 'Virgin most powerful' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'virgo-clemens',
      group: 'marian',
      call: { la: 'Virgo clemens', es: 'Virgen clemente', en: 'Virgin most merciful' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'virgo-fidelis',
      group: 'marian',
      call: { la: 'Virgo fidelis', es: 'Virgen fiel', en: 'Virgin most faithful' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'speculum-iustitiae',
      group: 'marian',
      call: {
        la: 'Speculum iustitiae',
        es: 'Espejo de justicia',
        en: 'Mirror of justice',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'sedes-sapientiae',
      group: 'marian',
      call: { la: 'Sedes sapientiae', es: 'Trono de la sabiduría', en: 'Seat of wisdom' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'causa-nostrae-laetitiae',
      group: 'marian',
      call: {
        la: 'Causa nostrae laetitiae',
        es: 'Causa de nuestra alegría',
        en: 'Cause of our joy',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'vas-spirituale',
      group: 'marian',
      call: { la: 'Vas spirituale', es: 'Vaso espiritual', en: 'Spiritual vessel' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'vas-honorabile',
      group: 'marian',
      call: { la: 'Vas honorabile', es: 'Vaso digno de honor', en: 'Vessel of honour' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'vas-insigne-devotionis',
      group: 'marian',
      call: {
        la: 'Vas insigne devotionis',
        es: 'Vaso de insigne devoción',
        en: 'Singular vessel of devotion',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'rosa-mystica',
      group: 'marian',
      call: { la: 'Rosa mystica', es: 'Rosa mística', en: 'Mystical rose' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'turris-davidica',
      group: 'marian',
      call: { la: 'Turris davidica', es: 'Torre de David', en: 'Tower of David' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'turris-eburnea',
      group: 'marian',
      call: { la: 'Turris eburnea', es: 'Torre de marfil', en: 'Tower of ivory' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'domus-aurea',
      group: 'marian',
      call: { la: 'Domus aurea', es: 'Casa de oro', en: 'House of gold' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'foederis-arca',
      group: 'marian',
      call: { la: 'Foederis arca', es: 'Arca de la Alianza', en: 'Ark of the covenant' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'ianua-caeli',
      group: 'marian',
      call: { la: 'Ianua caeli', es: 'Puerta del cielo', en: 'Gate of heaven' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'stella-matutina',
      group: 'marian',
      call: { la: 'Stella matutina', es: 'Estrella de la mañana', en: 'Morning star' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'salus-infirmorum',
      group: 'marian',
      call: {
        la: 'Salus infirmorum',
        es: 'Salud de los enfermos',
        en: 'Health of the sick',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'refugium-peccatorum',
      group: 'marian',
      call: {
        la: 'Refugium peccatorum',
        es: 'Refugio de los pecadores',
        en: 'Refuge of sinners',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'solacium-migrantium',
      group: 'marian',
      call: {
        la: 'Solacium migrantium',
        es: 'Consuelo de los migrantes',
        en: 'Solace of Migrants',
      },
      response: 'ora-pro-nobis',
      addedIn: 2020,
    },
    {
      id: 'consolatrix-afflictorum',
      group: 'marian',
      call: {
        la: 'Consolatrix afflictorum',
        es: 'Consoladora de los afligidos',
        en: 'Comfort of the afflicted',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'auxilium-christianorum',
      group: 'marian',
      call: {
        la: 'Auxilium christianorum',
        es: 'Auxilio de los cristianos',
        en: 'Help of Christians',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-angelorum',
      group: 'marian',
      call: { la: 'Regina angelorum', es: 'Reina de los Ángeles', en: 'Queen of Angels' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-patriarcharum',
      group: 'marian',
      call: {
        la: 'Regina patriarcharum',
        es: 'Reina de los Patriarcas',
        en: 'Queen of Patriarchs',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-prophetarum',
      group: 'marian',
      call: {
        la: 'Regina prophetarum',
        es: 'Reina de los Profetas',
        en: 'Queen of Prophets',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-apostolorum',
      group: 'marian',
      call: {
        la: 'Regina apostolorum',
        es: 'Reina de los Apóstoles',
        en: 'Queen of Apostles',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-martyrum',
      group: 'marian',
      call: {
        la: 'Regina martyrum',
        es: 'Reina de los Mártires',
        en: 'Queen of Martyrs',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-confessorum',
      group: 'marian',
      call: {
        la: 'Regina confessorum',
        es: 'Reina de los Confesores',
        en: 'Queen of Confessors',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-virginum',
      group: 'marian',
      call: {
        la: 'Regina virginum',
        es: 'Reina de las Vírgenes',
        en: 'Queen of Virgins',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-sanctorum-omnium',
      group: 'marian',
      call: {
        la: 'Regina sanctorum omnium',
        es: 'Reina de todos los Santos',
        en: 'Queen of all Saints',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-sine-labe',
      group: 'marian',
      call: {
        la: 'Regina sine labe originali concepta',
        es: 'Reina concebida sin pecado original',
        en: 'Queen conceived without original sin',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-in-caelum-assumpta',
      group: 'marian',
      call: {
        la: 'Regina in caelum assumpta',
        es: 'Reina asunta a los Cielos',
        en: 'Queen assumed into heaven',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-sacratissimi-rosarii',
      group: 'marian',
      call: {
        la: 'Regina sacratissimi Rosarii',
        es: 'Reina del Santísimo Rosario',
        en: 'Queen of the most holy Rosary',
      },
      response: 'ora-pro-nobis',
    },
    {
      id: 'regina-familiae',
      group: 'marian',
      call: { la: 'Regina familiae', es: 'Reina de la familia', en: 'Queen of families' },
      response: 'ora-pro-nobis',
      addedIn: 1995,
    },
    {
      id: 'regina-pacis',
      group: 'marian',
      call: { la: 'Regina pacis', es: 'Reina de la paz', en: 'Queen of peace' },
      response: 'ora-pro-nobis',
    },
    {
      id: 'agnus-parce',
      group: 'agnus',
      call: {
        la: 'Agnus Dei, qui tollis peccata mundi',
        es: 'Cordero de Dios, que quitas el pecado del mundo',
        en: 'Lamb of God, who takes away the sins of the world',
      },
      response: 'parce',
    },
    {
      id: 'agnus-exaudi',
      group: 'agnus',
      call: {
        la: 'Agnus Dei, qui tollis peccata mundi',
        es: 'Cordero de Dios, que quitas el pecado del mundo',
        en: 'Lamb of God, who takes away the sins of the world',
      },
      response: 'exaudi',
    },
    {
      id: 'agnus-miserere',
      group: 'agnus',
      call: {
        la: 'Agnus Dei, qui tollis peccata mundi',
        es: 'Cordero de Dios, que quitas el pecado del mundo',
        en: 'Lamb of God, who takes away the sins of the world',
      },
      response: 'miserere',
    },
    {
      id: 'ora-pro-nobis-sancta',
      group: 'versicle',
      call: {
        la: 'Ora pro nobis, sancta Dei Genetrix.',
        es: 'Ruega por nosotros, Santa Madre de Dios.',
        en: 'Pray for us, O holy Mother of God.',
      },
      response: 'versicle',
    },
    {
      id: 'ut-digni',
      group: 'versicle',
      call: {
        la: 'Ut digni efficiamur promissionibus Christi.',
        es: 'Para que seamos dignos de alcanzar las promesas de Cristo.',
        en: 'That we may be made worthy of the promises of Christ.',
      },
      response: 'versicle',
    },
  ],
  responses: {
    miserere: {
      la: 'miserere nobis.',
      es: 'ten piedad de nosotros.',
      en: 'have mercy on us.',
    },
    'ora-pro-nobis': {
      la: 'ora pro nobis.',
      es: 'ruega por nosotros.',
      en: 'pray for us.',
    },
    parce: {
      la: 'parce nobis, Domine.',
      es: 'perdónanos, Señor.',
      en: 'spare us, O Lord.',
    },
    exaudi: {
      la: 'exaudi nos, Domine.',
      es: 'escúchanos, Señor.',
      en: 'graciously hear us, O Lord.',
    },
    versicle: { la: '', es: '', en: '' },
  },
  source: {
    name: 'Letanías lauretanas, texto oficial (Santa Sede) con las invocaciones añadidas en 2020',
    url: 'https://www.vatican.va/special/rosary/documents/litanie-lauretane_sp.html',
  },
};
