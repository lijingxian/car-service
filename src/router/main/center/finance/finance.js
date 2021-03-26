// 所有组件都要异步加载
const Nav = resolve => require(['@/pages/finance/nav'], resolve);
const ReceiptMgmt = resolve => require(['@/pages/finance/receipt-mgmt/ReceiptMgmt'], resolve);
const PaymentMgmt = resolve => require(['@/pages/finance/payment-mgmt/PaymentMgmt'], resolve);
const SupplierCheckAcount = resolve => require(['@/pages/finance/supplier-check-acount/SupplierCheckAcount'], resolve);
const AgentCheckAcount = resolve => require(['@/pages/finance/agent-check-acount/AgentCheckAcount'], resolve);
const InvoiceMgmt = resolve => require(['@/pages/finance/invoice-mgmt/InvoiceMgmt'], resolve);
const GeneralViewAnalysis = resolve => require(['@/pages/finance/statistics-analysis-new/sale/GeneralViewAnalysis'], resolve);
const routes = [
  {
    path: '',
    component: Nav
  },
  {
    path: 'receipt-mgmt',
    component: ReceiptMgmt
  },
  {
    path: 'payment-mgmt',
    component: PaymentMgmt
  },
  {
    path: 'invoice-mgmt',
    component: InvoiceMgmt
  },
  {
    path: 'supplier-check-acount',
    component: SupplierCheckAcount
  },
  {
    path: 'agent-check-acount',
    component: AgentCheckAcount
  },
  {
    path: 'statistics-analysis',
    component: GeneralViewAnalysis
  }
];

export default routes;
