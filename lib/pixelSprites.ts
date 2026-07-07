// Pixel-art sprite generation for the hero sky panel.
// Sprites are drawn to <canvas> at runtime and returned as data URLs —
// next/image cannot consume data URLs, so consumers render them as
// CSS background-image on divs with image-rendering: pixelated.
// Client-only: requires document.

export type Period = "dawn" | "day" | "sunset" | "night";

export const PALETTES: Record<
  Period,
  {
    sky: string; skyText: string;
    skyBands: [string, string, string, string]; // top → horizon, stepped for depth
    cloudW: string; cloudS: string;
    sunX: string; sunH: string; sunR: string;
    grassH: string; grassL: string; grassM: string; grassD: string;
    sparkle: string;
    accent: string; // page-wide accent (selection, hover underlines) — dark enough for cream bg
  }
> = {
  dawn:   { sky: "#c3a8d8", skyText: "#ffffff", skyBands: ["#a98bc6", "#c3a8d8", "#d8c2e4", "#ebd8e6"], cloudW: "#fdf6e6", cloudS: "#e0c7e6", sunX: "#ffd9a0", sunH: "#ffedd0", sunR: "#f2a65a", grassH: "#9ed07e", grassL: "#6fae57", grassM: "#3f8449", grassD: "#27573a", sparkle: "#f6e3b2", accent: "#8a5fb0" },
  day:    { sky: "#8faae9", skyText: "#ffffff", skyBands: ["#6f92e4", "#8faae9", "#aabff0", "#c6d4f6"], cloudW: "#fffdf4", cloudS: "#cfe3f7", sunX: "#ffe259", sunH: "#fff3ae", sunR: "#f5b93d", grassH: "#b9e37e", grassL: "#86c85a", grassM: "#479c52", grassD: "#2c6b43", sparkle: "#f2dfae", accent: "#4661b8" },
  sunset: { sky: "#e5a184", skyText: "#ffffff", skyBands: ["#c47a75", "#e5a184", "#f0b993", "#f9d2a6"], cloudW: "#fdf2dc", cloudS: "#eec0a8", sunX: "#ff9d5c", sunH: "#ffc98f", sunR: "#e8763a", grassH: "#b3c273", grassL: "#6fa04f", grassM: "#3d7a44", grassD: "#265237", sparkle: "#fae6b4", accent: "#d4622c" },
  night:  { sky: "#2b3260", skyText: "#eef0ff", skyBands: ["#1c2242", "#2b3260", "#3c4477", "#4d568e"], cloudW: "#565f9e", cloudS: "#414876", sunX: "#f0eddc", sunH: "#fffef2", sunR: "#c9c4a8", grassH: "#4d7a52", grassL: "#2f5c38", grassM: "#1d4227", grassD: "#122b1a", sparkle: "#ece4bc", accent: "#5a64b0" },
};

const CLOUD_GRIDS = {
  a: [
    ".......WWWW.............",
    ".....WWWWWWWW...WWW.....",
    "....WWWWWWWWWW.WWWWW....",
    "..WWWWWWWWWWWWWWWWWWW...",
    ".WWWWWWWWWWWWWWWWWWWWW..",
    "WWWWWWWWWWWWWWWWWWWWWWW.",
    "WWWSSWWWWWWWWWWWWWWWWWWW",
    "WSSSSSSWWWWWWWSSWWWWWWWW",
    ".SSSSSSSSSSSSSSSSSSSSSS.",
    "...SSSS..SSSSSSSSSS.....",
  ],
  b: [
    "....WWWWW.....",
    "..WWWWWWWWW...",
    ".WWWWWWWWWWWW.",
    "WWWWWWWWWWWWWW",
    "WSSWWWWWSSWWW.",
    ".SSSSSSSSSSS..",
  ],
  c: [
    ".....WWWW........WWWWW........",
    "...WWWWWWWW....WWWWWWWWW......",
    "..WWWWWWWWWWWWWWWWWWWWWWWW....",
    ".WWWWWWWWWWWWWWWWWWWWWWWWWWWW.",
    "WWWSSWWWWWWWWWWWWSSSWWWWWWWWWW",
    ".SSSSSSSSSSSSSSSSSSSSSSSSSSS..",
    "...SSSS....SSSSSSSSS..........",
  ],
};

const SUN_GRID = [
  "....XXXX....",
  "..XXXXXXXX..",
  ".XXXXXXXXXX.",
  ".XXXHHXXXXX.",
  "XXXHHHHXXXXX",
  "XXXHHHHXXXXX",
  "XXXXHHXXXXXX",
  "XXXXXXXXXXXX",
  ".XXXXXXXXXR.",
  ".XXXXXXXRRR.",
  "..XXXXRRRR..",
  "....RRRR....",
];

function drawGrid(grid: string[], colorMap: Record<string, string>, scale = 1): string {
  const h = grid.length;
  const w = grid[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d")!;
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = colorMap[row[x]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  });
  return canvas.toDataURL();
}

function drawGrass(p: (typeof PALETTES)[Period], sway = false): string {
  const W = 512;
  const H = 22;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  // Deterministic pseudo-random so the repeat-x tile is stable across renders
  const rand = (n: number) => {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const px = (x: number, y: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(((x % W) + W) % W, y, 1, 1);
  };

  // Band tops (rows 0-6 left clear as headroom for blades)
  const lightTop = (x: number) => 7 + [0, 1, 1, 2, 1, 0][Math.floor(x / 5) % 6];
  const midTop = (x: number) => 12 + [0, 2, 1, 0, 1, 2][Math.floor(x / 7) % 6];
  const darkTop = (x: number) => 16 + [1, 0, 2, 1, 0, 1][Math.floor(x / 6) % 6];

  for (let x = 0; x < W; x++) {
    const lt = lightTop(x);
    const mt = midTop(x);
    const dt = darkTop(x);
    ctx.fillStyle = p.grassL;
    ctx.fillRect(x, lt, 1, mt - lt);
    ctx.fillStyle = p.grassM;
    ctx.fillRect(x, mt, 1, dt - mt);
    ctx.fillStyle = p.grassD;
    ctx.fillRect(x, dt, 1, H - dt);
  }

  // Dithered band transitions + scattered tone specks (organic, camo-like texture)
  for (let x = 0; x < W; x++) {
    const lt = lightTop(x);
    const mt = midTop(x);
    const dt = darkTop(x);
    if (rand(x * 3 + 1) < 0.4) px(x, mt + (rand(x * 2) < 0.5 ? 0 : 1), p.grassL);
    if (rand(x * 7 + 2) < 0.4) px(x, dt + (rand(x * 4) < 0.5 ? 0 : 1), p.grassM);
    if (rand(x * 11 + 3) < 0.2) px(x, lt + 1 + Math.floor(rand(x * 5) * Math.max(1, mt - lt - 1)), p.grassH);
    if (rand(x * 13 + 4) < 0.15) px(x, mt + 1 + Math.floor(rand(x * 6) * Math.max(1, dt - mt - 1)), p.grassD);
    if (rand(x * 17 + 5) < 0.12) px(x, dt + 2 + Math.floor(rand(x * 8) * Math.max(1, H - dt - 2)), p.grassM);
  }

  // Blade tufts poking above the light band, tips highlighted (some in pale sparkle).
  // In the sway frame the top half of each blade leans one pixel to the right.
  const blade = (bx: number, h: number, tip: string) => {
    const lt = lightTop(bx);
    for (let y = lt - h; y < lt; y++) {
      const dx = sway && y - (lt - h) < Math.ceil(h / 2) ? 1 : 0;
      px(bx + dx, y, p.grassL);
    }
    px(bx + (sway ? 1 : 0), lt - h, tip);
  };
  let x = 3;
  while (x < W - 3) {
    const r = rand(x * 1.3 + 7);
    const h = 2 + Math.floor(r * 4); // 2-5 tall
    const lt = lightTop(x);
    blade(x, h, r < 0.3 ? p.sparkle : p.grassH);
    if (r > 0.55) px(x + 1 + (sway ? 1 : 0), lt - Math.max(1, h - 2), p.grassL); // bent side leaf
    if (r > 0.72) blade(x + 2, Math.max(2, h - 2), p.grassH); // shorter buddy blade
    x += 4 + Math.floor(rand(x * 2.1 + 9) * 6); // stride 4-9
  }

  return canvas.toDataURL();
}

export interface SpriteSet {
  a: string;
  b: string;
  c: string;
  sun: string;
  grass: string;
  grassSway: string;
}

const spriteCache: Partial<Record<Period, SpriteSet>> = {};

export function getSprites(period: Period): SpriteSet {
  const cached = spriteCache[period];
  if (cached) return cached;
  const p = PALETTES[period];
  const cloudMap = { W: p.cloudW, S: p.cloudS };
  const out: SpriteSet = {
    a: drawGrid(CLOUD_GRIDS.a, cloudMap),
    b: drawGrid(CLOUD_GRIDS.b, cloudMap),
    c: drawGrid(CLOUD_GRIDS.c, cloudMap),
    sun: drawGrid(SUN_GRID, { X: p.sunX, H: p.sunH, R: p.sunR }),
    grass: drawGrass(p),
    grassSway: drawGrass(p, true),
  };
  spriteCache[period] = out;
  return out;
}

export function periodForHour(hour: number): Period {
  return hour < 5 ? "night" : hour < 7 ? "dawn" : hour < 17 ? "day" : hour < 19 ? "sunset" : "night";
}
