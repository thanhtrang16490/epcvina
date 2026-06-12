// ── Image placeholder utilities ─────────────────────────────────────
const PLACEHOLDER_BASE = 'https://placehold.co/600x400';

// Get background color based on device category
export function getCategoryColor(category: string): string {
  switch(category) {
    case 'panel': return 'fef3c7';    // amber-100 (yellow)
    case 'inverter': return 'dbeafe'; // blue-100
    case 'battery': return 'd1fae5';  // green-100
    case 'mounting': return 'fee2e2'; // red-100
    case 'wiring': return 'e0e7ff';   // indigo-100
    case 'cabinet': return 'f3e8ff';  // purple-100
    case 'grounding': return 'ccfbf1'; // teal-100
    default: return 'e5e7eb';         // gray-200
  }
}

// Combo images - Show system type with device icons on left, text on right
export const comboImg = (name: string, devices?: string[]) => {
  const mainText = encodeURIComponent(name);
  return `${PLACEHOLDER_BASE}/e5e7eb/374151?text=${mainText}`;
};

// Device images - Show device category and brand
export const deviceImg = (name: string, category?: string) => {
  const bgColor = getCategoryColor(category || '');
  const text = encodeURIComponent(name);
  return `${PLACEHOLDER_BASE}/${bgColor}/374151?text=${text}`;
};

// Shared image arrays for equipment
export const PANEL_IMAGES = [
  'https://placehold.co/600x400/f59e0b/ffffff?text=Solar+Panel+1',
  'https://placehold.co/600x400/f97316/ffffff?text=Solar+Panel+2',
  'https://placehold.co/600x400/ef4444/ffffff?text=Solar+Panel+3',
  'https://placehold.co/600x400/3b82f6/ffffff?text=Solar+Panel+4',
];

export const INVERTER_IMAGES_AUXSOL = [
  deviceImg('Inverter Auxsol 1', 'inverter'),
  deviceImg('Inverter Auxsol 2', 'inverter'),
  deviceImg('Inverter Auxsol 3', 'inverter'),
];

export const INVERTER_IMAGES_SAJ = [
  deviceImg('Inverter SAJ 1', 'inverter'),
  deviceImg('Inverter SAJ 2', 'inverter'),
  deviceImg('Inverter SAJ 3', 'inverter'),
];

export const MOUNTING_IMAGES = [
  deviceImg('Mounting System 1', 'mounting'),
  deviceImg('Mounting System 2', 'mounting'),
  deviceImg('Mounting System 3', 'mounting'),
  deviceImg('Mounting System 4', 'mounting'),
];

export const WIRING_IMAGES = [
  deviceImg('Wiring Cable 1', 'wiring'),
  deviceImg('Wiring Cable 2', 'wiring'),
];

export const CABINET_IMAGES = [
  deviceImg('Electrical Cabinet 1', 'cabinet'),
  deviceImg('Electrical Cabinet 2', 'cabinet'),
];

export const GROUNDING_IMAGES = [
  deviceImg('Grounding System 1', 'grounding'),
  deviceImg('Grounding System 2', 'grounding'),
];

export const BATTERY_IMAGES = [
  deviceImg('Battery Storage 1', 'battery'),
  deviceImg('Battery Storage 2', 'battery'),
];
