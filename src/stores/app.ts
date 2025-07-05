import { defineStore } from "pinia";

export const useAppStore = defineStore("app-store", {
  state: () => ({
    drawer: true,
    department: null,
  }),
});
