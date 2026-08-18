import type { PrayerText } from '../types';

/**
 * One source per prayer, pointing at the page that actually publishes that text. The Rosary page
 * of the USCCB does not print most of them, so citing it for everything would make the content
 * unauditable.
 */
const usccbPrayer = (slug: string) =>
  ({
    name: 'United States Conference of Catholic Bishops',
    url: `https://www.usccb.org/prayers/${slug}`,
  }) as const;

const usccbRosary = {
  name: 'United States Conference of Catholic Bishops, How to Pray the Rosary',
  url: 'https://www.usccb.org/how-to-pray-the-rosary',
} as const;

const hours = {
  name: 'Liturgy of the Hours invitatory (Ps 70:1). RVM 37 names this opening; the words are the psalm verse, not a Catechism paragraph.',
  url: 'https://www.vatican.va/content/john-paul-ii/en/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html',
} as const;

export const englishPrayers: readonly PrayerText[] = [
  {
    id: 'signum-crucis',
    locale: 'en-US',
    title: 'Sign of the Cross',
    lines: [
      'In the name of the Father, and of the Son, and of the Holy Spirit.',
      'Amen.',
    ],
    source: usccbPrayer('sign-cross'),
  },
  {
    id: 'credo',
    locale: 'en-US',
    title: "The Apostles' Creed",
    lines: [
      'I believe in God, the Father almighty, Creator of heaven and earth,',
      'and in Jesus Christ, his only Son, our Lord,',
      'who was conceived by the Holy Spirit, born of the Virgin Mary,',
      'suffered under Pontius Pilate, was crucified, died and was buried;',
      'he descended into hell; on the third day he rose again from the dead;',
      'he ascended into heaven, and is seated at the right hand of God the Father almighty;',
      'from there he will come to judge the living and the dead.',
      'I believe in the Holy Spirit, the holy catholic Church,',
      'the communion of saints, the forgiveness of sins,',
      'the resurrection of the body, and life everlasting.',
      'Amen.',
    ],
    source: usccbPrayer('apostles-creed'),
  },
  {
    id: 'pater-noster',
    locale: 'en-US',
    title: 'Our Father',
    lines: [
      'Our Father, who art in heaven,',
      'hallowed be thy name;',
      'thy kingdom come, thy will be done',
      'on earth as it is in heaven.',
      'Give us this day our daily bread,',
      'and forgive us our trespasses,',
      'as we forgive those who trespass against us;',
      'and lead us not into temptation,',
      'but deliver us from evil.',
      'Amen.',
    ],
    responseFrom: 4,
    source: usccbPrayer('our-father'),
  },
  {
    id: 'ave-maria',
    locale: 'en-US',
    title: 'Hail Mary',
    lines: [
      'Hail, Mary, full of grace,',
      'the Lord is with thee.',
      'Blessed art thou among women',
      'and blessed is the fruit of thy womb, Jesus.',
      'Holy Mary, Mother of God,',
      'pray for us sinners,',
      'now and at the hour of our death.',
      'Amen.',
    ],
    responseFrom: 4,
    source: usccbPrayer('hail-mary'),
  },
  {
    id: 'gloria-patri',
    locale: 'en-US',
    title: 'Glory Be',
    lines: [
      'Glory be to the Father and to the Son and to the Holy Spirit,',
      'as it was in the beginning, is now, and ever shall be,',
      'world without end.',
      'Amen.',
    ],
    responseFrom: 1,
    source: usccbPrayer('glory-be'),
  },
  {
    id: 'oratio-fatimae',
    locale: 'en-US',
    title: 'Fatima Prayer',
    lines: [
      'O my Jesus, forgive us our sins,',
      'save us from the fires of hell;',
      'lead all souls to Heaven,',
      'especially those who have most need of your mercy.',
    ],
    source: usccbRosary,
  },
  {
    id: 'salve-regina',
    locale: 'en-US',
    title: 'Hail, Holy Queen',
    lines: [
      'Hail, Holy Queen, Mother of Mercy,',
      'our life, our sweetness and our hope.',
      'To thee do we cry, poor banished children of Eve.',
      'To thee do we send up our sighs, mourning and weeping in this valley of tears.',
      'Turn then, most gracious advocate, thine eyes of mercy toward us,',
      'and after this our exile show unto us the blessed fruit of thy womb, Jesus.',
      'O clement, O loving, O sweet Virgin Mary.',
    ],
    source: usccbPrayer('hail-holy-queen'),
  },
  {
    id: 'versiculum-salve',
    locale: 'en-US',
    title: 'Versicle after the Hail, Holy Queen',
    lines: [
      'Pray for us, O holy Mother of God.',
      'That we may be made worthy of the promises of Christ.',
    ],
    responseFrom: 1,
    source: usccbPrayer('hail-holy-queen'),
  },
  {
    id: 'oratio-litaniarum',
    locale: 'en-US',
    title: 'Prayer after the Litany',
    lines: [
      'Grant, we beseech thee, O Lord God,',
      'that we, your servants, may enjoy perpetual health of mind and body;',
      'and by the glorious intercession of the Blessed Mary, ever Virgin,',
      'may be delivered from present sorrow, and obtain eternal joy.',
      'Through Christ our Lord.',
      'Amen.',
    ],
    source: usccbPrayer('litany-blessed-virgin-mary'),
  },
  {
    id: 'oratio-finalis',
    locale: 'en-US',
    title: 'Closing prayer',
    lines: [
      'O God, whose Only Begotten Son, by his life, Death, and Resurrection,',
      'has purchased for us the rewards of eternal life,',
      'grant, we beseech thee, that while meditating on these mysteries',
      'of the most holy Rosary of the Blessed Virgin Mary,',
      'we may imitate what they contain and obtain what they promise,',
      'through the same Christ our Lord.',
      'Amen.',
    ],
    source: usccbRosary,
  },
  {
    id: 'deus-in-adiutorium',
    locale: 'en-US',
    title: 'O God, come to my assistance',
    lines: ['O God, come to my assistance.', 'O Lord, make haste to help me.'],
    responseFrom: 1,
    source: hours,
  },
  {
    id: 'sub-tuum',
    locale: 'en-US',
    title: 'We fly to thy protection',
    lines: [
      'We fly to thy protection, O holy Mother of God.',
      'Despise not our petitions in our necessities,',
      'but deliver us always from all dangers,',
      'O glorious and blessed Virgin.',
    ],
    source: usccbPrayer('sub-tuum-praesidium-your-protection'),
  },
  {
    id: 'sancte-michael',
    locale: 'en-US',
    title: 'Prayer to Saint Michael',
    lines: [
      'Saint Michael the Archangel, defend us in battle.',
      'Be our protection against the wickedness and snares of the devil.',
      'May God rebuke him, we humbly pray;',
      'and do thou, O Prince of the heavenly host,',
      'by the power of God, cast into hell Satan and all the evil spirits',
      'who prowl about the world seeking the ruin of souls.',
      'Amen.',
    ],
    source: usccbPrayer('prayer-saint-michael-archangel'),
  },
] as const;
