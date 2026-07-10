// src/shims-vue.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module '@/composables/*';
declare module '@/stores/*';
declare module '@/features/*';
declare module '@/plugins/*'