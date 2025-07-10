import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user'
import vuetify from './plugins/vuetify'

const app = createApp(App)

// Create pinia instance
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Add pinia to app
app.use(pinia)
app.use(vuetify)

// Initialize store before mounting
const userStore = useUserStore()
userStore.initialize().then(() => {
  // Mount app after store is initialized
  app.use(router)
  app.mount('#app')
}).catch((error: any) => {
  console.error('Failed to initialize user store:', error)
  // Mount anyway to prevent app from breaking
  app.use(router)
  app.mount('#app')
})