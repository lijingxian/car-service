<template>
  <div class="handbook-list-view">
    <biz-flex-table ref="table" :tableData="cardList" @selection-change="handleSelectionChange"
      @row-click="rowClick(arguments)" @filter-data-change="filterChange">
      <el-table-column prop="product" label="商品" min-width="160">
        <template slot-scope="scope">
          <div style="display:flex;justify-content:space-between;width:100%">
            <div style="width:100%">
              <div class="product-info-content">
                <img v-if="scope.row.image" :src="scope.row.image" :onerror="errorImg" />
                <img v-else src="/resources/admin/images/default/product-default-100.png" />
                <div class="wrapper" style="width:200px">
                  <div class="titleClass">{{scope.row.brand?scope.row.brand:'--'}}</div>
                  <div class="overflow">{{scope.row.series?scope.row.series:'--'}}</div>
                  <div class="overflow">{{scope.row.carType?scope.row.carType:'--'}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.state==='0'?'已导入':scope.row.state==='1'?'已使用':scope.row.state==='2'?'商品需更新':'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="deleteLine(scope.row)" v-if="hasAuthDel">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import defaultImg from '@/assets/images/icon_vip.png';
import { mapGetters } from 'vuex';
export default {
  name: 'HandbookListView',
  data() {
    return {
      defaultImg: defaultImg,
      selectionKeys: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      showDialog: false
    };
  },
  props: {
    cardList: Array,
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizFlexTable
  },
  created() {},
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:aftersale.booklet.delete');
    }
  },
  mounted() {},
  methods: {
    // stateColor(row) {
    //   if (row.state === '2') {
    //     return '#FF7300';
    //   } else if (row.state === '0' || row.state === '1') {
    //     return '#11AE17';
    //   } else {
    //     return '#000000';
    //   }
    // },
    operationSuccess() {
      this.$emit('create');
    },
    rowClick() {
      this.$emit('rowClick', arguments[0][0]);
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val);
    },
    deleteLine(val) {
      this.$emit('deleteLine', val);
    },
    filterChange() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    }
  }
};
</script>
<style lang="scss">
.handbook-list-view {
}
</style>
