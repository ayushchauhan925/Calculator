import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { themes, type Theme, type ThemeName } from '@/theme/themes';

interface SettingsState {
  themeName: ThemeName;
  haptics: boolean;
  setTheme: (name: ThemeName) => void;
  toggleHaptics: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      themeName: 'obsidian',
      haptics: true,
      setTheme: (themeName) => set({ themeName }),
      toggleHaptics: () => set((s) => ({ haptics: !s.haptics })),
    }),
    {
      // Bumped from 'calc-settings' — the old key holds 'nebula', a theme
      // that no longer exists, which would crash on restore.
      name: 'calc-settings-v2',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** Active theme. Falls back if a stale name ever comes out of storage. */
export const useTheme = (): Theme => {
  const name = useSettings((s) => s.themeName);
  return themes[name] ?? themes.obsidian;
};