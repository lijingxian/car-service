<template>
  <div class="reception-mgmt">
    <div class="toggle-btn" @click="isShowFilter">
      {{ toggleRecommendTxt }}
      <div class="iconfont biz-icon-i-web-zd1" :class="{ 'rotate-180': showRecommend }"></div>
    </div>
    <biz-flex-table
      :checkable="false"
      :operations="operations"
      @operate="operate"
      :filters="filters"
      :loading="loading"
      @filter-data-change="filterDataChange"
      :tableData="tableData"
      :pagination="pagination"
      @row-click="rowClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 表格内容 -->
      <!-- <el-table-column v-for="(col,index) of columns" :key="col.id" :label="col.name" :min-width="getWidth(col)">
        <template slot-scope="scope">
          <div v-if="col.id === '1'">{{scope.row.plateNumber}}</div>
          <div v-else-if="col.id === '2'" class="customer-info">
            <img v-if="scope.row.member&&scope.row.member.photo" :src="scope.row.member.photo" />
            <img v-if="scope.row.member&&!scope.row.member.photo" src="../../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title">{{scope.row.member?scope.row.member.name:'-'}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member&&scope.row.member.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member&&scope.row.member.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member&&scope.row.member.gender === '2'"></i>
                <span>{{scope.row.member?scope.row.member.mobile:'-'}}</span>
              </div>
            </div>
          </div>
          <div v-else-if="col.id === '3'"><div>{{scope.row.accessTime||'-'}}</div><div><img :src="scope.row.accessImage" width="120"></div></div>
          <div v-else-if="col.id === '4'">{{scope.row.leaveTime||'-'}}<div><img :src="scope.row.leaveImage" width="120"></div></div>
          <div v-else-if="col.id === '5'">{{scope.row.isReception === true ? '已接待' : '未接待' }}</div>
          <div v-else-if="col.id === '6'">{{scope.row.adminName||'-'}}</div>
          <div v-else-if="col.id === '7'">
            <div>{{ scope.row.releaseAdmin&&scope.row.releaseAdmin.name?scope.row.releaseAdmin.name:'-' }}</div>
            <div>{{ scope.row.shop&&scope.row.shop.name?scope.row.shop.name:'-' }}</div>
          </div>
          <div v-else-if="col.id === '8'">{{scope.row.shop.name||'-'}}</div>
          <div v-else-if="col.id === '9'">{{formatAppoint(scope.row)||'-'}}</div>
          <div v-else-if="col.id === '10'">{{scope.row.orderSn||'-'}}</div>
        </template>
        <template #header>
          <div class="custom-header">
            <div>{{col.name}}</div>
            <i v-show="index===(columns.length - 1)" @click="onCustomColumns" class="el-icon-setting"></i>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="name" label="车辆" min-width="50">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.plateNumber}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="会员信息" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="customer-info">
              <img v-if="scope.row.member&&scope.row.member.head" :src="scope.row.member.head" />
              <img v-if="scope.row.member&&!scope.row.member.head" src="../../../../assets/images/default_user.png" />
              <div class="wrapper">
                <div class="title">{{scope.row.member?scope.row.member.name:'-'}}</div>
                <div class="gender">
                  <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.member&&scope.row.member.gender === '0'"></i>
                  <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.member&&scope.row.member.gender === '1'"></i>
                  <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.member&&scope.row.member.gender === '2'"></i>
                  <span>{{scope.row.member?scope.row.member.mobile:'-'}}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="是否预约" min-width="50">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{formatAppoint(scope.row)||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="到店信息" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow" v-if="scope.row.accessImage">
              <img :src="scope.row.accessImage||'--'" width="120">
            </div>
            <div class="overflow">
              {{scope.row.accessTime||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="离店信息" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow" v-if="scope.row.leaveImage">
              <img :src="scope.row.leaveImage||'--'" width="120">
            </div>
            <div class="overflow">
              {{scope.row.leaveTime||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="接待信息" min-width="60">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.isReception === true ? '已接待' : '未接待' }}
            </div>
            <div class="overflow">
              {{scope.row.adminName||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="消费信息" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.order?scope.row.order.sn:'--'}}
            </div>
            <div class="overflow">
              商品：{{scope.row.order?(scope.row.order.orderItems.length>0?scope.row.order.orderItems[0].fullName:'--'):'--'}}
            </div>
            <div class="overflow">
              金额：{{scope.row.order?scope.row.order.amount:'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="所属店铺" min-width="80">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.shop.name||'--'}}
            </div>
          </div>
        </template>
      </el-table-column>
    </biz-flex-table>
    <!-- 侧边弹出栏 -->
    <biz-popup-tabs :open="open" @close="close" v-model="tabName">
      <el-tab-pane label="基本信息" name="first" v-if="!showTemplate&&isShowReception">
        <base-info :itemId="currentRowId" :isEdit="isEdit" @update="update" ref="baseInfo" @show-image="showImg"></base-info>
      </el-tab-pane>
      <el-tab-pane label="离店信息" name="other" v-if="!showTemplate&&isShowLeave&&isShow">
        <leave-info :itemId="currentRowId" :isEdit="isEdit" @update="update"></leave-info>
      </el-tab-pane>
      <el-tab-pane label="消息模板设置" name="setting" v-if="showTemplate">
        <template-settings ref="recharge" :isEdit="isEdit" :itemId="currentRowId" @update="update"></template-settings>
      </el-tab-pane>
      <el-tab-pane label="道闸设置" name="second" v-if="showTemplate">
        <banisters-setting :itemId="currentRowId" :isEdit="isEdit" @update="update"></banisters-setting>
      </el-tab-pane>
      <el-tab-pane label="车辆设置" name="three" v-if="showTemplate">
        <car-setting :itemId="currentRowId" :isEdit="isEdit" @update="update"></car-setting>
      </el-tab-pane>
      <el-tab-pane label="接待提醒" name="dispath" v-if="showTemplate">
        <rank-item ref="rank"></rank-item>
      </el-tab-pane>
    </biz-popup-tabs>
    <!-- 道闸弹出框 -->
    <el-dialog title="道闸控制" :visible.sync="dialogVisible" :width="250*(lprList.length)+'px'">
      <div class="lpr-area">
        <div
          class="lpr-btn"
          :style="lprBtnStyle"
          v-for="item in lprList"
          :key="item.index"
          @click="lprClick(item.parent,item.parent.unionConfig.editable)"
        >
          <div class="lpr-name">{{ item.parent.name }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 图片预览框 -->
    <el-dialog class="img-viewer" :visible.sync="imgVisible" width="700px">
      <img :src="imgPreview" alt />
    </el-dialog>
    <export-file ref="exportFile" :stepkey="stepkey" :total="total" :count="count" :percentage="percentage" @clearTimeOut="clearTimeOut"></export-file>
    <biz-columns :visible.sync="columnsSettingVisible" @update="getColumns" :tableId="tableId"></biz-columns>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import { ExportFile } from '@/components/BizUpload';
import BaseInfo from './BaseInfo';
import LeaveInfo from './LeaveInfo';
import RankItem from '../components/RankItem';
import TemplateSettings from './TemplateSettings';
import CarSetting from './CarSetting';
import BanistersSetting from './BanistersSetting';
import lprBtnBgImg from '@/assets/images/lpr-control/lpr_close.png';
import AdminMgmt from '@/service/staff-mgmt/adminMgmt';
import date from '@/utils/date';
import { customerService, global } from '@/common/urls';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import axios from 'axios';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';

export default {
  name: 'ReceptionMgmt',
  data() {
    return {
      tableId: '5',
      rankData: {
        id: '',
        target: '0',
        members: [],
        memberRanks: []
      },
      total: 0,
      count: 0,
      t: '',
      percentage: 0,
      stepkey: '',
      isUpdate: false,
      showRecommend: false,
      dialogVisible: false,
      imgVisible: false,
      imgPreview: '',
      // 道闸列表
      lprList: [],
      // 消息模板设置
      editShopIds: [],
      isEdit: true,
      showTemplate: false,
      loading: false,
      open: false,
      isShowReception: false,
      isShowLeave: false,
      isShow: true,
      tabName: 'first',
      currentRowId: { id: '' },
      operations: [
        { label: '新增', name: 'add', type: 'primary', auth: ['admin:reception.add'] },
        { label: '刷新', name: 'refresh', type: '' },
        { label: '设置', name: 'templateSettings', type: '', auth: ['admin:reception.set'] },
        { label: '下载本地版', name: 'download', type: '' },
        { label: '道闸', name: 'lprControl', type: '', auth: ['admin:reception.barrier'] },
        { label: '导出', name: 'export', type: '', auth: ['admin:reception.export'] }
      ],
      filters: [
        {
          type: 'datetimerange',
          label: '创建时间',
          class: 'hidden',
          value: [date.lastMonthDate() + ' ' + '00:00:00', date.nowDate() + ' ' + '23:59:59']
        },
        {
          type: 'select',
          label: '接待状态',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '已接待', value: 'true' },
            { label: '未接待', value: 'false' }
          ]
        },
        {
          type: 'select',
          label: '专属顾问',
          value: '',
          class: 'hidden',
          options: []
        },
        {
          type: 'select',
          label: '会员状态',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '会员', value: 'true' },
            { label: '非会员', value: 'false' }
          ]
        },
        {
          type: 'select',
          label: '到店状态',
          value: '',
          class: 'hidden',
          options: [
            { label: '全部', value: '' },
            { label: '在店', value: 'true' },
            { label: '离店', value: 'false' }
          ]
        },
        {
          type: 'input',
          placeholder: '请输入车牌/会员名或接待姓名',
          name: 'searchbar',
          value: ''
        }
      ],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        // 总条目数
        total: 0
      },
      tableData: [],
      lprBtnStyle: {
        background: 'url(' + lprBtnBgImg + ') 50% 50% / auto 100% no-repeat'
      }
    };
  },
  components: {
    BizFlexTable,
    BizPopupTabs,
    BaseInfo,
    LeaveInfo,
    TemplateSettings,
    CarSetting,
    BanistersSetting,
    ExportFile,
    RankItem
  },
  beforeDestroy() {
    if (this.t) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      window.clearTimeout(this.t); // 关闭
    }
  },
  computed: {
    toggleRecommendTxt() {
      const { showRecommend } = this;
      if (showRecommend) {
        return '收起';
      }
      return '筛选';
    }
  },
  mixins: [ColumnsMixin],
  methods: {
    ...mapGetters(['getUser']),
    getWidth(col) {
      switch (col.id) {
        case '2':
          return '180';
        case '3':
          return '150';
        case '4':
          return '150';

        default:
          return '';
      }
    },
    operate(name) {
      this[name]();
    },
    isShowFilter() {
      if (this.showRecommend) {
        this.filters[0].class = 'hidden';
        this.filters[1].class = 'hidden';
        this.filters[2].class = 'hidden';
        this.filters[3].class = 'hidden';
        this.filters[4].class = 'hidden';
      } else {
        this.filters[0].class = 'show';
        this.filters[1].class = 'show';
        this.filters[2].class = 'show';
        this.filters[3].class = 'show';
        this.filters[4].class = 'show';
      }
      this.showRecommend = !this.showRecommend;
    },
    clearTimeOut() {
      window.clearTimeout(this.t);
    },
    getEditableStores() {
      http
        .get(global.editableStores, {
          resourceType: '9'
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
    // 按钮'添加'
    add() {
      this.currentRowId = { id: '' };
      this.tabName = 'first';
      this.$set(this.rankData, 'target', '0');
      this.$set(this.rankData, 'members', []);
      this.$set(this.rankData, 'memberRanks', []);
      this.open = true;
      this.isShow = false;
      this.isEdit = true;
    },
    // 按钮'模板设置'
    templateSettings() {
      this.tabName = 'setting';
      this.showTemplate = true;
      this.open = true;
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.pagination.currentPage = 1;
      this.filters = val;
      this.refresh();
    },
    // 点击预览到店/离店图片
    showImg(img) {
      this.imgPreview = img;
      this.imgVisible = true;
    },
    rowClick(row) {
      if (this.isShowReception === false && this.isShowLeave === false) {
        this.$message.warning('无权限查看');
        return false;
      }
      if (row.unionConfig.editable === '0' && this.getUser().roleLevel === 'shop') {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
      this.edit(row.id);
    },
    edit(id) {
      this.isShow = true;
      this.$nextTick(function() {
        this.currentRowId = { id: id };
        this.tabName = 'first';
        this.open = true;
      });
    },
    // 下载本地版
    download() {
      window.open('/upload/app/intelltgentshop/%E6%99%BA%E8%83%BD%E5%88%B0%E5%BA%97%E5%AE%89%E8%A3%85%E7%A8%8B%E5%BA%8F.zip');
    },
    // 道闸
    lprControl() {
      http
        .get(customerService.ReceptionMgmt.queryLPR, {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          if (data.data.length === 0) {
            this.$message.warning('道闸不存在');
            return;
          }
          this.lprList = data.data;
          this.dialogVisible = true;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.dialogVisible = false;
        });
    },
    lprClick(row, editable) {
      if (editable === '0') {
        this.$message.warning('无此权限');
        return false;
      }
      let params = {
        shopId: row.storeId || '',
        command: {
          id: row.id,
          type: 'openGate',
          gateName: row.name
        }
      };
      http
        .post(customerService.ReceptionMgmt.accessCommand, params)
        .then(data => {
          this.$message.success(`道闸${name}已开启`);
          this.dialogVisible = false;
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
          this.dialogVisible = false;
        });
    },
    getConsultant() {
      this.loading = true;
      http
        .post('/admin/common/roleAdmins.jhtml', {
          roleTypes: ['reception']
        })
        .then(data => {
          this.filters[2].options = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取所有店铺
    getShopList() {
      let params = {
        shopId: this.shopId,
        sourceType: '0'
      };
      AdminMgmt.getShopList(
        params,
        data => {
          let shopList = [{ label: '全部', value: '' }].concat(
            data.shops.map(shop => {
              return { label: shop.name, value: shop.id };
            })
          );
          this.filters[4].options = shopList;
        },
        ErrorData => {}
      );
    },
    getProcess() {
      let url = '/admin/common/exportProgress.jhtml';
      http
        .get(url, { type: '0' })
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
    // 导出
    async export() {
      let params = {
        beginTime: this.filters[0].value[0] || '',
        endTime: this.filters[0].value[1] || '',
        isReception: this.filters[1].value || '',
        consultantId: this.filters[2].value || '',
        isMember: this.filters[3].value || '',
        isInShop: this.filters[4].value || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchContent: this.filters[5].value || '',
        shopId: window.top.SHOP_ID || ''
      };
      try {
        this.getProcess();
        this.$refs.exportFile.uploadingVisible = true;
        let response = await axios.post('/admin/intelligent/intelligentAccess/export.jhtml', params, { responseType: 'blob' });
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
        return;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    // 跳页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    // 是否预约
    formatAppoint(row) {
      return row.isAppointment === true ? '已预约' : '未预约';
    },
    close() {
      this.open = false;
      this.showTemplate = false;
    },
    update() {
      this.isUpdate = true;
      this.refresh();
    },
    refresh() {
      let params = {
        beginTime: this.filters[0].value[0] || '',
        endTime: this.filters[0].value[1] || '',
        isReception: this.filters[1].value || '',
        consultantId: this.filters[2].value || '',
        isMember: this.filters[3].value || '',
        isInShop: this.filters[4].value || '',
        pageSize: this.pagination.pageSize,
        pageNumber: this.pagination.currentPage,
        searchContent: this.filters[5].value,
        shopId: window.top.SHOP_ID || ''
      };
      this.loading = true;
      http
        .get(customerService.ReceptionMgmt.queryList, params)
        .then(data => {
          this.loading = false;
          this.tableData = data.data;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
          console.log('ERR_REFRESH: ', ErrorData);
        });
    },
    queryInfo() {
      http
        .get(customerService.ReceptionMgmt.queryInfo, {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          this.showMessage(
            `今日到店${data.accessCount}人，其中会员${data.memberCount}人，已接待${data.memberReceptionCount}人，累计消费${data.money}元`,
            'info'
          );
        })
        .catch();
    },
    getAuthUrl() {
      http
        .get('/admin/common/listAuthority/v201901.jhtml', {
          shopId: window.top.SHOP_ID || ''
        })
        .then(data => {
          if (data.authorities.indexOf('admin:reception.info') !== -1) {
            this.isShowReception = true;
          }
          if (data.authorities.indexOf('admin:reception.leave') !== -1) {
            this.isShowLeave = true;
          }
        })
        .catch();
    },
    // 显示消息提示
    showMessage(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    }
  },
  created() {
    this.getConsultant();
    this.getAuthUrl();
    this.getEditableStores();
    // this.getShopList();
  },
  mounted() {
    if (this.$route.query.showDialog) {
      this.lprControl();
    }
    if (this.$route.query.showTemplate) {
      this.templateSettings();
    }
    this.queryInfo();
    this.refresh();
  },
  watch: {
    open(newVal, oldVal) {
      if (!newVal && this.isUpdate) {
        this.refresh();
        this.isUpdate = false;
      }
    }
  }
};
</script>

<style lang="scss">
.reception-mgmt {
  .custom-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    > div {
      padding-left: 0;
    }
    i {
      font-size: 18px;
    }
  }
  img {
    max-width: 100%;
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
  .biz-input {
    width: 280px;
  }
  .lpr-area {
    width: 100%;
    display: flex;
    justify-content: center;
    .lpr-btn {
      cursor: pointer;
      border-radius: 50%;
      width: 130px;
      height: 130px;
      padding: 0 35px;
      margin: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }
  }
  .biz-input {
    position: absolute;
    top: 15px;
    right: 85px;
  }
  .toggle-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    z-index: 1;
    .rotate-180 {
      transform: rotate(180deg);
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
.el-dialog__wrapper.img-viewer {
  img {
    max-width: 100%;
  }
}
</style>
