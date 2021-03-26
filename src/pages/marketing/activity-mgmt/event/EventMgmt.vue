<template>
  <biz-grid class="event-market-mgmt">
    <div slot="top">
      <div class="activity-mgmt-top">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
        </biz-header>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <div class="list" @click="rowClick(item)" v-for="(item,index) in activityList" :key="index">
        <div class="td-1" v-if="item.state==='1'">
          <div class="td-1-1"><span>进行中</span></div>
          <div class="td-1-2">
            <span class="title">活动距结束</span>
            <span class="time">{{countTime(item.endDate)}}</span>
            <span>{{item.beginDate}}</span>
            <span>{{item.endDate}}</span>
          </div>
        </div>
        <div class="td-1-created" v-if="item.state==='3'">
          <div class="td-1-1"><span>已创建</span></div>
          <div class="td-1-2">
            <span class="title">
              <el-button type="primary" icon="iconfont1 biz-icon-i-web-fb" size="mini" @click.stop="publiced(item)"
                :disabled="!isEdit">正式发布</el-button>
            </span>
            <span>{{item.beginDate}}</span>
            <span>{{item.endDate}}</span>
          </div>
        </div>
        <div class="td-1-publish" v-if="item.state==='0'">
          <div class="td-1-1"><span>未开始</span></div>
          <div class="td-1-2">
            <span class="title">活动距开始</span>
            <span class="time">{{countTime(item.beginDate)}}</span>
            <span>{{item.beginDate}}</span>
            <span>{{item.endDate}}</span>
          </div>
        </div>
        <div class="td-1-end" v-if="item.state==='2'">
          <div class="td-1-1"><span>已结束</span></div>
          <div class="td-1-2">
            <span class="title">
              <el-button type="primary" icon="iconfont1 biz-icon-i-web-sy" size="mini" @click.stop="viewBenefits(item)"
                :disabled="!isEdit">查看收益</el-button>
            </span>
            <span>{{item.beginDate}}</span>
            <span>{{item.endDate}}</span>
          </div>
        </div>
        <div class="td-2">
          <div class="td-2-1">{{item.title}}</div>
          <div class="td-2-2">
            <span>签到人数<span>{{item.signedMembers}}</span></span><span>上墙人数<span>{{item.commentMembers}}</span></span><span>上墙消息<span>{{item.commentNews}}</span></span>
          </div>
        </div>
        <div class="td-3">
          <div>
            <div class="icon" @click.stop="editContent(item)">
              <i class="iconfont biz-icon-i-web-huod"></i>
            </div>
            <span @click.stop="editContent(item)">节目编辑</span>
            <div class="icon" @click.stop="editAwards(item)">
              <i class="iconfont biz-icon-i-web-jlsz"></i>
            </div>
            <span @click.stop="editAwards(item)">奖励编辑</span>
          </div>
          <div>
            <div class="icon" @click.stop="individuation(item)">
              <i class="iconfont biz-icon-i-web-gxh"></i>
            </div>
            <span @click.stop="individuation(item)">个性化</span>
            <div class="icon" @click.stop="editRecord(item)">
              <i class="iconfont biz-icon-i-web-sj"></i>
            </div>
            <span @click.stop="editRecord(item)">数据</span>
          </div>
        </div>
        <div class="td-4">
          <div class="icon" @click.stop="fullScreenClick(item)">
            <i class="iconfont biz-icon-i-web-dpm"></i>
          </div>
          <span @click.stop="fullScreenClick(item)">大屏幕</span>
          <el-popover placement="bottom-start" trigger="hover" width="100px">
            <img :src="item.qrCodePath" width="80" height="80">
            <div class="icon" slot="reference">
              <i class="iconfont biz-icon-i-web-ss"></i>
            </div>
            <span slot="reference">手机端</span>
          </el-popover>
        </div>
        <div class="td-5" v-if="isEdit">
          <div class="icon" @click.stop="copy(item)" v-if="hasAuthCopy">
            <i class="iconfont el-icon-tickets"></i>
          </div>
          <span @click.stop="copy(item)" v-if="hasAuthCopy">复制</span>
          <div class="icon" @click.stop="del(item)" v-if="hasAuthDel">
            <i class="iconfont biz-icon-iconfontshanchu1"></i>
          </div>
          <span @click.stop="del(item)" v-if="hasAuthDel">删除</span>
        </div>
      </div>
    </div>
    <div class="m-pagination" slot="bottom">
      <div class="limit-pagination">
        <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
        </biz-pagination>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
        <el-tab-pane label="基本信息" key="jbxx" name="baseinfo">
          <base-info ref="baseInfo" :itemId="itemId" @created="createdInfo" @base-info-updated="updatedInfo" :isEdit="isEdit">
          </base-info>
        </el-tab-pane>
        <el-tab-pane label="活动内容" name="contentinfo" v-if="itemId">
          <activity-content ref="contentinfo" :itemId="itemId" @operateSuccess="operateSuccess" :isEdit="isEdit">
          </activity-content>
        </el-tab-pane>
        <el-tab-pane label="活动奖品" name="awardsinfo" v-if="itemId">
          <activity-awards ref="awardsinfo" :itemId="itemId" :isEdit="isEdit">
          </activity-awards>
        </el-tab-pane>
        <!-- <el-tab-pane label="推送设置" key="tssz" name="publishSetting" v-if="itemId">
          <biz-publish-setting :itemId="itemObj" :articleType="'2'"></biz-publish-setting>
        </el-tab-pane> -->
        <el-tab-pane key="hdtz" label="活动通知" name="notice" v-if="itemId">
          <activity-notice ref="notice" :itemId="itemObj" :defaultShop="user.shop" :isEdit="isEdit"
            :memberRankList="initInfo.memberRankList">
          </activity-notice>
        </el-tab-pane>
        <el-tab-pane label="活动记录" name="record" v-if="itemId">
          <activity-record ref="record" :itemId="itemId" :isEdit="isEdit">
          </activity-record>
        </el-tab-pane>
        <el-tab-pane label="活动效益" name="benefits" v-if="itemId">
          <activity-benefits ref="benefits" :itemId="itemId" :isEdit="isEdit">
          </activity-benefits>
        </el-tab-pane>
        <el-tab-pane label="个性化" name="individuation" v-if="itemId">
          <activity-individuation ref="individuation" :itemId="itemId" :isEdit="isEdit">
          </activity-individuation>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
    <el-dialog title="" :visible.sync="dialogVisibleScreen" append-to-body :fullscreen="fullscreen"
      custom-class="fullScreen-dialog">
      <full-screen :itemId="itemId" :open="dialogVisibleScreen"></full-screen>
    </el-dialog>
    <div v-if="activityList.length === 0" :style="styleObject"></div>
  </biz-grid>
</template>

<script>
import { BizHeader, BizPagination } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import BaseInfo from './ActivityBaseInfo';
import ActivityContent from './ActivityContent';
import ActivityAwards from './ActivityAwards';
// import BizPublishSetting from '@/components/BizPublishSetting';
import ActivityNotice from './ActivityNotice';
import ActivityRecord from './ActivityRecord';
import ActivityBenefits from './ActivityBenefits';
import ActivityIndividuation from './ActivityIndividuation';
import http from '@/common/http';
import { activityMgmt } from '@/common/urls';
import date from '@/utils/date';
import activityMgmtService from '@/service/activity-mgmt/marketing/activityMgmt';
import FullScreen from './components/FullScreen';
import code from '@/assets/images/promotion-preview/QRCode.png';
import service from '@/service/member-card-mgmt/memberCardMgmt';
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'ActivityMarketingMgmt',
  data() {
    return {
      modifiedForm: {},
      code: code,
      itemId: '',
      itemObj: { id: '' },
      loading: false,
      activeActivity: {},
      initInfo: {
        memberRankList: []
      },
      orderProperty: '',
      orderDirection: '',
      defaultId: '',
      height: '100%',
      isCreated: false,
      fullscreen: true,
      dialogVisibleScreen: false,
      isAward: false,
      popupTabName: 'baseinfo',
      openPopup: false,
      editShopIds: [],
      isEdit: true,
      shopList: [],
      activityList: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      operations: [
        {
          disabled: false,
          label: '新增',
          name: 'add',
          type: 'primary',
          auth: ['admin:offlineActivity.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      filters: [
        {
          type: 'select',
          label: '状态',
          name: 'state',
          value: '',
          disabled: false,
          options: [
            { label: '全部', value: '' },
            { label: '未开始', value: '0' },
            { label: '进行中', value: '1' },
            { label: '已结束', value: '2' },
            { label: '已创建', value: '3' }
          ]
        },
        {
          type: 'daterange',
          label: '创建时间',
          name: 'publishDate',
          value: [date.lastMonthDate(), date.nowDate()]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入活动名称',
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
    BizPopupTabs,
    BaseInfo,
    ActivityContent,
    ActivityAwards,
    // BizPublishSetting,
    ActivityNotice,
    ActivityRecord,
    ActivityBenefits,
    ActivityIndividuation,
    FullScreen
  },
  created() {
    this.getList();
    this.getInitInfo();
    this.listAuthority();
  },
  mounted() {
    this.popupTabName = 'baseinfo';
    this.$refs.baseInfo.clear();
    this.isCreated = true;
    this.getKpi();
  },
  watch: {},
  computed: {
    ...mapGetters('Authority', ['currentAuth']),
    hasAuthEdit() {
      return this.currentAuth.includes('admin:offlineActivity.edit');
      // return true;
    },
    hasAuthDel() {
      return this.currentAuth.includes('admin:offlineActivity.delete');
      // return true;
    },
    hasAuthCopy() {
      return this.currentAuth.includes('admin:offlineActivity.copy');
      // return true;
    },
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 300px no-repeat'
      };
    }
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    operateSuccess() {
      this.$refs.awardsinfo.getList();
    },
    refresh() {
      this.itemId = '';
      this.getList();
    },
    createdInfo(id) {
      this.itemId = id;
      this.getList();
    },
    updatedInfo() {
      this.getList();
    },
    listAuthority() {
      service.listAuthority(
        {},
        data => {
          if (data.authorities.indexOf('admin:offlineActivity.edit') > 0) {
            this.isEdit = true;
            this.operations[0].type = 'primary';
            this.operations[0].disabled = false;
          } else {
            this.isEdit = false;
            this.operations[0].type = '';
            this.operations[0].disabled = true;
          }
        },
        // result_code 不是100的处理
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    getKpi() {
      http
        .get('/admin/localMarketing/kpi.jhtml?', {})
        .then(data => {
          let msg =
            '通过该功能管理线上的各种线下活动，持续活跃会员，营销利器，当前累计活动' +
            data.data.marketingAll +
            '，进行中' +
            data.data.marketingContinue +
            '，未开始' +
            data.data.marketingNotBegin +
            '，未发布' +
            data.data.marketingCreated +
            '，已结束' +
            data.data.marketingEnded +
            '。';
          this.$message({
            showClose: true,
            message: msg
          });
        })
        .catch(ErrorData => {
          // this.$message.warning(ErrorData.errorMessage || '操作出现错误');
        });
    },
    fullScreenClick(row) {
      this.itemId = row.id;
      this.itemObj = { id: row.id };
      this.dialogVisibleScreen = true;
    },
    individuation(row) {
      this.itemId = row.id;
      this.itemObj = { id: row.id };
      this.popupTabName = 'individuation';
      this.openPopup = true;
    },
    editAwards(row) {
      this.itemId = row.id;
      this.itemObj = { id: row.id };
      this.popupTabName = 'awardsinfo';
      this.openPopup = true;
    },
    editRecord(row) {
      this.itemId = row.id;
      this.itemObj = { id: row.id };
      this.popupTabName = 'record';
      this.openPopup = true;
    },
    editContent(row) {
      this.itemId = row.id;
      this.itemObj = { id: row.id };
      this.popupTabName = 'contentinfo';
      this.openPopup = true;
    },
    add() {
      this.itemId = '';
      this.itemObj = { id: '' };
      this.popupTabName = 'baseinfo';
      this.openPopup = true;
    },
    copy(row) {
      this.itemId = '';
      this.itemObj = { id: '' };
      this.popupTabName = 'baseinfo';
      this.$refs.baseInfo.copy(row.id);
      this.$nextTick(() => {
        this.openPopup = true;
      });
    },
    getInitInfo: async function() {
      this.user = this.getUser();
      let params = {
        shopId: window.top.SHOP_ID || ''
      };

      activityMgmtService.getInitInfo(
        params,
        data => {
          this.initInfo = data;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    countTime(date) {
      // 获取当前时间
      let dateTime = new Date();
      let now = dateTime.getTime();
      // 设置截止时间
      let endDate = new Date(date);
      let end = endDate.getTime();
      // 时间差
      let leftTime = end - now;
      // 定义变量 d,h,m,s保存倒计时的时间
      let h = 0;
      let m = 0;
      let s = 0;
      if (leftTime >= 0) {
        h = Math.floor(leftTime / 1000 / 60 / 60);
        m = Math.floor((leftTime / 1000 / 60) % 60);
        s = Math.floor((leftTime / 1000) % 60);
      }
      console.log(s);
      // 递归每秒调用countTime方法，显示动态时间效果
      // setTimeout(this.countTime(date), 1000);
      return h + '小时' + m + '分' + s + '秒';
    },
    publiced(row) {
      http
        .post('/admin/localMarketing/publish.jhtml', {
          id: row.id
        })
        .then(data => {
          this.$message.success('发布成功');
          this.getList();
          this.itemId = '';
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
          console.log(errData);
          console.log('code错误');
        });
    },
    viewBenefits(row) {
      this.itemId = row.id;
      this.itemObj = { id: row.id };
      this.popupTabName = 'benefits';
      this.openPopup = true;
      this.$nextTick(() => {
        this.$refs.notice.refresh(row);
      });
    },
    getList() {
      http
        .get(activityMgmt.LocalList, {
          stateStr: this.filters[0].value || '',
          beginDate: this.filters[1].value.length > 0 ? this.filters[1].value[0] + ' ' + '00:00:00' : '',
          endDate: this.filters[1].value.length > 0 ? this.filters[1].value[1] + ' ' + '23:59:59' : '',
          searchValue: this.filters[2].value || '',
          pageNumber: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        })
        .then(data => {
          this.activityList = data.content;
          this.activityList.sort(function(a, b) {
            return a.state - b.state;
          });
          this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
        });
    },
    rowClick(row) {
      if (this.itemId === row.id) {
        this.$refs.baseInfo.refresh(row.id);
      }
      this.itemId = row.id;
      this.itemObj = { id: row.id };
      this.popupTabName = 'baseinfo';
      this.openPopup = true;
      this.$nextTick(() => {
        this.$refs.notice.refresh(row);
      });
    },
    del(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(row.id);
          let params = {
            ids: ids,
            shopId: window.top.SHOP_ID || ''
          };
          http
            .delete(activityMgmt.CreateLocalActivity, params)
            .then(data => {
              this.$message.success('删除成功');
              this.getList();
            })
            .catch(errData => {
              this.$message.warning(errData.errorMessage);
            });
        })
        .catch(() => {});
    },
    filterDataChange() {
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
.event-market-mgmt {
  .content {
    .list {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      border: 1px solid #dadada;
      border-radius: 5px;
      text-align: center;
      color: #606266;
      margin: 5px 0px 10px 0px;
      .iconfont {
        color: #ff7300;
        font-size: 26px;
      }
      .iconfont1 {
        font-family: 'iconfont' !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        color: #fff;
        font-size: 14px;
      }
      .td-1-created {
        width: 30%;
        display: flex;
        position: relative;
        .td-1-1 {
          width: 0px;
          height: 0px;
          border-top: 55px solid #0babeb;
          border-right: 55px solid transparent;
          span {
            transform: rotate(-45deg);
            -ms-transform: rotate(-45deg); /* IE 9 */
            -moz-transform: rotate(-45deg); /* Firefox */
            -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
            -o-transform: rotate(-45deg);
            color: #ffffff;
            position: absolute;
            top: 10px;
          }
        }
        .td-1-2 {
          .title {
            height: 75px;
            line-height: 75px;
          }
          span {
            display: inherit;
          }
        }
      }
      .td-1-end {
        width: 30%;
        display: flex;
        position: relative;
        .td-1-1 {
          width: 0px;
          height: 0px;
          border-top: 55px solid #aaaaaa;
          border-right: 55px solid transparent;
          span {
            transform: rotate(-45deg);
            -ms-transform: rotate(-45deg); /* IE 9 */
            -moz-transform: rotate(-45deg); /* Firefox */
            -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
            -o-transform: rotate(-45deg);
            color: #ffffff;
            position: absolute;
            top: 10px;
          }
        }
        .td-1-2 {
          .title {
            height: 75px;
            line-height: 75px;
          }
          span {
            display: inherit;
          }
        }
      }
      .td-1-publish {
        width: 30%;
        display: flex;
        position: relative;
        .td-1-1 {
          width: 0px;
          height: 0px;
          border-top: 55px solid #3f51b5;
          border-right: 55px solid transparent;
          span {
            transform: rotate(-45deg);
            -ms-transform: rotate(-45deg); /* IE 9 */
            -moz-transform: rotate(-45deg); /* Firefox */
            -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
            -o-transform: rotate(-45deg);
            color: #ffffff;
            position: absolute;
            top: 10px;
          }
        }
        .td-1-2 {
          span {
            display: block;
          }
          .title {
            height: 40px;
            line-height: 50px;
            font-size: 12px;
          }
          .time {
            height: 35px;
            line-height: 35px;
            font-size: 16px;
          }
        }
      }
      .td-1 {
        width: 30%;
        display: flex;
        position: relative;
        .td-1-1 {
          width: 0px;
          height: 0px;
          border-top: 55px solid #ff7300;
          border-right: 55px solid transparent;
          span {
            transform: rotate(-45deg);
            -ms-transform: rotate(-45deg); /* IE 9 */
            -moz-transform: rotate(-45deg); /* Firefox */
            -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
            -o-transform: rotate(-45deg);
            color: #ffffff;
            position: absolute;
            top: 10px;
          }
        }
        .td-1-2 {
          span {
            display: block;
          }
          .title {
            height: 40px;
            line-height: 50px;
            font-size: 12px;
          }
          .time {
            height: 35px;
            line-height: 35px;
            font-size: 16px;
          }
        }
      }
      .td-2 {
        width: 40%;
        border-left: 1px solid #dadada;
        border-right: 1px solid #dadada;
        .td-2-1 {
          font-size: 16px;
          height: 50px;
          line-height: 50px;
        }
        .td-2-2 {
          display: flex;
          justify-content: space-around;
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          span {
            span {
              margin-left: 5px;
              font-size: 14px;
            }
          }
        }
      }
      .td-3 {
        display: flex;
        justify-content: space-around;
        width: 14%;
        line-height: 20px;
        .icon {
          padding-top: 10px;
        }
      }
      .td-4 {
        border-left: 1px solid #dadada;
        border-right: 1px solid #dadada;
        width: 8%;
        line-height: 20px;
        .icon {
          padding-top: 10px;
        }
      }
      .td-5 {
        width: 8%;
        line-height: 20px;
        cursor: pointer;
        .icon {
          padding-top: 10px;
        }
        .iconfont {
          color: #606266;
        }
      }
    }
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
}
</style>
