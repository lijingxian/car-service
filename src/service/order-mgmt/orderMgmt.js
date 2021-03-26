import responseHandle from '@/common/error/responseHandle';
import axios from 'axios';
import urls from '@/common/urls';

export default {
  listOrder(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.list, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  viewOrder(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.order : urls.orderMgmt.orderMgmt.order, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  updateOrder(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.order : urls.orderMgmt.orderMgmt.order, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createOrder(params, success, fail) {
    axios
      .post(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.order : urls.orderMgmt.orderMgmt.order, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  excuteOrder(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.service : urls.orderMgmt.orderMgmt.service, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  closeOrder(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.close : urls.orderMgmt.orderMgmt.close, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  confirmOrder(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.confirm : urls.orderMgmt.orderMgmt.confirm, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  paymentOrder(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.payment : urls.orderMgmt.orderMgmt.payment, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  shippingOrder(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.shipping : urls.orderMgmt.orderMgmt.shipping, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  repairMaintainHistory(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.repairMaintainHistory, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listAdminByRole(params, success, fail) {
    axios
      .post(urls.orderMgmt.orderMgmt.listAdminByRole, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listExistCardTemplate(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.listExistCardTemplate, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  viewProducts(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.viewProducts : urls.orderMgmt.orderMgmt.viewProducts, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  viewOrderlogs(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.viewOrderlogs : urls.orderMgmt.orderMgmt.viewOrderlogs, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  viewOrderRefunds(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.viewOrderRefunds : urls.orderMgmt.orderMgmt.viewOrderRefunds, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryInvoiceDetailByOrderID(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.queryInvoiceDetailByOrderID : urls.orderMgmt.orderMgmt.queryInvoiceDetailByOrderID, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  invoiceMail(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.invoiceMail : urls.orderMgmt.orderMgmt.invoiceMail, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  invoiceMailUpdate(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.invoiceMail : urls.orderMgmt.orderMgmt.invoiceMail, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  invoiceInfoDefault(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.invoiceInfoDefault : urls.orderMgmt.orderMgmt.invoiceInfoDefault, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  invoiceByOrder(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.invoiceByOrder : urls.orderMgmt.orderMgmt.invoiceByOrder, {
        params: params
      })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  invoiceDetailCreate(params, success, fail) {
    axios
      .post(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.invoice : urls.orderMgmt.orderMgmt.invoice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  invoiceDetailUpdate(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.invoice : urls.orderMgmt.orderMgmt.invoice, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  invoiceDetail(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.invoiceDetail : urls.orderMgmt.orderMgmt.invoiceDetail, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  addOrderItems(params, success, fail) {
    axios
      .post(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.addOrderItems : urls.orderMgmt.orderMgmt.addOrderItems, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  brands(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.brands, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  series(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.series, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  types(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.types, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  getFinancialPlans(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.getFinancialPlans, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  memberList(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.memberList, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  options(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.options, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  rescuers(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.rescuers, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  export(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.export, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  rescueOrderLogs(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.rescueOrderLogs, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  loanTerms(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.loanTerms, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  queryOrderKpi(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.queryOrderKpi, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  refundsAudit(params, success, fail) {
    axios
      .put(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.refundsAudit : urls.orderMgmt.orderMgmt.refundsAudit, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  rescuerSetting(params, success, fail) {
    axios
      .put(urls.orderMgmt.orderMgmt.rescuerSetting, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  rescuerDispath(params, success, fail) {
    axios
      .put(urls.orderMgmt.orderMgmt.rescuerDispath, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  carOptions(params, success, fail) {
    axios
      .put(urls.orderMgmt.orderMgmt.carOptions, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  createMember(params, success, fail) {
    axios
      .post(urls.orderMgmt.orderMgmt.createMember, params)
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  certificate(params, success, fail) {
    axios
      .get(window.top.dType === 'purchaseOrder' ? urls.orderMgmt.purchaseOrderMgmt.certificate : urls.orderMgmt.orderMgmt.certificate, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  },
  listProductByTestDrive(params, success, fail) {
    axios
      .get(urls.orderMgmt.orderMgmt.listProductByTestDrive, { params: params })
      .then(responseHandle(success, fail))
      .catch(error => {
        console.error(error);
      });
  }
};
