import { Donor, CollectionPiece } from '../types';

export const INITIAL_DONORS: Donor[] = [
  {
    id: 'd1',
    name: 'Mateo G.',
    timeAgo: 'Hace 2 min',
    timestamp: Date.now() - 1000 * 60 * 2,
    message: 'Fuerza Colombia, juntos salimos adelante.',
    itemSupported: 'Resilience Tee - Black / Edition #142'
  },
  {
    id: 'd2',
    name: 'Elena R.',
    timeAgo: 'Hace 15 min',
    timestamp: Date.now() - 1000 * 60 * 15,
    message: 'Todo mi apoyo desde Medellín para los rescatistas.',
    itemSupported: 'I Love Colombia Tee - Cream / Edition #141'
  },
  {
    id: 'd3',
    name: 'Carlos D.',
    timeAgo: 'Hace 45 min',
    timestamp: Date.now() - 1000 * 60 * 45,
    message: 'Una prenda, una ayuda real.',
    itemSupported: 'Resilience Red Tee / Edition #140'
  },
  {
    id: 'd4',
    name: 'Sofia L.',
    timeAgo: 'Hace 1 hora',
    timestamp: Date.now() - 1000 * 60 * 60,
    message: 'Por nuestras familias y comunidades afectadas.',
    itemSupported: 'Why Wait Crop Top - Black / Edition #139'
  },
  {
    id: 'd5',
    name: 'Valentina C.',
    timeAgo: 'Hace 2 horas',
    timestamp: Date.now() - 1000 * 60 * 120,
    message: 'Orgullosa de ser parte del cambio.',
    itemSupported: 'Resilience Vintage Tee / Edition #138'
  },
  {
    id: 'd6',
    name: 'Santiago M.',
    timeAgo: 'Hace 3 horas',
    timestamp: Date.now() - 1000 * 60 * 180,
    message: 'Solidaridad inquebrantable.',
    itemSupported: 'I Love Colombia Oversized / Edition #137'
  },
  {
    id: 'd7',
    name: 'Andrés P.',
    timeAgo: 'Hace 4 horas',
    timestamp: Date.now() - 1000 * 60 * 240,
    message: 'Gracias por esta iniciativa OSANELI.',
    itemSupported: 'Denim Utility Shorts / Edition #136'
  },
  {
    id: 'd8',
    name: 'Camila V.',
    timeAgo: 'Hace 5 horas',
    timestamp: Date.now() - 1000 * 60 * 300,
    message: 'Juntos somos imparables.',
    itemSupported: 'Why Wait Hoodie / Edition #135'
  }
];

export const COLLECTION_PIECES: CollectionPiece[] = [
  {
    id: 'c1',
    name: 'RESILIENCE HEAVYWEIGHT TEE - NOIR',
    tag: 'RESILIENCE 01',
    type: 't-shirt',
    color: '#08100a',
    colorName: 'Pure Noir',
    priceUSD: 48,
    priceCOP: 195000,
    editionNumber: 143,
    totalEdition: 200,
    description: 'Camiseta de corte oversized en algodón pesado de 280 GSM con gráfica tipográfica frontal "RESILIENCE" y detalles en serigrafía de alta densidad.',
    features: ['100% Algodón Premium Colombiano', '280 GSM Heavyweight Jersey', '100% de ganancias destinadas al fondo de emergencia', 'Certificado numerado de pieza solidaria']
  },
  {
    id: 'c2',
    name: 'RESILIENCE FLAME RED TEE',
    tag: 'RESILIENCE 02',
    type: 't-shirt',
    color: '#e62424',
    colorName: 'Flame Red',
    priceUSD: 48,
    priceCOP: 195000,
    editionNumber: 144,
    totalEdition: 200,
    description: 'Edición limitada en rojo intenso con estampado reflectivo y tipografía de impacto. Diseñada para visibilizar el apoyo activo.',
    features: ['100% Algodón Peinado', 'Corte Boxy Streetwear', 'Cuello reforzado rib 1x1', 'Etiqueta conmemorativa 10 Agosto 2026']
  },
  {
    id: 'c3',
    name: 'I LOVE COLOMBIA STREET GRAFFITI TEE',
    tag: 'COLOMBIA BUBBLE',
    type: 't-shirt',
    color: '#121212',
    colorName: 'Deep Black',
    priceUSD: 52,
    priceCOP: 210000,
    editionNumber: 145,
    totalEdition: 200,
    description: 'Diseño insignia con gráfica graffiti en relieve tridimensional blanco y corazón en contraste. Simboliza el amor colectivo por el país.',
    features: ['Gráfica oficial conmemorativa', 'Algodón orgánico tacto suave', 'Corte unisex relajado', 'Numeración bordada en la manga']
  },
  {
    id: 'c4',
    name: 'WHY WAIT UNTIL TOMORROW? RAW CROPPED',
    tag: 'WHY WAIT 01',
    type: 'crop',
    color: '#1a1f1a',
    colorName: 'Dark Moss',
    priceUSD: 42,
    priceCOP: 175000,
    editionNumber: 146,
    totalEdition: 200,
    description: 'Crop top de corte cuadrado con mensaje de urgencia "Why Wait Until Tomorrow?" en tipografía neón y detalles desgastados.',
    features: ['Corte Boxy Crop', 'Terminación en orillo al corte', '100% Algodón perchado', 'Aporte directo a suministros médicos']
  },
  {
    id: 'c5',
    name: 'SOLIDARITY DENIM UTILITY SHORTS',
    tag: 'DENIM UTILITY',
    type: 'shorts',
    color: '#1b3b35',
    colorName: 'Forest Wash Denim',
    priceUSD: 65,
    priceCOP: 260000,
    editionNumber: 147,
    totalEdition: 200,
    description: 'Bermuda de denim lavado con bolsillos utilitarios tácticos y bordado sutil de OSANELI en hilo dorado.',
    features: ['Denim rígido 13.5 oz', 'Bolsillos laterales cargo', 'Herrajes metálicos anticorrosivos', 'Edición numerada y seriada']
  },
  {
    id: 'c6',
    name: 'RESILIENCE TWO-TONE RINGER TEE - GOLD/RED',
    tag: 'RINGER 01',
    type: 't-shirt',
    color: '#ffe088',
    colorName: 'Sand / Crimson Ringer',
    priceUSD: 46,
    priceCOP: 185000,
    editionNumber: 148,
    totalEdition: 200,
    description: 'Camiseta estilo ringer vintage en tono arena con cuellos y puños en rojo contrastante y letras frontales sólidas.',
    features: ['Estilo retro con fit moderno', 'Cuello contrastado elástico', 'Tejido pre-encogido de larga duración', 'Insignia de solidaridad en la nuca']
  }
];

export const IMAGES = {
  fistLogo: 'https://lh3.googleusercontent.com/aida/AP1WRLsrVg7R0L4IaolKbHoq9coAk9jYndVgaFiJ-7cPLZGXYlO04XAQEKFV0m7xCq7j09W4U0yY-m3wscTDhRlhj0s5yUFUmN87k8coZVwcO2m4h0CrPDvgeVXrtp7jurOZP_8Sd8Vw9xZrLG_sOpnj66_XU6P9dPV-VEgMM5VigexyGTxETKWnqtQ6CWfRpI9c4edkQ_6E4qmLzTpw9Q-xKNO7REPdbYKLgHHqlz3OEZFc76oPDfax4P_hYraE',
  fistAlt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8XAUaaLLmyQc_skE_6kYQpwj0ef64gWQGB4Q_OuVs9QSpkLFkLYIUyHJ0lYgSFzHK35jxKS16HBEf5bszwL3YkjLxDuuPoYSbYJFJX9L5FmzwwU3uU3mHRxQkqYNl-k-NfTmizaihGIdHVKPG92xiroYEYay2DSoVLQSXoBegRVjTBKYurKpwVmcUiN3DXHIj5O4ZgAgxitBQIAkjNfMxdB1X0GwXe0LoMMfVA77wRZdRsV6WTuCs9g',
  rescueWorkers: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebnOXEigH1ETbYVSsfSiPwb7zwuK_Tckc1lozjFLhNivwZCC9C7QpKeLq9t4rpAHU2RecnZEENv2LVwZIDeJu6aFk0JdGMRoOsnG7pYV_od7BKL6e0BRGVQEdIWwYFRiAYb-Tn7YCR68aGlokmKX-QhHPcl__SFu6nL3YTsCm7eR4qv2VoddXeAnUOovTvKdttGBv9h_LEZ0fDu1SW97VfdtN3PU4kWZIoOCHm88BCiyxwFVqYV_yYCDCWUbfs6p4joI',
  damagedBuildings: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWERsUxliQ-lMxqiF50uox2W1MygmVDX4XtH02s9LlwsMty220ZtHXClyldaA9gsUDOVNZ_ghDJBFZ4YxXEyeBn9Uq-E_LcyuLq09vBskvSO_HEiv6nxPUg-fddr2Um9i2uWSrsjn26HwpM5X4cdQvLLROiWXK9qBOjIXWsEEc1TQfrysfsicnRySOV9SQzSSG6ngFeTFW407kMMe1hUv9NrwXcW-RykIdEha95_9-GkEsXBDI4CNjqEge2UeMdILKYTw',
  iloveColombia: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeNaLk5yejlWe7wu0w3wAPKucojLF6RlCKtJtzsVR56zABkf7cVwQ1oAF93mmVXruggIVHYxzj5cWokxfPMoBgSH8wA2Yil4uGV78ttXxQsST9K-TfUXPh9VykJ2m-QROcUxP5CLrZoy63NSmoAiyHt2Fvg31r8Z4u77v8jJwl8P3AlklWbG2uZ16_jd2ao2IDHSK6NoWVYhqBTmjCwDWhgItp9B-IMzHxozWCQHHK87tYyTgRadyWHcFAoe3FFLqxPw8',
  collectionGrid: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZSj_sJgcj-ZhVEg0_x79fiyl2CtZKwjaO2lzuNlTuIVnmGQ_SDQH4xIk-q_Huo5VI3idhzpf23_ZwQJFoalsYtGv9ghdnuYN92Vyqd85jdBMM7zcIFBrg-r9D40UUB24AAPM0kVFD9TF1Qonm483q5ber4jKX-MZgTCw0SpL-9fBDHIlWxjwV90sHTuwGWCXxlKXU3xFGgiMCLm3lc1LGqz_FvJQ694itE4WDfeZ-oCCX0I6WD9Dsdt5pFbGN7DGL7k8'
};
