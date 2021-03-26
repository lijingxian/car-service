<template>
  <div class="biz-index-kpi-bar">
    <div class="kpi-item" v-for="item in kpiData" :key="item.index">
      <div class="title">
        {{typeList[item.name].name}}
      </div>
      <div class="total">
        {{ total(item) }}
      </div>
      <div class="kpi">
        <p
          v-for="(list, key) in item"
          :key="list.index"
          v-if="key !== 'name' && totalArr.indexOf(key) === -1 && item[key] !== '' ||
                item.cardCount && item.totalMoney && key === 'totalMoney' ||
                item.totalMoney && item.totalCount && key === 'totalCount'"
        >
          {{ typeList[item.name][key] }}: {{ item[key] || 0 }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/common/http';

export default {
  name: 'BizIndexKpiBar',
  data () {
    return {
      url: '/admin/ecommerce/kpi/queryKpiData.jhtml',
      kpiData: [],
      typeList: {
        member: {
          name: '会员数',
          total: '累计用户数',
          dayIncrease: '用户新增数',
          dayActive: '活跃用户数',
          yesterdayIncrease: '昨日新增',
          weekActive: '活跃'
        },
        car: {
          name: '车辆数',
          total: '累计车辆数',
          dayIncrease: '新增车辆',
          online: '在线车辆',
          trouble: '问题车辆',
          totalFleet: '车队数',
          yesterdayIncrease: '昨日新增车辆'
        },
        store: {
          name: '店铺数',
          total: '累计店铺数',
          dayIncrease: '新增店铺',
          dayActive: '活跃店铺'
        },
        company: {
          name: '运营商',
          total: '累计运营商数',
          dayIncrease: '新增运营商',
          dayActive: '活跃运营商'
        },
        terminal: {
          name: '终端',
          total: '累计设备数',
          dayIncrease: '新增终端',
          totalValid: '有效终端',
          online: '在线终端'
        },
        sim: {
          name: 'Sim卡',
          total: '累计SIM卡',
          dayIncrease: '新增SIM卡',
          totalValid: '有效SIM卡'
        },
        order: {
          name: '订单',
          monthTotal: '本月累计订单',
          monthTotalAmount: '本月累计订单金额',
          dayIncrease: '今日订单',
          dayIncreaseAmount: '今日订单金额',
          monthSaleCar: '本月累计交车',
          daySaleCar: '今日交车',
          monthAfterSaleAmount: '本月售后产值',
          monthEnterFactoryCount: '进厂台次',
          monthExcellentAmount: '精品产值',
          dayRescueIncrease: '今日救援订单',
          totalIncrease: '总订单',
          totalIncreaseOrderAmount: '总订单金额',
          yesterdayIncrease: '昨日订单',
          yesterdayIncreaseAmount: '昨日订单金额'
        },
        product: {
          name: '商品',
          total: '商品累计数',
          monthTotal: '本月新增',
          dayIncrease: '今日新增',
          hotsale: '热销商品',
          unsalable: '滞销商品',
          lowStock: '低库存商品'
        },
        community: {
          name: '社区',
          totalInteraction: '互动数',
          dayInteraction: '今日互动数',
          yesterdayInteraction: '昨日新增帖子',
          totalTopic: '总话题数',
          yesterdayTopic: '昨日新增话题数'
        },
        fleet: {
          name: '车友会成员',
          total: '车友会数量',
          fleetMember: '成员数量',
          activeFleetMember: '活跃成员数',
          activityCount: '活动数',
          joinCount: '参与人次'
        },
        fleetActivity: {
          name: '车友会活动',
          monthTotal: '本月活动数',
          dayIncrease: '今日活动数',
          totalAttend: '活动参加人数'
        },
        content: {
          name: '公众号',
          totalArticle: '推送文章数',
          todayArticle: '今日文章数',
          articleReadCount: '阅读人数',
          totalAttend: '关注数',
          dayIncreaseAttend: '新增关注数',
          thisWeekAritcle: '本周文章数',
          thisWeekRead: '本周文章阅读数',
          thisWeekAttend: '本周新增关注数'
        },
        service: {
          name: '会话数',
          totalChat: '会话数量',
          chatLength: '会话时长(分)',
          todayChat: '今日会话',
          yesterdayChatLength: '昨日会话时长(分)',
          yesterdayChat: '昨日会话'
        },
        evaluateKpi: {
          name: '满意度',
          satisfaction: '满意度',
          skillSatisfaction: '技术满意度',
          serviceSatisfaction: '服务满意度',
          monthAdvice: '本月投诉数',
          monthSkillAdvice: '本月技术投诉数',
          monthServiceAdvice: '本月服务投诉数'
        },
        activity: {
          name: '活动',
          monthTotal: '本月活动数',
          dayIncrease: '今日活动数',
          totalAttend: '活动参与人数',
          totalCount: '总活动数',
          monthContinuedCount: '本月正在进行活动数',
          monthContinuedAttend: '活动参加人数',
          monthContinuedShared: '活动转发人数'
        },
        promotion: {
          name: '促销',
          monthTotal: '本月促销',
          dayIncrease: '今日促销',
          totalAmount: '促销金额',
          monthRunTotal: '本月正在进行的促销',
          monthRunAttend: '促销参与人数',
          monthRunShared: '促销转发次数'
        },
        coupon: {
          name: '优惠券',
          monthTotal: '本月优惠券发放量',
          monthRceived: '优惠券领取数',
          monthUsed: '优惠券使用数'
        },
        insurance: {
          name: '保险',
          monthAmount: '本月保险产值',
          monthIncreaseCount: '本月新车保险数',
          monthNewCarAmount: '本月新车保险金额'
        },
        potentialCustomer: {
          name: '有效客户数',
          monthTotalValid: '本月有效客户数',
          keepFileRate: '留档率',
          lbr: '成交率',
          signCount: '签约人数',
          todayIncreased: '今日新增人数',
          todaySignCount: '今日签约人数',
          todayDefeatCount: '今日战败人数',
          totalCount: '潜客总数',
          totalValid: '总有效客户数'
        },
        memberCard: {
          name: '会员卡',
          cardCount: '总数量',
          newYesterday: '昨日新增会员',
          totalMoney: '总储值',
          moneyYesterday: '昨日新增'
        },
        advice: {
          name: '售后投诉',
          totalCount: '总数量',
          skillAdviceCount: '技术投诉数',
          serverAdviceCount: '服务投诉数'
        },
        reception: {
          name: '客服接待',
          totalCount: '总接待数',
          todayCount: '今日接待数'
        },
        afterSale: {
          name: '售后产值',
          totalMoney: '总售后产值',
          yesterdayMoney: '昨日售后产值',
          monthCount: '本月进厂台次',
          totalCount: '总进厂台次',
          yesterdayCount: '昨日进厂台次'
        },
        offerCar: {
          name: '交车',
          totalSaledCount: '总交车数量',
          todayToSaleCount: '今日待交车数量'
        }
      },
      totalArr: ['total', 'totalIncrease', 'fleetMember', 'totalInteraction', 'totalAttend', 'totalChat', 'satisfaction', 'monthContinuedCount', 'monthRunTotal', 'monthTotal', 'monthAmount', 'totalValid', 'cardCount', 'totalMoney', 'totalCount', 'totalSaledCount']
    };
  },
  computed: {
  },
  components: {
  },
  methods: {
    typeName(item) {
      for (let arrItem of this.totalArr) {
        if (this.typeList[item.name][arrItem]) {
          return this.typeList[item.name][arrItem];
        }
      }
    },
    total(item) {
      for (let arrItem of this.totalArr) {
        if (item[arrItem]) {
          return item[arrItem];
        }
      }
    },
    queryKpiData() {
      http.get(this.url, {})
        .then(data => {
          this.kpiData = this.formatKpiData(data.statistics);
          // let kpiListTotal = {};
        })
        .catch();
    },
    formatKpiData(data) {
      let tmp = [];
      for (let name in data) {
        tmp.push(Object.assign({}, { name: name }, data[name]));
      }
      return tmp;
    }
  },
  mounted() {
    this.queryKpiData();
  }
};
</script>

<style lang="scss">
.biz-index-kpi-bar {
  display: flex;
  flex-wrap: wrap;
  .kpi-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px;
    width: 201px;
    min-height: 130px;
    background-color: #ccc;
  }
}
</style>
