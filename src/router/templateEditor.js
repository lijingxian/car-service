const router = [
  {
    path: '/template-editor',
    component: () => import('@/pages/template-editor/index')
  },
  {
    path: '/template-single-page',
    component: () => import('@/pages/template-editor/SinglePage')
  }
];

export default router;
