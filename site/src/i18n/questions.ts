import type { UiLanguage } from './ui';

/**
 * The questions page: indulgences with their real conditions, the fifteen promises with
 * their status, and why the app promises nothing. Written against
 * docs/referencias/rosario-doctrina.md; every claim carries its source.
 */
export type QuestionSection = {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly source?: string;
};

export type QuestionsContent = {
  readonly title: string;
  readonly lead: string;
  readonly sections: readonly QuestionSection[];
};

export const questions: Record<UiLanguage, QuestionsContent> = {
  es: {
    title: 'Preguntas',
    lead: 'Lo que la Iglesia enseña sobre las indulgencias del Rosario, lo que son las quince promesas, y por qué esta app no te promete nada.',
    sections: [
      {
        id: 'indulgencia',
        title: '¿Qué indulgencia tiene rezar el Rosario?',
        paragraphs: [
          'La Iglesia concede indulgencia plenaria a quien reza cinco decenas seguidas, meditando los misterios, en una iglesia u oratorio, en familia, en comunidad religiosa, en una asociación de fieles o, en general, cuando varios se reúnen con un fin honesto. Rezado en otras circunstancias, por ejemplo solo en casa, la indulgencia es parcial.',
          'También la concede a quien se une en directo, por radio o televisión, al Rosario rezado por el Papa. La concesión habla de la retransmisión en directo, no de grabaciones.',
          'La indulgencia plenaria pide además las condiciones habituales: confesión sacramental, comunión eucarística, oración por las intenciones del Papa y el desapego de todo pecado, incluso venial. Si falta alguna, la indulgencia es parcial.',
          'Se puede ganar una plenaria al día, y se puede ofrecer por un difunto a modo de sufragio: la Iglesia la presenta a Dios por él, no dispone de su aplicación.',
        ],
        source: 'Enchiridion Indulgentiarum, concesión 17 y normas 17-21.',
      },
      {
        id: 'condiciones',
        title: '¿Qué cuentan como condiciones habituales?',
        paragraphs: [
          'Las tres condiciones pueden cumplirse varios días antes o después de la obra; conviene que la comunión y la oración por el Papa sean el mismo día. Una misma confesión sirve para varias indulgencias plenarias; la comunión y la oración por el Papa se piden para cada una.',
          'La oración por las intenciones del Papa se cumple con un Padrenuestro y un Avemaría, o con otra oración que elijas.',
          'Basta con tener la intención de ganarla, aunque sea general: no hay que acordarse de cada indulgencia por separado.',
        ],
        source: 'Enchiridion Indulgentiarum, normas 17, 18 y 20.',
      },
      {
        id: 'promesas',
        title: '¿Y las quince promesas de la Virgen?',
        paragraphs: [
          'Las quince promesas las transmite el beato Alano de la Roche, dominico del siglo XV, como dadas por la Virgen a santo Domingo y a él. Son tradición piadosa: ningún documento pontificio las enumera y no son magisterio ni revelación pública.',
          'Se publican con imprimatur en devocionarios, lo cual garantiza que no contienen error doctrinal, no que el episodio sea histórico. La tradición misma las entiende bajo la condición de la fe, la conversión y la perseverancia: no son un mecanismo automático.',
        ],
        source:
          'Beato Alano de la Roche, s. XV. Texto publicado con nihil obstat e imprimi potest dominicanos (Rosary Center). Sobre la condición de la fe y la conversión: san Luis María de Montfort, El secreto admirable del Santísimo Rosario, rosa 41.',
      },
      {
        id: 'la-app',
        title: '¿La app me da la indulgencia?',
        paragraphs: [
          'No. Las indulgencias las concede la Iglesia bajo sus condiciones, y varias son interiores, como el estado de gracia y el desapego del pecado: ninguna pantalla puede verificarlas. La app describe las condiciones reales y nada más: nunca marca una indulgencia como conseguida.',
          'Por lo mismo, la app cuenta lo que se puede contar: rosarios, decenas, días. Nunca cuenta gracias, ni promete efectos espirituales por usarla.',
        ],
      },
      {
        id: 'rosario-bendecido',
        title: '¿Un rosario bendecido vale más?',
        paragraphs: [
          'El rosario de cuentas bendecido por un sacerdote o diácono es un sacramental, y su uso devoto lleva indulgencia parcial. No es un amuleto: los sacramentales no dan la gracia por sí solos, disponen a recibirla, y la bendición mira sobre todo a quien reza y medita los misterios. Atribuir el efecto a la sola materialidad del objeto sería superstición.',
        ],
        source:
          'Enchiridion Indulgentiarum, concesión 15; Catecismo de la Iglesia Católica 1670 y 2111; Rosarium Virginis Mariae 28.',
      },
    ],
  },
  en: {
    title: 'Questions',
    lead: 'What the Church teaches about the Rosary indulgences, what the fifteen promises are, and why this app makes no promises.',
    sections: [
      {
        id: 'indulgence',
        title: 'What indulgence does praying the Rosary carry?',
        paragraphs: [
          'The Church grants a plenary indulgence for praying five decades in one go, meditating on the mysteries, in a church or oratory, in the family, in a religious community, in an association of the faithful or, in general, whenever several people gather for an honest purpose. Prayed in any other setting - alone at home, for instance - the indulgence is partial.',
          'She also grants it for joining, live on radio or television, the Rosary prayed by the Pope. The grant speaks of the live broadcast, not of recordings.',
          'The plenary indulgence also asks for the usual conditions: sacramental confession, Eucharistic communion, prayer for the intentions of the Pope, and detachment from all sin, even venial. If any is missing, the indulgence is partial.',
          'One plenary indulgence can be gained per day, and it can be offered for one of the dead by way of suffrage: the Church presents it to God for them; she does not dispose of how it is applied.',
        ],
        source: 'Enchiridion Indulgentiarum, grant 17 and norms 17-21.',
      },
      {
        id: 'conditions',
        title: 'What counts as the usual conditions?',
        paragraphs: [
          'The three conditions may be fulfilled several days before or after the work itself, though communion and the prayer for the Pope are best made on the day itself. One confession serves several plenary indulgences; communion and the prayer for the Pope are asked for each one.',
          "The prayer for the Pope's intentions is fulfilled with one Our Father and one Hail Mary, or another prayer of your choosing.",
          'A general intention is enough: there is no need to call each indulgence to mind separately.',
        ],
        source: 'Enchiridion Indulgentiarum, norms 17, 18 and 20.',
      },
      {
        id: 'promises',
        title: 'What about the fifteen promises?',
        paragraphs: [
          'The fifteen promises come down through Blessed Alan de la Roche, a Dominican of the fifteenth century, as given by Our Lady to Saint Dominic and to him. They are pious tradition: no pontifical document lists them, and they are neither magisterium nor public revelation.',
          'They are printed with imprimatur in devotionals, which guarantees they contain no doctrinal error, not that the episode is historical. The tradition itself reads them under the condition of faith, conversion and perseverance: they are not an automatic mechanism.',
        ],
        source:
          'Blessed Alan de la Roche, 15th c. Text published with Dominican nihil obstat and imprimi potest (Rosary Center). On the condition of faith and conversion: Saint Louis de Montfort, The Secret of the Rosary, rose 41.',
      },
      {
        id: 'the-app',
        title: 'Does the app grant me the indulgence?',
        paragraphs: [
          'No. Indulgences are granted by the Church under her conditions, and several of them are interior - the state of grace, detachment from sin - which no screen can verify. The app describes the real conditions and nothing more: it never marks an indulgence as obtained.',
          'For the same reason, the app counts what can be counted: rosaries, decades, days. It never counts graces, and it never promises spiritual effects for using it.',
        ],
      },
      {
        id: 'blessed-rosary',
        title: 'Is a blessed rosary worth more?',
        paragraphs: [
          'A rosary blessed by a priest or deacon is a sacramental, and its devout use carries a partial indulgence. It is not an amulet: sacramentals do not confer grace by themselves, they dispose one to receive it, and the blessing looks above all to the person who prays and meditates the mysteries. Attributing the effect to the sheer materiality of the object would be superstition.',
        ],
        source:
          'Enchiridion Indulgentiarum, grant 15; Catechism of the Catholic Church 1670 and 2111; Rosarium Virginis Mariae 28.',
      },
    ],
  },
};
