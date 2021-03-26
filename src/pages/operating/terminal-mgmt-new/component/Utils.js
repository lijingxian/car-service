import calUrlParams from '@/utils/calUrlParams';

export default {
  isLPR() {
    return calUrlParams.getUriQuery().terminalTypeName === 'LPR';
  },
  getTerminalTypeId() {
    return calUrlParams.getUriQuery().terminalTypeId;
  }
};
