import setting from './setting';
import baseData from './base-data';
import purchaseMgmt from './purchase-mgmt';
import storeHouseMgmt from './store-house-mgmt';
export default {
  ...setting,
  ...baseData,
  ...purchaseMgmt,
  ...storeHouseMgmt
};
