<template>
  <div class="scrollt-t">
    <biz-scroll-load :on-reach-top="handleReachTop"
                     :on-reach-bottom="handleReachBottom">
      <div class="b-bb">
        <el-button v-for="(dataa,index) of dataList"
                   :key="index">{{dataa.label}}</el-button>
      </div>
    </biz-scroll-load>
  </div>
</template>

<script>
import { BizScrollLoad } from '@/components/BizScrollLoad';

export default {
  name: 'ScrollTest',
  data() {
    return {
      dataList: [
        {
          label: '123'
        },
        {
          label: '123等我染发1'
        },
        {
          label: '12撒旦法3'
        },
        {
          label: '12他如果3'
        },
        {
          label: '12格瑞特3'
        },
        {
          label: '1地方是23'
        },
        {
          label: '123'
        },
        {
          label: '123等我染发'
        },
        {
          label: '12撒旦法3'
        },
        {
          label: '12他如果3'
        },
        {
          label: '12格瑞特3'
        },
        {
          label: '1地方是23'
        }
      ]
    };
  },
  props: {},
  components: { BizScrollLoad },
  computed: {},
  watch: {},
  methods: {
    handleReachTop() {
      return new Promise(resolve => {
        setTimeout(() => {
          this.dataList.unshift({
            label: new Date().toString()
          });
          resolve();
        }, 1000);
      });
    },
    handleReachBottom() {
      return new Promise(resolve => {
        setTimeout(() => {
          this.dataList.push({
            label: new Date().toString()
          });
          resolve();
        }, 1000);
      });
    }
  }
};
</script>

<style lang="scss">
.scrollt-t {
  .b-bb {
    display: flex;
    flex-direction: column;
  }
}
</style>
