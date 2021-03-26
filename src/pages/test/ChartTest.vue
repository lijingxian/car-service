<template>
  <div class='test-test'>
    <canvas id='canvas'></canvas>
  </div>
</template>

<script>
import http from '@/common/http';
import Tree from './tt';

export default {
  name: '',
  data() {
    return {
      loading: false,
      tree: null,
      data: []
    };
  },
  components: {
  },
  methods: {},
  async mounted() {
    let params = {
      // 功能范围: 0平台1运营商2店铺
      scope: ''
    };
    let res = await http.get('/admin/function/tree.jhtml', params);
    this.data = res.authorityList;
    this.tree = new Tree(this.data);
    this.tree.render();
  },
  created() {
  }
};
</script>

<style lang='scss'>
.test-test {
  height: 100%;
  padding: 100px;
  overflow: scroll;
}
</style>
