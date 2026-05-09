const hashString = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRandom = (seed: string) => {
  let value = hashString(seed);

  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T,>(items: T[], random: () => number) => items[Math.floor(random() * items.length)];

export function generatePixelPlant(seed: string) {
  const random = createRandom(seed);
  const palettes = [
    { leaf: '#28A745', leafDark: '#1f7f39', leafLight: '#77c96b', pot: '#d45d3a' },
    { leaf: '#4a6741', leafDark: '#263c25', leafLight: '#9abd83', pot: '#b8794f' },
    { leaf: '#2f8f6b', leafDark: '#1b5e49', leafLight: '#8fd0a7', pot: '#c76542' },
    { leaf: '#5f8d3e', leafDark: '#355523', leafLight: '#b4ce72', pot: '#a85f3f' },
  ];
  const palette = pick(palettes, random);
  const rects: string[] = [];
  const rect = (x: number, y: number, width: number, height: number, fill: string) => {
    rects.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`);
  };

  const center = 15;
  const height = 13 + Math.floor(random() * 8);
  const stemTop = 31 - height;

  rect(10, 31, 10, 2, palette.pot);
  rect(9, 33, 12, 4, palette.pot);
  rect(11, 37, 8, 1, '#1A1A1A');

  for (let y = stemTop; y < 32; y += 1) {
    rect(center, y, 1, 1, palette.leafDark);
  }

  for (let y = stemTop + 2; y < 30; y += 3) {
    const side = random() > 0.5 ? 1 : -1;
    const length = 3 + Math.floor(random() * 4);
    const thickness = random() > 0.68 ? 2 : 1;
    const x = side > 0 ? center + 1 : center - length;
    rect(x, y, length, thickness, palette.leaf);
    rect(x + (side > 0 ? length - 1 : 0), y - 1, 1, 1, palette.leafLight);
  }

  const crownWidth = 3 + Math.floor(random() * 3);
  rect(center - Math.floor(crownWidth / 2), stemTop, crownWidth, 2, palette.leafLight);
  rect(center - 1, stemTop - 2, 3, 2, palette.leaf);

  if (random() > 0.55) {
    rect(center - 5, stemTop + 4, 3, 2, palette.leafLight);
    rect(center + 3, stemTop + 5, 4, 2, palette.leaf);
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 40" shape-rendering="crispEdges">
      <rect width="30" height="40" fill="#F4F1EA"/>
      <rect x="3" y="4" width="24" height="28" fill="#ffffff" opacity="0.38"/>
      ${rects.join('')}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
