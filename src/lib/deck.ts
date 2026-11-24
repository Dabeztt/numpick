import type { ImageMetadata } from 'astro';
import cardBackAsset from '../assets/cards/card_back.png';

// --- Card Back Asset Export ---
export const cardBackSrc = cardBackAsset.src;

// --- Eagerly Import All Card Assets from src/assets/cards/ ---
const cardAssets = import.meta.glob<{ default: ImageMetadata }>('../assets/cards/*.png', { eager: true });

// --- Deck Definition & Generator ---
export const SUITS = ['Hearts', 'Clubs', 'Diamonds', 'Spades'] as const;

export const RANKS = [
  { name: 'Ace', label: 'A', value: 1 },
  { name: '2', label: '2', value: 2 },
  { name: '3', label: '3', value: 3 },
  { name: '4', label: '4', value: 4 },
  { name: '5', label: '5', value: 5 },
  { name: '6', label: '6', value: 6 },
  { name: '7', label: '7', value: 7 },
  { name: '8', label: '8', value: 8 },
  { name: '9', label: '9', value: 9 },
  { name: '10', label: '10', value: 10 },
  { name: 'Jack', label: 'J', value: 10 },
  { name: 'Queen', label: 'Q', value: 10 },
  { name: 'King', label: 'K', value: 10 }
] as const;

export interface Card {
  rank: string;
  suit: string;
  label: string;
  value: number;
  image: string;
}

export function generateFullDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      const filename = `${r.name}_of_${s}.png`;
      const assetKey = `../assets/cards/${filename}`;
      const imgModule = cardAssets[assetKey];
      const imgSrc = imgModule ? imgModule.default.src : '';

      deck.push({
        rank: r.name,
        suit: s,
        label: r.label,
        value: r.value,
        image: imgSrc
      });
    }
  }
  return deck;
}
