<template>
  <div class="cs-roll-out">
    <div class="cs-list">
      <div class="cs">
        <el-radio-group v-model="csId">
          <el-radio :label="cs.id" v-for="cs of csList" :key="cs.id">{{cs.name}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-select v-model="reason" size="small">
      <el-option v-for="option in reasonOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
    </el-select>
    <div class="footer">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="confirmed">确定</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import IoService from '@/service/customer-service/session-online/imIo';
export default {
  name: 'RollOut',
  data() {
    return {
      reason: '',
      csId: '',
      reasonOptions: [
        {
          label: '错拍重拍漏拍',
          value: '0'
        },
        {
          label: '退款退货问题',
          value: '1'
        },
        {
          label: '换货问题',
          value: '2'
        },
        {
          label: '修改地址',
          value: '3'
        },
        {
          label: '修改发票',
          value: '4'
        },
        {
          label: '物流问题',
          value: '5'
        }
      ]
    };
  },
  props: {},
  computed: {
    ...mapGetters('CustomService', ['csList', 'activatedRoom']),
    ...mapGetters(['currentUser'])
  },
  watch: {},
  methods: {
    ...mapMutations('CustomService', ['updateTabType', 'removeRoom']),
    cancel() {
      this.updateTabType({ tabType: '' });
    },
    confirmed() {
      if (this.reason === '') {
        this.$message({
          showClose: true,
          message: '请选择原因',
          type: 'warning'
        });
        return;
      }
      if (this.csId === '') {
        this.$message({
          showClose: true,
          message: '请选择转出人',
          type: 'warning'
        });
        return;
      }
      let reasonName = '';
      for (const iterator of this.reasonOptions) {
        if (iterator.value === this.reason) {
          reasonName = iterator.label;
          break;
        }
      }
      IoService.dispatcherRollOut(
        {
          reasonValue: this.reason,
          reasonName: reasonName,
          head: this.activatedRoom.head,
          name: this.activatedRoom.name,
          from: {
            id: this.currentUser.id,
            name: this.currentUser.name
          },
          csId: this.csId,
          clientId: this.activatedRoom.id
        },
        result => {
          if (result) {
            this.$message({
              showClose: true,
              message: '转出成功',
              type: 'success'
            });
            this.updateTabType({ tabType: '' });
            this.$nextTick(() => {
              this.removeRoom({
                imType: 'client',
                id: this.activatedRoom.id
              });
            });
          } else {
            this.$message({
              showClose: true,
              message: '转出失败，所选客服不在线',
              type: 'warning'
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="scss">
.cs-roll-out {
  .el-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .el-radio {
      margin: 15px 0 0 35px;
    }
  }
  .el-select {
    margin: 15px 0 15px 30px;
  }
  .footer {
    margin: 15px 0 15px 30px;
  }
}
</style>
