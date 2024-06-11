import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'editer',
    path: '/editer/:command',
    props: true,
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
        path: 'notification',
        component: () => import('@/views/notification.vue'),
      },
      {
        path: 'info',
        component: () => import('@/views/person.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/views/settings.vue'),
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
