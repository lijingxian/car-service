<template>
  <biz-grid class="member-card-list">
    <div slot="top">
      <div class="member-mgmt-top">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange"
          :views="views" @onSwitch="onViewSwitch" v-if="isEdit" @cascader-change="handleCascaderChange">
        </biz-header>
        <biz-header :filters="filters" @filterDataChange="filterDataChange" :views="views" @onSwitch="onViewSwitch" @cascader-change="handleCascaderChange"
          v-if="!isEdit">
        </biz-header>
      </div>
      <div class="toggle-btn" @click="isShow">
        {{ toggleRecommendTxt }}
        <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <member-mgmt-list-view v-if="this.activedView==='list'" :editShopIds="editShopIds" :cardList="cardList" :height="height"
        @created="refresh" @deleteLine="deleteLine" @adjustment="adjustment" @distributeRights="distributeRights" @active="active"
        @rowClick="rowClick" @handleSelectionChange="handleSelectionChange" :isEdit="isEdit" @memberClick="memberClick">
      </member-mgmt-list-view>
      <member-mgmt-card-view v-show="this.activedView==='card'" :editShopIds="editShopIds" :cardList="cardList"
        @rowClick="rowClick" @deleteLine="deleteLine" @created="refresh" :isEdit="isEdit">
      </member-mgmt-card-view>
    </div>
    <biz-pagination slot="bottom" :pagination="pagination" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"></biz-pagination>
    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
        <el-tab-pane label="基本信息" name="baseinfo">
          <base-info ref="baseInfo" :itemId="itemId" :templateId="templateId" @operationSuccess="operationSuccess" :isEdit="flag">
          </base-info>
        </el-tab-pane>
        <el-tab-pane label="V豆明细" name="beaninfo" v-if="itemId.id">
          <bean-info ref="beanInfo" :itemId="itemId" @operationSuccess="operationSuccess" :isEdit="flag">
          </bean-info>
        </el-tab-pane>
        <el-tab-pane label="积分明细" name="pointinfo" v-if="itemId.id">
          <point-info ref="pointInfo" :itemId="itemId" @operationSuccess="operationSuccess" :isEdit="flag">
          </point-info>
        </el-tab-pane>
        <el-tab-pane label="余额储值" name="storeinfo" v-if="itemId.id">
          <store-info ref="storeInfo" :itemId="itemId" :userId="memberId" @saveSuccess="saveSuccess" :isEdit="flag">
          </store-info>
        </el-tab-pane>
        <el-tab-pane label="福利" name="rightsinfo" v-if="itemId.id">
          <rights-info ref="rightsinfo" :itemId="itemId" :userId="memberId" @operationSuccess="operationSuccess" :isEdit="flag">
          </rights-info>
        </el-tab-pane>
        <el-tab-pane label="共享" name="shareinfo" v-if="itemId.id">
          <share-info ref="shareInfo" :itemId="itemId" @operationSuccess="operationSuccess" :isEdit="flag">
          </share-info>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="memberInfo" @close="memberInfo=false" v-model="memberName">
        <el-tab-pane label="基本信息" name="memberInfo">
          <membership-mgmt-base-info :itemId="memberId" ref="memberInfo"></membership-mgmt-base-info>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="carInfo">
          <membership-mgmt-vehicle-info :itemId="memberId" ref="carInfo"></membership-mgmt-vehicle-info>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <el-dialog title="发放福利" :visible.sync="dialogTableVisible" width="90%" append-to-body custom-class="rights-distribute">
      <el-form ref="form" label-width="120px" size="small" class="rightsForm">
        <el-form-item label="福利类型:">
          <div>
            <el-radio-group v-model="typeModel">
              <el-radio label="0">权益</el-radio>
              <el-radio label="1">券</el-radio>
            </el-radio-group>
            <div style="float:right;">
              <biz-filter v-if="typeModel==='1'" :filters="dialogFilters" @filterDataChange="dialogFilterDataChange"></biz-filter>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-for="right in rights" v-if="right.rights&&typeModel==='0'" :label="right.name+':'" :key="right.id" prop="rights">
          <div class="right-check-style">
            <el-checkbox v-for="item in right.rights" :label="item.name" :key="item.id" v-model="item.isSelected"
              :disabled="item.valid==='0'" true-label='1' false-label='0'>
              <img :src="item.logo||defaultImg" width="50px" height="50px" />
              <div class="right_name" :title="item.name">{{item.name}}</div>
              <div style="height:150px;overflow:auto;font-size:12px">
                <div style="float:left;line-height:58px">权益包含：</div>
                <div style="float:right">
                  <div class="span" v-for="(rightsCoupon,index) in item.rightsCouponList" :key="index">
                    <div class="rightsCoupon_name" :title="rightsCoupon.name">{{rightsCoupon.name}}{{rightsCoupon.quantity}}张</div>
                    <!-- <div class="rightsCoupon">
                      <el-input v-model="rightsCoupon.quantity" :disabled="item.valid==='0'" size="mini" class="rights-input">
                      </el-input>
                      <div>张</div>
                    </div> -->
                  </div>
                </div>
              </div>
            </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item  v-if="typeModel==='1'">
          <div class="right-coupon-style">
            <coupon-item v-for="item of couponList" :item="item" :key="item.id" @check-change="checkChange(item,arguments[0])"></coupon-item>
          </div>
        </el-form-item>
      </el-form>
      <div v-if="typeModel==='1'">
        <biz-pagination :pagination="dialogPagination" @handleSizeChange="handleDialogSizeChange"
          @handleCurrentChange="handleDialogCurrentChange"></biz-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" size="mini">发放</el-button>
      </span>
    </el-dialog>
    <export-file ref="exportFile" :stepkey="stepkey" :total="total" :count="count" :percentage="percentage" @clearTimeOut="clearTimeOut"></export-file>
  </biz-grid>
</template>

<script>
import CouponItem from './components/CouponItem';
import { BizHeader, BizPagination } from '@/components/BizTable';
import BizFilter from '@/components/BizTable/BizFilter';
import { ExportFile } from '@/components/BizUpload';
import { BizGrid } from '@/components/BizGrid';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './MemberBaseInfo';
import BeanInfo from './MemberBeanInfo';
import PointInfo from './MemberPointInfo';
import StoreInfo from './MemberStoreInfo';
import RightsInfo from './MemberRightsInfo';
import ShareInfo from './MemberShareInfo';
import MemberMgmtListView from './MemberMgmtListView';
import MemberMgmtCardView from './MemberMgmtCardView';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import MembershipMgmtBaseInfo from '../membership-mgmt/MembershipMgmt/MembershipMgmtBaseInfo';
import MembershipMgmtVehicleInfo from '../membership-mgmt/MembershipMgmt/MembershipMgmtVehicleInfo';
import { mapGetters } from 'vuex';
import defaultImg from '@/assets/images/icon_vip.png';
import axios from 'axios';
import { membershipMgmt as membership, global } from '@/common/urls';
import http from '@/common/http';
export default {
  name: 'MemebrCardList',
  data() {
    return {
      loading: false,
      memberInfo: false,
      isEdit: true,
      flag: true,
      showRecommend: false,
      total: 0,
      count: 0,
      typeModel: '0',
      t: '',
      percentage: 0,
      stepkey: '',
      editShopIds: [],
      rankList: [],
      tempalteList: [],
      itemId: { id: '' },
      memberId: { id: '' },
      templateId: '',
      memberCardId: '',
      height: '100%',
      type: '',
      defaultImg: defaultImg,
      isCreated: false,
      dialogTableVisible: false,
      popupTabName: 'baseinfo',
      memberName: 'memberInfo',
      openPopup: false,
      cardList: [],
      rights: [],
      couponList: [],
      selectCouponList: [],
      multipleSelection: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      views: [
        {
          actived: false,
          class: 'iconfont biz-icon-qiapianshitu',
          name: 'card',
          title: '卡片视图'
        },
        {
          actived: true,
          class: 'iconfont biz-icon-liebiaoshitu',
          name: 'list',
          title: '列表视图'
        }
      ],
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入功能名称',
          name: 'searchValue',
          value: ''
        }
      ],
      operations: [
        {
          label: '新增',
          name: 'create',
          type: 'primary',
          auth: ['admin:memberCard.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '删除',
          name: 'delete',
          type: '',
          disabled: true,
          auth: ['admin:memberCard.delete']
        },
        {
          label: '权益更新',
          name: 'updateRights',
          type: '',
          disabled: true,
          auth: ['admin:memberCard.rightsrenew']
        },
        {
          label: '导出',
          name: 'exportMemberCard',
          type: '',
          auth: ['admin:memberCard.export']
        }
      ],
      filters: [
        {
          type: 'select',
          label: '所属店铺',
          name: 'shopName',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'cascader',
          label: '制式/等级',
          name: 'memberTag',
          changeOnSelect: true,
          filterable: false,
          showAllLevels: true,
          value: [''],
          class: 'hidden',
          options: []
        },
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '停用', value: '0' },
            { label: '启用', value: '1' }
          ]
        },
        // {
        //   type: 'select',
        //   label: '数据来源',
        //   name: 'property',
        //   value: '',
        //   options: [
        //     { label: '全部', value: '' },
        //     { value: 'nickname', label: '昵称' },
        //     { value: 'mobile', label: '电话' },
        //     { value: 'sn', label: '卡号' },
        //     { value: 'bean', label: 'V豆' },
        //     { value: 'balance', label: '余额' },
        //     { value: 'point', label: '积分' }
        //   ]
        // },
        {
          type: 'input',
          label: '',
          placeholder: '请输入会员卡号/电话/姓名',
          select: [],
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  components: {
    BizGrid,
    BizHeader,
    BizPagination,
    MemberMgmtListView,
    MemberMgmtCardView,
    BizPopupTabs,
    BaseInfo,
    BeanInfo,
    PointInfo,
    StoreInfo,
    RightsInfo,
    MembershipMgmtBaseInfo,
    MembershipMgmtVehicleInfo,
    ExportFile,
    ShareInfo,
    BizFilter,
    CouponItem
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  created() {
    this.templateId = this.$route.params.templateId || '';
    this.listCardTemplate(this.templateId);
    this.getList();
    this.listAuthority();
    this.getEditableStores();
    this.$route.params.isEdit !== 'false' && this.queryKpi();
    this.queryShopList();
    // this.templateId && console.log(this.$refs.table);
  },
  mounted() {},
  computed: {
    ...mapGetters(['getUser']),
    activedView() {
      for (const view of this.views) {
        if (view.actived) {
          return view.name;
        }
      }
      return '';
    },
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  methods: {
    checkChange(item, value) {
      console.log(value);
      // this.rights.find(right => {
      //   return right.id === item.id;
      // }).checked = value;
      if (value) {
        this.selectCouponList.push(item);
      } else {
        this.selectCouponList.splice(this.selectCouponList.indexOf(item), 1);
      }
      console.log(this.selectCouponList);
    },
    dialogFilterDataChange(val) {
      this.dialogPagination.currentPage = 1;
      this.getCouponList();
    },
    getCouponList() {
      let params = {
        type: '13',
        shopId: window.top.SHOP_ID || '',
        pageNumber: this.dialogPagination.currentPage,
        pageSize: this.dialogPagination.pageSize,
        searchValue: this.dialogFilters[0].value
      };
      this.loading = true;
      http
        .get('/admin/couponManage/coupons.jhtml', params)
        .then(data => {
          this.couponList = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(data => {})
        .finally(() => {
          this.loading = false;
        });
    },
    operate(name) {
      this[name]();
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    isShow() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        // document.getElementsByClassName('biz-table-filter')[0].style.marginTop = '';
        // if (this.activedView === 'card') {
        //   document.getElementsByClassName('biz-table-filter')[0].style.marginBottom = '';
        // }
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        // document.getElementsByClassName('biz-table-filter')[0].style.marginTop = '30px';
        // if (this.activedView === 'card') {
        //   document.getElementsByClassName('biz-table-filter')[0].style.marginBottom = '0px';
        // }
      }
      this.showRecommend = !this.showRecommend;
    },
    operationSuccess(val) {
      this.getList();
      if (val) {
        this.openPopup = false;
      }
    },
    queryShopList() {
      http
        .get(membership.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '6'
        })
        .then(data => {
          let arr = data.shops;
          arr.map(item => {
            item.value = item.id;
            item.label = item.name;
          });
          arr.unshift({ value: '', label: '全部' });
          this.$set(this.filters[0], 'options', arr);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    saveSuccess(id) {
      this.getList();
      this.itemId.id = id;
      this.$refs.beanInfo.getList();
      this.$refs.pointInfo.getList();
      this.$refs.baseInfo.query();
      this.$refs.rightsinfo.getList();
    },
    memberClick(row) {
      this.$refs.memberInfo.operations = [];
      this.$refs.carInfo.operations = [];
      this.$refs.carInfo.ishandler = false;
      this.memberId = { id: row.member.id };
      this.memberInfo = true;
    },
    adjustment(val, row) {
      this.itemId.id = row.id;
      this.memberId = { id: row.member.id };
      if (val === 'beanAdd') {
        this.popupTabName = 'beaninfo';
        this.$nextTick(function() {
          this.$refs.beanInfo.add();
        });
      } else if (val === 'beanCon') {
        this.popupTabName = 'beaninfo';
        this.$nextTick(function() {
          this.$refs.beanInfo.consumption();
        });
      } else if (val === 'pointAdd') {
        this.popupTabName = 'pointinfo';
        this.$nextTick(function() {
          this.$refs.pointInfo.add();
        });
      } else if (val === 'pointCon') {
        this.popupTabName = 'pointinfo';
        this.$nextTick(function() {
          this.$refs.pointInfo.consumption();
        });
      } else if (val === 'payment') {
        this.popupTabName = 'storeinfo';
        this.$nextTick(function() {
          this.$refs.storeInfo.payment();
        });
      } else if (val === 'charge') {
        this.popupTabName = 'storeinfo';
        this.$nextTick(function() {
          this.$refs.storeInfo.chargebacks();
        });
      }
      this.openPopup = true;
    },
    getList() {
      this.loading = true;
      console.log(this.filters[1].value);
      let params = {
        // property: this.filters[3].value || '',
        searchShopId: this.filters[0].value,
        value: this.filters[3].value || '',
        state: this.filters[2].value || '',
        operator: this.filters[3].select[0] ? this.filters[3].select[0].value : 'like',
        shopId: window.top.SHOP_ID || '',
        templateId: this.filters[1].value[0] || this.templateId,
        rankId: this.filters[1].value[1] || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      service.getList(
        params,
        data => {
          this.loading = false;
          this.cardList = data.content;
          this.pagination.total = Number(data.total);
          // if (this.filters[1].value || this.templateId) this.listRank();
          if (!this.filters[1].value && !this.templateId) {
            this.filters[1].value = [''];
            this.filters[2].options = [];
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          console.log(ErrorData);
          if (ErrorData.errorMessage) {
            this.$message({
              message: ErrorData.errorMessage,
              type: 'warning',
              showClose: true
            });
          }
        }
      );
    },
    refresh() {
      this.getList();
      this.operations.map(item => {
        if (item.name === 'delete' || item.name === 'updateRights') {
          item.disabled = true;
        }
      });
    },
    queryKpi() {
      service.memberCardBox(
        {
          shopId: window.top.SHOP_ID || '',
          templateId: this.filters[1].value[0] || this.templateId
        },
        data => {
          this.$message({
            customClass: 'motorists-club-activity__kpi',
            showClose: true,
            message: `您当前共有会员卡${data.total}张，总余额${data.totalBalance}元，其中启用${data.enableTotal}张，总余额${data.enableTotalBalance}元`,
            duration: 3000
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    listAuthority() {
      service.listAuthority(
        {},
        data => {
          if (data.authorities.indexOf('admin:memberCard.edit') > 0) {
            this.isEdit = true;
          } else {
            this.isEdit = false;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '6'
        })
        .then(data => {
          this.editShopIds = [];
          data.dataList.map(item => {
            this.editShopIds.push(item.id);
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    delete() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let ids = [];
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          http
            .delete('/admin/memberCard/memberCard.jhtml', { ids: ids })
            .then(data => {
              this.$message.success('删除成功');
              this.refresh();
            })
            .catch(errData => {
              console.log(errData);
              console.log('code错误');
              if (errData.errorMessage !== '店铺不存在') {
                this.$message.warning(errData.errorMessage);
              }
            })
            .finally(() => {
              this.loading = false;
            });
        });
      } else {
        this.$message('请选择一条数据');
      }
    },
    deleteLine(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .delete('/admin/memberCard/memberCard.jhtml', { ids: [row.id] })
          .then(data => {
            this.$message.success('删除成功');
            this.refresh();
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage !== '店铺不存在') {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    active(row) {
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.updateVipCardState(
          {
            state: row.state,
            ids: [row.id],
            shopId: window.top.SHOP_ID || ''
          },
          data => {
            this.$message.success('操作成功');
            this.refresh();
            this.$refs.baseInfo.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMsg);
          }
        );
      });
    },
    updateRights() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let ids = [];
        this.multipleSelection.forEach(element => {
          ids.push(element.id);
        });
        this.$confirm('确定执行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          service.distributeRights(
            {
              ids: ids
            },
            data => {
              this.$message.success('操作成功');
              this.refresh();
            },
            // result_code 不是100的处理
            ErrorData => {
              this.$message.warning(ErrorData.errorMsg);
            }
          );
        });
      } else {
        this.$message('请选择一条数据');
      }
    },
    distributeRights(row) {
      this.typeModel = '0';
      this.getCouponList();
      this.memberCardId = row.id;
      service.listDistributeRights(
        {
          shopId: window.top.SHOP_ID || '',
          memberCardId: row.id
        },
        data => {
          this.rights = data.content;
          this.dialogTableVisible = true;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    confirm() {
      let selectRights = [];
      if (this.typeModel === '0') {
        this.selectCouponList = [];
        this.rights.map(item => {
          if (item.rights) {
            item.rights.map(right => {
              if (right.isSelected === '1') {
                selectRights.push(right);
              }
            });
          }
        });
        if (selectRights.length === 0) {
          this.$message.warning('请选择权益');
          return false;
        }
      } else {
        selectRights = [];
        if (this.selectCouponList.length === 0) {
          this.$message.warning('请选择券');
          return false;
        }
      }
      service.distributeAssignedRights(
        {
          shopId: window.top.SHOP_ID || '',
          rights: selectRights,
          rightsCouponList: this.selectCouponList,
          memberCardIds: [this.memberCardId]
        },
        data => {
          this.$message.success('发放成功');
          this.dialogTableVisible = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    async exportMemberCard() {
      // this.loading = true;
      let idsStr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        idsStr.push(this.multipleSelection[i].id);
      }
      let params = {
        // property: this.filters[3].value || '',
        searchShopId: this.filters[0].value,
        state: this.filters[3].value || '',
        filter: {
          operator: 'like',
          value: this.filters[3].value || ''
        },
        shopId: window.top.SHOP_ID || '',
        templateId: this.filters[1].value[0] || this.templateId,
        rankId: this.filters[1].value[1] || '',
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        ids: idsStr
      };
      try {
        this.getProcess();
        this.$refs.exportFile.uploadingVisible = true;
        let response = await axios.post('/admin/memberCard/memberCard/export.jhtml', params, { responseType: 'blob' });
        console.log('response => ', response);
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
        let elink = document.createElement('a');
        elink.download = fileName.match(/"(\S*)"/)[1];
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.loading = false;
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    getProcess() {
      let url = '/admin/memberCard/exportProgress.jhtml';
      http
        .get(url, {})
        .then(data => {
          if (!data.data.total) {
            this.total = 0;
            this.count = 0;
            this.stepkey = '';
            this.percentage = 0;
          }
          if (data.data.total) {
            this.total = Number(data.data.total || 0);
            this.count = Number(data.data.count || 0);
            this.stepkey = data.data.remark;
            this.percentage = Number(data.data.rate);
            this.$refs.exportFile.title = data.data.title;
          }
          if (data.data && data.data.rate && data.data.rate === '100') {
            this.clearTimeOut();
            this.$refs.exportFile.showCurrentInfo = false;
            this.$refs.exportFile.title = '导出完成';
          } else if ((data.data && data.data.rate && data.data.rate !== '100') || !data.data.rate) {
            if (this.t) {
              this.clearTimeOut();
            }
            this.t = setTimeout(this.getProcess, 2000);
            this.$refs.exportFile.showCurrentInfo = true;
          }
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    create() {
      this.flag = true;
      this.itemId = { id: '' };
      this.popupTabName = 'baseinfo';
      this.openPopup = true;
    },
    listCardTemplate(templateId) {
      service.listCardTemplate(
        { templateId: templateId, shopId: this.filters[0].value || window.top.SHOP_ID || '' },
        data => {
          this.filters[1].options = data.content.map(item => {
            return {
              value: item.templateId,
              label: item.templateName,
              children: item.userRankDatas.map(element => {
                return {
                  value: element.userRankId,
                  label: element.userRankName
                };
              })
            };
          });
          console.log(this.filters[1].options);
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    onViewSwitch(name) {
      this.multipleSelection = [];
      for (const view of this.views) {
        view.actived = false;
        if (view.name === name) {
          view.actived = true;
          if (view.name !== 'list') {
            this.operations.map(item => {
              if (item.name === 'delete' || item.name === 'updateRights') {
                item.disabled = true;
              }
            });
          }
        }
      }
    },
    resize() {
      // this.$nextTick(() => {
      //   let height =
      //     document.documentElement.clientHeight || window.innerHeight;
      //   this.height = String(height - 180);
      // });
    },
    handleCascaderChange(value) {
      this.filters[1].value = value;
      this.getList();
    },
    filterDataChange() {
      // if (this.filters[3].value === 'bean') {
      //   this.filters[4].placeholder = '请输入V豆限定值';
      // } else if (this.filters[3].value === 'balance') {
      //   this.filters[4].placeholder = '请输入余额限定值';
      // } else if (this.filters[3].value === 'point') {
      //   this.filters[4].placeholder = '请输入积分限定值';
      // } else {
      //   this.filters[4].placeholder = '请输入关键字';
      // }
      // if (this.filters[3].value === 'bean' || this.filters[3].value === 'balance' || this.filters[3].value === 'point') {
      //   this.filters[4].select = [
      //     {
      //       value: this.filters[4].select[0] ? this.filters[4].select[0].value : '',
      //       options: [{ label: '>=', value: 'ge' }, { label: '<=', value: 'le' }]
      //     }
      //   ];
      // } else if (this.filters[3].value !== 'bean' && this.filters[3].value !== 'balance') {
      //   this.filters[4].select.splice(0, 1);
      // }
      this.pagination.currentPage = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getList();
    },
    handleDialogSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.getCouponList();
    },
    handleDialogCurrentChange(val) {
      this.dialogPagination.currentPage = val;
      this.getCouponList();
    },
    rowClick(val) {
      this.flag = true;
      this.popupTabName = 'baseinfo';
      if ((this.getUser.roleLevel === 'shop' && val.unionConfig.editable === '0') || !this.isEdit) {
        this.flag = false;
      }
      this.itemId = { id: String(val.id) };
      this.memberId = { id: val.member.id };
      this.openPopup = true;
    },
    handleSelectionChange(val) {
      console.log(val);
      if (val.length > 0 || this.getUser.roleLevel !== 'shop') {
        this.operations.map(item => {
          if (item.name === 'delete' || item.name === 'updateRights') {
            item.disabled = false;
          }
        });
      } else {
        this.operations.map(item => {
          if (item.name === 'delete' || item.name === 'updateRights') {
            item.disabled = true;
          }
        });
      }
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss">
.rights-distribute {
  .el-checkbox__label {
    border: 1px solid #f5f5f5;
    margin-left: 10px
  }
  .right-coupon-style {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0;
  }
}
.rightsForm {
  .el-form-item__content {
    text-align: left;
  }
  .right-check-style{
    .el-checkbox__input {
      top: -150px;
    }
  }
  .el-checkbox {
    .right_name {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
    img {
      position: relative;
      top: 20px;
      margin-right: 10px;
      z-index: 1;
    }
    .span {
      display: table;
      margin-top: 20px;
      .rightsCoupon_name {
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #666666;
      }
      .rightsCoupon {
        display: flex;
        line-height: 32px;
        .rights-input {
          width: 120px;
          margin-right: 10px;
        }
      }
    }
    // .el-input-group__append {
    //   width: 50px;
    // }
    .el-input__inner {
      min-width: 50px;
    }
    // .el-input-group__prepend {
    //   width: 300px;
    // }
  }
}
.member-card-list {
  .content {
    height: 100%;
  }
  .motorists-club-activity__kpi {
    top: 45px;
  }
  .biz-input {
    width: 290px;
  }
  .m-pagination {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .limit-pagination {
      margin-right: 10px;
      display: flex;
      justify-content: center;
    }
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 125px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 80px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
    }
  }
  .biz-header .biz-header__filter-wrapper .biz-header__switch {
    margin-top: -25px;
  }
  .biz-header__filter-wrapper {
    width: 100%;
    .biz-table-filter {
      width: 100%;
    }
  }
  .biz-table-filter .filter-wrap {
    margin-top: 5px;
    .el-select {
      width: 100%;
    }
  }
  .biz-header .biz-header__filter-wrapper {
    float: left;
  }
}
</style>
