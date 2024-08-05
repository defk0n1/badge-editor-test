import { createRouter, createWebHistory } from 'vue-router'
import GuestView from '../views/GuestView.vue'
import ManagerView from '../views/ManagerView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/guest', component: GuestView},
    {path: '/manager', component: ManagerView},
  ]
})

export default router
