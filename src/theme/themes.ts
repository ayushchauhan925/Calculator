export type ThemeName =
  | 'obsidian'
  | 'et66'
  | 'bone'
  | 'kiln'
  | 'titanium'
  | 'carbon'
  | 'azure';

export type KeyShape = 'circle' | 'squircle' | 'square';

export type Theme = {
  name: ThemeName;
  label: string;
  dark: boolean;

  shell: string;          // page background — flat, no gradient
  surface: string;        // display panel, modal sheets

  textHi: string;         // the result
  textLo: string;         // preview, labels
  textErr: string;

  keyFill: string;        // digit keys
  keyText: string;
  keyBorder: string;      // 'transparent' = no border

  opFill: string;         // operators
  opText: string;
  opBorder: string;

  fnFill: string;         // scientific panel
  fnText: string;
  fnBorder: string;

  accent: string;         // used once — the = key
  accentText: string;

  rule: string;           // hairlines
  keyShape: KeyShape;
  radius: number;         // used for squircle/square
};

export const themes: Record<ThemeName, Theme> = {
  // Haute horlogerie. Unfilled keys, brass hairlines, near-black dial.
  obsidian: {
    name: 'obsidian',
    label: 'Obsidian',
    dark: true,
    shell: '#0C0C0D',
    surface: '#141416',
    textHi: '#EDE8DC',
    textLo: '#6B6862',
    textErr: '#A8564B',
    keyFill: 'transparent',
    keyText: '#EDE8DC',
    keyBorder: 'rgba(198,161,91,0.22)',
    opFill: 'transparent',
    opText: '#C6A15B',
    opBorder: 'rgba(198,161,91,0.55)',
    fnFill: 'transparent',
    fnText: '#8A8378',
    fnBorder: 'rgba(198,161,91,0.14)',
    accent: '#C6A15B',
    accentText: '#0C0C0D',
    rule: 'rgba(198,161,91,0.20)',
    keyShape: 'circle',
    radius: 0,
  },

  // Black shell, orange accent. High contrast, circular keys.
  carbon: {
    name: 'carbon',
    label: 'Carbon',
    dark: true,
    shell: '#0E0E0E',
    surface: '#1A1A1A',
    textHi: '#F2EFEA',
    textLo: '#6E6A64',
    textErr: '#E05A3A',
    keyFill: '#1C1C1C',
    keyText: '#F2EFEA',
    keyBorder: 'transparent',
    opFill: '#262626',
    opText: '#FF7A29',
    opBorder: 'transparent',
    fnFill: '#171717',
    fnText: '#8C877F',
    fnBorder: 'transparent',
    accent: '#FF7A29',
    accentText: '#0E0E0E',
    rule: 'rgba(255,122,41,0.18)',
    keyShape: 'circle',
    radius: 0,
  },

  // White shell, blue accent. Clean and bright, circular keys.
  azure: {
    name: 'azure',
    label: 'Azure',
    dark: false,
    shell: '#FBFCFD',
    surface: '#F1F4F8',
    textHi: '#141A21',
    textLo: '#8B95A1',
    textErr: '#D0342C',
    keyFill: '#EDF1F6',
    keyText: '#141A21',
    keyBorder: 'transparent',
    opFill: '#E1E9F3',
    opText: '#1E6FD9',
    opBorder: 'transparent',
    fnFill: '#F3F6FA',
    fnText: '#6C7885',
    fnBorder: 'transparent',
    accent: '#1E6FD9',
    accentText: '#FFFFFF',
    rule: 'rgba(30,111,217,0.16)',
    keyShape: 'circle',
    radius: 0,
  },

  // Dieter Rams. Warm grey body, charcoal keys, one yellow.
  et66: {
    name: 'et66',
    label: 'ET66',
    dark: false,
    shell: '#E9E7E2',
    surface: '#C6CDA4',
    textHi: '#2B2E22',
    textLo: '#7C8168',
    textErr: '#9C3A28',
    keyFill: '#37383A',
    keyText: '#DFDDD8',
    keyBorder: 'transparent',
    opFill: '#4A4B4E',
    opText: '#FFFFFF',
    opBorder: 'transparent',
    fnFill: '#5C5D60',
    fnText: '#DFDDD8',
    fnBorder: 'transparent',
    accent: '#E8B01E',
    accentText: '#2B2E22',
    rule: 'rgba(43,46,34,0.15)',
    keyShape: 'circle',
    radius: 0,
  },

  // Editorial ivory. Numerals on paper, hairline grid, no fills.
  bone: {
    name: 'bone',
    label: 'Bone',
    dark: false,
    shell: '#F4F1EA',
    surface: '#F4F1EA',
    textHi: '#17150F',
    textLo: '#9B9384',
    textErr: '#7A2B24',
    keyFill: 'transparent',
    keyText: '#17150F',
    keyBorder: '#DAD4C6',
    opFill: 'transparent',
    opText: '#17150F',
    opBorder: '#DAD4C6',
    fnFill: 'transparent',
    fnText: '#7B7364',
    fnBorder: '#DAD4C6',
    accent: '#7A2B24',
    accentText: '#F4F1EA',
    rule: '#DAD4C6',
    keyShape: 'square',
    radius: 0,
  },

  // Wabi-sabi clay. Matte fills, tonal steps, no shadow.
  kiln: {
    name: 'kiln',
    label: 'Kiln',
    dark: false,
    shell: '#E5DACB',
    surface: '#DDD0BE',
    textHi: '#2A2620',
    textLo: '#8E8375',
    textErr: '#A6512F',
    keyFill: '#CDBBA6',
    keyText: '#2A2620',
    keyBorder: 'transparent',
    opFill: '#C0AC94',
    opText: '#2A2620',
    opBorder: 'transparent',
    fnFill: '#D6C7B4',
    fnText: '#6B6156',
    fnBorder: 'transparent',
    accent: '#A6512F',
    accentText: '#E5DACB',
    rule: 'rgba(42,38,32,0.12)',
    keyShape: 'squircle',
    radius: 18,
  },

  // Milled aluminium, smoked glass display, amber digits.
  titanium: {
    name: 'titanium',
    label: 'Titanium',
    dark: true,
    shell: '#7E8083',
    surface: '#171819',
    textHi: '#E9A63C',
    textLo: '#8A6B3A',
    textErr: '#D2604A',
    keyFill: '#8B8D90',
    keyText: '#1C1D1E',
    keyBorder: '#A4A6A9',
    opFill: '#6A6C6F',
    opText: '#E4E5E6',
    opBorder: '#87898C',
    fnFill: '#76787B',
    fnText: '#E4E5E6',
    fnBorder: '#8E9093',
    accent: '#E9A63C',
    accentText: '#1C1D1E',
    rule: 'rgba(255,255,255,0.14)',
    keyShape: 'squircle',
    radius: 10,
  },
};