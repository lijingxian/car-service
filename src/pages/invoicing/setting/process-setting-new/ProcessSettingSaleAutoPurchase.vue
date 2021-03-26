<template>
  <biz-grid class="process-s-auto">
    <div slot="top" class="popup">
      <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    </div>
    <el-form ref="form" label-width="120px" size="small" v-loading="loading" :model="formData">
      <el-form-item label="审批方式">
        <div slot="label">
          是否自动采购
          <el-button type="text" size="small" v-popover:UnionType>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="UnionType" placement="bottom-start" width="300" trigger="hover">
            <p>设置为自动采购后，系统将为您自动向供应商提交采购单，此种设置适用代销方式的门店；</p>
            <p>设置为人工采购，则需要相关人员手动创建采购单，适用直销方式的门店。</p>
          </el-popover>
        </div>
        <el-radio-group v-model="formData.way">
          <el-radio label="0">自动根据销售单向供应商提交采购单</el-radio>
          <el-radio label="1">人工手动向供应商采购</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </biz-grid>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';
import BizSaveButton from '@/components/BizSaveButton';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';
import service from '@/service/order-mgmt/orderMgmt';

export default {
  name: 'ApproveSettingBsae',
  components: {
    BizSaveButton,
    BizGrid
  },
  props: {
    idObject: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      addFormVisible: false,
      loading: false,
      isCreate: false,
      tableData: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      formData: {
        enabled: '0',
        billName: '',
        billType: '',
        way: '0'
      },
      rollList: [],
      rollDatas: [],
      roleName: ''
    };
  },
  computed: {},
  watch: {
    idObject(val) {
      if (val.id) {
        this.refresh();
        this.isCreate = false;
      } else {
        this.isCreate = true;
      }
    }
  },
  created() {
    this.queryRollList();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    refresh() {
      let params = {
        id: this.idObject.id,
        shopId: window.top.SHOP_ID || '',
        billAuditType: '5'
      };
      this.loading = true;
      http
        .get(urls.invoicing.approvalConfig, params)
        .then(data => {
          this.tableData = data.approvalConfigs.items.map((item, index) => {
            return {
              id: item.id,
              auditId: item.auditId,
              money: item.money,
              roleId: item.roleId,
              approver: {
                id: item.approver.id,
                name: item.approver.name
              },
              rollDatas: this.listAdminByRole(item.roleId, [item.roleType])
            };
          });
          console.log(this.tableData);
          this.formData.enabled = data.approvalConfigs.enabled;
          this.formData.way = data.approvalConfigs.way;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    roleChange(val, index) {
      let roleTypes = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (index === i && this.tableData[i].roleId === val) {
          this.tableData[i].approver.id = '';
        }
      }
      for (const roleList of this.rollList) {
        if (roleList.id === val) {
          roleTypes.push(roleList.type);
        }
      }
      this.listAdminByRole(val, roleTypes);
    },
    listAdminByRole(roleId, roleTypes) {
      service.listAdminByRole(
        { roleTypes: roleTypes },
        data => {
          this.loading = false;
          this.tableData.forEach(list => {
            if (list.roleId === roleId) {
              list.rollDatas = data.dataList;
            }
          });
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
        }
      );
    },
    queryRollList() {
      let params = {
        id: this.idObject.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/admin/json/getVisibleRoles.jhtml', params)
        .then(data => {
          this.rollList = data.allRoles;
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {});
    },
    addLevel() {
      this.isCreate = true;
      this.tableData.push({
        approver: { id: '' },
        auditId: '',
        id: '',
        level: '',
        money: '',
        roleId: '',
        roleName: '',
        rollDatas: [{ id: '', name: '' }]
      });
    },
    deleteRegion(ids, index) {
      this.tableData.splice(index, 1);
    },
    updateRegion() {
      this.itemDatas = this.tableData.map(item => {
        return {
          approver: { id: item.approver.id },
          auditId: item.auditId,
          id: item.id,
          level: item.level,
          money: item.money,
          roleId: item.roleId,
          roleName: item.roleName
        };
      });
      let params = {
        id: this.idObject.id,
        shopId: window.top.SHOP_ID || '',
        billName: this.formData.billName,
        enabled: this.formData.enabled,
        way: this.formData.way,
        items: this.itemDatas,
        billType: '5'
      };
      http
        .put(urls.invoicing.approvalConfig, params)
        .then(data => {
          this.$message.success('保存成功');
          this.refresh();
          this.$emit('item-updated');
        })
        .catch(ErrorData => {
          this.$message({
            message: ErrorData.errorMessage,
            type: 'warning'
          });
          console.log('ERR_REFRESH: ', ErrorData);
        })
        .finally(data => {
          this.loading = false;
        });
    },
    save() {
      let flag = false;
      this.errorMoney = '';
      this.tableData.forEach(item => {
        if (item.roleId === '') {
          this.$message.warning('请输入审批角色');
          flag = true;
        }
        if (item.approver.id === '') {
          this.$message.warning('请输入角色审批人');
          flag = true;
        }
        if (!item.money) {
          this.$message.warning('请输入审批金额');
          flag = true;
        }
      });
      if (flag) {
        return false;
      } else {
        this.updateRegion();
      }
    }
  }
};
</script>

<style lang="scss">
.process-s-auto {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-radio {
    padding: 10px;
  }
}
</style>
