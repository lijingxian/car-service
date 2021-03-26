<template>
  <biz-grid class="portrait-preference">
    <el-form ref="form" :model="form" label-width="100px" size="small" v-loading="loading" :inline-message="true">
      <el-form-item label="活跃度标签" prop="activeTagNames">
        <el-input placeholder="请选择活跃度标签" v-model="form.activeTagNames" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="参与活动次数" prop="attendTimes">
        <el-input placeholder="请输入参与活动次数" disabled v-model="form.attendTimes"></el-input>
      </el-form-item>
      <el-form-item label="分享活动次数" prop="shareTimes">
        <el-input placeholder="请输入分享活动次数" disabled v-model="form.shareTimes"></el-input>
      </el-form-item>
      <el-form-item label="参与活动类型" prop="typeNames">
        <el-input placeholder="请输入参与活动类型" disabled v-model="form.typeNames"></el-input>
      </el-form-item>
      <el-form-item label="最近参与时间" prop="latestTime">
        <el-input placeholder="请输入最近参与时间" disabled v-model="form.latestTime"></el-input>
      </el-form-item>
      <el-form-item label="最近浏览商品" prop="productResults">
        <div v-for="(item,index) in form.productResults" :key="index" v-if="index<5">
          <el-button type="text" size="mini" @click="clickProduct($event, item)" v-if="item.target_name">
            <span style="white-space:normal">{{ item.target_name? item.target_name : '' }}</span>
          </el-button>
        </div>
        <div v-if="form.productResults.length>5" style="font-size:12px;color:#ff7300;cursor:pointer" @click="moreResults">...更多</div>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" width="550px">
      <div style="display: flex;flex-wrap: wrap;justify-content: space-between;padding:10px">
        <div v-for="(item,index) in form.productResults" :key="index" style="width:220px">
          <el-button type="text" size="mini" @click="clickProduct($event, item)">
            <span style="white-space:normal">{{ item.target_name? item.target_name : '' }}</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import { membershipMgmt } from '@/common/urls';
import http from '@/common/http';

export default {
  name: 'portrait-preference',
  components: {
    BizGrid
  },
  props: {},
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        activeTagNames: '',
        attendTimes: '',
        shareTimes: '',
        typeNames: '',
        latestTime: '',
        productResults: []
      }
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    ...mapGetters('SessionOnline', ['activatedRoom'])
  },
  watch: {
    activatedRoom() {
      this.getNews();
    }
  },
  mounted() {},
  created() {},
  methods: {
    moreResults() {
      this.dialogVisible = true;
    },
    getNews() {
      this.loading = true;
      let params = {
        userId: this.activatedRoom.id,
        shopId: this.getUser.shop.id
      };
      http
        .get(membershipMgmt.memberNews, params)
        .then(data => {
          let typeNames = '';
          this.loading = false;
          typeNames = data.data.activity.typeNames.replace(/^\s*|\s*$/g, '');
          this.form.typeNames = typeNames.replace(/\s+|&nbsp;/ig, '/');
          this.form.activeTagNames = data.data.actvie.activeTagNames;
          this.form.attendTimes = data.data.activity.attendTimes;
          this.form.shareTimes = data.data.activity.shareTimes;
          this.form.latestTime = data.data.activity.latestTime;
          this.form.productResults = data.data.productResults;
        })
        .catch(errData => {})
        .finally(() => {
          this.loading = false;
        });
    },
    clickProduct(e, row) {
      this.$emit('showProduct', row);
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss">
.portrait-preference {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-form {
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    padding-right: 20px;
  }
  .el-select {
    margin-top: 18px;
  }
  .el-form-item__content > :first-child {
    margin-top: 0;
  }
  .transition-box {
    margin-top: 10px;
  }
  .el-checkbox-group .el-checkbox {
    width: 165px;
    margin: 0;
    .el-checkbox__label {
      width: 140px;
      white-space: normal;
    }
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin-bottom: 8px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
}
</style>
