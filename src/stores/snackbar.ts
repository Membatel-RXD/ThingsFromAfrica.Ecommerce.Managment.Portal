import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    visible: false,
    message: '',
    color: 'success',
    timeout: 4000,
  }),
  actions: {
    show(message: string, color: string = 'success') {
      this.message = message;
      this.color = color;
      this.visible = true;
    },
    success(message: string) {
      this.show(message, 'success');
    },
    error(message: string) {
      this.show(message, 'error');
    },
    info(message:string){
      this.show(message, 'info');
    }
  },
});
