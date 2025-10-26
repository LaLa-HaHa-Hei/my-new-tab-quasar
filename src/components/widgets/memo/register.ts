import type { WidgetDef, WidgetItem } from 'src/types';
import type { MemoData } from './memoData';
import { LocalStorage } from 'quasar';
import Memo from './Memo.vue';
import { StorageKey } from 'src/constants/storageKeys';
import MemoConfigDialog from './MemoConfigDialog.vue';
import { Dialog } from 'quasar';
import { useMemoStore, type MemoConfig } from './memoStore';
import { i18n } from 'src/boot/i18n';

const def: WidgetDef = {
  key: 'memo',
  get name() {
    return i18n.global.t('widget.memo.name');
  },
  component: Memo,
  get description() {
    return i18n.global.t('widget.memo.description');
  },
  toString: () => {
    return `${def.name}`;
  },
  create: () => {
    const data: MemoData = {
      id: Date.now(),
    };
    const widget: WidgetItem = {
      id: Date.now(),
      w: 3,
      h: 2,
      widgetKey: def.key,
      data: data,
    };
    return Promise.resolve(widget);
  },
  onRemove: (widget: WidgetItem) => {
    const data = widget.data as MemoData;
    LocalStorage.remove(`${StorageKey.WIDGET_CONFIG_PREFIX}memo_${data.id}`);
  },
  editConfig: () => {
    Dialog.create({
      component: MemoConfigDialog,
    });
  },
  exportConfig: () => {
    return useMemoStore().config!;
  },
  importConfig: (config: object) => {
    useMemoStore().config = config as MemoConfig;
  },
};

export default def;
