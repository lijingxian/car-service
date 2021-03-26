<template>
  <div class="member-rights-card-view">
    <div class="no-content"
         v-if="cardList.length === 0"
         :style="styleObject"></div>
    <div class="category-list" v-for="(category,index) in cardList" :key="index">
      <div class="category-name">{{ category.name }}</div>
      <div class="rights_card" @click.stop="rightsIconHandeler">
        <div class="content" style="display:flex;flex-wrap:wrap">
          <div v-for="(rights,index) in category.rights" :key="index" style="border-radius: 5px;border: 1px solid #F1F1F2;width: 270px;height: 180px;line-height: 20px;padding:20px;margin:10px">
            <i class="del-btn el-icon-error" @click.stop="deleteRights"></i>
            <div class="logo">
              <div class="image" style="text-align:center;padding-left:20px">
                <img v-if="rights.logo" :src="rights.logo" style="width:60px;height:60px"/>
                <img v-else src="../../../../assets/images/icon_vip.png" style="width:60px;height:60px"/>
              </div>
              <div class="name" style="padding-top:10px;text-align:center;font-size:14px;color:#333333;font-weight:bold">
                {{rights.name}}
              </div>
              <div class="dec" style="text-align:left;padding-top:10px;font-size:12px">
                {{rights.description}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoContent from '@/assets/images/emptyGray.png';
export default {
  name: 'MemberRightsCardView',
  props: {
    cardList: Array
  },
  data() {
    return {};
  },
  methods: {
    rightsIconHandeler(model, e) {
      this.$emit('rightsIconHandeler', model);
    },
    deleteRights(model, e) {
      this.$emit('deleteRights', model);
    },
    operationSuccess() {
      this.$emit('create');
    }
  },
  computed: {
    styleObject() {
      return {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        background: 'url(' + NoContent + ') 50% 50% / 20% no-repeat'
      };
    }
  }
};
</script>

<style lang="scss">
.member-rights-card-view {
  display: flex;
  flex-wrap: wrap;
  // height: 100%;
  overflow: auto;
  .category-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .category-name {
    width: 100%;
    color: rgba(102, 102, 102, .75);
    font-size: 16px;
    font-weight: bold;
    line-height: 21px;
    margin: 20px 10px;
  }
  .del-btn {
    float: right;
    font-size: 16px;
    color: #d9d9d9;
  }
}
</style>
