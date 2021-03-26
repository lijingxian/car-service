<template>
  <div class="help-base-info">
    <div class="title">{{form.title}}</div>
    <div class="image" v-if="form.category&&form.category.name==='推荐文章'">
      <img src="../../../assets/images/activity-default/help_default.png"/>
    </div>
    <div class="content">{{form.content}}</div>
  </div>
</template>

<script>

export default {
  name: 'AboutUs',
  data () {
    return {};
  },
  props: {
    form: {
      type: Object
    }
  },
  computed: {},
  components: {},
  methods: {},
  mounted() {}
};
</script>

<style lang="scss">
.help-base-info {
  padding: 10px;
  .title {
    font-size: 18px;
    color: #101010;
    padding: 10px;
  }
  .image {
    padding-left: 10px;
    padding-right: 10px;
    img {
      width: 460px;
      height: 232px;
    }
  }
  .content {
    font-size: 14px;
    color: #101010;
    padding: 10px;
  }
}
</style>
