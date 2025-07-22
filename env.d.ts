/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import 'pinia';
import { PersistOptions } from 'pinia-plugin-persistedstate';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // You can define simpler getters that will be defined on the store so you can just use `this.myGetter` inside actions
  }

  export interface DefineStoreOptionsBase<S, Store> {
    // Allow defining a number of ms to debounce actions
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>;
    persist?: boolean | PersistOptions | (boolean | PersistOptions)[];
  }
}
