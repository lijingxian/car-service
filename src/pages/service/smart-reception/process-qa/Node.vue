<template>
  <div class="process-node">
    <div class="operator-top">
      <i class="el-icon-close" @click="remove"></i>
    </div>
    <div class="p-wrap" @click="onCLick">
      <div class="question" v-show="nodeData.id">问：{{nodeData.question}}</div>
      <div class="answer" v-show="nodeData.id">答：{{answer}}</div>
      <div class="image" v-if="nodeData.type==='3'">
        <img :src="nodeData.answer" />
      </div>
      <div class="link" v-if="nodeData.type==='2'">{{nodeData.answer}}</div>
      <div class="audio" v-if="nodeData.type==='1002'">
        <audio :src="nodeData.answer" controls="controls"></audio>
      </div>
      <div class="richtext" v-if="nodeData.type==='1'" v-html="nodeData.answer"></div>
      <div class="goods" v-if="nodeData.type==='1001'">
        <div class="g-image">
          <img :src="(productList.length>0&&productList[0].image)||DefaultImg" />
        </div>
        <div class="name-zone">
          <div class="name">{{productName}}</div>
          <div class="name">{{productNumber}}</div>
        </div>
      </div>
      <div class="goods" v-if="nodeData.type==='1005'||nodeData.type==='1006'">
        <div class="g-image">
          <img :src="(activeAnswerList.length>0&&activeAnswerList[0].cover)||DefaultImg" />
        </div>
        <div class="name-zone">
          <div class="name">{{activeName}}</div>
        </div>
      </div>
    </div>
    <div class="bottom-line" :class="bottomStyle">
      <i class="el-icon-plus" @click="add"></i>
    </div>
    <q-a :flowId="flowId" :parenteId="parenteId" :itemObjId="itemObjId" :open="open" @close="open = false;" @refresh="refresh"></q-a>
  </div>
</template>

<script>
import QA from './QA';
import DefaultImg from '@/assets/images/commodity/pic_default_none_100.png';
import http from '@/common/http';
import { customerService, commodity } from '@/common/urls';

export default {
  name: 'node',
  components: {
    QA
  },
  props: {
    flowId: {
      type: String,
      default() {
        return '';
      }
    },
    nodeData: {
      type: Object,
      default() {
        return {};
      }
    },
    hasChild: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      DefaultImg: DefaultImg,
      parenteId: '',
      itemObjId: {
        id: ''
      },
      productList: [],
      activeAnswerList: [],
      open: false
    };
  },
  computed: {
    answer() {
      if (
        this.nodeData.type === '1' ||
        this.nodeData.type === '2' ||
        this.nodeData.type === '3' ||
        this.nodeData.type === '1001' ||
        this.nodeData.type === '1002' ||
        this.nodeData.type === '1005' ||
        this.nodeData.type === '1006'
      ) {
        return '';
      }
      return this.nodeData.answer;
    },
    bottomStyle() {
      return {
        'has-child': this.hasChild
      };
    },
    productName() {
      if (this.productList.length === 0) {
        return '';
      }
      return this.productList[0].name;
    },
    activeName() {
      if (this.activeAnswerList.length === 0) {
        return '';
      }
      return this.activeAnswerList[0].title;
    },
    productNumber() {
      if (this.productList.length === 1) {
        return '';
      }
      return `等${this.productList.length}件商品`;
    }
  },
  watch: {
    nodeData: {
      immediate: true,
      handler(nodeData) {
        if (nodeData.type === '1001') {
          this.getProduct();
        }
        if (nodeData.type === '1005' || nodeData.type === '1006') {
          this.queryActivesByIds();
        }
      }
    }
  },
  created() {},
  methods: {
    onCLick() {
      this.open = true;
      this.parenteId = this.nodeData.parenteId;
      if (this.nodeData.id) {
        this.itemObjId = { id: this.nodeData.id };
      } else {
        this.itemObjId = { id: '' };
      }
    },
    add() {
      this.itemObjId = { id: '' };
      this.parenteId = this.nodeData.id;
      this.open = true;
    },
    refresh() {
      this.$emit('refresh');
    },
    remove() {
      if (!this.nodeData.id) {
        return;
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        let params = {
          flowId: this.flowId,
          id: this.nodeData.id
        };
        http
          .delete(customerService.processQA.node, params)
          .then(data => {
            this.$message.success('删除成功');
            this.$emit('refresh');
          })
          .catch(errData => {
            if (errData.errorMessage) {
              this.$message.warning(errData.errorMessage);
            }
          })
          .finally(data => {
            this.loading = false;
          });
      });
    },
    getProduct() {
      console.log('getProduct');
      let promises = [];
      for (const id of this.nodeData.answer.split(',')) {
        let params = {
          id,
          shopId: window.top.SHOP_ID || ''
        };
        promises.push(http.get(commodity.queryProductBasicInfo, params));
      }
      Promise.all(promises).then(list => {
        this.productList = list.map(item => item.productBasicInfoData);
      });
    },
    // 根据ID查询活动
    queryActivesByIds() {
      http
        .post('/admin/marketing/activityList.jhtml', { ids: this.nodeData.answer.split(',') })
        .then(data => {
          this.activeAnswerList = data.activityList;
          // this.form.answer = this.activeAnswerList.map(item => item.id).join(',');
        })
        .catch();
    }
  }
};
</script>

<style lang="scss">
.process-node {
  font-size: 14px;
  color: #606266;
  padding: 0 10px 0 10px;
  position: relative;
  .operator-top {
    height: 20px;
    position: absolute;
    right: 15px;
    z-index: 2;
    text-align: right;
    color: #aaa;
    i {
      font-size: 16px;
      &:hover {
        color: #666;
      }
    }
  }
  .p-wrap {
    border-radius: 5px;
    width: 200px;
    height: 130px;
    border: 1px #d9d9d9 solid;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
    &:hover {
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.397);
    }
    .question {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-bottom: 5px;
      width: 100%;
    }
    .answer {
      width: 100%;
      white-space: normal;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
    .link {
      width: 100%;
      word-break: break-all;
      white-space: pre-wrap;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
    .image {
      width: 120px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .audio {
      width: 100%;
      height: 80px;
      audio {
        width: 100%;
      }
    }
    .richtext {
      width: 100%;
      height: 80px;
      white-space: normal;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }
    .goods {
      width: 100%;
      height: 80px;
      display: flex;
      .g-image {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .name-zone {
        margin-left: 5px;
        width: calc(100% - 50px);
        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
  .bottom-line {
    height: 19px;
    text-align: center;
    .el-icon-plus {
      padding: 1px;
      background-color: #aaa;
      border-radius: 50%;
      font-size: 16px;
      position: relative;
      top: -8px;
      color: #fff;
      &:hover {
        background-color: #666;
      }
    }
  }
  .has-child {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50%;
      height: 19px;
      border-right: 1px solid #ddd;
    }
  }
}
</style>
