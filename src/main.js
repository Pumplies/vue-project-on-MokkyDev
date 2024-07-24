import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomeComponent.vue'
import FavoritesPage from './pages/FavoriteComponent.vue'
const routes = [
    { path: '/', component: HomePage },
    { path: '/favorites', component: FavoritesPage },
  ]
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  export default router  


const app = createApp(App)
app.use(router)
app.use(autoAnimatePlugin)
app.mount('#app')


