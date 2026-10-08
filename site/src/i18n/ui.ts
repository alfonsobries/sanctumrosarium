import type { Language } from './routes';

/**
 * The site's own words. Prayers, mysteries, quotations and their sources never live here:
 * they come from @sanctamaria/content, the same package the app prays from.
 */
const es = {
  'site.name': 'Sanctum Rosarium',
  'site.tagline': 'Reza el Santo Rosario',
  'site.description':
    'Reza el Santo Rosario cada día con la app Sanctum Rosarium: el misterio del día en un toque, con voz o a tu ritmo, en iPhone, Android y Apple Watch. Gratis, sin cuentas y sin anuncios.',
  skip: 'Ir al contenido',
  'nav.label': 'Principal',
  'nav.menu': 'Menú',
  'nav.how': 'Cómo rezar',
  'nav.mysteries': 'Misterios',
  'nav.prayers': 'Oraciones',
  'nav.today': 'Hoy',
  'nav.help': 'Ayudar',
  'nav.app': 'La app',
  'nav.language': 'English',
  'theme.toggle': 'Cambiar entre claro y oscuro',
  'store.appStore': 'Descargar en el App Store',
  'store.playStore': 'Disponible en Google Play',
  'store.free': 'Gratis · iPhone, Apple Watch y Android',

  'home.title': 'Sanctum Rosarium, la app para rezar el Santo Rosario',
  'home.kicker': 'Gratis · Sin cuentas · Sin anuncios',
  'home.headline': 'Reza el Rosario cada día',
  'home.lead':
    'El misterio del día, listo en un toque. Con voz o a tu ritmo, en el teléfono o en el Apple Watch, con cada oración tomada de fuentes de la Iglesia.',
  'home.today': 'Hoy se rezan los',
  'home.todayLink': 'Ver los misterios de hoy',
  'home.features': 'Hecha para rezar',
  'home.featuresLead':
    'Para quien reza todos los días y para quien quiere aprender. Cada pantalla tiene una tarea.',
  'feature.voice.title': 'Reza con voz',
  'feature.voice.body':
    'Dos voces rezan contigo, como en comunidad: una dirige y la otra responde. Sigue con la pantalla apagada y se controla desde los audífonos.',
  'feature.pace.title': 'A tu ritmo',
  'feature.pace.body':
    'Avanza tocando o deslizando la pantalla. Las cuentas de la decena te dicen siempre por dónde vas.',
  'feature.watch.title': 'Completo en el Apple Watch',
  'feature.watch.body':
    'El Rosario entero en la muñeca, con su propia voz, el texto para seguirlo y una vibración en cada cuenta. La corona ajusta el volumen.',
  'feature.gospel.title': 'El Evangelio de cada misterio',
  'feature.gospel.body':
    'Antes de cada decena, el pasaje que la cuenta. Cuando varios evangelistas narran el mismo misterio, cada vez lee uno distinto.',
  'feature.learn.title': 'Aprende a rezarlo',
  'feature.learn.body':
    'Cinco pasos cortos para empezar, los veinte misterios con su pasaje y cada oración con su fuente.',
  'feature.journal.title': 'Un diario tranquilo',
  'feature.journal.body':
    'Recuerda los días que rezaste. Cuenta rosarios y decenas, sin rachas ni comparaciones.',
  'feature.styles.title': 'Ocho estilos',
  'feature.styles.body':
    'De lo más sencillo a un manuscrito iluminado, la Guadalupana y una versión con letra grande. Claro y oscuro en cada uno.',
  'feature.languages.title': 'Cuatro idiomas',
  'feature.languages.body': 'Español de México y de España, inglés y latín, con voz en los cuatro.',
  'home.privacy.title': 'Lo que rezas se queda contigo',
  'home.privacy.body':
    'Sanctum Rosarium funciona sin cuenta y sin conexión. No tiene servidor ni analítica: tu diario vive solo en tu teléfono.',
  'home.learn.title': '¿Primera vez rezando el Rosario?',
  'home.learn.body':
    'Una guía paso a paso, con la corona dibujada cuenta por cuenta y cada oración completa.',
  'home.learn.cta': 'Aprende a rezarlo',
  'home.help.title': 'Gratis, para siempre',
  'home.help.body':
    'Sanctum Rosarium no tiene anuncios ni suscripciones. Se sostiene con donativos y con quien ayuda a mejorarla.',
  'home.help.cta': 'Cómo ayudar',
  'home.faq': 'Preguntas frecuentes',

  'faq.free.q': '¿Sanctum Rosarium es gratis?',
  'faq.free.a':
    'Sí. Es gratis, sin anuncios y sin compras dentro de la app. El desarrollo se sostiene con donativos.',
  'faq.offline.q': '¿Necesito internet para rezar?',
  'faq.offline.a':
    'No. Las oraciones, los textos del Evangelio y el audio vienen dentro de la app y funcionan sin conexión.',
  'faq.account.q': '¿Tengo que crear una cuenta?',
  'faq.account.a':
    'No. La app no tiene cuentas ni servidor. Tu diario se guarda solo en tu teléfono y el Apple Watch lo recibe directamente de él.',
  'faq.android.q': '¿Hay versión para Android?',
  'faq.android.a': 'Sí. Sanctum Rosarium está en el App Store para iPhone y Apple Watch, y en Google Play para Android.',
  'faq.catholic.q': '¿De dónde salen las oraciones?',
  'faq.catholic.a':
    'De fuentes oficiales de la Iglesia católica: la Santa Sede, la Conferencia del Episcopado Mexicano a través de Desde la fe y la USCCB. Cada oración muestra su fuente.',
  'faq.today.q': '¿Qué misterios se rezan hoy?',
  'faq.today.a':
    'Los lunes y sábados, los gozosos; martes y viernes, los dolorosos; miércoles y domingo, los gloriosos; los jueves, los luminosos (Rosarium Virginis Mariae 38).',

  'how.title': 'Cómo rezar el Rosario paso a paso',
  'how.description':
    'Guía para rezar el Santo Rosario: cómo empieza, cada decena, los misterios de cada día y las oraciones completas, con las citas de san Juan Pablo II.',
  'how.kicker': 'Guía',
  'how.lead':
    'El Rosario se reza con oraciones sencillas mientras se contempla la vida de Jesús con María. Aquí está cada paso, en el orden en que la app lo reza.',
  'how.corona': 'El rosario, cuenta por cuenta',
  'how.coronaCaption':
    'Cada cuenta es una oración: la cruz y las cuentas de abajo abren el rezo; cada grupo de diez es una decena.',
  'how.sequence': 'El orden completo',
  'how.opening': 'Al empezar',
  'how.decade': 'En cada decena',
  'how.decadeTimes': 'Se repite cinco veces, una por misterio.',
  'how.closing': 'Al terminar',
  'how.optional': 'Opcional',
  'how.announce': 'Se anuncia el misterio y se guarda un momento de silencio',
  'how.reading': 'Se lee el pasaje del Evangelio',
  'how.tenHailMarys': 'Diez Avemarías',
  'how.threeHailMarys': 'Tres Avemarías',
  'how.pope': 'Padrenuestro y Avemaría por las intenciones del Papa',
  'how.otherWays':
    'Hay otros modos legítimos de empezar y terminar según cada región (RVM 37). Este es el más difundido.',
  'how.source': 'Fuente',

  'mysteries.title': 'Los misterios del Rosario',
  'mysteries.description':
    'Los veinte misterios del Santo Rosario: gozosos, luminosos, dolorosos y gloriosos, con el pasaje del Evangelio de cada uno y el día de la semana en que se rezan.',
  'mysteries.kicker': 'Los veinte misterios',
  'mysteries.lead':
    'Cada misterio es un momento de la vida de Jesús y de María. Se rezan en cuatro grupos de cinco, uno para cada día de la semana.',
  'mysteries.days': 'Se rezan',
  'mysteries.gospel': 'Evangelio',
  'mysteries.fruit': 'Fruto',
  'mysteries.see': 'Ver los cinco misterios',
  'mysteries.order': 'Misterio',
  'mysteries.artCredit': 'Pintura',
  'mysteries.calendar': 'Qué misterios se rezan cada día',
  'mysteries.calendarSource':
    'Distribución que propone san Juan Pablo II en Rosarium Virginis Mariae 38, sin quitar la libertad de elegir otros.',
  'mysteries.setTitle': '{set} del Rosario',
  'mysteries.setDescription':
    'Los cinco {set} del Santo Rosario, con el pasaje del Evangelio de cada uno. Se rezan {days}.',

  'today.title': '¿Qué misterios se rezan hoy?',
  'today.description':
    'Los misterios del Rosario que se rezan hoy según el día de la semana, con los cinco misterios y su pasaje del Evangelio.',
  'today.kicker': 'Hoy',
  'today.lead': 'Según el día de la semana, como propone Rosarium Virginis Mariae 38.',
  'today.week': 'Toda la semana',

  'prayers.title': 'Las oraciones del Rosario',
  'prayers.description':
    'Las oraciones del Santo Rosario completas: Padrenuestro, Avemaría, Gloria, Credo, Salve, la oración de Fátima, la Letanía lauretana y la oración final, con su fuente.',
  'prayers.kicker': 'Oraciones',
  'prayers.lead': 'Cada oración en el orden en que se reza, con el texto de una fuente de la Iglesia.',
  'prayers.latin': 'En latín',
  'prayers.source': 'Texto de',
  'prayers.accessed': 'consultado el',
  'prayers.prayerTitle': '{prayer}: oración completa',
  'prayers.prayerDescription': '{prayer}, oración del Santo Rosario. Texto completo con su fuente{latin}.',
  'prayers.withLatin': ', en español y en latín',
  'prayers.whereInRosary': 'Dónde se reza',
  'prayers.respond': 'La segunda parte la responden todos.',
  'where.opening': 'Al empezar el Rosario',
  'where.decade': 'En cada decena',
  'where.closing': 'Al terminar el Rosario',
  'where.optionalLitany': 'Al final, si se reza la Letanía',
  'where.count': '{count} veces en el Rosario completo',
  'where.once': 'Una vez en el Rosario completo',
  'prayers.all': 'Todas las oraciones del Rosario',
  'prayers.litanyNote': 'A cada invocación se responde con la segunda parte.',
  'category.magisterium': 'Magisterio',
  'category.liturgy': 'Liturgia',
  'category.pious-tradition': 'Tradición piadosa',

  'promises.title': 'Las quince promesas del Rosario',
  'promises.description':
    'Las quince promesas de la Virgen a quienes rezan el Rosario, según la tradición que difundió el beato Alano de la Rupe, con su origen y cómo entenderlas.',
  'promises.kicker': 'Tradición piadosa',
  'promises.understanding': 'Cómo entenderlas',

  'help.title': 'Cómo ayudar a Sanctum Rosarium',
  'help.description':
    'Sanctum Rosarium es gratis y sin anuncios. Puedes ayudar con un donativo para el desarrollo y los costos técnicos, o ayudando a mejorar la app.',
  'help.kicker': 'Ayudar',
  'help.headline': 'Gratis para todos, sostenida por muchos',
  'help.lead':
    'Sanctum Rosarium es gratis y lo será siempre: sin anuncios, sin suscripciones y sin vender datos. La hacemos para que más personas recen el Rosario.',
  'help.donate.title': 'Dona para el desarrollo',
  'help.donate.body': 'Tu donativo paga lo que cuesta mantener la app viva y mejorarla:',
  'help.donate.cost1': 'Las cuentas de desarrollador de Apple y Google para publicarla.',
  'help.donate.cost2': 'Las voces del audio en cada idioma.',
  'help.donate.cost3': 'El dominio y el hospedaje de este sitio.',
  'help.donate.cost4': 'El tiempo de desarrollo y la revisión de los textos.',
  'help.donate.cta': 'Donar',
  'help.donate.ask': '¿Quieres apoyar con un donativo? Escríbenos y te contamos cómo.',
  'help.contribute.title': 'Ayuda a mejorarla',
  'help.contribute.lead': 'Hay muchas formas de ayudar, aunque no programes.',
  'help.pray.title': 'Comparte',
  'help.pray.body': 'Recomiéndala en tu parroquia, tu grupo de oración o tu familia. Cada persona que reza cuenta.',
  'help.review.title': 'Revisa los textos',
  'help.review.body':
    'Si eres sacerdote, religioso o catequista, ayúdanos a confirmar que cada texto y cada explicación son fieles a la Iglesia.',
  'help.translate.title': 'Lleva la app a tu idioma',
  'help.translate.body':
    'Portugués, italiano, francés, polaco… Cada traducción usa los textos aprobados por la Iglesia de ese país.',
  'help.report.title': 'Cuéntanos qué falla',
  'help.report.body': 'Un error en un texto, un audio que se corta, una idea para mejorar: todo ayuda.',
  'help.code.title': 'Programa o diseña',
  'help.code.body':
    'Sanctum Rosarium será de código abierto. Si sabes React Native, Swift, Kotlin, diseño o ilustración, tu ayuda es bienvenida.',
  'help.contact': 'Escríbenos',
  'help.github': 'Ver en GitHub',
  'terms.title': 'Términos y condiciones',
  'terms.description': 'Los términos de uso de la app Sanctum Rosarium y de este sitio.',
  'support.title': 'Soporte',
  'support.description': 'Ayuda con la app Sanctum Rosarium: preguntas frecuentes y cómo escribirnos.',
  'support.lead': 'Si algo no funciona, encontraste un error en un texto o tienes una idea, escríbenos. Leemos cada mensaje.',
  'support.write': 'Escribir a soporte',
  'support.faq': 'Preguntas frecuentes',
  'legal.updated': 'Última actualización: 8 de octubre de 2026',
  'footer.legal': 'Legal',

  'privacy.title': 'Privacidad',
  'privacy.description': 'Sanctum Rosarium no recopila datos: no tiene cuentas, servidor ni analítica.',

  'footer.about':
    'Sanctum Rosarium es una app católica, gratuita y sin anuncios para rezar el Santo Rosario.',
  'footer.pray': 'Rezar',
  'footer.learn': 'Aprender',
  'footer.project': 'Proyecto',
  'footer.sources': 'Las oraciones y citas vienen de la Santa Sede, Desde la fe y la USCCB.',
  'footer.art': 'Pinturas de dominio público vía Wikimedia Commons.',

  'notFound.title': 'Esta página no existe',
  'notFound.body': 'Quizá buscabas cómo rezar el Rosario o los misterios de hoy.',

  'breadcrumb.home': 'Inicio',
  'weekday.0': 'domingo',
  'weekday.1': 'lunes',
  'weekday.2': 'martes',
  'weekday.3': 'miércoles',
  'weekday.4': 'jueves',
  'weekday.5': 'viernes',
  'weekday.6': 'sábado',
  and: 'y',
};

type Key = keyof typeof es;

const en: Record<Key, string> = {
  'site.name': 'Sanctum Rosarium',
  'site.tagline': 'Pray the Holy Rosary',
  'site.description':
    "Pray the Holy Rosary every day with the Sanctum Rosarium app: the day's mystery in one tap, with a voice or at your own pace, on iPhone, Android and Apple Watch. Free, with no account and no ads.",
  skip: 'Skip to content',
  'nav.label': 'Main',
  'nav.menu': 'Menu',
  'nav.how': 'How to pray',
  'nav.mysteries': 'Mysteries',
  'nav.prayers': 'Prayers',
  'nav.today': 'Today',
  'nav.help': 'Help',
  'nav.app': 'The app',
  'nav.language': 'Español',
  'theme.toggle': 'Switch between light and dark',
  'store.appStore': 'Download on the App Store',
  'store.playStore': 'Get it on Google Play',
  'store.free': 'Free · iPhone, Apple Watch and Android',

  'home.title': 'Sanctum Rosarium, the app to pray the Holy Rosary',
  'home.kicker': 'Free · No account · No ads',
  'home.headline': 'Pray the Rosary every day',
  'home.lead':
    "The day's mystery, ready in one tap. With a voice or at your own pace, on your phone or your Apple Watch, with every prayer taken from Church sources.",
  'home.today': 'Today we pray the',
  'home.todayLink': "See today's mysteries",
  'home.features': 'Made for prayer',
  'home.featuresLead':
    'For those who pray every day and for those who want to learn. Every screen has one task.',
  'feature.voice.title': 'Pray with a voice',
  'feature.voice.body':
    'Two voices pray with you, as in a community: one leads and the other answers. It keeps going with the screen off and answers your headphones.',
  'feature.pace.title': 'At your own pace',
  'feature.pace.body': "Move on with a tap or a swipe. The decade's beads always show where you are.",
  'feature.watch.title': 'Complete on Apple Watch',
  'feature.watch.body':
    'The whole Rosary on your wrist, with its own voice, the words to follow along and a tap on every bead. The crown sets the volume.',
  'feature.gospel.title': 'The Gospel of each mystery',
  'feature.gospel.body':
    'Before each decade, the passage that tells it. When several evangelists tell the same mystery, each time reads a different one.',
  'feature.learn.title': 'Learn to pray it',
  'feature.learn.body':
    'Five short steps to begin, the twenty mysteries with their passage and every prayer with its source.',
  'feature.journal.title': 'A quiet journal',
  'feature.journal.body':
    'Remember the days you prayed. It counts rosaries and decades, with no streaks and no comparisons.',
  'feature.styles.title': 'Eight styles',
  'feature.styles.body':
    'From the plainest to an illuminated manuscript, Our Lady of Guadalupe and a large print edition. Light and dark in each.',
  'feature.languages.title': 'Four languages',
  'feature.languages.body': 'Spanish from Mexico and from Spain, English and Latin, with a voice in all four.',
  'home.privacy.title': 'What you pray stays with you',
  'home.privacy.body':
    'Sanctum Rosarium works with no account and no connection. It has no server and no analytics: your journal lives only on your phone.',
  'home.learn.title': 'Praying the Rosary for the first time?',
  'home.learn.body': 'A step-by-step guide, with the rosary drawn bead by bead and every prayer in full.',
  'home.learn.cta': 'Learn to pray it',
  'home.help.title': 'Free, for good',
  'home.help.body':
    'Sanctum Rosarium has no ads and no subscriptions. It is kept alive by donations and by those who help make it better.',
  'home.help.cta': 'How to help',
  'home.faq': 'Questions',

  'faq.free.q': 'Is Sanctum Rosarium free?',
  'faq.free.a': 'Yes. It is free, with no ads and no in-app purchases. Its development is funded by donations.',
  'faq.offline.q': 'Do I need the internet to pray?',
  'faq.offline.a': 'No. The prayers, the Gospel passages and the audio come inside the app and work offline.',
  'faq.account.q': 'Do I have to create an account?',
  'faq.account.a':
    'No. The app has no accounts and no server. Your journal is stored only on your phone, and your Apple Watch receives it straight from there.',
  'faq.android.q': 'Is there an Android version?',
  'faq.android.a': 'Yes. Sanctum Rosarium is on the App Store for iPhone and Apple Watch, and on Google Play for Android.',
  'faq.catholic.q': 'Where do the prayers come from?',
  'faq.catholic.a':
    "From official sources of the Catholic Church: the Holy See, the Mexican bishops' Desde la fe and the USCCB. Every prayer shows its source.",
  'faq.today.q': 'Which mysteries are prayed today?',
  'faq.today.a':
    'Joyful on Monday and Saturday, sorrowful on Tuesday and Friday, glorious on Wednesday and Sunday, luminous on Thursday (Rosarium Virginis Mariae 38).',

  'how.title': 'How to pray the Rosary, step by step',
  'how.description':
    "A guide to praying the Holy Rosary: how it begins, each decade, the mysteries for each day and the prayers in full, with Saint John Paul II's words.",
  'how.kicker': 'Guide',
  'how.lead':
    'The Rosary is prayed with simple prayers while contemplating the life of Jesus with Mary. Here is every step, in the order the app prays it.',
  'how.corona': 'The rosary, bead by bead',
  'how.coronaCaption':
    'Each bead is a prayer: the cross and the beads below open the prayer; each group of ten is a decade.',
  'how.sequence': 'The whole order',
  'how.opening': 'To begin',
  'how.decade': 'In each decade',
  'how.decadeTimes': 'Five times, one for each mystery.',
  'how.closing': 'To close',
  'how.optional': 'Optional',
  'how.announce': 'The mystery is announced, followed by a moment of silence',
  'how.reading': 'The Gospel passage is read',
  'how.tenHailMarys': 'Ten Hail Marys',
  'how.threeHailMarys': 'Three Hail Marys',
  'how.pope': "An Our Father and a Hail Mary for the Pope's intentions",
  'how.otherWays':
    'There are other legitimate ways to begin and close, depending on the region (RVM 37). This is the most widespread.',
  'how.source': 'Source',

  'mysteries.title': 'The Mysteries of the Rosary',
  'mysteries.description':
    'The twenty mysteries of the Holy Rosary: joyful, luminous, sorrowful and glorious, with the Gospel passage of each one and the day of the week they are prayed.',
  'mysteries.kicker': 'The twenty mysteries',
  'mysteries.lead':
    'Each mystery is a moment in the life of Jesus and Mary. They are prayed in four sets of five, one for each day of the week.',
  'mysteries.days': 'Prayed on',
  'mysteries.gospel': 'Gospel',
  'mysteries.fruit': 'Fruit',
  'mysteries.see': 'See the five mysteries',
  'mysteries.order': 'Mystery',
  'mysteries.artCredit': 'Painting',
  'mysteries.calendar': 'Which mysteries to pray each day',
  'mysteries.calendarSource':
    'The distribution Saint John Paul II proposes in Rosarium Virginis Mariae 38, leaving you free to choose others.',
  'mysteries.setTitle': '{set} of the Rosary',
  'mysteries.setDescription':
    'The five {set} of the Holy Rosary, with the Gospel passage of each one. Prayed on {days}.',

  'today.title': "Today's Rosary mysteries",
  'today.description':
    'The mysteries of the Rosary prayed today by day of the week, with the five mysteries and their Gospel passage.',
  'today.kicker': 'Today',
  'today.lead': 'By day of the week, as Rosarium Virginis Mariae 38 proposes.',
  'today.week': 'The whole week',

  'prayers.title': 'The Prayers of the Rosary',
  'prayers.description':
    'The prayers of the Holy Rosary in full: Our Father, Hail Mary, Glory Be, Creed, Hail Holy Queen, the Fatima Prayer, the Litany of Loreto and the closing prayer, with their source.',
  'prayers.kicker': 'Prayers',
  'prayers.lead': 'Every prayer in the order it is prayed, with the text of a Church source.',
  'prayers.latin': 'In Latin',
  'prayers.source': 'Text from',
  'prayers.accessed': 'accessed',
  'prayers.prayerTitle': '{prayer}: full prayer',
  'prayers.prayerDescription': '{prayer}, a prayer of the Holy Rosary. Full text with its source{latin}.',
  'prayers.withLatin': ', in English and in Latin',
  'prayers.whereInRosary': 'Where it is prayed',
  'prayers.respond': 'Everyone answers the second part.',
  'where.opening': 'At the start of the Rosary',
  'where.decade': 'In every decade',
  'where.closing': 'At the end of the Rosary',
  'where.optionalLitany': 'At the end, when the Litany is prayed',
  'where.count': '{count} times in the full Rosary',
  'where.once': 'Once in the full Rosary',
  'prayers.all': 'All the prayers of the Rosary',
  'prayers.litanyNote': 'Each invocation is answered with the second part.',
  'category.magisterium': 'Magisterium',
  'category.liturgy': 'Liturgy',
  'category.pious-tradition': 'Pious tradition',

  'promises.title': 'The Fifteen Promises of the Rosary',
  'promises.description':
    'The fifteen promises of Our Lady to those who pray the Rosary, from the tradition spread by Blessed Alan de la Roche, with their origin and how to read them.',
  'promises.kicker': 'Pious tradition',
  'promises.understanding': 'How to read them',

  'help.title': 'How to help Sanctum Rosarium',
  'help.description':
    'Sanctum Rosarium is free and has no ads. You can help with a donation for its development and technical costs, or by helping make the app better.',
  'help.kicker': 'Help',
  'help.headline': 'Free for everyone, kept by many',
  'help.lead':
    'Sanctum Rosarium is free and always will be: no ads, no subscriptions and no selling data. We make it so more people pray the Rosary.',
  'help.donate.title': 'Donate to its development',
  'help.donate.body': 'Your donation pays for what it takes to keep the app alive and make it better:',
  'help.donate.cost1': 'The Apple and Google developer accounts to publish it.',
  'help.donate.cost2': 'The voices of the audio in every language.',
  'help.donate.cost3': 'The domain and hosting of this site.',
  'help.donate.cost4': 'The development time and the review of the texts.',
  'help.donate.cta': 'Donate',
  'help.donate.ask': 'Would you like to support it with a donation? Write to us and we will tell you how.',
  'help.contribute.title': 'Help make it better',
  'help.contribute.lead': "There are many ways to help, even if you don't write code.",
  'help.pray.title': 'Share it',
  'help.pray.body': 'Recommend it to your parish, your prayer group or your family. Every person who prays counts.',
  'help.review.title': 'Review the texts',
  'help.review.body':
    'If you are a priest, a religious or a catechist, help us confirm that every text and every explanation is faithful to the Church.',
  'help.translate.title': 'Bring the app to your language',
  'help.translate.body':
    "Portuguese, Italian, French, Polish… Each translation uses the texts approved by the Church in that country.",
  'help.report.title': "Tell us what's wrong",
  'help.report.body': 'A mistake in a text, an audio that cuts off, an idea to make it better: it all helps.',
  'help.code.title': 'Code or design',
  'help.code.body':
    'Sanctum Rosarium will be open source. If you know React Native, Swift, Kotlin, design or illustration, your help is welcome.',
  'help.contact': 'Write to us',
  'help.github': 'See it on GitHub',
  'terms.title': 'Terms of use',
  'terms.description': 'The terms of use of the Sanctum Rosarium app and this website.',
  'support.title': 'Support',
  'support.description': 'Help with the Sanctum Rosarium app: common questions and how to reach us.',
  'support.lead': 'If something does not work, you found a mistake in a text or you have an idea, write to us. We read every message.',
  'support.write': 'Write to support',
  'support.faq': 'Questions',
  'legal.updated': 'Last updated: October 8, 2026',
  'footer.legal': 'Legal',

  'privacy.title': 'Privacy',
  'privacy.description': 'Sanctum Rosarium collects no data: it has no accounts, no server and no analytics.',

  'footer.about': 'Sanctum Rosarium is a free Catholic app with no ads to pray the Holy Rosary.',
  'footer.pray': 'Pray',
  'footer.learn': 'Learn',
  'footer.project': 'Project',
  'footer.sources': 'Prayers and quotations come from the Holy See, Desde la fe and the USCCB.',
  'footer.art': 'Public domain paintings via Wikimedia Commons.',

  'notFound.title': 'This page does not exist',
  'notFound.body': "Maybe you were looking for how to pray the Rosary or today's mysteries.",

  'breadcrumb.home': 'Home',
  'weekday.0': 'Sunday',
  'weekday.1': 'Monday',
  'weekday.2': 'Tuesday',
  'weekday.3': 'Wednesday',
  'weekday.4': 'Thursday',
  'weekday.5': 'Friday',
  'weekday.6': 'Saturday',
  and: 'and',
};

const strings: Record<Language, Record<Key, string>> = { es, en };

export type UiKey = Key;

/** A translator for one language; `{name}` placeholders are filled from `values`. */
export function t(language: Language) {
  return (key: Key, values: Record<string, string> = {}): string =>
    strings[language][key].replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? `{${name}}`);
}

/** "lunes y sábado", "Monday and Saturday". */
export function listOf(items: readonly string[], language: Language): string {
  if (items.length <= 1) {
    return items.join('');
  }
  return `${items.slice(0, -1).join(', ')} ${t(language)('and')} ${items.at(-1)}`;
}
