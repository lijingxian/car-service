<template>
  <div class="vehicle-mgmt__record-list">
    <template v-for="item in list">
      <div
        class="vehicle-mgmt__record-list_item"
        :key="item.id"
      >
        <img v-if="item.type === '0'" :src="item.picture" @click="handleClick($event, item)" />
        <video v-else :src="item.file" controls></video>
        <div class="content">
          <div class="date">{{item.beginTime}} <span v-if="!!item.endTime"> - {{item.endTime}}</span></div>
          <div class="address">{{item.beginAddress}} <span v-if="!!item.endAddress"> - {{item.endAddress}}</span></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'VehicleMgmtRecordList',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleClick (e, model) {
      window.open(model.picture);
    }
  }
};
</script>

<style lang="scss">
.vehicle-mgmt__record-list {

  .vehicle-mgmt__record-list_item {
    height: 110px;
    overflow: hidden;
    border: 1px solid #ebeef5;
    margin-bottom: 5px;

    img, video {
      float: left;
      width: 200px;
      min-height: 110px;
      background: #ebeef5;
      cursor: pointer;
    }

    .content {
      margin-left: 200px;
      padding: 15px 20px;
      font-size: 14px;
      color: #606060;

      .date {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
