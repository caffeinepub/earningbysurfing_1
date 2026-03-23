import { Category } from "../backend";

export interface CuratedProduct {
  id: bigint;
  title: string;
  category: Category;
  description: string;
  aiReview: string;
  qualityScore: bigint;
}

export const CURATED_PRODUCTS: CuratedProduct[] = [
  {
    id: BigInt(1),
    title: "Anker PowerCore 26800",
    category: Category.tech,
    description:
      "World's best-selling portable charger with dual USB ports and ultra-high capacity.",
    aiReview: "Top-rated by 180,000+ buyers globally. Excellent value.",
    qualityScore: BigInt(97),
  },
  {
    id: BigInt(2),
    title: "Fitbit Charge 6",
    category: Category.wellness,
    description:
      "Advanced fitness tracker with heart-rate monitoring, sleep analysis, and GPS.",
    aiReview: "Best-in-class health wearable with seamless app integration.",
    qualityScore: BigInt(95),
  },
  {
    id: BigInt(3),
    title: "Sony WH-1000XM5 Headphones",
    category: Category.tech,
    description:
      "Industry-leading noise cancellation with 30-hour battery and premium audio.",
    aiReview: "Audiophiles' favourite — unbeatable ANC performance.",
    qualityScore: BigInt(98),
  },
  {
    id: BigInt(4),
    title: "Garmin Forerunner 265",
    category: Category.wellness,
    description:
      "GPS running watch with advanced training metrics and AMOLED display.",
    aiReview: "Serious runners swear by Garmin's accuracy and durability.",
    qualityScore: BigInt(94),
  },
  {
    id: BigInt(5),
    title: "Bose QuietComfort 45",
    category: Category.tech,
    description:
      "Legendary comfort and noise cancellation with balanced audio for all-day wear.",
    aiReview: "A timeless classic that never disappoints.",
    qualityScore: BigInt(93),
  },
  {
    id: BigInt(6),
    title: "iRobot Roomba j7+",
    category: Category.lifestyle,
    description:
      "Self-emptying robot vacuum that avoids obstacles and maps your home.",
    aiReview: "Game-changer for busy households. Strong affiliate conversions.",
    qualityScore: BigInt(92),
  },
  {
    id: BigInt(7),
    title: "Dyson V15 Detect",
    category: Category.lifestyle,
    description:
      "Laser dust detection and powerful suction in a cordless vacuum.",
    aiReview: "Premium product with huge brand trust and high AOV.",
    qualityScore: BigInt(96),
  },
  {
    id: BigInt(8),
    title: "NutriBullet Pro 900",
    category: Category.wellness,
    description:
      "High-speed personal blender for smoothies, shakes, and nutrient extraction.",
    aiReview: "Kitchen essential with massive reorder rate.",
    qualityScore: BigInt(91),
  },
  {
    id: BigInt(9),
    title: "Kindle Paperwhite (2024)",
    category: Category.lifestyle,
    description:
      "Glare-free display, weeks of battery life, and waterproof design.",
    aiReview:
      "Best e-reader for avid readers. Strong evergreen affiliate demand.",
    qualityScore: BigInt(93),
  },
  {
    id: BigInt(10),
    title: "JBL Charge 5 Bluetooth Speaker",
    category: Category.tech,
    description:
      "Portable, waterproof speaker with 20-hour battery and powerbank feature.",
    aiReview:
      "Viral on social media. Extremely high click-through in affiliate ads.",
    qualityScore: BigInt(90),
  },
  {
    id: BigInt(11),
    title: "Philips Hue Smart Bulb Starter Kit",
    category: Category.lifestyle,
    description:
      "Smart lighting system with 16 million colors and voice-control integration.",
    aiReview:
      "Trending in smart home category. Excellent repeat-purchase rate.",
    qualityScore: BigInt(89),
  },
  {
    id: BigInt(12),
    title: "Oral-B iO Series 9 Electric Toothbrush",
    category: Category.wellness,
    description: "AI-guided brushing with pressure sensor and 7 smart modes.",
    aiReview: "Premium wellness product with doctor-recommended credibility.",
    qualityScore: BigInt(95),
  },
];
