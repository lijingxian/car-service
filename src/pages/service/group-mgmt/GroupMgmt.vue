<template>
  <div class="customer-service__group-mgmt">
    <biz-flex-table ref="table" :operations="operations" :tableData="tableData" :loading="loading" @operate="operateHandler"
      @size-change="pageSizeChange" @current-change="currentPageChange" @selection-change="selectionChangeHandler"
      @filter-data-change="filterDataChangeHandler" @row-click="rowOperationClickHandler">
      <el-table-column prop="name" label="群组名称" min-width="120">
      </el-table-column>
      <el-table-column prop="groupOwner.name" label="群主" min-width="120">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.groupOwner.head" :src="scope.row.groupOwner.head" />
            <img v-else src="../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.groupOwner.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.groupOwner.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.groupOwner.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.groupOwner.gender === '2'"></i>
                <span>{{scope.row.groupOwner.mobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accountlist" label="群组成员" min-width="230">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="customer-info" style="display:flex;flex-wrap:wrap">
              <div v-for="(item, index) in scope.row.members" :key="index" type="text" size="mini"
                v-show="item.isService==='1'" @click="showDetailHandler($event, item)">
                <img v-if="item.head" :src="item.head" />
                <img v-else src="../../../assets/images/default_user.png" />
                <div class="wrapper">
                  <div class="title">{{item.name}}</div>
                  <div class="gender">
                    <i class="male iconfont biz-icon-i-web-m" v-if="item.gender === '0'"></i>
                    <i class="female iconfont biz-icon-i-web-f" v-if="item.gender === '1'"></i>
                    <i class="none iconfont biz-icon-i-web-bm" v-if="item.gender === '2'"></i>
                    <span>{{item.mobile}}</span>
                  </div>
                </div>
              </div>
              <div class="customer-info" v-for="(item, index) in scope.row.members" :key="index" type="text" size="mini"
                v-show="item.isService==='0'">
                <img v-if="item.head" :src="item.head" />
                <img v-else src="../../../assets/images/default_user.png" />
                <div class="wrapper">
                  <div class="title">{{item.name}}</div>
                  <div class="gender">
                    <i class="male iconfont biz-icon-i-web-m" v-if="item.gender === '0'"></i>
                    <i class="female iconfont biz-icon-i-web-f" v-if="item.gender === '1'"></i>
                    <i class="none iconfont biz-icon-i-web-bm" v-if="item.gender === '2'"></i>
                    <span>{{item.mobile}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="操作" width="130">
        <template slot-scope="scope" v-if="hasAuthDel">
          <el-button type="text" size="mini" @click="deleteHandler($event, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </biz-flex-table>
    <div slot="float">
      <tag-class-popup :isService="isService" :open="open" :itemId="itemId" @close="open = false;"
        @operationSuccess="operationSuccess"></tag-class-popup>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import TagClassPopup from './GroupMgmt/GroupMgmtPopup';
import { mapGetters } from 'vuex';
import service from '@/service/customer-service/group-mgmt/groupMgmt';

export default {
  name: 'TagClassMgmt',
  components: {
    BizFlexTable,
    TagClassPopup
  },
  props: {},
  data() {
    return {
      // 是否显示客服详情
      isService: false,
      // 控件
      itemId: { id: '' },
      selections: [],

      // 右侧弹窗
      open: false,

      // Table相关
      loading: false,
      tableData: [],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:group.add']
        },
        {
          label: '删除',
          name: 'del',
          type: '',
          disabled: true,
          auth: ['admin:group.delete']
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入分类名称',
          name: 'searchValue',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthDel() {
      // return true;
      return this.currentAuth.includes('admin:group.delete');
    }
  },
  methods: {
    deleteItem(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        service.delete(
          {
            ids: ids
          },
          data => {
            this.loading = false;
            this.$message.success('删除成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
            this.loading = false;
          }
        );
      });
    },

    operationSuccess() {
      this.open = false;
      this.query();
    },
    operateHandler(name) {
      this[name]();
    },
    pageSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.query();
    },
    currentPageChange(val) {
      this.pagination.currentPage = val;
      this.query();
    },
    rowOperationClickHandler(model, e, column) {
      this.isService = false;
      this.itemId = { id: String(model.id) };
      this.open = true;
    },
    selectionChangeHandler(val) {
      this.selections = val;
      this.operations.map(item => {
        if (item.name === 'del') {
          item.disabled = true;
        }
        if (val.length > 0) {
          if (item.name === 'del') {
            item.disabled = false;
          }
        }
      });
    },
    filterDataChangeHandler() {
      this.query();
    },
    deleteHandler(e, model) {
      e.stopPropagation();

      this.deleteItem([model.id]);
    },
    showDetailHandler(e, model) {
      e.stopPropagation();
      this.isService = true;
      this.itemId = { id: String(model.id) };
      this.open = true;
      console.log('person id:', model.id, model.nickname);
    },

    getQueryParams() {
      return {
        shopId: window.top.SHOP_ID || ''
      };
    },
    query() {
      this.loading = true;
      service.query(
        this.getQueryParams(),
        data => {
          this.tableData = data.dataList;

          // this.$set(this.pagination, 'total', Number.parseInt(data.total));
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
          this.loading = false;
        }
      );
    },
    add() {
      this.open = true;
      this.itemId = { id: '' };
    },
    del() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteItem(ids);
      } else {
        this.$message('请选择一个分类');
      }
    }
  },
  mounted() {
    this.$message({
      showClose: true,
      message: '对客服群组进行增删改',
      type: 'info'
    });
  },
  created() {
    this.query();
  }
};
</script>

<style lang="scss">
.customer-service__group-mgmt {
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  .customer-info {
    img {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .wrapper {
      margin-left: 56px;
      position: relative;
      .gender {
        .iconfont {
          position: absolute;
          left: -28px;
          bottom: -2px;
          font-size: 24px;
        }

        .male {
          color: #2069cb;
        }
        .female {
          color: #f935d1;
        }
        .none {
          color: #ff7300;
        }
      }
    }
  }
  .cs-user-list {
    display: flex;
    flex-wrap: wrap;
    .user-item {
      // width: 60px;
      text-align: center;
      margin-right: 10px;
      float: left;

      img {
        display: block;
        margin: 0 auto 5px;
        width: 48px;
        height: 48px;
      }

      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .user-item-div {
      // width: 60px;
      text-align: center;
      margin-right: 10px;
      float: left;
      padding: 8px 0px;

      img {
        display: block;
        margin: 0 auto 5px;
        width: 48px;
        height: 48px;
      }

      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .el-button + .el-button {
      margin-left: 0px;
    }
  }
}
</style>
