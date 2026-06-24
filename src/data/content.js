// Contenido de "El Archivo" (Pasillo 2) — tal cual el set original.
export const ARCHIVE_DOCS = [
  {
    id: 1,
    category: 'Música',
    tone: '#C8102E',
    x: -1.55,
    y: 1.5,
    z: -3,
    title: 'Nirvana y el fin de la ilusión del rock como rebeldía',
    excerpt: 'Kurt Cobain no mató al rock star: lo dejó en evidencia.',
    body:
      'Nevermind (1991) fue de los primeros discos en convertir la autodestrucción en un producto de masas. Cobain odiaba ser un símbolo, pero esa misma incomodidad terminó siendo el símbolo. Cuando la rebeldía se vuelve mercancía, ¿sigue siendo rebeldía?'
  },
  {
    id: 2,
    category: 'Moda',
    tone: '#8B1A1A',
    x: 1.6,
    y: 1.1,
    z: -6,
    title: 'Chanel y la ruptura del cuerpo femenino',
    excerpt: 'Coco Chanel no liberó el cuerpo femenino por comodidad: lo hizo para que dijera algo nuevo.',
    body:
      'El corsé no desapareció porque doliera, sino porque dejó de representar a la mujer que la modernidad necesitaba. La moda no siempre sigue a la sociedad: a veces se adelanta y la obliga a alcanzarla.'
  },
  {
    id: 3,
    category: 'Arte',
    tone: '#A11D33',
    x: -1.5,
    y: 2.6,
    z: -10,
    title: 'Warhol no vendió arte: vendió fama',
    excerpt: 'La Factory no era un estudio de artista: era una fábrica de celebridades.',
    body:
      'Warhol entendió antes que nadie que, en la cultura de masas, la imagen repetida pesa más que la imagen única. Marilyn, la sopa Campbell, Mao: todo se vuelve superficie cuando se repite lo suficiente.'
  },
  {
    id: 4,
    category: 'Publicidad',
    tone: '#D72638',
    x: 1.55,
    y: 1.3,
    z: -13,
    title: 'Chanel N°5 y la seducción sin promesa',
    excerpt: 'El primer perfume que no prometía nada concreto: el vacío como estrategia.',
    body:
      'La publicidad clásica vendía soluciones. Chanel N°5 vendió una atmósfera, una sensación sin argumento racional. Fue una de las primeras campañas en entender que el deseo no necesita explicarse.'
  },
  {
    id: 5,
    category: 'Filosofía',
    tone: '#6E0D25',
    x: -1.6,
    y: 0.9,
    z: -18,
    title: 'Hollywood: la promesa que se ve mejor de lejos',
    excerpt: 'El letrero de Hollywood está hecho para verse desde lejos, nunca de cerca.',
    body:
      'Es uno de los íconos más honestos de la cultura americana: una promesa que funciona exactamente mientras no se examine. El sueño americano y el letrero comparten la misma física — pierden sentido cuando uno se acerca demasiado.'
  },
  {
    id: 6,
    category: 'Cultura',
    tone: '#B22222',
    x: 1.5,
    y: 3.1,
    z: -21,
    title: 'El tatuaje: del estigma al lujo',
    excerpt: 'En cincuenta años, el tatuaje pasó de marca carcelaria a accesorio de alta gama.',
    body:
      'Lo que una generación usó para señalar exclusión, otra lo usa para señalar pertenencia. El significado de un símbolo nunca es fijo: depende de quién tiene el poder de definirlo en cada época.'
  },
  {
    id: 7,
    category: 'Arte',
    tone: '#9B2335',
    x: -1.55,
    y: 1.6,
    z: -26,
    title: 'La escultura clásica y el cuerpo imposible',
    excerpt: 'Los griegos no esculpían cuerpos reales: esculpían ideales.',
    body:
      'El canon clásico no documentaba la anatomía humana: la corregía. Dos mil años después seguimos heredando ese estándar imposible cada vez que comparamos un cuerpo real con una imagen.'
  },
  {
    id: 8,
    category: 'Cine',
    tone: '#7A1F2B',
    x: 1.6,
    y: 1.2,
    z: -30,
    title: 'El reloj como símbolo en el cine',
    excerpt: 'Hitchcock, Bergman, Nolan: el reloj no marca horas — marca el final de algo que no quiere terminar.',
    body:
      'Cuando el cine pone un reloj en cuadro, casi nunca habla del tiempo literal. Habla de la ansiedad de perder algo irrepetible. El objeto más simple de un set puede ser el más cargado de sentido.'
  }
];

export const ARCHIVE_CATEGORIES = ['Todos', 'Arte', 'Moda', 'Música', 'Publicidad', 'Filosofía', 'Cultura', 'Cine'];

// Contenido de "La Biblioteca" (Pasillo 1) — cuadros de arte que abren a video-ensayos.
// Paleta ámbar/dorada para diferenciarla del rojo editorial del Archivo.
export const LIBRARY_DOCS = [
  {
    id: 101,
    category: 'Pintura',
    tone: '#B8862E',
    x: -1.55,
    y: 1.5,
    z: -3,
    title: 'Las Meninas y el espectador atrapado',
    excerpt: 'Velázquez pintó el único cuadro que también te está mirando a ti.',
    body:
      'En Las Meninas, el punto de fuga cae justo donde estaría el espectador. Velázquez no retrató una escena: retrató el acto de ser observado. Cuatro siglos antes de la cámara, ya había inventado el selfie filosófico.'
  },
  {
    id: 102,
    category: 'Pintura',
    tone: '#A66B1F',
    x: 1.6,
    y: 1.1,
    z: -6,
    title: 'La noche estrellada como mapa emocional',
    excerpt: 'Van Gogh no pintó el cielo que veía: pintó el cielo que sentía.',
    body:
      'Los remolinos de La noche estrellada no corresponden a ninguna constelación real. Son turbulencia interior proyectada hacia afuera. El cielo se volvió el único lienzo lo bastante grande para contener lo que Van Gogh no podía decir con palabras.'
  },
  {
    id: 103,
    category: 'Escultura',
    tone: '#C9933A',
    x: -1.5,
    y: 2.6,
    z: -10,
    title: 'El Pensador y la pose que pensamos que pensaba',
    excerpt: 'Rodin esculpió un cuerpo entero para representar un solo gesto: pensar.',
    body:
      'La tensión muscular de El Pensador no es relajación intelectual, es esfuerzo físico. Rodin entendió que pensar de verdad —no la pose serena del filósofo de libro— se parece más a cargar un peso que a contemplar el horizonte.'
  },
  {
    id: 104,
    category: 'Fotografía',
    tone: '#D4A24C',
    x: 1.55,
    y: 1.3,
    z: -13,
    title: 'Migrant Mother y el rostro que se volvió época',
    excerpt: 'Dorothea Lange fotografió a una mujer y terminó fotografiando la Gran Depresión entera.',
    body:
      'No sabemos casi nada biográfico de Florence Owens Thompson más allá de esa imagen, y sin embargo su rostro se volvió el resumen visual de una década de crisis. Una fotografía puede borrar a la persona real al mismo tiempo que la vuelve inmortal.'
  },
  {
    id: 105,
    category: 'Pintura',
    tone: '#BF8F35',
    x: -1.6,
    y: 0.9,
    z: -18,
    title: 'Guernica: el color que decidió no estar',
    excerpt: 'Picasso pintó la masacre más famosa del siglo XX sin usar un solo color.',
    body:
      'El blanco, negro y gris de Guernica no son una limitación técnica: son la decisión de que el horror no necesita paleta. A veces la ausencia de algo comunica con más fuerza que su presencia.'
  },
  {
    id: 106,
    category: 'Arquitectura',
    tone: '#A87E2C',
    x: 1.5,
    y: 3.1,
    z: -21,
    title: 'La Sagrada Família y la obra que elige no terminar',
    excerpt: 'Gaudí diseñó un edificio que sabía que no vería terminado.',
    body:
      'Más de cien años de construcción convirtieron la inconclusión en parte del significado de la obra. Algunas obras de arte no están incompletas: están vivas, y eso implica que todavía no han dicho su última palabra.'
  },
  {
    id: 107,
    category: 'Pintura',
    tone: '#CC9940',
    x: -1.55,
    y: 1.6,
    z: -26,
    title: 'El grito y la cara que todos reconocemos sin saber por qué',
    excerpt: 'Munch pintó una emoción antes de que existiera el lenguaje clínico para nombrarla.',
    body:
      'El grito circula hoy como meme, emoji y referencia constante, pero en 1893 no existía un vocabulario popular para la ansiedad. Munch tuvo que inventar una imagen para un sentimiento que la cultura todavía no sabía cómo llamar.'
  },
  {
    id: 108,
    category: 'Fotografía',
    tone: '#E0AD55',
    x: 1.6,
    y: 1.2,
    z: -30,
    title: 'El beso de Times Square y el instante fabricado',
    excerpt: 'La foto más famosa del fin de la guerra no fue un retrato consentido: fue un instante robado.',
    body:
      'Décadas después, la identidad de los protagonistas del beso de V-J Day sigue en disputa, y se ha cuestionado si el momento fue tan espontáneo como parece. Las imágenes que definen una época cargan, casi siempre, con una historia menos limpia detrás.'
  }
];

export const LIBRARY_CATEGORIES = ['Todos', 'Pintura', 'Escultura', 'Fotografía', 'Arquitectura'];
