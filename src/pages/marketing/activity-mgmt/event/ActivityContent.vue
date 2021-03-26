<template>
  <biz-grid class="activity-content" v-loading="loading">
    <div slot="top">
      <div class="header_1">
        <el-button type="primary" size="mini" @click="screen">现场大屏幕</el-button>
        <el-button type="primary" size="mini" @click="add" v-if="isEdit">添加</el-button>
      </div>
      <!-- <div class="header_2">
        <span class="span">添加节目</span>
        <el-button type="primary" size="mini" @click="addCustom">自定义<i class="el-icon-plus el-icon--right"></i></el-button>
        <el-button type="primary" size="mini" @click="addPrize">抽奖<i class="el-icon-plus el-icon--right"></i></el-button>
      </div>-->
    </div>
    <el-table :data="tableData" height="100%" border highlight-current-row tooltip-effect="dark" stripe size="small">
      <el-table-column label="节目时间" prop="date">
        <template slot-scope="scope">{{scope.row.beginDate}} - {{scope.row.endDate}}</template>
      </el-table-column>
      <el-table-column label="节目名称" prop="title"></el-table-column>
      <el-table-column label="节目类型" prop="itemType">
        <template slot-scope="scope">{{scope.row.itemType ==='0' ? '签到' : scope.row.itemType ==='1'?'抽奖':'自定义'}}</template>
      </el-table-column>
      <el-table-column label="操作" prop="memo">
        <template slot-scope="scope" v-if="isEdit">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click.stop="edit(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini" @click.stop="del(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="biz-pagination" slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog title="节目编辑" center width="700px" :visible.sync="dialogVisible" append-to-body custom-class="program">
      <el-form ref="form" :model="formModel" label-width="110px" size="small" :rules="rules">
        <el-form-item label="节目类型" prop="itemType" class="isRequired">
          <el-select v-model="formModel.itemType" placeholder="请选择节目类型">
            <el-option v-for="(item,index) in  itemTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节目名称" prop="title" class="isRequired">
          <el-input v-model="formModel.title" stlye="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="节目时间" prop="beginDate" class="isRequired">
          <el-time-picker v-model="formModel.beginDate" value-format="HH:mm" format="HH:mm"></el-time-picker>
          <span style="margin: 0px 5px">-</span>
          <el-time-picker v-model="formModel.endDate" value-format="HH:mm" format="HH:mm"></el-time-picker>
        </el-form-item>
        <el-form-item label="抽奖方式" prop="name" v-if="formModel.itemType==='1'" class="isRequired">
          <el-radio-group v-model="formModel.lotteryWay">
            <!-- <el-radio v-for="(item,index) in  lotteryWayList" :key="index" :label="item.value">{{item.label}}</el-radio> -->
            <el-radio label="2">现场摇一摇</el-radio>
            <el-radio label="3">大转盘</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title :visible.sync="dialogVisibleScreen" @close="closed" append-to-body :fullscreen="fullscreen"
      custom-class="fullScreen-dialog">
      <full-screen :itemId="itemId" :open="dialogVisibleScreen"></full-screen>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
import FullScreen from './components/FullScreen';
import { BizPagination } from '@/components/BizTable';
export default {
  name: 'MemberBaseInfo',
  props: {
    itemId: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  components: {
    BizGrid,
    FullScreen,
    BizPagination
  },
  data() {
    return {
      rules: {
        title: [
          {
            required: true,
            message: '请输入节目名称',
            trigger: 'blur'
          }
        ],
        beginDate: [
          {
            required: true,
            message: '请输入节目时间',
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      dialogVisible: false,
      dialogVisibleScreen: false,
      fullscreen: true,
      // 用户信息
      formModel: {
        title: '',
        beginDate: '',
        endDate: '',
        itemType: '0',
        lotteryWay: '2',
        localMarketingId: ''
      },
      itemTypeList: [],
      lotteryWayList: [],
      selections: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      }
    };
  },
  created() {
    if (this.itemId) {
      this.backgrounds();
      this.getList();
    }
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    closed() {
      this.dialogVisibleScreen = false;
    },
    screen() {
      this.dialogVisibleScreen = true;
    },
    add() {
      this.formModel = {
        title: '',
        beginDate: '',
        endDate: '',
        itemType: '0',
        lotteryWay: '2',
        localMarketingId: ''
      };
      this.dialogVisible = true;
    },
    getList() {
      http
        .get(activityMgmt.itemsList, { id: this.itemId })
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    backgrounds() {
      http
        .get(activityMgmt.backgrounds, {})
        .then(data => {
          this.itemTypeList = data.itemTypeList;
          this.lotteryWayList = data.lotteryWayList;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formModel.localMarketingId = this.itemId;
          if (this.formModel.id) {
            http
              .put(activityMgmt.localMarketingItem, this.formModel)
              .then(data => {
                this.$message.success('更新成功');
                this.getList();
                this.$emit('operateSuccess');
                this.dialogVisible = false;
              })
              .catch(errData => {
                this.loading = false;
                this.$message.warning(errData.errorMessage);
              });
          } else {
            http
              .post(activityMgmt.localMarketingItem, this.formModel)
              .then(data => {
                this.$message.success('创建成功');
                this.getList();
                this.$emit('operateSuccess');
                this.dialogVisible = false;
              })
              .catch(errData => {
                this.loading = false;
                this.$message.warning(errData.errorMessage);
              });
          }
        }
      });
    },
    edit(row) {
      http
        .get(activityMgmt.localMarketingItem, { id: row.id })
        .then(data => {
          this.dialogVisible = true;
          this.formModel = Object.assign({}, data.data);
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    del(row) {
      this.loading = true;
      let ids = [];
      ids.push(row.id);
      http
        .delete(activityMgmt.localMarketingItem, { ids: ids })
        .then(data => {
          this.loading = false;
          this.$message.success('删除成功');
          this.$emit('operateSuccess');
          this.getList();
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.fullScreen-dialog {
  .el-dialog__header {
    position: relative;
    z-index: 1;
  }
}
.program {
  .el-input__inner {
    width: 220px;
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.activity-content {
  padding-top: 20px;
  .el-table {
    overflow: auto;
  }
  .header_1 {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .header_2 {
    .span {
      margin-right: 10px;
    }
    font-size: 12px;
    padding-bottom: 20px;
    padding-top: 10px;
  }
  .el-input-number--small {
    width: 100%;
  }
}
</style>
