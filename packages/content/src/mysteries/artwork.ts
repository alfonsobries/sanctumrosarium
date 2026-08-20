import type { Artwork, MysteryId } from '../types';

const commons = (file: string): string =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

/**
 * One public-domain work per mystery. Curated for task 036: museums that allow
 * reproduction, never the Vatican Museums, never generated illustration (decision 9).
 *
 * The files live in `packages/content/art/{id}.jpg`, downloaded from Wikimedia Commons
 * as PD-Art reproductions of two-dimensional works.
 */
export const artworks: Readonly<Record<MysteryId, Artwork>> = {
  'gaudiosa-1': {
    file: 'gaudiosa-1.jpg',
    title: 'La Anunciación',
    artist: 'Fra Angelico',
    year: 'c. 1426',
    museum: 'Museo Nacional del Prado, Madrid',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('La Anunciación, by Fra Angelico, from Prado in Google Earth.jpg'),
    },
  },
  'gaudiosa-2': {
    file: 'gaudiosa-2.jpg',
    title: 'La Visitación',
    artist: 'Giotto',
    year: 'c. 1305',
    museum: 'Capilla de los Scrovegni, Padua',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Giotto - Scrovegni - -16- - Visitation.jpg'),
    },
  },
  'gaudiosa-3': {
    file: 'gaudiosa-3.jpg',
    title: 'Natividad de noche',
    artist: 'Geertgen tot Sint Jans',
    year: 'c. 1490',
    museum: 'The National Gallery, Londres',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Geertgen tot Sint Jans, The Nativity at Night, c 1490.jpg'),
    },
  },
  'gaudiosa-4': {
    file: 'gaudiosa-4.jpg',
    title: 'Presentación en el Templo',
    artist: 'Ambrogio Lorenzetti',
    year: '1342',
    museum: 'Galleria degli Uffizi, Florencia',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Ambrogio Lorenzetti 003.jpg'),
    },
  },
  'gaudiosa-5': {
    file: 'gaudiosa-5.jpg',
    title: 'Jesús entre los doctores',
    artist: 'Alberto Durero',
    year: '1506',
    museum: 'Museo Nacional Thyssen-Bornemisza, Madrid',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Albrecht Dürer 026.jpg'),
    },
  },
  'luminosa-1': {
    file: 'luminosa-1.jpg',
    title: 'El bautismo de Cristo',
    artist: 'Piero della Francesca',
    year: 'c. 1450',
    museum: 'The National Gallery, Londres',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons(
        'Piero della Francesca - Battesimo di Cristo (National Gallery, London).jpg',
      ),
    },
  },
  'luminosa-2': {
    file: 'luminosa-2.jpg',
    title: 'Las bodas de Caná',
    artist: 'Giotto',
    year: 'c. 1305',
    museum: 'Capilla de los Scrovegni, Padua',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Giotto - Scrovegni - -24- - Marriage at Cana.jpg'),
    },
  },
  'luminosa-3': {
    file: 'luminosa-3.jpg',
    title: 'El sermón de la montaña',
    artist: 'Carl Bloch',
    year: '1877',
    museum: 'Palacio de Frederiksborg, Hillerød',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Bloch-SermonOnTheMount.jpg'),
    },
  },
  'luminosa-4': {
    file: 'luminosa-4.jpg',
    title: 'La Transfiguración',
    artist: 'Giovanni Bellini',
    year: 'c. 1480',
    museum: 'Museo di Capodimonte, Nápoles',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Giovanni Bellini - Transfiguration of Christ - WGA1690.jpg'),
    },
  },
  'luminosa-5': {
    file: 'luminosa-5.jpg',
    title: 'La última cena',
    artist: 'Juan de Juanes',
    year: 'c. 1562',
    museum: 'Museo Nacional del Prado, Madrid',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Joan de Joanes - The Last Supper - WGA12058.jpg'),
    },
  },
  'dolorosa-1': {
    file: 'dolorosa-1.jpg',
    title: 'La oración en el huerto',
    artist: 'Giovanni Bellini',
    year: 'c. 1465',
    museum: 'The National Gallery, Londres',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Bellini,Giovanni - Agony in the Garden - National Gallery.jpg'),
    },
  },
  'dolorosa-2': {
    file: 'dolorosa-2.jpg',
    title: 'La flagelación de Cristo',
    artist: 'Caravaggio',
    year: '1607',
    museum: 'Museo di Capodimonte, Nápoles',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('The Flagellation of Christ-Caravaggio (1607).jpg'),
    },
  },
  'dolorosa-3': {
    file: 'dolorosa-3.jpg',
    title: 'Cristo escarnecido',
    artist: 'El Bosco',
    year: 'c. 1495-1500',
    museum: 'The National Gallery, Londres',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons(
        'Hieronymus Bosch - Christ Mocked (The Crowning with Thorns) - Google Art Project.jpg',
      ),
    },
  },
  'dolorosa-4': {
    file: 'dolorosa-4.jpg',
    title: 'Cristo con la cruz a cuestas',
    artist: 'El Greco',
    year: 'c. 1580',
    museum: 'The Metropolitan Museum of Art, Nueva York',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('El Greco - Christ Carrying the Cross - Google Art Project.jpg'),
    },
  },
  'dolorosa-5': {
    file: 'dolorosa-5.jpg',
    title: 'Cristo crucificado',
    artist: 'Diego Velázquez',
    year: 'c. 1632',
    museum: 'Museo Nacional del Prado, Madrid',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Cristo crucificado.jpg'),
    },
  },
  'gloriosa-1': {
    file: 'gloriosa-1.jpg',
    title: 'La Resurrección',
    artist: 'Piero della Francesca',
    year: 'c. 1465',
    museum: 'Museo Civico, Sansepolcro',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Resurrection (Piero della Francesca).jpeg'),
    },
  },
  'gloriosa-2': {
    file: 'gloriosa-2.jpg',
    title: 'La Ascensión',
    artist: 'Giotto',
    year: 'c. 1305',
    museum: 'Capilla de los Scrovegni, Padua',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Giotto - Scrovegni - -38- - Ascension.jpg'),
    },
  },
  'gloriosa-3': {
    file: 'gloriosa-3.jpg',
    title: 'Pentecostés',
    artist: 'El Greco',
    year: 'c. 1600',
    museum: 'Museo Nacional del Prado, Madrid',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons('Pentecostés (El Greco, c. 1600) Prado.jpg'),
    },
  },
  'gloriosa-4': {
    file: 'gloriosa-4.jpg',
    title: 'La Asunción de la Virgen',
    artist: 'El Greco',
    year: '1577-1579',
    museum: 'Art Institute of Chicago',
    license: 'CC0',
    source: {
      name: 'Art Institute of Chicago, Open Access (CC0)',
      url: commons(
        'Domenikos Theotokópoulos, called El Greco - The Assumption of the Virgin - Google Art Project.jpg',
      ),
    },
  },
  'gloriosa-5': {
    file: 'gloriosa-5.jpg',
    title: 'La coronación de la Virgen',
    artist: 'Fra Angelico',
    year: 'c. 1430-1432',
    museum: 'Musée du Louvre, París',
    license: 'PD-Art',
    source: {
      name: 'Wikimedia Commons, reproducción PD-Art',
      url: commons(
        'Le Couronnement de la Vierge - Fra Angelico - Musée du Louvre Peintures INV 314 ; MR 220.jpg',
      ),
    },
  },
};
