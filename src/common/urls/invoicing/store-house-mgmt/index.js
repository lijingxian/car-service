import depotOutMgmt from './depotOutMgmt';
import depotInMgmt from './depotInMgmt';
import inventory from './inventory';
import stockStatistics from './stockStatistics';
import allottedMgmt from './allottedMgmt';
import barCode from './barCode';
export default Object.assign({}, { depotOutMgmt }, { depotInMgmt }, { inventory }, { stockStatistics }, { allottedMgmt }, { barCode });
