<template>
  <biz-grid class="recommend-mgmt" v-loading="loading">
    <div class="recommend-setting">
      <div class="rec-select-con">
        <span class="title">客户端推荐算法配置</span>
        <div class="select-con">
          <span class="label">个性化资讯推荐算法运行时机</span>
          <el-select v-model="personalInfoRecommendTime" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in recommendRunTime" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">个性化资讯推荐列表显示数目</span>
          <el-select v-model="personalInfoRecommendCount" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in listLength" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">相关资讯更新时间</span>
          <el-select v-model="relativeInfoUpdateTime" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in listUpdateTime" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">相关资讯列表长度</span>
          <el-input v-model="relativeInfoListLength" class="news-list-length"></el-input>
        </div>
        <div class="select-con">
          <span class="label">个性化商品推荐算法运行时机</span>
          <el-select v-model="personalProductRecommendTime" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in recommendRunTime" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">个性化商品推荐列表显示数目</span>
          <el-select v-model="personalProductRecommendCount" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in listLength" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">相似商品更新时间</span>
          <el-select v-model="similarProductUpdateTime" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in listUpdateTime" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">相似商品列表长度</span>
          <el-input v-model="similarProductListLength" class="news-list-length"></el-input>
        </div>
        <div class="select-con">
          <span class="label">相关商品更新时间</span>
          <el-select v-model="relativeProductUpdateTime" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in listUpdateTime" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">相关商品列表长度</span>
          <el-input v-model="relativeProductListLength" class="news-list-length"></el-input>
        </div>
      </div>
      <div slot="bottom" class="bottom-button">
        <biz-header :operations="operationTop" @operate="operate">
        </biz-header>
      </div>
      <div class="rec-select-con">
        <span class="title">客户端排序规则</span>
        <div class="select-con">
          <span class="label">个性化资讯列表排序规则</span>
          <el-select v-model="personalInfoOrderType" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in listOrderType" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
        <div class="select-con">
          <span class="label">个性化商品列表排序规则</span>
          <el-select v-model="personalProductOrderType" placeholder="请选择" filterable class="rec-select" @change="workTimeChange">
            <el-option v-for="(item,index) in listOrderType" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </div>
      </div>
      <div slot="bottom" class="bottom-button">
        <biz-header :operations="operationBottom" @operate="operate">
        </biz-header>
      </div>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import http from '@/common/http';
import urls from '@/common/urls';

export default {
  name: 'recommend-mgmt',
  data() {
    return {
      loading: false,
      operationTop: [
        {
          label: '恢复默认',
          name: 'topRestore',
          type: 'primary'
        },
        {
          label: '保存',
          name: 'topSave',
          type: 'primary'
        }
      ],
      operationBottom: [
        {
          label: '恢复默认',
          name: 'bottomRestore',
          type: 'primary'
        },
        {
          label: '保存',
          name: 'bottomSave',
          type: 'primary'
        }
      ],
      personalInfoRecommendTime: '',
      personalInfoOrderType: '',
      personalInfoRecommendCount: '',
      relativeInfoUpdateTime: '',
      relativeInfoListLength: '',
      personalProductRecommendTime: '',
      personalProductRecommendCount: '',
      similarProductUpdateTime: '',
      similarProductListLength: '',
      relativeProductUpdateTime: '',
      relativeProductListLength: '',
      personalProductOrderType: '',
      recommendRunTime: [],
      listUpdateTime: [],
      listLength: [],
      listOrderType: []
    };
  },
  props: {},
  components: { BizGrid, BizHeader },
  computed: {},
  watch: {},
  methods: {
    topRestore() {
      this.restore('top');
    },
    topSave() {
      this.save('top');
    },
    bottomRestore() {
      this.restore('bottom');
    },
    bottomSave() {
      this.save('bottom');
    },
    restore(type) {
      let param;

      if (type === 'top') {
        param = {
          personalInfoRecommendTime: '每天',
          personalInfoRecommendCount: '50',
          relativeInfoUpdateTime: '每周',
          relativeInfoListLength: '12',
          personalProductRecommendTime: '每天',
          personalProductRecommendCount: '50',
          similarProductUpdateTime: '每周',
          similarProductListLength: '12',
          relativeProductUpdateTime: '每周',
          relativeProductListLength: '12'
        };
      } else if (type === 'bottom') {
        param = {
          personalInfoOrderType: '0',
          personalProductOrderType: '1'
        };
      }

      http
        .put(urls.systemSetting.querySystemSetting, param)
        .then(data => {
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('refreshNotification');
          this.getSettings();
        })
        .catch(error => {
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
    save(type) {
      let param;

      this.loading = true;
      if (type === 'top') {
        param = {
          personalInfoRecommendTime: this.personalInfoRecommendTime,
          personalInfoRecommendCount: this.personalInfoRecommendCount,
          relativeInfoUpdateTime: this.relativeInfoUpdateTime,
          relativeInfoListLength: this.relativeInfoListLength,
          personalProductRecommendTime: this.personalProductRecommendTime,
          personalProductRecommendCount: this.personalProductRecommendCount,
          similarProductUpdateTime: this.similarProductUpdateTime,
          similarProductListLength: this.similarProductListLength,
          relativeProductUpdateTime: this.relativeProductUpdateTime,
          relativeProductListLength: this.relativeProductListLength
        };
      } else if (type === 'bottom') {
        param = {
          personalInfoOrderType: this.personalInfoOrderType === '轮询原则' ? '0' : '1',
          personalProductOrderType: this.personalProductOrderType === '轮询原则' ? '0' : '1'
        };
      }

      http
        .put(urls.systemSetting.querySystemSetting, param)
        .then(data => {
          this.loading = false;
          this.$message({
            title: '成功',
            message: '更新成功',
            type: 'success'
          });
          this.$emit('refreshNotification');
        })
        .catch(error => {
          this.$message({
            title: '警告',
            message: error.errorMessage,
            type: 'warning'
          });
        })
        .finally(() => {});
    },
    operate(name) {
      this[name]();
    },
    workTimeChange() {},
    getSettings() {
      this.loading = true;
      let param = {
        type: '4'
      };

      http
        .get(urls.systemSetting.settings, param)
        .then(data => {
          this.loading = false;
          console.log('推荐配置', data);
          this.recommendRunTime = data.recommendRunTime;
          this.listUpdateTime = data.listUpdateTime;
          this.listLength = data.listLength;
          this.listOrderType = data.listOrderType;
          this.setting(data);
        })
        .catch(() => {})
        .finally(() => {});
    },
    setting(data) {
      this.personalInfoRecommendTime = data.settingList.personalInfoRecommendTime;
      this.personalInfoRecommendCount = data.settingList.personalInfoRecommendCount;
      this.relativeInfoUpdateTime = data.settingList.relativeInfoUpdateTime;
      this.relativeInfoListLength = data.settingList.relativeInfoListLength;
      this.personalProductRecommendTime = data.settingList.personalProductRecommendTime;
      this.personalProductRecommendCount = data.settingList.personalProductRecommendCount;
      this.similarProductUpdateTime = data.settingList.similarProductUpdateTime;
      this.similarProductListLength = data.settingList.similarProductListLength;
      this.relativeProductUpdateTime = data.settingList.relativeProductUpdateTime;
      this.relativeProductListLength = data.settingList.relativeProductListLength;
      // this.personalInfoOrderType = data.settingList.personalInfoOrderType;
      // this.personalProductOrderType = data.settingList.personalProductOrderType;

      // this.personalInfoRecommendTime = this.recommendRunTime[parseInt(data.settingList.personalInfoRecommendTime)].name;
      // this.personalInfoRecommendCount = this.listLength[parseInt(data.settingList.personalInfoRecommendCount)].name;
      // this.relativeInfoUpdateTime = this.listUpdateTime[parseInt(data.settingList.relativeInfoUpdateTime)].name;
      // this.relativeInfoListLength = data.settingList.relativeInfoListLength;
      // this.personalProductRecommendTime = this.recommendRunTime[parseInt(data.settingList.personalProductRecommendTime)].name;
      // this.personalProductRecommendCount = this.listLength[parseInt(data.settingList.personalProductRecommendCount)].name;
      // this.similarProductUpdateTime = this.listUpdateTime[parseInt(data.settingList.similarProductUpdateTime)].name;
      // this.similarProductListLength = data.settingList.similarProductListLength;
      // this.relativeProductUpdateTime = this.listUpdateTime[parseInt(data.settingList.relativeProductUpdateTime)].name;
      // this.relativeProductListLength = data.settingList.relativeProductListLength;
      this.personalInfoOrderType = this.listOrderType[parseInt(data.settingList.personalInfoOrderType)].name;
      this.personalProductOrderType = this.listOrderType[parseInt(data.settingList.personalProductOrderType)].name;
    }
  },
  created() {
    this.getSettings();
  }
};
</script>

<style lang="scss">
.recommend-mgmt {
  .recommend-setting {
    color: #606266;
    font-size: 14px;
    .rec-select-con {
      .title {
        display: block;
        margin: 40px 0 0 40px;
      }
      .select-con {
        display: flex;
        align-items: center;
        margin: 20px 0 0 100px;
        .label {
          display: block;
          margin-right: 20px;
        }

        .el-input,
        .el-select,
        .el-input__inner {
          width: 220px;
          height: 32px;
          line-height: 32px;
        }
      }
    }

    .bottom-button {
      padding: 20px 0 0 550px;
    }
  }
}
</style>
