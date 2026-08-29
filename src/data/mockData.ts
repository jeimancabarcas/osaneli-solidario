import { Donor, CollectionPiece } from '../types';

export const INITIAL_DONORS: Donor[] = [
  {
    id: 'd1',
    name: 'Mateo G.',
    timeAgo: 'Hace 2 min',
    timestamp: Date.now() - 1000 * 60 * 2,
    message: 'Fuerza Cartagena, juntos salimos adelante.',
    itemSupported: 'Camiseta Solidaria / Edición #142'
  },
  {
    id: 'd2',
    name: 'Elena R.',
    timeAgo: 'Hace 15 min',
    timestamp: Date.now() - 1000 * 60 * 15,
    message: 'Todo mi apoyo desde Cartagena para las familias afectadas.',
    itemSupported: 'Short Denim Solidario / Edición #141'
  },
  {
    id: 'd3',
    name: 'Carlos D.',
    timeAgo: 'Hace 45 min',
    timestamp: Date.now() - 1000 * 60 * 45,
    message: 'Una prenda, una ayuda real para nuestra ciudad.',
    itemSupported: 'Camiseta Solidaria / Edición #140'
  },
  {
    id: 'd4',
    name: 'Sofia L.',
    timeAgo: 'Hace 1 hora',
    timestamp: Date.now() - 1000 * 60 * 60,
    message: 'Por las comunidades de Bolívar y los rescatistas.',
    itemSupported: 'Short Denim Solidario / Edición #139'
  },
  {
    id: 'd5',
    name: 'Valentina C.',
    timeAgo: 'Hace 2 horas',
    timestamp: Date.now() - 1000 * 60 * 120,
    message: 'Orgullosa de sumarme a OSANELI Cartagena 2026.',
    itemSupported: 'Camiseta Solidaria / Edición #138'
  },
  {
    id: 'd6',
    name: 'Santiago M.',
    timeAgo: 'Hace 3 horas',
    timestamp: Date.now() - 1000 * 60 * 180,
    message: 'Solidaridad incondicional con nuestra gente.',
    itemSupported: 'Camiseta Solidaria / Edición #137'
  },
  {
    id: 'd7',
    name: 'Andrés P.',
    timeAgo: 'Hace 4 horas',
    timestamp: Date.now() - 1000 * 60 * 240,
    message: 'Gracias OSANELI por liderar este movimiento en Cartagena.',
    itemSupported: 'Short Denim Solidario / Edición #136'
  },
  {
    id: 'd8',
    name: 'Camila V.',
    timeAgo: 'Hace 5 horas',
    timestamp: Date.now() - 1000 * 60 * 300,
    message: 'Cartagena unida, nadie se queda atrás.',
    itemSupported: 'Camiseta Solidaria / Edición #135'
  }
];

export const COLLECTION_PIECES: CollectionPiece[] = [
  {
    id: 'c1',
    name: 'CAMISETA SOLIDARIA OSANELI - CARTAGENA 2026',
    tag: 'CAMISETA SOLIDARIA',
    type: 't-shirt',
    color: '#08100a',
    colorName: 'Pure Noir / Gold Accent',
    priceUSD: 30,
    priceCOP: 120000,
    editionNumber: 143,
    totalEdition: 200,
    description: 'Corte regular fit.',
    features: [
      'Corte Regular Fit',
      '100% Algodón Premium Colombiano',
      'Gráfica oficial conmemorativa Cartagena 2026',
      'Edición seriada y limitada'
    ]
  },
  {
    id: 'c2',
    name: 'SHORT DENIM SOLIDARIO OSANELI - CARTAGENA 2026',
    tag: 'SHORT DENIM UTILITY',
    type: 'shorts',
    color: '#1b3b35',
    colorName: 'Deep Forest Denim',
    priceUSD: 38,
    priceCOP: 150000,
    editionNumber: 144,
    totalEdition: 200,
    description: 'Corte regular fit.',
    features: [
      'Corte Regular Fit',
      'Denim 100% algodón rígido',
      'Bolsillos utilitarios reforzados',
      'Edición seriada y limitada'
    ]
  }
];

export const IMAGES = {
  fistLogo: 'https://poderlegislativo.camara.gov.co/wp-content/uploads/2026/08/foto-1-terremoto-en-colombia-imagen.webp',
  fistAlt: 'https://poderlegislativo.camara.gov.co/wp-content/uploads/2026/08/foto-1-terremoto-en-colombia-imagen.webp',
  rescueWorkers: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebnOXEigH1ETbYVSsfSiPwb7zwuK_Tckc1lozjFLhNivwZCC9C7QpKeLq9t4rpAHU2RecnZEENv2LVwZIDeJu6aFk0JdGMRoOsnG7pYV_od7BKL6e0BRGVQEdIWwYFRiAYb-Tn7YCR68aGlokmKX-QhHPcl__SFu6nL3YTsCm7eR4qv2VoddXeAnUOovTvKdttGBv9h_LEZ0fDu1SW97VfdtN3PU4kWZIoOCHm88BCiyxwFVqYV_yYCDCWUbfs6p4joI',
  damagedBuildings: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWERsUxliQ-lMxqiF50uox2W1MygmVDX4XtH02s9LlwsMty220ZtHXClyldaA9gsUDOVNZ_ghDJBFZ4YxXEyeBn9Uq-E_LcyuLq09vBskvSO_HEiv6nxPUg-fddr2Um9i2uWSrsjn26HwpM5X4cdQvLLROiWXK9qBOjIXWsEEc1TQfrysfsicnRySOV9SQzSSG6ngFeTFW407kMMe1hUv9NrwXcW-RykIdEha95_9-GkEsXBDI4CNjqEge2UeMdILKYTw',
  iloveColombia: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeNaLk5yejlWe7wu0w3wAPKucojLF6RlCKtJtzsVR56zABkf7cVwQ1oAF93mmVXruggIVHYxzj5cWokxfPMoBgSH8wA2Yil4uGV78ttXxQsST9K-TfUXPh9VykJ2m-QROcUxP5CLrZoy63NSmoAiyHt2Fvg31r8Z4u77v8jJwl8P3AlklWbG2uZ16_jd2ao2IDHSK6NoWVYhqBTmjCwDWhgItp9B-IMzHxozWCQHHK87tYyTgRadyWHcFAoe3FFLqxPw8',
  collectionGrid: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZSj_sJgcj-ZhVEg0_x79fiyl2CtZKwjaO2lzuNlTuIVnmGQ_SDQH4xIk-q_Huo5VI3idhzpf23_ZwQJFoalsYtGv9ghdnuYN92Vyqd85jdBMM7zcIFBrg-r9D40UUB24AAPM0kVFD9TF1Qonm483q5ber4jKX-MZgTCw0SpL-9fBDHIlWxjwV90sHTuwGWCXxlKXU3xFGgiMCLm3lc1LGqz_FvJQ694itE4WDfeZ-oCCX0I6WD9Dsdt5pFbGN7DGL7k8'
};

