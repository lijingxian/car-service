<template>
  <biz-grid class="promotion-notice">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    <el-form ref="form" :model="notice" :rules="rules" size="small" label-width="110px" v-loading="loading" :disabled="!isEdit">
      <el-form-item label="发送给" prop="noticeTarget">
        <el-radio-group v-model="notice.noticeTarget" @change="onTypeChange">
          <el-radio label="ToStore">所有会员</el-radio>
          <el-radio label="ToMemberrank">指定等级会员</el-radio>
          <el-radio label="ToMember">指定会员</el-radio>
        </el-radio-group>
        <div v-if="notice.noticeTarget==='ToStore'">
          <span>已选中会员{{total}}人</span>
        </div>
        <div v-else-if="notice.noticeTarget==='ToMemberrank'">
          <el-button type="primary" class="btn-style" @click="selectRank">选择</el-button>
          <span>已选中会员{{rankTotal}}人</span>
          <div v-for="item in selVips" :key="item.name">{{item.name + ' (' + item.curSel + ')'}}</div>
        </div>
        <div v-else>
          <el-button type="primary" @click="showPeoplePicker" class="btn-style">选择</el-button>
          <span>已选中会员{{notice.noticeMembers.length}}人</span>
          <div :class="isShow?'nick-name-container-show':'nick-name-container'">
            <div v-for="item in notice.noticeMembers" :key="item.id" class="nick-name-title">{{item.name||item.nickname}}</div>
          </div>
          <div class="color" v-if="notice.noticeMembers.length>6&&!isShow" @click="view">查看全部</div>
        </div>
      </el-form-item>
      <el-form-item label="通知方式">
        <div>
          <el-button type="text" size="small" v-popover:codePop>
            <i class="iconfont el-icon-question" style="color: #ff7300"></i>
            <span style="font-size:14px">输入框内支持自定义编辑</span>
          </el-button>
          <el-popover ref="codePop" placement="left" width="300" trigger="hover">
            <div>
              <p>APP通知，发送后安装了V服爱车APP且登录的会员将在APP收到此消息</p>
              <p>微信通知，发送后关注了微信公众号且登录的会员将在微信上收到此消息</p>
              <p>短信通知，发送后将通过短信通知到会员</p>
              <p>注意：用户没有登录APP/没有关注公众号/关注公众号但没有登录将存在收不到消息的情况。消息发送后可能因为运营商原因存在延迟收到的情况，请知悉</p>
            </div>
          </el-popover>
        </div>
        <div class="notify-type">
          <div class="item">
            <el-checkbox v-model="notice.isAppNotice" @change="appChange">App消息</el-checkbox>
            <div class="preview-content" v-show="notice.isAppNotice">
              <el-input v-model="notice.content" placeholder="请输入通知内容，不超过100字符" type="textarea" :maxlength="100"></el-input>
            </div>
          </div>
          <div class="item">
            <el-checkbox v-model="notice.isWechatNotice">微信消息</el-checkbox>
            <div class="preview-content" v-show="notice.isWechatNotice">
              <el-input type="textarea" v-model="notice.wechatTitle" :rows="1" :maxlength="100" placeholder="请输入通知内容，不超过100字符"></el-input>
              <div>活动主体：
                <span class="custom-c">{{promotion.title}}</span>
              </div>
              <div>通知时间：
                <span class="custom-c">{{promotion.beginDate}}</span>
                -
                <span class="custom-c">{{promotion.endDate}}</span>
              </div>
              <el-input type="textarea" v-model="notice.wechatRemark" placeholder="请输入通知内容，不超过100字符" :maxlength="100"></el-input>
            </div>
          </div>
          <div class="item">
            <el-checkbox v-model="notice.isSmsNotice">短信消息</el-checkbox>
            <div class="preview-content" v-show="notice.isSmsNotice">
              【V服平台】亲爱的会员，为感恩长期以来大家对
              <span class="custom-c">{{defaultShop.name}}</span>
              的支持，您可参加
              <span class="custom-c">{{promotion.title}}</span>
              。退订回N
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <biz-dialog-selector title="选择会员" :visibility.sync="showDialog" :appendToBody="true" :keyField="'id'" :selectionKeys="selectionKeys"
      :loading="dialogLoading" :tableData="dialogTableData" :pagination="dialogPagination" :filters="dialogFilters" @confirmed="handleConfirmed"
      @filterDataChange="dialogFilterDataChange" @pageSizeChange="dialogPageSizeChange" @currentPageChange="dialogCurrentPageChange"
      @selectionChange="selectionChange">
      <el-table-column prop="userName" label="会员信息">
        <template slot-scope="scope">
          <div class="customer-info">
            <img v-if="scope.row.head" :src="scope.row.head" />
            <img v-else src="../../../../assets/images/default_user.png" />
            <div class="wrapper">
              <div class="title" :title="scope.row.name">{{scope.row.name}}</div>
              <div class="gender">
                <i class="male iconfont biz-icon-i-web-m" v-if="scope.row.gender === '0'"></i>
                <i class="female iconfont biz-icon-i-web-f" v-if="scope.row.gender === '1'"></i>
                <i class="none iconfont biz-icon-i-web-bm" v-if="scope.row.gender === '2'"></i>
                <span>{{scope.row.mobile||scope.row.contactMobile}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="状态">
        <template slot-scope="scope">
          {{scope.row.enableState==='1'?'启用':'停用'}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="店铺">
        <template slot-scope="scope">
          {{scope.row.shop.name}}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="最后登录">
        <template slot-scope="scope">
          {{scope.row.lastLoginDate}}
        </template>
      </el-table-column>
    </biz-dialog-selector>
    <el-dialog title="选择等级" :visible.sync="showRankDialog" :appendToBody="true" center custom-class="rank-dialog">
      <div class="content">
        <div class="memberRank" v-for="memberRank of vipRankList" :key="memberRank.id">
          <div class="vip-name">{{memberRank.name}}</div>
          <div class="vip-container">
            <div class="vip" v-for="rank of memberRank.ranks" :key="rank.id">
              <el-checkbox :value="rank.checked" @change="vipChange(rank)">{{rank.name}}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRankDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRankConfirmed">确认选择</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="showConfirmDialog" :appendToBody="true" center>
      <div class="content">
        本活动还未发布，确认通知到指定会员？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="publish" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="通知结果" :visible.sync="showResultDialog" :appendToBody="true" custom-class="promotion-dialog" center>
      <div>共通知会员{{memberCount}}位，其中送达App{{appCount}}位，送达微信{{wechatCount}}位，送达短信{{smsCount}}位，可能因为运营商原因存在延迟收到的情况，请勿重复发送。</div>
      <div class="container">
        <biz-flex-table :pagination="dialogResultPagination" :tableData="sendResultList" :loading="resultLoading" :checkable="false"
          @size-change="dialogResultPageSizeChange" @current-change="dialogResultCurrentPageChange" class="tabel-style">
          <el-table-column prop="type" label="通知方式">
          </el-table-column>
          <el-table-column prop="member" label="通知对象">
          </el-table-column>
          <el-table-column prop="result" label="结果">
          </el-table-column>
        </biz-flex-table>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import ActivityNotificationService from '@/service/motorists-club-activity/ActivityNotification';
import Service from '@/service/activity-mgmt/promotion-mgmt/promotionMgmt';
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { mapGetters } from 'vuex';
import { BizFlexTable } from '@/components/BizTable';

export default {
  name: 'PromotionNotice',
  components: {
    BizSaveButton,
    BizDialogSelector,
    BizGrid,
    BizFlexTable
  },
  data() {
    return {
      loading: false,
      selectionList: [],
      total: 0,
      rankTotal: 0,
      showResultDialog: false,
      resultLoading: false,
      isShow: false,
      selVips: [],
      sendResultList: [],
      allResultList: [],
      showRankDialog: false,
      showConfirmDialog: false,
      promotion: {},
      vipList: [],
      showDialog: false,
      notice: {
        wechatTitle: '',
        wechatRemark: '',
        id: '',
        content: '',
        noticeTarget: 'ToStore',
        isNeedNotice: '1',
        isWechatNotice: false,
        isAppNotice: false,
        isSmsNotice: false,
        isAppPopup: false,
        isNoticed: false,
        noticeDate: '',
        noticeMemberRanks: [],
        noticeMembers: []
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:promotion.edit']
        },
        {
          label: '发送',
          name: 'send',
          type: 'primary',
          disabled: false,
          auth: ['admin:promotion.edit']
        }
      ],
      rules: {
        isNeedNotice: [{ required: true, message: '请选择是否通知', trigger: 'blur' }],
        content: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, rules, callback) => {
              if (this.notice.isNeedNotice === '0' || this.notice.content) {
                callback();
              } else {
                callback(new Error('请输入通知内容'));
              }
            }
          }
        ]
      },
      dialogLoading: true,
      dialogTableData: [],
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogResultPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入姓名/手机号',
          name: 'searchValue',
          value: ''
        }
      ]
    };
  },
  props: {
    memberRankList: {
      type: Array,
      default() {
        return [];
      }
    },
    isEdit: {
      type: Boolean
    },
    defaultShop: {
      type: Object,
      default() {
        return {
          id: '',
          name: '',
          address: ''
        };
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(['getUser']),
    memberCount() {
      let count = Math.max(this.appCount, this.wechatCount, this.smsCount);
      return count;
    },
    appCount() {
      let count = 0;
      this.allResultList.forEach(item => {
        if (item.type === 'App通知') {
          count++;
        }
      });
      return count;
    },
    wechatCount() {
      let count = 0;
      this.allResultList.forEach(item => {
        if (item.type === '微信通知') {
          count++;
        }
      });
      return count;
    },
    smsCount() {
      let count = 0;
      this.allResultList.forEach(item => {
        if (item.type === '短信通知') {
          count++;
        }
      });
      return count;
    },
    vipRankList() {
      let memberRankList = this.memberRankList;

      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          vip.checked = false;
        }
      }
      for (const memberRank of memberRankList) {
        for (const vip of memberRank.ranks) {
          for (const iterator of this.notice.noticeMemberRanks) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }

      return memberRankList;
    },
    selectionKeys() {
      let list = [];
      for (const iterator of this.notice.noticeMembers) {
        list.push(iterator.id);
      }
      return list;
    },
    app() {
      return this.defaultShop.name + '发布了' + this.promotion.title + ',快去享受优惠吧！';
    },
    sms() {
      return (
        '【V服平台】亲爱的会员，为感恩长期以来大家对' +
        this.defaultShop.name +
        '的支持，您可参加' +
        this.promotion.title +
        this.notice.content +
        '。退订回N'
      );
    },
    wechat() {
      return (
        '您关注的店铺发布了新活动\n' +
        '活动主体：' +
        this.promotion.title +
        '\n' +
        '通知时间：' +
        this.promotion.beginDate +
        ' - ' +
        this.promotion.endDate +
        '\n' +
        '您可以到V服爱车的近期活动/最新促销查看并参加。'
      );
    },
    appPopup() {
      return this.defaultShop.name + '发布了' + this.promotion.title + ',快去享受优惠吧！\n 稍后/现在参与';
    }
  },
  methods: {
    operate(name) {
      this[name]();
    },
    appChange() {
      if (this.notice.isAppNotice && !this.notice.content) {
        this.notice.content = this.defaultShop.name + '发布了' + (this.promotion.title || '') + ',快去享受优惠吧！';
      }
    },
    dialogResultPageSizeChange(val) {
      this.dialogResultPagination.pageSize = val;
      this.refreshCurTabel();
    },
    dialogResultCurrentPageChange(val) {
      this.dialogResultPagination.currentPage = val;
      this.refreshCurTabel();
    },
    refreshCurTabel() {
      this.sendResultList = [];
      let i = (this.dialogResultPagination.currentPage - 1) * this.dialogResultPagination.pageSize;
      let count = this.dialogResultPagination.currentPage * this.dialogResultPagination.pageSize - 1;
      for (i; i < count; i++) {
        if (this.allResultList[i]) {
          this.sendResultList.push(this.allResultList[i]);
        }
      }
    },
    selectRank() {
      this.showRankDialog = true;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.addTips()) {
          return;
        }
        this.loading = true;
        this.clearMemberData();
        let params = {
          promotionId: this.promotion.id,
          notice: {
            id: this.notice.id,
            content: this.notice.content,
            noticeTarget: this.notice.noticeTarget,
            isNeedNotice: this.notice.isNeedNotice,
            isWechatNotice: this.notice.isWechatNotice ? '1' : '0',
            isAppNotice: this.notice.isAppNotice ? '1' : '0',
            isSmsNotice: this.notice.isSmsNotice ? '1' : '0',
            isAppPopup: this.notice.isAppPopup ? '1' : '0',
            isNoticed: this.notice.isNoticed ? '1' : '0',
            noticeDate: this.notice.noticeDate,
            noticeMemberRanks: this.notice.noticeMemberRanks,
            noticeMembers: this.notice.noticeMembers,
            wechatTitle: this.notice.wechatTitle,
            wechatRemark: this.notice.wechatRemark
          }
        };
        console.log(params);
        this.loading = true;
        Service.updatePromotionNotice(
          params,
          data => {
            this.$message.success('更新成功');
            this.loading = false;
            this.$emit('created');
          },
          ErrorData => {
            this.loading = false;
            this.$notify({
              title: '警告',
              message: ErrorData.errorMessage,
              type: 'warning',
              duration: 1500
            });
          }
        );
      });
    },
    send() {
      if (this.promotion.stateStr === '3') {
        this.showConfirmDialog = true;
      } else {
        this.publish();
      }
    },
    publish() {
      this.loading = true;
      this.showConfirmDialog = false;
      Service.publishPromotionNotice(
        {
          promotionId: this.promotion.id
        },
        data => {
          this.loading = false;
          this.allResultList = data.resultData;
          this.dialogResultPagination.currentPage = 1;
          this.dialogResultPagination.pageSize = 20;
          this.refreshCurTabel();
          this.dialogResultPagination.total = this.allResultList.length;
          this.showResultDialog = true;
          this.operations[1].label = '再次发送';
          let tabelData = this.allResultList;
          tabelData.forEach(item => {
            item.result = '已经发送';
            switch (item.type) {
              case '0':
                item.type = 'App通知';
                break;
              case '1':
                item.type = '短信通知';
                break;
              case '2':
                item.type = '微信通知';
                break;
              default:
                break;
            }
          });
        },
        ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        }
      );
    },
    refresh(promotion) {
      this.promotion = promotion;
      let params = {
        promotionId: promotion.id
      };
      Service.getPromotionNotice(
        params,
        data => {
          if (JSON.stringify(data.data) === '{}') {
            this.clear();
            this.notice.content = this.defaultShop.name + '发布了' + this.promotion.title + ',快去享受优惠吧！';
            this.notice.wechatTitle = '您关注的店铺发布了新活动';
            this.notice.wechatRemark = '您可以到V服爱车的近期活动/最新促销查看并参加。';
            this.notice.noticeTarget = 'ToStore';
            this.getVipCount();
          } else {
            this.notice.id = data.data.id;
            this.notice.content = data.data.content || '';
            this.notice.noticeTarget = data.data.noticeTarget;
            this.notice.isNeedNotice = data.data.isNeedNotice;
            this.notice.isWechatNotice = data.data.isWechatNotice !== '0';
            this.notice.isAppNotice = data.data.isAppNotice !== '0';
            this.notice.isSmsNotice = data.data.isSmsNotice !== '0';
            this.notice.isAppPopup = data.data.isAppPopup !== '0';
            this.notice.isNoticed = data.data.isNoticed !== '0';
            this.notice.noticeDate = data.data.noticeDate;
            this.notice.noticeMemberRanks = data.data.noticeMemberRanks || [];
            this.notice.noticeMembers = data.data.noticeMembers || [];
            this.notice.wechatTitle = data.data.wechatTitle ? data.data.wechatTitle : '您关注的店铺发布了新活动';
            this.notice.wechatRemark = data.data.wechatRemark
              ? data.data.wechatRemark
              : '您可以到V服爱车的近期活动/最新促销查看并参加。';
            this.selVipList();
            let ary = this.notice.noticeMemberRanks.map(item => {
              return parseInt(item.id);
            });
            this.getVipCount(ary);
          }
          this.operations[1].label = data.data.isNoticed === '1' ? '再次发送' : '发送';
          this.appChange();
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    clear() {
      this.notice.content = '';
      this.notice.noticeTarget = 'ToStore';
      this.notice.isNeedNotice = '1';
      this.notice.isWechatNotice = false;
      this.notice.isAppNotice = false;
      this.notice.isSmsNotice = false;
      this.notice.isAppPopup = false;
      this.notice.isNoticed = false;
      this.notice.noticeDate = '';
      this.notice.noticeMemberRanks = [];
      this.notice.noticeMembers = [];
      this.notice.wechatRemark = '';
      this.notice.wechatTitle = '';
    },
    vipChange(val) {
      if (val.checked) {
        this.notice.noticeMemberRanks.forEach((element, index) => {
          if (element.id === val.id) {
            this.notice.noticeMemberRanks.splice(index, 1);
          }
        });
      } else {
        this.notice.noticeMemberRanks.push({ id: val.id });
      }
    },
    handleRankConfirmed(selectionKeys, selections) {
      let ary;
      this.showRankDialog = false;
      this.selVipList();
      ary = this.notice.noticeMemberRanks.map(item => {
        return parseInt(item.id);
      });
      if (ary && ary.length) {
        this.getVipCount(ary);
      } else {
        this.rankTotal = 0;
      }
    },
    selVipList() {
      let curSel;
      this.selVips = [];
      this.vipRankList.forEach(item => {
        curSel = [];
        item.ranks.forEach(element => {
          if (element.checked) {
            curSel.push(element.name);
          }
        });
        if (curSel.length) {
          this.selVips.push({ name: item.name, curSel: curSel.join('、') });
        }
      });
    },
    queryPeople() {
      this.dialogLoading = true;

      let params = {
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };

      ActivityNotificationService.queryPeople(
        params,
        data => {
          console.log(data);
          this.dialogTableData = data.content;
          this.dialogPagination.total = Number(data.total);
          this.dialogLoading = false;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    showPeoplePicker() {
      this.dialogFilters[0].value = '';
      this.showDialog = true;
      this.queryPeople();
    },
    selectionChange(selections) {
      this.selectionList = [];
      selections.forEach(item => {
        if (this.selectionList.indexOf(item) === -1) {
          this.selectionList.push(item);
        }
      });
    },
    handleConfirmed(selectionKeys, selections) {
      let list = [];
      for (const iterator of selectionKeys) {
        this.selectionList.forEach(item => {
          if (item.id === iterator) {
            list.push({
              id: iterator,
              name: item.name,
              nickName: item.nickName
            });
          }
        });
      }
      if (this.notice.noticeMembers.length) {
        list.forEach(item => {
          if (!this.containsItem(this.notice.noticeMembers, item.id)) {
            this.notice.noticeMembers.push(item);
          }
        });
      } else {
        this.notice.noticeMembers = this.notice.noticeMembers.concat(list);
      }
      this.notice.noticeMembers = this.notice.noticeMembers.filter(item => {
        return this.containsItem(selectionKeys, item.id);
      });
    },
    addTips() {
      let str;
      let str1;
      let showTip = false;
      if (this.notice.isAppNotice) {
        str = this.notice.content.replace(/ /g, '');
        if (!str.length) {
          this.$notify({
            title: '警告',
            message: '请输入通知内容',
            type: 'warning',
            duration: 1500
          });
          showTip = true;
        }
      }
      if (this.notice.isWechatNotice) {
        str = this.notice.wechatTitle.replace(/ /g, '');
        str1 = this.notice.wechatRemark.replace(/ /g, '');
        if (!str.length || !str1.length) {
          this.$notify({
            title: '警告',
            message: '请输入通知内容',
            type: 'warning',
            duration: 1500
          });
          showTip = true;
        }
      }
      return showTip;
    },
    containsItem(ary, id) {
      let contain = false;
      ary.forEach(item => {
        if (item.id) {
          if (item.id === id) {
            contain = true;
            return false;
          }
        } else {
          if (item === id) {
            contain = true;
            return false;
          }
        }
      });
      return contain;
    },
    dialogFilterDataChange() {
      this.dialogPagination.currentPage = 1;
      this.queryPeople();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.queryPeople();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.queryPeople();
    },
    getStatus(row) {
      switch (row.enableState) {
        case '0':
          return '停用';
        case '1':
          return '启用';
      }
      return '';
    },
    clearMemberData() {
      let memberRankList;
      switch (this.notice.noticeTarget) {
        case 'ToStore':
          memberRankList = this.memberRankList;
          for (const memberRank of memberRankList) {
            for (const vip of memberRank.ranks) {
              vip.checked = false;
            }
          }
          this.rankTotal = 0;
          this.selVips = [];
          this.notice.noticeMembers = [];
          this.notice.noticeMemberRanks = [];
          break;
        case 'ToMemberrank':
          this.total = 0;
          this.notice.noticeMembers = [];
          break;
        case 'ToMember':
          memberRankList = this.memberRankList;
          for (const memberRank of memberRankList) {
            for (const vip of memberRank.ranks) {
              vip.checked = false;
            }
          }
          this.total = 0;
          this.rankTotal = 0;
          this.selVips = [];
          this.notice.noticeMemberRanks = [];
          break;
        default:
          break;
      }
    },
    onTypeChange(val) {
      if (val === 'ToStore') {
        this.getVipCount();
      }
    },
    view() {
      this.isShow = true;
    },
    getVipCount(ary) {
      let param = {
        shopId: '',
        memberRankIds: null
      };
      if (this.notice.noticeTarget === 'ToStore') {
        param.shopId = this.getUser.shop.id;
      } else if (this.notice.noticeTarget === 'ToMemberrank') {
        if (!ary || !ary.length) {
          return;
        }
        param.memberRankIds = ary.toString();
      }
      http
        .get('admin/member/count.jhtml', param)
        .then(data => {
          console.log(data);
          if (this.notice.noticeTarget === 'ToStore') {
            this.total = data.total;
          } else if (this.notice.noticeTarget === 'ToMemberrank') {
            this.rankTotal = data.total;
          }
        })
        .catch(error => {
          if (error.errorMessage) {
            console.log(error.errorMessage);
          }
        });
    }
  }
};
</script>

<style lang="scss">
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
      .title {
        width: 180px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
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
.promotion-dialog {
  width: 800px;
  height: 80%;
  padding: 20px;
  .biz-grid {
    top: 45px;
    height: 85%;
  }
  > .el-dialog__body {
    width: 100%;
    height: 98%;
    position: relative;
    flex-grow: 1;
    padding: 0;
  }
  .container {
    padding: 20px;
    margin: 20px;
    width: 100%;
    height: 100%;
  }
  .el-dialog__header {
    text-align: center;
  }
  .el-pagination {
    margin: 10px 0;
  }
  .dialog-footer {
    display: none;
  }
}
.rank-dialog {
  .content {
    min-height: 300px;
    height: 500px;
    overflow-y: auto;
    .vip-name {
      margin: 10px 0;
    }
    .vip-container {
      display: flex;
      flex-wrap: wrap;
      .vip {
        min-width: 110px;
        padding: 0 20px;
      }
    }
  }
  .el-dialog__footer {
    text-align: right;
  }
}
.promotion-notice {
  .biz-save-button {
    margin-top: 10px;
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 10px;
    .el-radio + .el-radio {
      // margin-left: 15px;
    }
    .preview-content {
      background-color: #f5f7fa;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 5px;
      line-height: 1.5;
      color: #c0c4cc;
      .custom-c {
        color: #606266;
      }
    }
    .nick-name-container {
      max-height: 60px;
      overflow: hidden;
      .nick-name-title {
        float: left;
        width: 100px;
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .color {
      color: #ff7300;
      cursor: pointer;
    }
    .nick-name-container-show {
      .nick-name-title {
        float: left;
        width: 100px;
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .btn-style {
      margin-right: 10px;
    }
  }
}
</style>
