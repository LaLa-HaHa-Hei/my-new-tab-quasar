import { defineBoot } from '#q-app/wrappers';
import { useWidgetRegistryStore } from 'src/stores/widgetRegistry';
import type { WidgetDef } from 'src/types';

export default defineBoot(() => {
  const widgetRegistry = useWidgetRegistryStore();
  const modules = import.meta.glob('src/components/widgets/**/register.ts', { eager: true });
  Object.values(modules).forEach((m) => {
    const def = (m as { default: WidgetDef }).default;
    widgetRegistry.register(def);
  });
});
