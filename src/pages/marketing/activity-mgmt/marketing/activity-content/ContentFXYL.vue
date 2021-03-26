<template>
  <biz-grid class="content-fxyl">
    <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit">
    </biz-save-button>
    <el-form :rules="rules" ref="form" :model="content" label-width="100px" size="small" v-loading="loading" :disabled="!isEdit">
      <el-form-item label="会员等级">
        <rank-item :rankData="rankData" ref="rank"></rank-item>
      </el-form-item>
      <el-form-item label="奖励限制" prop="maxAwardTimes">
        <el-input-number :min="min" placeholder="请输入奖励限制" v-model="content.maxAwardTimes"></el-input-number>
      </el-form-item>
      <el-form-item label="推荐内容类型">
        <el-select v-model="content.shareType" @change="typeChange" placeholder="请选择推荐内容类型">
          <el-option :label="typeObject.label" v-for="(typeObject,index) of contentTypeList" :key="index" :value="typeObject.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐内容">
        <el-input placeholder="请输入内容标题" @focus="selectActivity" v-model="content.shareContent"></el-input>
      </el-form-item>
      <!-- <el-form-item label="链接地址" prop="product">
        <el-input disabled type="textarea" v-model="url"></el-input>
      </el-form-item> -->

      <el-form-item label="活动规则">
        <el-input placeholder="请输入活动规则" type="textarea" v-model="content.desc"></el-input>
      </el-form-item>
    </el-form>

    <biz-dialog-selector title="选择营销活动" :visibility.sync="showActivitySelector" :tableData="activityTableData" :pagination="activityPagination"
      :selectionMode="'single'" @pageSizeChange="activityPageSizeChange" @currentPageChange="activityCurrentPageChange"
      @confirmed="confirmedActivity" :filters="activityFilters" @filterDataChange="activityFilterDataChange">
      <el-table-column prop="title" label="活动名称">
      </el-table-column>
      <el-table-column prop="type" :formatter="getActivityType" label="活动类型">
      </el-table-column>
      <el-table-column prop="state" :formatter="getActivityStatus" label="状态">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺">
      </el-table-column>
    </biz-dialog-selector>

    <biz-dialog-selector title="选择商品" :visibility.sync="showProductSelector" :tableData="productTableData" :pagination="productPagination"
      :selectionMode="'single'" @pageSizeChange="productPageSizeChange" @currentPageChange="productCurrentPageChange" @confirmed="confirmedProduct"
      :filters="productFilters" @filterDataChange="productFilterDataChange">
      <el-table-column prop="sn" label="商品信息">
        <template slot-scope="scope">
          <div class="dialog-column">
            <div style="width:100%">
              <div>编号：{{scope.row.sn}}</div>
              <div>{{scope.row.name}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryType" :formatter="getProductType" label="分类">
      </el-table-column>
      <el-table-column prop="price" label="价格">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺">
      </el-table-column>
    </biz-dialog-selector>

    <biz-dialog-selector title="选择VR" :visibility.sync="showVRSelector" :tableData="VRTableData" :pagination="VRPagination"
      :selectionMode="'single'" @pageSizeChange="VRPageSizeChange" @currentPageChange="VRCurrentPageChange" @confirmed="confirmedVR"
      :filters="VRFilters" @filterDataChange="VRFilterDataChange">
      <el-table-column width="200" prop="title" label="标题">
      </el-table-column>
      <el-table-column width="200" prop="fileName" label="文件名称">
      </el-table-column>
      <el-table-column prop="filePath" label="文件路径">
      </el-table-column>
    </biz-dialog-selector>

    <biz-dialog-selector title="车友会活动" :visibility.sync="showMASelector" :tableData="MATableData" :pagination="MAPagination"
      :selectionMode="'single'" @pageSizeChange="MAPageSizeChange" @currentPageChange="MACurrentPageChange" @confirmed="confirmedMA"
      :filters="MAFilters" @filterDataChange="fleetCircleFilterDataChange">
      <el-table-column width="200" prop="title" label="标题">
      </el-table-column>
      <el-table-column prop="address" label="地点">
      </el-table-column>
      <el-table-column prop="shop.name" label="店铺">
      </el-table-column>
      <el-table-column prop="beginDate" label="时间">
      </el-table-column>
    </biz-dialog-selector>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import Service from '@/service/activity-mgmt/marketing/activity-content/activityContent';
import BizSaveButton from '@/components/BizSaveButton';
import motoristsClubActivityService from '@/service/motorists-club-activity/motoristsClubActivity';
import baseinfoService from '@/service/recommend-mgmt/baseInfo';
import BizDialogSelector from '@/components/BizDialogSelector';
import RankItem from './RankItem';

export default {
  name: 'ContentFXYL',
  data() {
    return {
      min: 1,
      loading: false,
      dialogVisible: false,
      activity: {},
      rankData: {
        memberRankList: this.memberRankList,
        publishTarget: '0',
        memberRanks: [],
        members: []
      },
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          auth: ['admin:activity.edit']
        }
      ],
      contentTypeList: [
        {
          label: '营销活动',
          value: '0'
        },
        {
          label: '商品',
          value: '1'
        },
        {
          label: '店铺VR',
          value: '2'
        },
        {
          label: '车友会活动',
          value: '3'
        }
      ],
      content: {
        id: '',
        type: '5',
        memberRanks: [],
        shareType: '0',
        path: '',
        maxAwardTimes: '',
        desc: ''
      },
      // 营销活动
      showActivitySelector: false,
      activityTableData: [],
      activityPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      activityFilters: [
        {
          type: 'input',
          placeholder: '请输入活动名称',
          name: 'searchbar',
          value: ''
        }
      ],
      // 商品
      showProductSelector: false,
      productTableData: [],
      productPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      productFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入商品名称',
          name: 'searchValue',
          value: ''
        }
      ],
      // VR
      showVRSelector: false,
      VRTableData: [],
      VRPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 9
      },
      VRFilters: [
        {
          type: 'input',
          placeholder: '请输入标题',
          name: 'searchbar',
          value: ''
        }
      ],
      // 车友会活动
      showMASelector: false,
      MATableData: [],
      MAPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      MAFilters: [
        {
          type: 'input',
          placeholder: '请输入活动名称',
          name: 'searchbar',
          value: ''
        }
      ],
      rules: {
        maxAwardTimes: [
          { required: true, message: '请输入奖励限制', trigger: 'blur' }
        ]
      }
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
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  created() {},
  computed: {
    url() {
      return (
        window.location.origin +
        '/resources/admin/ecStatic/index.html#/eve_recommend/' +
        this.content.id
      );
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
          for (const iterator of this.content.memberRanks) {
            if (iterator.id === vip.id) {
              vip.checked = true;
            }
          }
        }
      }

      return memberRankList;
    }
  },
  components: {
    BizGrid,
    BizSaveButton,
    BizDialogSelector,
    RankItem
  },
  methods: {
    operate(name) {
      this[name]();
    },
    vipChange(val) {
      if (val.checked) {
        this.content.memberRanks.forEach((element, index) => {
          if (element.id === val.id) {
            this.content.memberRanks.splice(index, 1);
          }
        });
      } else {
        this.content.memberRanks.push({ id: val.id });
      }
    },
    typeChange() {
      this.content.shareContent = '';
      this.content.shareId = '';
    },
    refresh(activity) {
      this.activity = activity;
      let params = {
        id: this.activity.id
      };
      Service.getActivityContent(
        params,
        data => {
          this.content.id = data.activity.id;
          this.content.type = data.activity.type;
          this.content.shareId = data.activity.shareId;
          this.content.shareType = data.activity.shareType;
          this.content.shareContent = data.activity.shareContent;
          this.content.path = data.activity.path;
          this.content.maxAwardTimes = data.activity.maxAwardTimes;
          this.content.desc = data.activity.desc;
          this.content.memberRanks = data.activity.memberRanks || [];
          this.rankData.publishTarget = data.activity.publishTarget;
          this.rankData.memberRanks = data.activity.memberRanks ? data.activity.memberRanks : [];
          this.rankData.members = data.activity.members ? data.activity.members : [];
          if (this.rankData.publishTarget === '0') {
            this.$refs.rank.getVipCount();
          }
          if (this.rankData.memberRanks.length) {
            this.$refs.rank.memberRankHandle();
          }
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;
        this.$refs.rank.clearData();
        let params = {
          type: this.content.type,
          id: this.content.id,
          shareType: this.content.shareType,
          shareId: this.content.shareId,
          shareContent: this.content.shareContent,
          maxAwardTimes: this.content.maxAwardTimes,
          desc: this.content.desc,
          publishTarget: this.rankData.publishTarget,
          memberRanks: this.rankData.memberRanks,
          members: this.rankData.members
        };
        Service.updateActivityContent(
          params,
          data => {
            this.$message.success('更新成功');
            this.loading = false;
            this.$emit('created');
          },
          ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },
    selectActivity() {
      switch (this.content.shareType) {
        case '0':
          this.showActivitySelector = true;
          this.getActivityList();
          break;
        case '1':
          this.showProductSelector = true;
          this.getProducts();
          break;
        case '2':
          this.showVRSelector = true;
          this.getVRs();
          break;
        case '3':
          this.showMASelector = true;
          this.getMAList();
          break;
        default:
          break;
      }
    },
    // 营销
    getActivityList() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        activityType: '-1',
        pageable: {
          pageNumber: this.activityPagination.currentPage,
          pageSize: this.activityPagination.pageSize,
          searchValue: this.activityFilters[0].value
        }
      };
      baseinfoService.getActivitiess(
        params,
        data => {
          this.activityPagination.total = Number(data.total);
          this.activityTableData = data.content;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    activityCurrentPageChange(val) {
      this.activityPagination.currentPage = val;
      this.getActivityList();
    },
    activityPageSizeChange(val) {
      this.activityPagination.pageSize = val;
      this.getActivityList();
    },
    activityFilterDataChange(val) {
      this.activityPagination.pageSize = 1;
      this.getActivityList();
    },
    confirmedActivity(val, innerSelection) {
      this.content.shareId = innerSelection[0].id;
      this.content.shareContent = innerSelection[0].title;
    },
    getActivityStatus(row) {
      switch (row.state) {
        case '0':
          return '未开始';
        case '1':
          return '进行中';
        case '2':
          return '已结束';
        case '3':
          return '已创建';
        default:
          break;
      }
    },
    getActivityType(row) {
      switch (row.type) {
        case '0':
          return '抢红包';
        case '1':
          return '摇一摇';
        case '2':
          return '抽奖';
        case '3':
          return '拼团购';
        case '4':
          return 'N元抢购';
        case '5':
          return '秒杀';
        case '6':
          return '帮砍价';
        case '7':
          return '推荐有礼';
        case '8':
          return '分享有礼';
        case '9':
          return '活动招募';
        default:
          break;
      }
    },
    // 商品
    getProducts() {
      let params = {
        searchValue: this.productFilters[0].value,
        shopId: window.top.SHOP_ID || '',
        type: '0',
        pageNumber: this.productPagination.currentPage,
        pageSize: this.productPagination.pageSize
      };
      baseinfoService.getProducts(
        params,
        data => {
          this.productPagination.total = Number(data.total);
          this.productTableData = data.content;
        },
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    productPageSizeChange(val) {
      this.productPagination.pageSize = val;
      this.getProducts();
    },
    productCurrentPageChange(val) {
      this.productPagination.currentPage = val;
      this.getProducts();
    },
    productFilterDataChange() {
      this.productPagination.currentPage = 1;
      this.getProducts();
    },
    confirmedProduct(val, innerSelection) {
      this.content.shareId = innerSelection[0].id;
      this.content.shareContent = innerSelection[0].fullName;
    },
    getProductType(row) {
      switch (row.productType) {
        case '0':
          return '普通商品';
        case '1':
          return '兑换商品';
        case '2':
          return '赠品';
        case '3':
          return 'sim充值';
        case '4':
          return '平台服务';
        default:
          break;
      }
    },
    // VR
    VRPageSizeChange(val) {
      this.VRPagination.pageSize = val;
      this.getVRs();
    },
    VRCurrentPageChange(val) {
      this.VRPagination.currentPage = val;
      this.getArticles();
    },
    VRFilterDataChange() {
      this.VRPagination.currentPage = 1;
      this.getVRs();
    },
    confirmedVR(val, innerSelection) {
      this.content.shareId = innerSelection[0].id;
      this.content.shareContent = innerSelection[0].title;
    },
    getVRs() {
      let params = {
        shopId: window.top.SHOP_ID || '',
        searchValue: this.VRFilters[0].value,
        pageNumber: this.VRPagination.currentPage,
        pageSize: this.VRPagination.pageSize
      };
      baseinfoService.getVRs(
        params,
        data => {
          this.VRPagination.total = Number(data.total);
          this.VRTableData = data.vrList;
        },
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    // 车友会活动
    getMAList() {
      let params = {
        pageable: {
          searchValue: this.MAFilters[0].value,
          pageNumber: this.MAPagination.currentPage,
          pageSize: this.MAPagination.pageSize
        }
      };

      motoristsClubActivityService.getActivityList(
        params,
        data => {
          this.MAPagination.total = Number(data.total);
          this.MATableData = data.content;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    MAPageSizeChange(val) {
      this.MAPagination.pageSize = val;
      this.getMAList();
    },
    MACurrentPageChange(val) {
      this.MAPagination.currentPage = val;
      this.getMAList();
    },
    fleetCircleFilterDataChange() {
      this.MAPagination.currentPage = 1;
      this.getMAList();
    },
    confirmedMA(val, innerSelection) {
      this.content.shareId = innerSelection[0].id;
      this.content.shareContent = innerSelection[0].title;
    }
  }
};
</script>

<style lang="scss">
.content-fxyl {
  .biz-save-button {
    margin-top: 10px;
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-bottom: 20px;
    padding-right: 30px;
    .vip-level {
      .vip-container {
        display: flex;
        flex-wrap: wrap;
        .vip {
          min-width: 110px;
        }
      }
    }
  }
}
</style>
