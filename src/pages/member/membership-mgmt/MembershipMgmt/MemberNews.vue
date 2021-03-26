<template>
  <biz-grid class="member-rights" v-loading="loading">
    <div class="select-wrap">
      <label class="s-label">选择店铺</label>
      <el-select size="mini" v-model="shopId" @change="shopChange">
        <el-option v-for="item in shopOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <el-collapse v-model="activeTab">
      <el-collapse-item title="活跃情况" name="actvie">
        <div class="item">
          <div class="label">最近登录地址：</div>
          <div class="content">{{actvie.latestAddress}}</div>
        </div>
        <div class="item">
          <div class="label">最近登录时间：</div>
          <div class="content">{{actvie.latestTime}}</div>
        </div>
        <div class="item">
          <div class="label">活跃度标签：</div>
          <div class="content">{{actvie.activeTagNames}}</div>
        </div>
        <div class="item">
          <div class="label">本月登录次数：</div>
          <div class="content">{{actvie.monthLoginTimes||''}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="下单情况" name="order">
        <div class="item">
          <div class="label">下单总额：</div>
          <div class="content">{{order.amount}}</div>
        </div>
        <div class="item">
          <div class="label">下单数量：</div>
          <div class="content">{{order.total}}</div>
        </div>
        <div class="item">
          <div class="label">下单类型：</div>
          <div class="content">{{order.typeNames}}</div>
        </div>
        <div class="item">
          <div class="label">最近下单时间：</div>
          <div class="content">{{order.latestTime}}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="活动参与" name="activity">
        <div class="item">
          <div class="label">参与活动次数：</div>
          <div class="content">{{activity.attendTimes}}</div>
        </div>
        <div class="item">
          <div class="label">分享活动次数：</div>
          <div class="content">{{activity.shareTimes}}</div>
        </div>
        <div class="item">
          <div class="label">参与活动类型：</div>
          <div class="content">{{activity.typeNames}}</div>
        </div>
        <div class="item">
          <div class="label">最近参与时间：</div>
          <div class="content">{{activity.latestTime}}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import http from '@/common/http';
import { membershipMgmt } from '@/common/urls';
import { mapGetters } from 'vuex';

export default {
  name: 'MemberNews',
  props: {
    itemId: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BizGrid
  },
  data() {
    return {
      activeTab: ['actvie', 'order', 'activity'],
      activity: {
        attendTimes: '',
        shareTimes: '',
        typeNames: '',
        latestTime: ''
      },
      actvie: {
        latestAddress: '',
        latestTime: '',
        activeTagNames: '',
        monthLoginTimes: ''
      },
      order: {
        amount: '',
        total: '',
        typeNames: '',
        latestTime: ''
      },
      shopId: '',
      shopOptions: [],
      loading: false
    };
  },
  created() {
    this.getShopList();
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  watch: {
    itemId: {
      handler(itemId) {
        this.shopId = this.currentUser.shop.id;
        this.getNews();
      }
    }
  },
  mounted() {},
  methods: {
    getNews() {
      this.loading = true;
      let params = {
        userId: this.itemId.userId,
        shopId: this.shopId
      };
      http
        .get(membershipMgmt.memberNews, params)
        .then(data => {
          this.activity = data.data.activity;
          this.actvie = data.data.actvie;
          this.order = data.data.order;
        })
        .catch(errData => {})
        .finally(() => {
          this.loading = false;
        });
    },
    getShopList() {
      http
        .get(membershipMgmt.mainPage.shopList, {
          shopId: window.top.SHOP_ID || '',
          sourceType: '5'
        })
        .then(data => {
          this.shopOptions = data.shops;
          this.$nextTick(() => {
            this.shopId = this.currentUser.shop.id;
            this.getNews();
          });
        })
        .catch(errData => {});
    },
    shopChange() {
      this.getNews();
    }
  }
};
</script>

<style lang="scss">
.member-rights {
  padding: 20px;
  .item {
    display: flex;
    .label {
      flex-shrink: 0;
      width: 180px;
      text-align: right;
    }
    .content {
      color: #ff7300;
    }
  }
}
</style>
