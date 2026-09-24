import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import './asset.css'
import './company.css'
import './user.css'
import './messages.css'
import App from './App.vue'
import { i18n } from './i18n'
import './locales/layout.css'

createApp(App).use(i18n).use(ElementPlus).mount('#app')
