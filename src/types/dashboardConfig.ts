import type { WidgetItem } from 'src/types';

export interface DashboardConfig {
  display: boolean;
  paddingTop: string;
  paddingX: string;
  size: string;
  gap: string;
  widgets: WidgetItem[];
}
