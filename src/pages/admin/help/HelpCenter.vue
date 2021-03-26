<template>
  <div class="help-center">
    <div class="content">
      <div class="top">
        <div class="title">推荐文章</div>
        <div class="main" v-for="(article,index) of recommendArticles" :key="index" v-if="index<4">
          <div style="padding-top: 15px;padding-bottom:15px;cursor: pointer;" @click.stop="articleDetail(article)">
            <img src="../../../assets/images/activity-default/help_default.png" style="width:193px;height:97px"/>
            <div style="font-size: 14px;color:#3F3F3F;padding-top:15px">{{article.title}}</div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="title">运营课堂
            <span style="color:#3F3F3F;font-size:14px;padding-left: 30px;">{{operationClass.length}}篇文章</span>
          </div>
          <div class="main" v-for="(operate,index) of operationClass" :key="index" v-if="index<5" style="padding:10px 0px">
            <div style="font-size: 14px;color:#3F3F3F;cursor: pointer;" @click.stop="operateDetail(operate)">
              <i class="el-icon-arrow-right"></i>{{operate.title}}</div>
          </div>
          <el-button size="small" type="text" v-if="operationClass.length>5" @click="moreOperate">更多</el-button>
        </div>
        <div class="right">
          <div class="title">常见问题
            <span style="color:#3F3F3F;font-size:14px;padding-left: 30px;">{{commonProblem.length}}篇文章</span>
          </div>
          <div class="main" v-for="(problem,index) of commonProblem" :key="index" v-if="index<5" style="padding:10px 0px">
            <div style="font-size: 14px;color:#3F3F3F;cursor: pointer;" @click.stop="problemDetail(problem)">
              <i class="el-icon-arrow-right"></i>{{problem.title}}</div>
          </div>
          <el-button size="small" type="text" v-if="commonProblem.length>5" @click="moreProblem">更多</el-button>
        </div>
      </div>
    </div>
    <div slot="float">
      <biz-popup-tabs :open="openDetail" v-model="tabName" @close="openDetail=false">
      <el-tab-pane label="详情" name="detail">
        <base-info :form="form"></base-info>
      </el-tab-pane>
    </biz-popup-tabs>
    </div>
    <el-dialog :visible.sync="operateVisible" :append-to-body="true" width="550px">
      <div style="padding:10px">
        <div v-for="(item,index) in operationClass" :key="index">
          <div style="font-size: 14px;color:#3F3F3F;padding: 5px;cursor: pointer;" @click="operateDetail(item)">
              <i class="el-icon-arrow-right"></i>{{item.title}}</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="problemVisible" :append-to-body="true" width="550px">
      <div style="padding:10px">
        <div v-for="(item,index) in commonProblem" :key="index">
          <div style="font-size: 14px;color:#3F3F3F;padding: 5px;cursor: pointer;" @click.stop="problemDetail(item)">
              <i class="el-icon-arrow-right"></i>{{item.title}}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '@/common/http';
import { BizPopupTabs } from '@/components/BizPopup';
import BaseInfo from './BaseInfo';

export default {
  name: 'HelpCenter',
  data () {
    return {
      recommendArticles: [],
      operationClass: [],
      commonProblem: [],
      operateVisible: false,
      problemVisible: false,
      tabName: 'detail',
      openDetail: false,
      form: {}
    };
  },
  computed: {},
  components: { BizPopupTabs, BaseInfo },
  methods: {
    queryArticles() {
      let params = {
        helpCenterTypeString: '0'
      };
      http
        .get('/admin/article/helpCenterListArticles.jhtml', params)
        .then(data => {
          this.loading = true;
          this.recommendArticles = data.content;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    queryOperate() {
      let params = {
        helpCenterTypeString: '1'
      };
      http
        .get('/admin/article/helpCenterListArticles.jhtml', params)
        .then(data => {
          this.loading = true;
          this.operationClass = data.content;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    queryProblem() {
      let params = {
        helpCenterTypeString: '2'
      };
      http
        .get('/admin/article/helpCenterListArticles.jhtml', params)
        .then(data => {
          this.loading = true;
          this.commonProblem = data.content;
        })
        .catch(errData => {
          this.loading = false;
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    moreOperate() {
      this.operateVisible = true;
    },
    moreProblem() {
      this.problemVisible = true;
    },
    operateDetail(row) {
      this.form = row;
      this.tabName = 'detail';
      this.openDetail = true;
      this.operateVisible = false;
    },
    problemDetail(row) {
      this.form = row;
      this.tabName = 'detail';
      this.openDetail = true;
      this.problemVisible = false;
    },
    articleDetail(row) {
      this.form = row;
      this.tabName = 'detail';
      this.openDetail = true;
      this.problemVisible = false;
      this.operateVisible = false;
    }
  },
  mounted() {},
  created() {
    this.queryArticles();
    this.queryOperate();
    this.queryProblem();
  }
};
</script>

<style lang="scss">
.help-center {
  height: 500px;
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  .content {
    width: 100%;
    .top {
      margin-bottom: 20px;
      .title {
        color: #101010;
        font-size: 16px;
        text-align: left;
        padding-bottom: 10px;
        border-bottom: #A2A1A1 solid 2px;
      }
    }
    .bottom {
      display: flex;
      .left {
        width: 50%;
        padding-right: 40px;
        .title {
          color: #101010;
          font-size: 16px;
          text-align: left;
          padding-bottom: 10px;
          border-bottom: #A2A1A1 solid 2px;
        }
      }
      .right {
        width: 50%;
        padding-left:40px;
        .title {
          color: #101010;
          font-size: 16px;
          text-align: left;
          padding-bottom: 10px;
          border-bottom: #A2A1A1 solid 2px;
        }
      }
    }
  }
}
</style>
