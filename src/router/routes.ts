import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/editer',
    component: () => import('@/views/home/index.vue'),
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
      {
        path: 'space',
        redirect: '/space/my',
        component: () => import('@/views/space.vue'),
        children: [
          {
            path: 'my',
            name: 'my',
            component: () => import('@/views/space/my.vue'),
          },
          {
            path: 'trash',
            name: 'trash',
            component: () => import('@/views/space/trash.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
