import { user } from '@/common/urls';
import http from '@/common/http';
import BizColumns from '@/components/BizColumns';
import { BizColumnOperation } from '@/components/BizTable';

export default {
  components: {
    BizColumnOperation,
    BizColumns
  },
  data() {
    return {
      columnsSettingVisible: false,
      columns: []
    };
  },
  created() {
    this.getTableId();
    this.getColumns();
  },
  methods: {
    onCustomColumns() {
      this.columnsSettingVisible = true;
    },
    getColumns() {
      console.log(12);
      http
        .get(user.columns, {
          tableId: this.tableId
        })
        .then(data => {
          this.columns = [];
          setTimeout(() => {
            this.columns = data.data.columnDatas.filter(item => item.displayable);
            if (this.$refs.table) {
              setTimeout(() => {
                this.$refs.table.doLayout();
              }, 50);
            }
          }, 20);
        }).catch(errData => {
          if (errData.errorMessage) console.log(errData.errorMessage);
        });
    },
    // 此函数有意义，为了替换在订单列表
    getTableId() {}
  }
};
