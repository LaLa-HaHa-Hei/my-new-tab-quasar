import type { BookmarkData } from 'src/components/widgets/bookmark/bookmarkData';
import type { MemoData } from 'src/components/widgets/memo/memoData';

export interface WidgetItem {
  id: number;
  widgetKey: string;
  w: number;
  h: number;
  data: BookmarkData | MemoData | null;
}
