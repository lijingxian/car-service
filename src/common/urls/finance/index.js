// 财务
// 收款管理
import receiptMgmt from './receiptMgmt';

// 付款管理
import paymentMgmt from './paymentMgmt';

// 供应商对账
import supplierCheckAcount from './supplierCheckAcount';

export default Object.assign({}, { receiptMgmt }, { paymentMgmt }, { supplierCheckAcount });
