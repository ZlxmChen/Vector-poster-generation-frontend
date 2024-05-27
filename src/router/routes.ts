import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'editor',
    path: '/editor/:command',
    component: () => import('@/views/home/index.vue'),
    props: true
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/',
    redirect: 'home',
    component: () => import('@/views/layout.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/home.vue'),
      },
      
    ]
  }
];

export default routes;
