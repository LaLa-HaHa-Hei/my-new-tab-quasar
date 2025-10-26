import type { WidgetItem } from 'src/types';
import type { Component } from 'vue';

export interface WidgetDef {
  key: string;
  name: string;
  component: Component;
  description?: string;
  toString: (widget: WidgetItem) => string;
  create: () => Promise<WidgetItem>;
  onRemove?: (widget: WidgetItem) => void;
  editConfig?: () => void;
  editItem?: (widget: WidgetItem) => Promise<WidgetItem>;
  exportConfig?: () => object;
  importConfig?: (config: object) => void;
}
