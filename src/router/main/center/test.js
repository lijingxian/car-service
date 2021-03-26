// 所有组件都要异步加载
const TableTest = resolve => require(['@/pages/test/TableTest'], resolve);
const ChartTest = resolve => require(['@/pages/test/ChartTest'], resolve);
const ScrollTest = resolve => require(['@/pages/test/ScrollTest'], resolve);
const TagTest = resolve => require(['@/pages/test/TagTest'], resolve);
const EleTable = resolve => require(['@/pages/test/EleTable'], resolve);
const EditorTest = resolve => require(['@/pages/test/EditorTest'], resolve);
const SignInWall = resolve => require(['@/pages/test/SignInWall'], resolve);
const LocationHref = resolve => require(['@/pages/test/LocationHref'], resolve);
const VueCropper = resolve => require(['@/pages/test/VueCropper'], resolve);
const QrCode = resolve => require(['@/pages/test/QrCode'], resolve);
const QrCodePay = resolve => require(['@/pages/test/QrCodePay'], resolve);
const FenceMapTest = resolve => require(['@/pages/test/FenceMapTest'], resolve);
const ReadTest = resolve => require(['@/pages/test/Read'], resolve);
const enter = [
  // 开发用功能定义页面
  {
    path: '/test/function-defination-admin',
    component: () => import('@/pages/system/system-setting-mgmt/function-defination/FunctionDefination.vue')
  },
  {
    path: '/tabletest',
    component: TableTest
  },
  {
    path: '/test',
    component: ChartTest
  },
  {
    path: '/tag-test',
    component: TagTest
  },
  {
    path: '/scoll-test',
    component: ScrollTest
  },
  {
    path: '/ele-test',
    component: EleTable
  },
  {
    path: '/ed-test',
    component: EditorTest
  },
  {
    path: '/siw',
    component: SignInWall
  },
  {
    path: '/location-href',
    component: LocationHref
  },
  {
    path: '/vue-cropper',
    component: VueCropper
  },
  {
    path: '/qr-code',
    component: QrCode
  },
  {
    path: '/qr-code-pay',
    component: QrCodePay
  },
  {
    path: '/fence-map-test',
    component: FenceMapTest
  },
  {
    path: '/read',
    component: ReadTest
  }
];

export default enter;
