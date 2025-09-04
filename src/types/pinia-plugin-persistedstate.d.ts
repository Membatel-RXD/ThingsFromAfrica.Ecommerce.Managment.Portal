declare module 'pinia-plugin-persistedstate' {
    import { PiniaPlugin } from 'pinia'
    
    interface PersistedStateOptions {
      key?: string
      storage?: Storage
      paths?: string[]
      beforeRestore?: (context: any) => void
      afterRestore?: (context: any) => void
      serializer?: {
        serialize: (value: any) => string
        deserialize: (value: string) => any
      }
      debug?: boolean
    }
  
    const piniaPluginPersistedstate: PiniaPlugin
    export default piniaPluginPersistedstate
  }
  