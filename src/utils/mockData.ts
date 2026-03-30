import type { Product, ProductCategory } from "../types/product";

const categories: ProductCategory[] = [
  "tech",
  "home",
  "fashion",
  "outdoor",
  "books",
];

const brands = [
  "Northline",
  "Velo",
  "Kupci Labs",
  "Harbor & Co",
  "Studio Nine",
  "Atlas Goods",
  "Meridian",
];

const tagPool = [
  "bestseller",
  "eco",
  "compact",
  "pro",
  "wireless",
  "limited",
  "refurbished",
  "gift",
  "starter",
  "premium",
];

/** Deterministic pseudo-random 0..1 from string seed */
function seeded01(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function pick<T>(arr: T[], seed: string, i: number): T {
  const idx = Math.floor(seeded01(seed, i) * arr.length) % arr.length;
  return arr[idx]!;
}

function titleFor(category: ProductCategory, index: number): string {
  const tech = [
    "Ultralight Laptop Stand",
    "Noise-Cancelling Earbuds",
    "USB-C Hub Pro",
    "Mechanical Keyboard",
    "Portable SSD",
    "Smart Watch Band",
    "4K Webcam",
    "Wireless Charger Pad",
  ];
  const home = [
    "Ceramic Table Lamp",
    "Linen Throw",
    "Oak Cutting Board",
    "Glass Carafe Set",
    "Wool Rug",
    "Stainless Kettle",
  ];
  const fashion = [
    "Merino Crew Sweater",
    "Canvas Tote",
    "Leather Belt",
    "Running Sneakers",
    "Wool Coat",
  ];
  const outdoor = [
    "Titanium Camp Mug",
    "Packable Rain Shell",
    "Trail Backpack",
    "LED Headlamp",
    "Insulated Bottle",
  ];
  const books = [
    "Design Systems Handbook",
    "Short Stories Vol. II",
    "Cooking Basics",
    "History Atlas",
    "Product Strategy Notes",
  ];
  const pool =
    category === "tech"
      ? tech
      : category === "home"
        ? home
        : category === "fashion"
          ? fashion
          : category === "outdoor"
            ? outdoor
            : books;
  return `${pick(pool, "t", index)} — ${String(index + 1).padStart(3, "0")}`;
}

export function generateMockCatalog(count: number): Product[] {
  const out: Product[] = [];
  for (let i = 0; i < count; i++) {
    const id = `kp-${String(i + 1).padStart(4, "0")}`;
    const category = pick(categories, "c", i);
    const r = seeded01(id, 1);
    const rating = Math.round((3.2 + r * 1.7) * 10) / 10;
    const reviewCount = Math.floor(5 + seeded01(id, 2) * 420);
    const basePrice = Math.round(15 + seeded01(id, 3) * 850);
    const tiers: Product["pricingTiers"] = [
      {
        name: "Standard",
        sku: `${id}-S`,
        price: basePrice,
        currency: "EUR",
      },
      {
        name: "Plus",
        sku: `${id}-P`,
        price: Math.round(basePrice * 1.12),
        currency: "EUR",
      },
      {
        name: "Bundle",
        sku: `${id}-B`,
        price: Math.round(basePrice * 1.22),
        currency: "EUR",
      },
    ];
    const tagCount = 2 + Math.floor(seeded01(id, 4) * 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      tags.push(pick(tagPool, id, t + 10));
    }
    const inStock = seeded01(id, 5) > 0.08;
    const stockUnits = inStock
      ? Math.floor(1 + seeded01(id, 6) * 120)
      : 0;

    out.push({
      id,
      title: titleFor(category, i),
      description: `Marketplace listing with rich metadata. Category ${category}; optimized for discovery and comparison across tiers.`,
      category,
      rating,
      reviewCount,
      tags: [...new Set(tags)],
      metadata: {
        brand: pick(brands, id, 7),
        manufacturerCountry: pick(
          ["DE", "JP", "IT", "SE", "US", "PT"],
          id,
          8,
        ),
        weightKg: Math.round((0.05 + seeded01(id, 9) * 8) * 100) / 100,
        dimensions: {
          w: Math.round(5 + seeded01(id, 10) * 45),
          h: Math.round(3 + seeded01(id, 11) * 35),
          d: Math.round(2 + seeded01(id, 12) * 25),
        },
      },
      pricingTiers: tiers,
      availability: {
        inStock,
        stockUnits,
        restockEtaDays: inStock
          ? null
          : Math.floor(3 + seeded01(id, 13) * 21),
      },
      featured: seeded01(id, 14) > 0.92,
      createdAt: Date.now() - Math.floor(seeded01(id, 15) * 90 * 86400000),
    });
  }
  return out;
}

export const MOCK_PRODUCTS: Product[] = generateMockCatalog(128);
