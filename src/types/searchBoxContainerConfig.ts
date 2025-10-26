import type { SearchBoxItem } from './searchBoxItem';

export interface SearchBoxContainerConfig {
  display: boolean;
  paddingTop: string;
  paddingX: string;
  columnCount: number;
  gap: string;
  items: SearchBoxItem[];
}
