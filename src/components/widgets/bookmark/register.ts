import type { WidgetDef, WidgetItem } from 'src/types';
import type { BookmarkData } from './bookmarkData';
import AddBookmarkDialog from './AddBookmarkDialog.vue';
import Bookmark from './Bookmark.vue';
import { Dialog } from 'quasar';
import EditBookmarkDialog from './EditBookmarkDialog.vue';
import BookmarkConfigDialog from './BookmarkConfigDialog.vue';
import { useBookmarkStore, type BookmarkConfig } from './bookmarkStore';
import { i18n } from 'src/boot/i18n';

const def: WidgetDef = {
  key: 'bookmark',
  get name() {
    return i18n.global.t('widgets.bookmark.name');
  },
  component: Bookmark,
  get description() {
    return i18n.global.t('widgets.bookmark.description');
  },
  toString: (widget: WidgetItem) => {
    const data = widget.data as BookmarkData;
    return `${def.name}: ${data.label}`;
  },
  create: () => {
    return new Promise((resolve, reject) => {
      Dialog.create({
        component: AddBookmarkDialog,
      })
        .onOk((widget) => {
          resolve(widget);
        })
        .onCancel(() => {
          reject(new Error('Canceled'));
        })
        .onDismiss(() => {
          reject(new Error('Dismissed'));
        });
    });
  },
  editItem: (widget: WidgetItem) => {
    return new Promise((resolve, reject) => {
      Dialog.create({
        component: EditBookmarkDialog,
        componentProps: {
          widget,
        },
      })
        .onOk((widget) => {
          resolve(widget);
        })
        .onCancel(() => {
          reject(new Error('Canceled'));
        })
        .onDismiss(() => {
          reject(new Error('Dismissed'));
        });
    });
  },
  editConfig: () => {
    Dialog.create({
      component: BookmarkConfigDialog,
    });
  },
  exportConfig: () => {
    return useBookmarkStore().config!;
  },
  importConfig: (config: object) => {
    useBookmarkStore().config = config as BookmarkConfig;
  },
};

export default def;
