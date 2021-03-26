<template>
  <biz-grid class="member-rights-info" v-loading="loading">
    <div style="margin-left:5px">
      <el-button type="primary" @click="verification()" v-if="isEdit" size="small">核销</el-button>
    </div>
    <!-- <div v-for="right in rightsDatas" :key="right.value" class="rollspan">
      <div class="title">
        <div><img :src="right.logo||defaultImage" class="image"></div>
        <div class="name">{{right.name}}</div>
        <div class="quantity">{{right.quantity?right.quantity+'张':'0张'}}</div>
        <div class="handler1" @click="detail(right.id,'')">详情</div>
      </div>
      <div class="date">{{right.beginDate}}至{{right.endDate||'长期有效'}}</div>
    </div> -->
    <el-radio-group v-model="radio" size="mini" @change="getListChange">
      <el-radio-button label="可使用"></el-radio-button>
      <el-radio-button label="已使用"></el-radio-button>
      <el-radio-button label="已过期"></el-radio-button>
    </el-radio-group>
    <div class="card-flex">
      <el-card class="box-card" v-for="(rightsData,index) in rightsDatas" :key="index" v-if="radio==='可使用'">
        <div class="display">
          <div class="name" :title="rightsData.name">{{rightsData.name}}</div>
          <el-button type="text" size="mini" v-if="isEdit" @click="deleteLine(rightsData.code)">核销</el-button>
        </div>
        <div class="display">
          <div>有效期截至：{{rightsData.endDate}}</div>
          <el-button type="text" size="mini" v-if="isEdit" @click="revoke(rightsData)">撤回</el-button>
        </div>
      </el-card>
      <el-card class="box-card" v-for="(rightsData,index) in rightsDatas" :key="index" v-if="radio==='已使用'">
        <div class="display">
          <div class="name" :title="rightsData.name">{{rightsData.name}}</div>
        </div>
        <div class="display">
          <div>使用日期：{{rightsData.usedDate}}</div>
          <el-button type="text" size="mini" @click="certificate(rightsData.id)">凭证</el-button>
        </div>
      </el-card>
      <el-card class="box-card" v-for="(rightsData,index) in rightsDatas" :key="index" v-if="radio==='已过期'">
        <div class="display">
          <div class="name" :title="rightsData.name">{{rightsData.name}}</div>
        </div>
        <div class="display">
          <div>有效期截至：{{rightsData.endDate}}</div>
        </div>
      </el-card>
      <div v-if="rightsDatas.length===0&&radio==='已过期'" :style="styleObject"></div>
      <div v-if="rightsDatas.length===0&&radio==='已使用'" :style="styleObject"></div>
      <div v-if="rightsDatas.length===0&&radio==='可使用'" :style="styleObject"></div>
    </div>
    <div class="biz-pagination" v-if="rightsDatas.length>0">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog title="核销" :visible.sync="dialogVisible" width="30%" :append-to-body="true" center>
      <el-form ref="formModel" size="small" :model="formModel" label-width="120px" :rules="rules" :inline-message="true">
        <el-form-item label="权益券码：" prop="code">
          <el-input v-model="formModel.code" placeholder="请输入要核销的权益券码" size="small" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="formModel.remarks" placeholder="备注字数限制100字" maxlength="100" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handler" size="small">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="福利核销" :visible.sync="dialogShow" width="500px" :append-to-body="true" center>
      <el-form ref="formSingle" size="small" :model="formSingle" label-width="55px" :inline-message="true">
        <div style="padding-bottom:10px">
          请您在与客户沟通一致前提下使用此功能，福利核销后，不能恢复。
        </div>
        <div style="padding-bottom:10px" v-if="cars&&cars.length>0">
          <el-radio-group v-model="formSingle.plateNumber">
            <el-radio v-for="(car,index) in cars" :key="index" :label="car.plateNumber" style="width:95px;padding:5px">{{car.plateNumber}}</el-radio>
          </el-radio-group>
        </div>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="formSingle.remarks" placeholder="备注字数限制100字" maxlength="100" size="small" />
        </el-form-item>
        <el-form-item>
          <div style="float:right">
            <el-button @click="dialogShow = false" size="small">取 消</el-button>
            <el-button type="primary" @click="confirm" size="small">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" :append-to-body="true" class="rights-dialog">
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="grid18"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple" align="right">
            <el-button type="primary" @click="print" size="mini">打印</el-button>
          </div>
        </el-col>
      </el-row>
      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10">
            <div class="p-title">
              {{title}}
            </div>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple" align="right">打印日期：{{formatDate(new Date().getTime())}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-top">
            <el-col :span="12">
              <div class="grid-content bg-purple">会员姓名：{{form.member?form.member.name:''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">会员电话：{{form.member?form.member.mobile:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">核销时间：{{form.usedDate}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">车牌号：{{form.member?form.member.defaultCarInfo?form.member.defaultCarInfo.plateNumber:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">车型：{{form.member?form.member.defaultCarInfo?form.member.defaultCarInfo.type:'':''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">车辆识别代码：{{form.member?form.member.defaultCarInfo?form.member.defaultCarInfo.vin:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">券名称：{{form.name}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">券码：{{form.code}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-bottom">
            <el-col :span="24">
              <div class="grid-content bg-purple">备注：{{form.remarks}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="18">
              <div class="grid18"></div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">客户签字：</div>
            </el-col>
          </el-row>
        </div>
      </vue-easy-print>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import { mapGetters } from 'vuex';
import NoContent from '@/assets/images/emptyGray.png';
import http from '@/common/http';
import { memberCardMgmt } from '@/common/urls';
import vueEasyPrint from 'vue-easy-print';
import { BizPagination } from '@/components/BizTable';
export default {
  name: 'MemberRightsInfo',
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    },
    userId: {
      type: Object,
      default() {
        return { id: '' };
      }
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
    vueEasyPrint,
    BizPagination
  },
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: '65px',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 50% no-repeat'
      };
    }
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      dialogVisible: false,
      dialogTableVisible: false,
      dialogShow: false,
      radio: '可使用',
      title: '',
      rules: {
        code: [{ required: true, trigger: 'blur', message: '请输入权益券码' }]
      },
      // 用户信息
      formModel: {
        code: '',
        remarks: ''
      },
      formSingle: {
        code: '',
        remarks: '',
        plateNumber: ''
      },
      form: {},
      cars: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      },
      rightsId: '',
      selections: [],
      rightsDatas: {
        expires: [],
        uses: [],
        unuses: []
      },
      tableData: [],
      state: ''
    };
  },
  created() {
    if (this.itemId.id) this.getList();
  },
  watch: {
    itemId(nVal, oVal) {
      if (nVal.id) {
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    ...mapGetters(['getUser']),
    // 显示消息提示
    showNotify(msg, type) {
      this.$notify({
        showClose: true,
        message: msg,
        type: type
      });
    },
    print() {
      this.$refs.easyPrint.print();
    },
    certificate(id) {
      let params = {
        id: id
      };
      http
        .get(memberCardMgmt.vipRights.voucher, params)
        .then(data => {
          this.dialogTableVisible = true;
          this.title = this.getUser().shop ? this.getUser().shop.name + '核销单' : '核销单';
          this.form = data.data;
        })
        .catch(ErrorData => {
          this.loading = false;
          console.log('ERR_REFRESH: ', ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // 月份是从0开始的
      let day = date.getDate();
      // let hour = date.getHours();
      // let min = date.getMinutes();
      // let sec = date.getSeconds();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

      return newTime;
    },
    getListChange() {
      this.pagination.currentPage = 1;
      this.getList();
    },
    queryCarList() {
      let param = {
        shopId: window.top.SHOP_ID || '',
        userId: this.userId.id,
        pageSize: 1000,
        pageNumber: 1
      };
      http
        .get('/admin/car/json/list.jhtml', param)
        .then(data => {
          this.cars = data.ownCars;
          data.ownCars.forEach(element => {
            if (element.defaultCar === '1') {
              this.formSingle.plateNumber = element.plateNumber;
            }
          });
        })
        .catch(errData => {
          if (errData.errorMessage !== '店铺不存在') this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getList() {
      this.loading = true;
      this.showForm = false;
      service.queryUserCoupons(
        {
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          memberCardId: this.itemId.id || '',
          couponState: this.radio === '可使用' ? 'unuse' : this.radio === '已使用' ? 'used' : 'expire'
        },
        data => {
          this.rightsDatas = data.dataList;
          this.pagination.total = Number(data.total);
          this.loading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    handleOperate(name) {
      this[name]();
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    deleteLine(code) {
      this.formSingle.code = code;
      this.formSingle.remarks = '';
      this.formSingle.plateNumber = '';
      this.cars = [];
      this.queryCarList();
      this.dialogShow = true;
    },
    confirm() {
      service.verification(
        {
          memberCardId: this.itemId.id || '',
          code: this.formSingle.code || '',
          remarks: this.formSingle.remarks || '',
          plateNumber: this.formSingle.plateNumber || ''
        },
        data => {
          this.$message.success('核销成功');
          this.getList();
          this.dialogShow = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    verification() {
      this.formModel = {};
      this.dialogVisible = true;
    },
    revoke(row) {
      this.$confirm('是否确认撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http
          .post(memberCardMgmt.vipRights.revoke, { memberCardId: this.itemId.id, id: row.id })
          .then(data => {
            this.$message.success('操作成功');
            this.getList();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    handler() {
      this.$refs.formModel.validate(valid => {
        if (valid) {
          service.verification(
            {
              memberCardId: this.itemId.id || '',
              code: this.formModel.code || '',
              remarks: this.formModel.remarks || ''
            },
            data => {
              this.$message.success('核销成功');
              this.getList();
              this.dialogVisible = false;
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            }
          );
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
.rights-dialog .el-dialog {
  width: 60%;
}
.member-rights-info {
  padding: 20px 0px 20px 20px;
  .name {
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-flex {
    height: 100%;
    display: table-cell;
  }
  .biz-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .el-radio-group {
    margin: 5px;
    .el-radio-button__inner {
      width: 150px;
    }
  }
  .box-card {
    font-size: 12px;
    margin: 5px;
    float: left;
    width: 215px;
    .display {
      display: flex;
      justify-content: space-between;
      line-height: 26px;
    }
  }
  .el-table-column--selection .cell {
    padding-left: 5px;
    padding-right: 5px;
  }

  .el-table .cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .rollspan {
    position: relative;
    margin: 10px 0px;
    font-size: 12px;
  }
  .image {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    margin-right: 20px;
    border-radius: 50%;
  }
  .date {
    position: absolute;
    top: 30px;
    left: 120px;
  }
  .date1 {
    position: absolute;
    top: 30px;
    left: 120px;
  }
  .handler {
    color: #ff7300;
    cursor: pointer;
  }
  .title {
    display: flex;
    justify-content: flex-start;
    div {
      margin: 0px 10px;
    }
    .name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 240px;
    }
    .quantity {
      position: absolute;
      right: 70px;
    }
    .handler1 {
      position: absolute;
      right: 0px;
      color: #ff7300;
      cursor: pointer;
    }
  }
}
</style>
