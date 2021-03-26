<template>
  <biz-grid class="member-care-mgmt">
    <div slot="top">
      <div class="member-mgmt-top">
        <biz-header :operations="operations" @operate="operate" :filters="filters" @filterDataChange="filterDataChange">
        </biz-header>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <member-care-card-view :memberCareList="memberCareList" @refresh="refresh" @click="rowClick" @delete="cardDelete">
      </member-care-card-view>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openPopup" v-model="popupTabName" @close="openPopup = false;">
        <el-tab-pane label="关怀卡信息" name="baseinfo">
          <member-base-info ref="baseInfo" :memberRankList="initInfo.memberRankList" @refresh="refresh" :itemId="itemId">
          </member-base-info>
        </el-tab-pane>
        <el-tab-pane v-if="itemId.id" label="发放人群" name="dispath">
          <rank-item ref="rank" :rankData="rankData"></rank-item>
        </el-tab-pane>
        <el-tab-pane v-if="itemId.id" label="会员通知" name="notice">
          <member-notice ref="notice" :itemId="itemId"></member-notice>
        </el-tab-pane>
        <el-tab-pane v-if="itemId.id" label="关怀样式" name="css">
           <content-site ref="activityContent"></content-site>
        </el-tab-pane>
        <el-tab-pane v-if="itemId.id" label="发放记录" name="record">
          <refueling-record ref="record" :itemId="itemId"></refueling-record>
        </el-tab-pane>
      </biz-popup-tabs>
      <biz-popup-tabs :open="openCategoryPopup" v-model="categoryTabName" @close="openCategoryPopup = false;">
        <el-tab-pane name="category" label="分类管理">
          <category-mgmt ref="category"></category-mgmt>
        </el-tab-pane>
      </biz-popup-tabs>
    </div>
  </biz-grid>
</template>

<script>
import { BizHeader } from '@/components/BizTable';
// import date from '@/utils/date';
import http from '@/common/http';
import urls from '@/common/urls';
import { mapGetters } from 'vuex';
import RankItem from './components/RankItem';
import { BizGrid } from '@/components/BizGrid';
import MemberCareCardView from './MemberCareCardView';
import CategoryMgmt from '@/pages/member/member-care-mgmt/care-card-category/CategoryMgmt';
import { BizPopupTabs } from '@/components/BizPopup';
import MemberBaseInfo from './MemberBaseInfo';
import MemberNotice from './MemberNotice';
import RefuelingRecord from './RefuelingRecord';
import ContentSite from './ContentSite';
export default {
  name: 'MemberCareMgmt',
  data() {
    return {
      itemId: { id: '' },
      loading: false,
      activeActivity: {},
      initInfo: {
        memberRankList: []
      },
      orderProperty: '',
      orderDirection: '',
      height: '100%',
      isCreated: false,
      popupTabName: 'baseinfo',
      categoryTabName: 'category',
      openPopup: false,
      openCategoryPopup: false,
      editShopIds: [],
      isEdit: true,
      shopList: [],
      memberCareList: [],
      multipleSelection: [],
      rankData: {
        id: '',
        target: '0',
        members: [],
        memberRanks: []
      },
      operations: [
        {
          label: '新增',
          name: 'create',
          type: 'primary',
          auth: ['admin:member.memberCare.care.add']
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        },
        {
          label: '分类管理',
          name: 'careCardCategory',
          type: ''
        }
      ],
      filters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入关怀卡名称',
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
    BizPopupTabs,
    MemberBaseInfo,
    MemberCareCardView,
    MemberNotice,
    RefuelingRecord,
    RankItem,
    ContentSite,
    CategoryMgmt
  },
  created() {
    this.refresh();
  },
  mounted() {
    this.popupTabName = 'baseinfo';
  },
  watch: {},
  computed: {},
  methods: {
    ...mapGetters(['getUser']),
    create() {
      this.popupTabName = 'baseinfo';
      this.itemId = { id: '' };
      this.$set(this.rankData, 'target', '0');
      this.$set(this.rankData, 'members', []);
      this.$set(this.rankData, 'memberRanks', []);
      this.openPopup = true;
      this.openCategoryPopup = false;
    },
    careCardCategory() {
      this.openPopup = false;
      this.openCategoryPopup = true;
    },
    refresh(id) {
      if (id) {
        this.itemId = { id };
      }
      this.getList();
    },
    operate(name) {
      this[name]();
    },
    filterDataChange() {
      this.getList();
    },
    rowClick(id) {
      this.popupTabName = 'baseinfo';
      this.itemId = { id };
      http
        .get(urls.memberCareMgmt.memberCare, { id: id })
        .then(data => {
          const { target, members, memberRanks } = data.data;
          this.rankData.target = target;
          this.rankData.members = members;
          this.rankData.memberRanks = memberRanks;
          this.rankData.id = id;
          if (this.rankData.target === '0') {
            this.$refs.rank.getVipCount();
          } else if (this.rankData.memberRanks.length) {
            this.$refs.rank.memberRankHandle();
          }
          this.$refs.activityContent.refresh({ id: id });
          this.openPopup = true;
          this.openCategoryPopup = false;
        })
        .catch();
    },
    cardDelete(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: [id]
        };
        http
          .delete(urls.memberCareMgmt.memberCare, params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refresh();
          })
          .catch(ErrorData => {
            this.$message({
              type: 'warning',
              message: ErrorData.errorMessage
            });
          });
      });
    },
    // 去掉内容中的标签及图片/视频
    formatContent(content) {
      let tmp = content.replace(/<script[^>]*?>.*<\/script>/g, '');
      tmp = tmp.replace(/<style[^>]*?>.*<\/style>/g, '');
      tmp = tmp.replace(/<[^>]+>/g, '');
      tmp = tmp.replace(/\\&[a-zA-Z]{1,10};/g, '');
      return tmp;
    },
    // 获取列表
    getList() {
      this.loading = true;
      const searchValue = this.filters[0].value;
      const shopId = (this.getUser.shop && this.getUser.shop.id) || window.top.SHOP_ID || '';
      let params = {
        shopId,
        pageNumber: 1,
        pageSize: 1000,
        searchValue
      };
      http
        .get(urls.memberCareMgmt.careCardList, params)
        .then(data => {
          this.loading = false;
          this.memberCareList = data.dataList;
          for (const item of data.dataList) {
            if (item.type === '0' && item.description === '') {
              item.description = '此关怀卡是对会员生日的关怀，在会员生日前将卡内的福利发放给会员。';
            } else if (item.type === '1' && item.description === '') {
              item.description = '此关怀卡是对老会员累计消费的回馈关怀，在会员累计消费满一定金额时将该卡内的福利发放给会员。';
            } else if (item.type === '2' && item.description === '') {
              item.description = '此关怀卡是对新注册会员的关怀，在会员注册并登陆时将该卡内的福利发放给会员。';
            } else if (item.type === '3' && item.description === '') {
              item.description = '此关怀卡是对会员车辆保养提醒的关怀，在保养快到期时将该卡内的福利发放给会员。';
            } else if (item.type === '4' && item.description === '') {
              item.description = '此关怀卡是对会员车辆续保提醒的关怀，在保险快到期时将该卡内的福利发放给会员。';
            } else if (item.type === '5' && item.description === '') {
              item.description = '次关怀卡是该指定日期对会员的关怀，在该日期时将卡内的福利发放给会员。';
            } else {
            }
          }
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.member-care-mgmt {
  padding: 5px 0px 5px 15px !important;
  .content {
    height: 100%;
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
