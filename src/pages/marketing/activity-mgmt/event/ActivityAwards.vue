<template>
  <biz-grid class="activity-awards" v-loading="loading">
    <div slot="top">
      <div class="header_1">
        <el-button type="primary" size="mini" @click="screen">现场大屏幕</el-button>
      </div>
      <el-alert :title="tooltip" type="info" :closable="false"></el-alert>
    </div>
    <el-table :data="tableData" height="100%" highlight-current-row border tooltip-effect="dark" stripe size="small">
      <el-table-column label="节目名称" prop="title">
      </el-table-column>
      <el-table-column label="节目类型" prop="itemType">
        <template slot-scope="scope">
          {{scope.row.itemType ==='0' ? '签到' : scope.row.itemType ==='1'?'抽奖':'自定义'}}
        </template>
      </el-table-column>
      <el-table-column label="抽奖方式" prop="lotteryWay">
        <template slot-scope="scope">
          {{lotteryWay(scope.row.lotteryWay)}}
        </template>
      </el-table-column>
      <el-table-column label="奖品数量" prop="prizeCount"></el-table-column>
      <el-table-column label="奖品编辑" prop="">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click.stop="edit(scope.row)" v-if="isEdit"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="biz-pagination" slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog title="签到奖励" center width="600px" :visible.sync="dialogVisible" append-to-body custom-class="sign-dialog">
      <el-form ref="form" :model="formModel" label-width="110px" size="small" :rules="rulesSign">
        <el-form-item label="奖品名称" prop="name">
          <el-input ref="awardTitle" placeholder="请输入奖品名称" v-model="formModel.name" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="奖品类型">
          <el-select v-model="formModel.type" placeholder="请选择奖品类型" @change="typeChange">
            <!-- <el-option :label="awardType.label" :value="awardType.value" :key="index" v-for="(awardType,index) of prizeTypeList"></el-option> -->
            <el-option value="0" label="v豆"></el-option>
            <el-option value="5" label="实物"></el-option>
            <el-option value="8" label="现金券"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品图片" prop="image">
          <BizAvatarUploaderNew v-model="formModel.image">
          </BizAvatarUploaderNew>
        </el-form-item>
        <el-form-item label="奖品面值" prop="count" v-show="formModel.type!=='4'">
          <div class="reward-value" v-if="formModel.type==='5'">
            <div>
              <el-radio v-model="formModel.coupon.isAmountUnfixed" label="0">固定</el-radio>
              <el-radio v-model="formModel.coupon.isAmountUnfixed" label="1" class="type-no">非固定</el-radio>
            </div>
            <div class="reward-dec">
              <el-input-number :min="0" v-model="formModel.count" :disabled="awardCountDisabled" class="reward-input"></el-input-number>
              <el-input v-model="formModel.coupon.amountDescription" placeholder="请输入奖品面值描述"></el-input>
            </div>
          </div>
          <el-input-number v-else :min="0" v-model="formModel.count" :disabled="awardCountDisabled" class="reward-input"></el-input-number>
        </el-form-item>
        <el-form-item label="奖品数量" prop="quantity">
          <el-input-number :min="1" v-model="formModel.quantity"></el-input-number>
        </el-form-item>
        <el-form-item v-show="formModel.type==='5'||formModel.type==='8'" label="结束时间">
          <el-date-picker v-model="formModel.coupon.endDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="formModel.type==='5'||formModel.type==='8'" label="使用门槛">
          <div class="isScan">
            <el-radio v-model="isLimit" label="1">限制</el-radio>
            <el-radio v-model="isLimit" label="0">不限制</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="满N元可用" v-show="isLimit==='1'" prop="minimumPrice">
          <el-input-number v-model="formModel.coupon.minimumPrice" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="抽奖奖励" center width="850px" :visible.sync="dialogVisible1" append-to-body custom-class="sign-dialog">
      <div style="display:flex;justify-content:space-between">
        <div>
          <el-form ref="formModel" :model="formModel" label-width="110px" size="small" :rules="rulesPrize">
            <el-form-item label="" prop="new" label-width="120px">
              <el-button type="primary" size="mini" @click="add">新建</el-button>
            </el-form-item>
            <div v-show="show">
              <el-form-item label="奖品名称" prop="name">
                <el-input ref="awardTitle" placeholder="请输入奖品名称" v-model="formModel.name" maxlength="10"></el-input>
              </el-form-item>
              <el-form-item label="奖品类型">
                <el-select v-model="formModel.type" placeholder="请选择奖品类型" @change="typeChange">
                  <el-option :label="awardType.label" :value="awardType.value" :key="index" v-for="(awardType,index) of prizeTypeList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="奖品图片" prop="image">
                <BizAvatarUploaderNew v-model="formModel.image">
                </BizAvatarUploaderNew>
              </el-form-item>
              <el-form-item label="奖品面值" prop="count" v-show="formModel.type!=='6'">
                <div class="reward-value" v-if="formModel.type==='5'">
                  <div>
                    <el-radio v-model="formModel.coupon.isAmountUnfixed" label="0">固定</el-radio>
                    <el-radio v-model="formModel.coupon.isAmountUnfixed" label="1" class="type-no">非固定</el-radio>
                  </div>
                  <div class="reward-dec">
                    <el-input-number :min="0" v-model="formModel.count" :disabled="awardCountDisabled" class="reward-input"></el-input-number>
                    <el-input v-model="formModel.coupon.amountDescription" placeholder="请输入奖品面值描述"></el-input>
                  </div>
                </div>
                <el-input-number v-else :min="0" v-model="formModel.count" :disabled="awardCountDisabled" class="reward-input"></el-input-number>
              </el-form-item>
              <el-form-item label="奖品数量" prop="quantity">
                <el-input-number :min="1" :max="100000" v-model="formModel.quantity"></el-input-number>
              </el-form-item>
              <el-form-item v-show="formModel.type==='5'||formModel.type==='8'" label="结束时间">
                <el-date-picker v-model="formModel.coupon.endDate" value-format="yyyy-MM-dd" type="date" placeholder="请选择结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item v-show="formModel.type==='5'||formModel.type==='8'" label="使用门槛">
                <div class="isScan">
                  <el-radio v-model="isLimit" label="1">限制</el-radio>
                  <el-radio v-model="isLimit" label="0">不限制</el-radio>
                </div>
              </el-form-item>
              <el-form-item label="满N元可用" v-show="isLimit==='1'" prop="minimumPrice">
                <el-input-number v-model="formModel.coupon.minimumPrice" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="" prop="save" label-width="120px">
                <el-button type="primary" size="mini" @click="save">保存</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div>
          <el-table :data="tableDataPrize" height="100%" border highlight-current-row tooltip-effect="dark" stripe size="small">
            <el-table-column label="奖品名称" prop="name"></el-table-column>
            <el-table-column label="奖品类型" prop="type">
              <template slot-scope="scope">
                {{prizeType(scope.row.type)}}
              </template>
            </el-table-column>
            <el-table-column label="奖品面值" prop="count"></el-table-column>
            <el-table-column label="奖品数量" prop="quantity"></el-table-column>
            <el-table-column label="操作" prop="data">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-delete" size="mini" @click="del(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="dialogVisible1 = false" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisibleScreen" @close="dialogVisibleScreen=false" append-to-body :fullscreen="fullscreen"
      custom-class="fullScreen-dialog">
      <full-screen :itemId="itemId" :open="dialogVisibleScreen"></full-screen>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizAvatarUploaderNew } from '@/components/BizForm';
import { BizPagination } from '@/components/BizTable';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
import FullScreen from './components/FullScreen';
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
    BizAvatarUploaderNew,
    FullScreen,
    BizPagination
  },
  data() {
    return {
      tooltip: '圆形转盘需3-8个奖品',
      loading: false,
      dialogVisible: false,
      dialogVisible1: false,
      awardCountDisabled: false,
      dialogVisibleScreen: false,
      fullscreen: true,
      show: false,
      marketingItemId: '',
      rulesSign: {
        name: [{ required: true, message: '请输入奖品名称', trigger: 'blur' }],
        image: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        count: [
          { required: true, message: '请输入奖品面值', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入奖品数量', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
        ]
      },
      rulesPrize: {
        name: [{ required: true, message: '请输入奖品名称', trigger: 'blur' }],
        image: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        quantity: [
          { required: true, message: '请输入奖品数量', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入整数', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入奖品面值', trigger: 'blur' },
          { pattern: /^\+?[0-9][0-9]*$/, message: '请输入整数', trigger: 'blur' }
        ]
      },
      // 用户信息
      formModel: {
        id: '',
        name: '',
        coupon: {
          amount: '',
          endDate: '',
          minimumPrice: '0',
          isAmountUnfixed: '0'
        },
        image: '',
        type: '',
        count: '',
        quantity: '1'
      },
      selections: [],
      tableData: [],
      isLimit: '0',
      tableDataPrize: [],
      itemTypeList: [],
      lotteryWayList: [],
      prizeTypeList: [],
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
      this.getList();
      this.backgrounds();
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
    clear() {
      return {
        id: '',
        name: '',
        coupon: {
          amount: '',
          endDate: '',
          minimumPrice: '0',
          isAmountUnfixed: '0'
        },
        image: '',
        type: '',
        count: '',
        quantity: '1'
      };
    },
    screen() {
      this.dialogVisibleScreen = true;
    },
    typeChange(type) {
      this.awardCountDisabled = false;
      switch (type) {
        case '0':
          this.formModel.image = '/resources/admin/images/default/bean.png';
          break;
        case '3':
          this.formModel.count = '0';
          this.awardCountDisabled = true;
          this.formModel.image = '/resources/admin/images/default/again.png';
          break;
        case '4':
          this.formModel.count = '0';
          this.awardCountDisabled = true;
          this.formModel.image = '/resources/admin/images/default/thanks.png';
          break;
        case '5':
          this.formModel.image = '/resources/admin/images/default/present.png';
          break;
        case '8':
          this.formModel.image = '/resources/admin/images/default/coupon.png';
          break;
        default:
          break;
      }
    },
    getList() {
      http
        .get(activityMgmt.itemsList, { id: this.itemId, filterType: 'hasPrize' })
        .then(data => {
          this.tableData = data.content;
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    lotteryWay(type) {
      switch (type) {
        case '0':
          return '用户名抽奖';
        case '1':
          return '评论抽奖';
        case '2':
          return '现场摇一摇';
        case '3':
          return '大转盘';
        default:
          return '--';
      }
    },
    prizeType(type) {
      switch (type) {
        case '0':
          return 'V豆';
        case '3':
          return '再来一次';
        case '4':
          return '谢谢参与';
        case '5':
          return '实物';
        case '8':
          return '现金券';
        default:
          return '--';
      }
    },
    backgrounds() {
      http
        .get(activityMgmt.backgrounds, {})
        .then(data => {
          this.itemTypeList = data.itemTypeList;
          this.lotteryWayList = data.lotteryWayList;
          this.prizeTypeList = data.prizeTypeList;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    // confirm1() {
    //   this.dialogVisible = false;
    //   this.formModel.localMarketingId = this.itemId;
    //   if (this.formModel.id) {
    //     http
    //       .put(activityMgmt.localMarketingItem, this.formModel)
    //       .then(data => {
    //         this.$message.success('创建成功');
    //         this.getList();
    //       })
    //       .catch(errData => {
    //         this.loading = false;
    //         this.$message.warning(errData.errorMessage);
    //       });
    //   } else {
    //     http
    //       .post(activityMgmt.localMarketingItem, this.formModel)
    //       .then(data => {
    //         this.$message.success('创建成功');
    //         this.getList();
    //       })
    //       .catch(errData => {
    //         this.loading = false;
    //         this.$message.warning(errData.errorMessage);
    //       });
    //   }
    // },
    edit(row) {
      this.show = false;
      this.marketingItemId = row.id;
      http
        .get(activityMgmt.prizesList, { marketingItemId: row.id })
        .then(data => {
          if (row.lotteryWay === '2' || row.lotteryWay === '3') {
            this.dialogVisible1 = true;
            this.tableDataPrize = data.data;
          } else {
            this.dialogVisible = true;
            this.formModel = Object.assign(this.clear(), data.data[0]);
            if (this.formModel.type === '') {
              this.formModel.type = '0';
              this.formModel.image = '/resources/admin/images/default/bean.png';
            }
            if (this.formModel.coupon.minimumPrice !== '' && this.formModel.coupon.minimumPrice !== '0') {
              this.isLimit = '1';
            } else {
              this.isLimit = '0';
            }
          }
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
        .delete(activityMgmt.prizeItem, { ids: ids })
        .then(data => {
          this.loading = false;
          this.$message.success('删除成功');
          this.getList();
          this.edit({ id: this.marketingItemId, lotteryWay: '2' });
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    confirm() {
      this.$refs.form.validate((valid, a) => {
        if (valid) {
          this.formModel.marketingItemId = this.marketingItemId;
          if (this.formModel.id) {
            this.update();
          } else {
            this.create();
          }
        }
      });
    },
    update() {
      http
        .put(activityMgmt.prizeItem, this.formModel)
        .then(data => {
          this.loading = false;
          this.$message.success('更新成功');
          this.getList();
          this.dialogVisible = false;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    create() {
      http
        .post(activityMgmt.prizeItem, this.formModel)
        .then(data => {
          this.loading = false;
          this.$message.success('创建成功');
          this.getList();
          this.dialogVisible = false;
        })
        .catch(errData => {
          this.loading = false;
          this.$message.warning(errData.errorMessage);
        });
    },
    add() {
      this.show = true;
      this.formModel = {
        id: '',
        name: '',
        coupon: {
          amount: '',
          endDate: '',
          minimumPrice: '0',
          isAmountUnfixed: '0'
        },
        image: '/resources/admin/images/default/bean.png',
        type: '0',
        count: '',
        quantity: '1'
      };
    },
    save() {
      this.$refs.formModel.validate((valid, a) => {
        if (valid) {
          this.formModel.marketingItemId = this.marketingItemId;
          http
            .post(activityMgmt.prizeItem, this.formModel)
            .then(data => {
              this.loading = false;
              this.$message.success('创建成功');
              this.edit({ id: this.formModel.marketingItemId, lotteryWay: '2' });
              this.getList();
            })
            .catch(errData => {
              this.loading = false;
              this.$message.warning(errData.errorMessage);
            });
        }
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
.sign-dialog {
  .reward-value {
    display: flex;
    align-items: center;
    .type-no {
      margin: 18px 0 0 0;
    }
    .reward-dec {
      margin-left: 10px;
      .reward-input {
        margin-bottom: 10px;
      }
    }
  }
}
.activity-awards {
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
