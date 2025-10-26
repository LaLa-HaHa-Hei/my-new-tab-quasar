import type { InjectionKey } from 'vue';

export const InjectKeys = {
  showSettingsDialog: Symbol('showSettingsDialog') as InjectionKey<(page?: string) => void>,
};
