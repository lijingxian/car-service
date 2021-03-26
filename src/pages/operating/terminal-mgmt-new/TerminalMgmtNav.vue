<template>
  <div class="terminal-mgmt-nav">
    <biz-nav-card :cardData="cardData"></biz-nav-card>
  </div>
</template>

<script>
import BizNavCard from '@/components/BizNavCard';
import service from '@/service/terminal-mgmt/TerminalMgmtNav';
import { mapGetters } from 'vuex';
export default {
  name: 'TerminalMgmtNav',
  data() {
    return {
      terminalCount: '0',
      configuredCount: '0',
      normalUseCount: '0',
      terminalTypeCount: '0',
      lprTerminalCount: '',
      lprConfiguredCount: '',
      lprNormalUseCount: ''
    };
  },
  computed: {
    cardData: function() {
      if (this.getUser().roleLevel === 'shop') {
        return [
          [
            {
              link: '/operating/terminal-mgmt/terminal-type/11/LPR',
              title: '添加终端设备',
              content: '添加需要的终端设备基本参数，为设备分配运营商',
              bottom: [
                {
                  content: '终端设备数量',
                  value: this.terminalCount,
                  unit: '个'
                }
              ]
            }
          ],
          [
            {
              link: '/operating/terminal-mgmt/terminal-type/11/LPR',
              title: '配置终端设备',
              content:
                '配置设备通讯方式、通讯协议、通讯标准和通讯地址，保证设备正常使用',
              bottom: [
                {
                  content: '已配置设备数量',
                  value: this.configuredCount,
                  unit: '个'
                },
                {
                  content: '正常使用设备数',
                  value: this.normalUseCount,
                  unit: '个'
                }
              ]
            }
          ]
        ];
      } else {
        return [
          [
            {
              link: '/operating/terminal-mgmt/terminal-type',
              title: '创建终端分类',
              content: '添加需要的终端设备基本参数，为设备分配运营商',
              bottom: [
                {
                  content: '终端类型数量',
                  value: this.terminalTypeCount,
                  unit: '个'
                }
              ]
            }
          ],
          [
            {
              link: '/operating/terminal-mgmt/terminal-type',
              title: '配置终端能力',
              content:
                '配置设备通讯方式、通讯协议、通讯标准和通讯地址，保证设备正常使用'
            }
          ],
          [
            {
              link: '/operating/terminal-mgmt/terminal-type/1/2GOBD',
              title: '添加终端设备',
              content: '添加需要的终端设备基本参数，为设备分配运营商',
              bottom: [
                {
                  content: '终端设备数量',
                  value: this.terminalCount,
                  unit: '个'
                }
              ]
            }
          ],
          [
            {
              link: '/operating/terminal-mgmt/terminal-type/1/2GOBD',
              title: '配置终端设备',
              content:
                '配置设备通讯方式、通讯协议、通讯标准和通讯地址，保证设备正常使用',
              bottom: [
                {
                  content: '已配置设备数量',
                  value: this.configuredCount,
                  unit: '个'
                },
                {
                  content: '正常使用设备数',
                  value: this.normalUseCount,
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
    ...mapGetters(['getUser']),
    getNavInfo() {
      let params = {};
      service.query(
        params,
        data => {
          this.terminalCount = data.data.terminalCount;
          this.configuredCount = data.data.configuredCount;
          this.normalUseCount = data.data.normalUseCount;
          this.terminalTypeCount = data.data.terminalTypeCount;
          this.lprTerminalCount = data.data.lprTerminalCount;
          this.lprConfiguredCount = data.data.lprConfiguredCount;
          this.lprNormalUseCount = data.data.lprNormalUseCount;
        },
        ErrorData => {
          console.log('ERR_GET_INFO: ', ErrorData);
        }
      );
    }
  },
  mounted() {
    this.getNavInfo();
  }
};
</script>

<style lang="scss">
.terminal-mgmt-nav {
  height: 100%;
  overflow: auto;
  padding: 30px 50px;
}
</style>
