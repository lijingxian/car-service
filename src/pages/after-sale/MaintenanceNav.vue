<template>
  <div class="maintenance-nav-page">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import MaintenanceRecords from '@/service/maintenance/maintenanceRecords';
import { mapGetters } from 'vuex';
export default {
  name: 'MaintenanceNav',
  data() {
    return {
      navData: {}
    };
  },
  computed: {
    ...mapGetters(['getUser']),
    cardData: function() {
      if (this.getUser.roleLevel === 'shop') {
        return [
          [
            {
              link: '/after-sale/booklet',
              title: '维护服务手册',
              content: '维护各个车型的服务手册',
              bottom: [
                {
                  content: '已有品牌',
                  value: this.navData.appointmentBrandCount,
                  unit: '个'
                },
                {
                  content: '已有系列',
                  value: this.navData.appointmentSeriesCount,
                  unit: '个'
                }
              ]
            }
          ],
          [
            {
              link: '/after-sale/appointment',
              title: '处理服务预约',
              content: '管理车辆维保预约记录',
              bottom: [
                {
                  content: '已有记录',
                  value: this.navData.appointmentCount,
                  unit: '条'
                },
                {
                  content: '今日新增记录',
                  value: this.navData.dayAppointmentCount,
                  unit: '条'
                },
                {
                  content: '预约到期记录',
                  value: this.navData.appointmentExpireCount,
                  unit: '条'
                }
              ]
            }
          ],
          [
            {
              link: '/after-sale/maintenance',
              title: '查看维保记录',
              content: '管理车辆维修保养记录',
              bottom: [
                {
                  content: '已有记录',
                  value: this.navData.maintainCount,
                  unit: '条'
                },
                {
                  content: '今日新增记录',
                  value: this.navData.dayMaintainCount,
                  unit: '条'
                }
              ]
            }
          ],
          [
            {
              link: '/after-sale/statistics-analysis/order',
              title: '数据洞察',
              content: '分析维保记录及预约记录'
            }
          ]
        ];
      } else {
        return [
          [
            {
              link: '/after-sale/booklet',
              title: '维护服务手册',
              content: '维护各个车型的服务手册',
              bottom: [
                {
                  content: '已有品牌',
                  value: this.navData.appointmentBrandCount,
                  unit: '个'
                },
                {
                  content: '已有系列',
                  value: this.navData.appointmentSeriesCount,
                  unit: '个'
                }
              ]
            }
          ]
        ];
      }
    }
  },
  components: {
    BizNavCard
  },
  methods: {
    getNavInfo() {
      let params = {
        shopId: window.top.SHOP_ID || ''
      };
      MaintenanceRecords.queryNavInfo(params, data => {
        this.navData = data.data;
      });
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.maintenance-nav-page {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
