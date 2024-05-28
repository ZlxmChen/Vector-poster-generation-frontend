import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('beforeEach', localStorage.getItem('token'));
  if (to.path !== '/login' && localStorage.getItem('token') == '') {
    // 如果用户未登录且目标路由不是登录页，重定向到登录页
    next('/login');
  } else {
    // 否则，放行
    next();
  }
});

export default router;
