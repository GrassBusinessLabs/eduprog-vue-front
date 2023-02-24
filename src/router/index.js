
import { useUserStore } from '@/stores/user'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async function(to, from, next){
  const userStore = useUserStore()
  await userStore.checkToken()
  if(to.fullPath==="/"){
    console.log("первый роут")
     next('/home')
  }
  if(to.meta.requiresUnAuth && userStore.tokenIsValid){
    console.log("второй роут")
    next('/home')
  }
  else if(to.meta.requiresAuth && !userStore.tokenIsValid){
    next('/login')
  }
  else{
    next()
  }
})
export default router
