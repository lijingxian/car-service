<template>
  <biz-grid class="member-rights">
    <el-radio-group v-model="isRights" size="mini" @change="rightsChange">
      <el-radio-button label="权益"></el-radio-button>
      <el-radio-button label="卡"></el-radio-button>
      <el-radio-button label="券"></el-radio-button>
    </el-radio-group>
    <div v-if="isRights==='权益'" style="margin-left:5px">
      <el-select size="mini" v-model="rights" @change="rightsCatgChange">
        <el-option v-for="item in memberCards" :key="item.id" :label="item.template.name" :value="item.id"></el-option>
      </el-select>
      <div>
        <div class="rights-flex">
          <div v-for="(rightsInfo,index) of showRightsInfos" :key="index">
            <div class="display" v-for="(rights,index) of rightsInfo.rights" :key="index">
              <div class="logo" style="display:flex;align-items:center;padding:5px;width:215px;float:left">
                <div class="image">
                  <img v-if="rights.logo" :src="rights.logo" style="width:50px;height:50px"/>
                  <img v-else :src="defaultImg" style="width:50px;height:50px"/>
                </div>
                <span style="color: #1a1a1a;font-size:12px;margin-left:10px;">{{rights.name}}</span>
              </div>
            </div>
            <div v-show="rightsInfo.rights.length===0" :style="styleObject"></div>
          </div>
        </div>
      </div>
      <div v-show="showRightsInfos.length===0" :style="styleObject"></div>
    </div>
    <div v-if="isRights==='卡'" style="margin-left:5px">
      <el-select size="mini" v-model="shopId" @change="shopChange">
        <el-option v-for="item in storeId" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <div style="align-items:center;display:flex" v-for="(card,index) of memberCards" :key="index">
        <div class="rights-card">
          <div class="center-content" style="padding:10px">
            <div style="display:flex;align-items:center">
              <img v-if="card.memberRank&&card.memberRank.image" :src="card.memberRank.image" />
              <img v-else :src="defaultImg" />
              <div style="color:#ffffff;padding:5px">
                <div class="count" style="font-size:14px;padding-bottom:5px">{{card.shop.name}}</div>
                <div class="count1" style="font-size:12px">{{card.memberRank.template.name + '|' + card.memberRank.name}}</div>
              </div>
            </div>
            <div class="content" style="color:#ffffff;padding-top:8px">
              <div class="count1" style="font-size:14px">{{card.sn}}</div>
            </div>
          </div>
          <div class="contenttext" style="font-size:12px;padding:20px;display:flex;text-align:center">
            <div style="width:33%">
              <div>余额</div>
              <div style="color:#FF7300">￥{{card.balance}}</div>
            </div>
            <div style="width:33%">
              <div>积分</div>
              <div style="color:#FF7300">{{card.point}}</div>
            </div>
            <div style="width:33%">
              <div>V豆</div>
              <div style="color:#FF7300">{{card.bean}}</div>
            </div>
          </div>
        </div>
        <div class="btn" style="width:80px;margin-left:10px">
          <el-button type="text" size="mini" @click.stop="adjustment('payment',card)">充值</el-button>
          <el-button type="text" size="mini" @click.stop="adjustment('charge',card)">消费</el-button>
        </div>
      </div>
      <div v-show="memberCards.length===0" :style="styleObject"></div>
    </div>
    <div v-if="isRights==='券'" style="margin-left:5px">
      <el-select size="mini" v-model="radio" @change="getListChange">
        <el-option label="可使用" value="1"></el-option>
        <el-option label="已使用" value="2"></el-option>
        <el-option label="已过期" value="3"></el-option>
      </el-select>
      <div>
        <div class="card-flex" v-loading="rightLoading">
          <el-card class="box-card" v-for="(rightsData,index) of showRightsDatas" :key="rightsData.couponCodeId">
            <div class="display">
              <div class="name" :title="rightsData.name">{{rightsData.name}}</div>
              <el-button type="text" size="mini" v-show="radio==='1'" v-if="isEdit" @click="verificationDialog(rightsData)">核销
              </el-button>
            </div>
            <div class="display" v-show="radio==='1'" :ref="'button'+index">
              <div>有效期截至：{{rightsData.endDate||'长期有效'}}</div>
              <el-button type="text" size="mini" v-if="isEdit" @click="revoke(rightsData)">撤回</el-button>
            </div>
            <div class="display" v-show="radio==='2'">
              <div>使用日期：{{rightsData.usedDate}}</div>
              <el-button type="text" size="mini" @click="printDialog(rightsData)">凭证</el-button>
            </div>
            <div class="display" v-show="radio==='3'">
              <div>有效期截至：{{rightsData.endDate}}</div>
            </div>
          </el-card>
          <div v-show="rightsDatas.length===0" :style="styleObject"></div>
        </div>
      </div>
    </div>
    <el-dialog title="福利核销" :visible.sync="dialogVerification" width="500px" :append-to-body="true" center>
      <el-form ref="formSingle" size="small" :model="formVerification" label-width="55px">
        <div style="padding-bottom:10px">请您在与客户沟通一致前提下使用此功能，福利核销后，不能恢复。</div>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="formVerification.remarks" placeholder="备注字数限制100字" maxlength="100" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVerification = false" size="small">取 消</el-button>
          <el-button type="primary" @click="verification" size="small">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogPrint" :append-to-body="true" class="rights-dialog">
      <el-row :gutter="10">
        <div class="btn-c" align="right">
          <el-button type="primary" @click="print" size="mini">打印</el-button>
        </div>
      </el-row>
      <vue-easy-print tableShow ref="easyPrint">
        <div class="d-p-wrap">
          <el-row :gutter="10">
            <div class="p-title">{{currentUser.shop ? currentUser.shop.name + '核销单' : '核销单'}}</div>
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
              <div class="grid-content bg-purple">会员姓名：{{formPrint.member?formPrint.member.name:''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">会员电话：{{formPrint.member?formPrint.member.mobile:''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">核销时间：{{formPrint.usedDate}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                车牌号：{{formPrint.member?formPrint.member.defaultCarInfo?formPrint.member.defaultCarInfo.plateNumber:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                车型：{{formPrint.member?formPrint.member.defaultCarInfo?formPrint.member.defaultCarInfo.type:'':''}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                车辆识别代码：{{formPrint.member?formPrint.member.defaultCarInfo?formPrint.member.defaultCarInfo.vin:'':''}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row">
            <el-col :span="12">
              <div class="grid-content bg-purple">券名称：{{formPrint.name}}</div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">券码：{{formPrint.code}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-bottom">
            <el-col :span="24">
              <div class="grid-content bg-purple">备注：{{formPrint.remarks}}</div>
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
import http from '@/common/http';
import { couponMgmt, membershipMgmt } from '@/common/urls';
import defaultImg from '@/assets/images/icon_vip.png';
import NoContent from '@/assets/images/emptyGray.png';
import { mapGetters } from 'vuex';
import vueEasyPrint from 'vue-easy-print';

export default {
  name: 'MemberRights',
  props: {
    storeId: {
      type: Array
    },
    itemId: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    vueEasyPrint,
    BizGrid
  },
  data() {
    return {
      formPrint: {},
      dialogPrint: false,
      formVerification: {
        couponCodeId: '',
        remarks: ''
      },
      isRights: '权益',
      dialogVerification: false,
      showRightsInfos: [],
      shopId: '',
      rights: '',
      rightsCatg: [],
      shopOptions: [],
      rightsDatas: [],
      radio: '1',
      defaultImg: defaultImg,
      loading: false,
      rightLoading: false,
      activeTab: ['member-card', 'rights'],
      memberCards: [],
      cardRank: [],
      pagination: {
        pageSize: 3,
        currentPage: 1,
        pageSizes: [3],
        total: 0
      },
      styleObject: {
        height: '200px',
        background: 'url(' + NoContent + ') 50% 50% / 50% no-repeat'
      }
    };
  },
  created() {},
  computed: {
    ...mapGetters(['currentUser']),
    showRightsDatas() {
      return this.rightsDatas;
    }
  },
  watch: {
    itemId: {
      handler(itemId) {
        this.radio = '1';
        this.activeTab = ['member-card', 'rights'];
        this.shopOptions = [];
        this.storeId.forEach(item => {
          this.getShopList(item.id);
        });
        this.$nextTick(() => {
          this.shopId = (this.storeId.length > 0 ? this.storeId[0].id : '') || this.currentUser.shop.id;
          this.getMemberCards();
          this.getRights();
        });
      }
    }
  },
  mounted() {
    this.storeId.forEach(item => {
      this.getShopList(item.id);
    });
    this.$nextTick(() => {
      this.shopId = (this.storeId.length > 0 ? this.storeId[0].id : '') || this.currentUser.shop.id;
      this.getMemberCards();
      this.getRights();
    });
  },
  methods: {
    rightsChange() {},
    printDialog(row) {
      this.dialogPrint = true;
      let params = {
        couponCodeId: row.couponCodeId
      };
      http
        .get(couponMgmt.print, params)
        .then(data => {
          this.formPrint = data.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    print() {
      this.$refs.easyPrint.print();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getMemberCards();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getMemberCards();
    },
    adjustment(val, row) {
      console.log(row + 'aaa');
      this.$emit('adjustment', val, row);
    },
    getMemberCards() {
      this.rights = '';
      this.cardRank = [];
      console.log('getMemberCards');
      let params = {
        userId: this.itemId.userId,
        shopId: this.shopId,
        sourceType: '5',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      http
        .get(membershipMgmt.memberCardList, params)
        .then(data => {
          this.memberCards = data.memberCards;
          data.memberCards.forEach(item => {
            this.cardRank.push(item.rank);
          });
          this.rights = this.memberCards.length > 0 ? this.memberCards[0].id : '';
          this.getRightsInfos(this.rights);
        })
        .catch(errData => {});
    },
    getListChange() {
      this.getRights();
    },
    rightsCatgChange() {
      this.getRightsInfos();
    },
    getRightsInfos(id) {
      let params = {
        memberCardId: this.rights || id || ''
      };
      http
        .get('/admin/rights/userCardRights.jhtml', params)
        .then(data => {
          this.showRightsInfos = [];
          data.content.forEach(item => {
            this.cardRank.forEach(list => {
              if (item.name === list) {
                this.showRightsInfos.push(item);
              }
            });
          });
        })
        .catch(errData => {})
        .finally(() => {
          this.rightLoading = false;
        });
    },
    getRights() {
      this.rightLoading = true;
      let params = {
        state: this.radio,
        userId: this.itemId.userId,
        shopId: this.shopId,
        sourceType: '5',
        pageNumber: 1,
        pageSize: 999
      };
      http
        .get(membershipMgmt.rightsList, params)
        .then(data => {
          this.rightsDatas = data.coupons;
        })
        .catch(errData => {})
        .finally(() => {
          this.rightLoading = false;
        });
    },
    getShopList(id) {
      console.log(123);
      http
        .get(membershipMgmt.mainPage.shopList, {
          shopId: id || window.top.SHOP_ID,
          sourceType: '5'
        })
        .then(data => {
          data.shops.map(item => {
            if (JSON.stringify(this.shopOptions).indexOf(JSON.stringify(item)) === -1) {
              this.shopOptions.push(item);
            }
          });
        })
        .catch(errData => {});
    },
    shopChange() {
      this.getMemberCards();
      this.getRights();
    },
    verificationDialog(row) {
      this.dialogVerification = true;
      this.formVerification.couponCodeId = row.couponCodeId;
      this.remarks = '';
    },
    verification() {
      let params = {
        couponCodeId: this.formVerification.couponCodeId,
        memberId: this.itemId.userId,
        remarks: this.formVerification.remarks
      };
      http
        .post(couponMgmt.verification, params)
        .then(data => {
          this.$message.success('核销成功');
          this.getRights();
          this.dialogVerification = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        })
        .finally(() => {});
    },
    revoke(row) {
      console.log(this.$refs['button' + 1]);
      this.$confirm('是否确认撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          memberId: this.itemId.userId,
          couponCodeId: row.couponCodeId
        };
        http
          .post(couponMgmt.revoke, params)
          .then(data => {
            this.$message.success('撤回成功');
            this.getRights();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let newTime = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
      return newTime;
    }
  }
};
</script>

<style lang="scss">
.member-rights {
  padding: 20px;
  .select-wrap {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .s-label {
      color: #989898;
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .table-wrap {
    height: 350px;
    width: 100%;
    ._member {
      display: flex;
      .head {
        width: 40px;
        height: 40px;
        margin-right: 5px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .el-radio-group {
    margin: 5px;
    .el-radio-button__inner {
      width: 150px;
    }
  }
  .rights-card {
    width: 320px;
    float: left;
    margin-top:10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    img {
      display: block;
      height: 48px;
      width: 48px;
      border-radius: 50%;
      text-align: center;
      background: #fff;
    }
    .center-content {
      background: #FF7300;
      height: 100px;
    }
  }
  .card-flex {
    width: 480px;
    display: table-cell;
    overflow-y: auto;
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
  }
  .view-all {
    margin-top: 20px;
    float: left;
    width: 100%;
    text-align: center;
    cursor: pointer;
  }
}
.d-p-wrap {
  text-align: left;
  .p-title {
    text-align: center;
    font-size: 20px;
  }
  .row {
    padding: 0px 0px 10px 0px;
  }
  .rowNone {
    padding: 0px 0px 10px 0px;
  }
  .row-top {
    padding: 10px 0px 10px 0px;
    border-top: 1px solid #666;
  }
  .grid18 {
    height: 20px;
  }
  .row-bottom {
    padding: 0px 0px 10px 0px;
    border-bottom: 1px solid #666;
  }
  .table-class {
    padding: 10px 0px 0px;
  }
  .el-table__body-wrapper {
    .el-table__row {
      .cell {
        > div {
          text-align: left;
        }
      }
    }
  }
}
</style>
