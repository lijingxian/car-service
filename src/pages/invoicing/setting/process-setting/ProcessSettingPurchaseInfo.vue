<template>
  <biz-grid class="process-p-bsae">
    <div slot="top" class="popup">
      <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    </div>
    <el-form ref="form" label-width="120px" size="small" v-loading="loading" :model="formData">
      <el-form-item label="审批方式">
        <div slot="label">
          审批方式
          <el-button type="text" size="small" v-popover:UnionType>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="UnionType" placement="bottom-start" width="300" trigger="hover">
            <p>系统审批：申请单提交后自动审批通过</p>
            <p>人工审批：申请单提交后需要按审批设置进行逐级审批</p>
          </el-popover>
        </div>
        <el-radio-group v-model="formData.way">
          <el-radio label="0">系统审批</el-radio>
          <el-radio label="1">人工审批</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批流程" v-if="formData.way==='1'"></el-form-item>

      <div v-if="formData.way==='1'">
        <el-steps direction="vertical">
          <el-step v-for="(list,index) in tableData" :key="index">
            <div slot="description" class="stepItem">
              <el-form>
                <el-form-item prop="roleId">
                  <el-select v-model="list.roleId" placeholder="请选择可进行审批的角色" @change="roleChange(list.roleId,index)">
                    <el-option v-for="item in rollList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                  <div style="float:right;">
                    <el-button type="text" @click="deleteRegion(list.id, index)">
                      <i class="iconfont biz-icon-iconfontshanchu1"></i>
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item prop="approver">
                  角色审批人
                  <el-select v-model="list.approver.id" placeholder="请选择可进行审批的角色">
                    <el-option v-for="item in list.rollDatas" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="money">
                  审批金额标准>=
                  <el-input v-model="list.money" placeholder="请输入金额" style="width:215px;"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-step>
        </el-steps>
        <div v-if="this.tableData.length<6">
          <!-- <div class="line">
            <i class="line-inner"></i>
          </div>-->
          <div class="addButton"
            style="cursor: pointer;width: 20px;height: 20px;border-radius: 50%;background: #333;color: #fff;font-size: 15px;line-height: 18px;text-align: center;z-index: 2;">
            <i class="el-icon-plus" @click.stop="addLevel" size="small"></i>
          </div>
        </div>
      </div>
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
        billType: '1'
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
              role: { id: item.roleId },
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
        role: { id: '' },
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
          role: { id: item.roleId },
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
        billType: '1'
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
.process-p-bsae {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-step.is-vertical .el-step__main {
    padding-bottom: 10px;
  }
  .stepItem {
    .el-form-item {
      margin-bottom: 50px;
    }
    .el-form-item__content {
      position: absolute;
    }
  }
  .el-form-item.isRequired .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
  .popup {
    display: -webkit-box;
    float: right;
  }
  .line {
    border-color: inherit;
    margin-left: 10px;
    line-height: 140px;
    .line-inner {
      border-left-style: solid;
      border-left-width: 2px;
      border-left-color: #c0c4cc;
    }
  }
}
</style>
