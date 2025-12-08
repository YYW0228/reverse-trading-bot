import { Quasar } from 'quasar'
import { Notify, Dialog, Loading, BottomSheet } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Quasar, {
    plugins: {
      Notify,
      Dialog,
      Loading,
      BottomSheet
    },
    config: {
      brand: {
        primary: '#5B21B6',
        secondary: '#8B5CF6',
        accent: '#C084FC',
        dark: '#1E1B4B',
        'dark-page': '#0F0F23',
        positive: '#10B981',
        negative: '#EF4444',
        info: '#3B82F6',
        warning: '#F59E0B'
      },
      notify: {
        position: 'top',
        timeout: 3000,
        textColor: 'white',
        actions: [{ icon: 'close', color: 'white' }]
      },
      loading: {
        spinnerColor: 'primary',
        spinnerSize: 140,
        backgroundColor: 'rgba(0,0,0,0.8)'
      }
    }
  })
})
