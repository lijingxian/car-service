<template>
  <div class="rate-list">
    <div class="rate-item clearfix" v-for="(item, index) in innerList" :key="index">
      <p class="name">{{item.name}}</p>
      <div class="right">
        <el-input-number :step="0.5" size="small" v-model="item.score" @input="handleInput"></el-input-number>
        <el-button type="text" @click="handleClick(item, $event)"><i class="iconfont biz-icon-iconfontshanchu1"></i></el-button>
      </div>
    </div>
    <el-input placeholder="请输入标签名称" v-model="text" maxlength="20">
      <template slot="append">
        <el-button type="text" @click="handleAddClick">&nbsp;&nbsp;新增</el-button>
      </template>
    </el-input>
  </div>
</template>

<script>

export default {
  name: 'RateList',
  props: {
    value: {
      type: Array
    }
  },
  data () {
    return {
      innerList: [],
      text: ''
    };
  },
  methods: {
    checkIncluded (text) {
      let included = false;
      this.innerList.forEach(item => {
        if (item.name === text) included = true;
      });

      return included;
    },

    handleInput () {
      this.$emit('input', this.innerList);
    },
    handleClick (model, e) {
      let index = this.innerList.indexOf(model);
      this.innerList.splice(index, 1);

      this.handleInput();
    },
    handleAddClick () {
      let text = this.text;
      if (text !== '') {
        if (this.checkIncluded(text)) {
          this.$message.warning('该标签已存在');
        } else {
          this.innerList.push({ name: text, score: 0 });

          this.handleInput();
        }
        this.text = '';
      }
    }
  },
  watch: {
    value (val) {
      this.innerList = val;
      this.text = '';
    }
  }
};
</script>

<style lang="scss">
.rate-list {
  .rate-item {
    text-align: right;

    .name {
      float: left;
      width: 160px;
      text-align: left;
      margin: 0;
      margin-bottom: 15px;
      word-break: break-all;
    }

    .right {
      margin-left: 160px;
    }
  }
}
</style>
