<template>
  <biz-grid class="terminal-mgmt-terminal__communication-info" v-loading="loading">
    <div>
      <biz-header slot="top" :operations="ruleTableOperations" @operate="operateHandler">
      </biz-header>
      <el-table size="small" :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
        <el-table-column type="selection" width="30">
        </el-table-column>
        <el-table-column label="通讯方式">
          <template slot-scope="scope">
            {{typeConverter(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column prop="protocol" label="通讯协议">
        </el-table-column>
        <el-table-column prop="standard" label="通讯标准">
        </el-table-column>
        <el-table-column prop="ip" label="通讯地址">
        </el-table-column>
        <el-table-column prop="title" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="mini" @click="rowEditClickHandler($event, scope.row)">
                编辑
              </el-button>
            </div>
            <div>
              <el-button type="text" size="mini" @click="rowDeleteClickHandler($event, scope.row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog class="box-card" :visible.sync="showRule" center append-to-body width="500px">
        <el-form ref="ruleForm" size="small" label-width="110px" :model="ruleModel" :rules="rules" :inline-message="true">
          <el-form-item label="通讯方式" prop="commType">
            <el-select v-model="ruleModel.commType" placeholder="请选择" style="width: 100%;" @change="commType">
              <el-option v-for="item in modeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通讯协议" prop="protocol">
            <el-select v-model="ruleModel.protocol" placeholder="请选择" style="width: 100%;" @change="protocol">
              <el-option v-for="item in protocolList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通讯标准" prop="standard">
            <el-select v-model="ruleModel.standard" placeholder="请选择" style="width: 100%;" @change="standard">
              <el-option v-for="item in standardList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通讯地址" prop="ip">
            <el-input placeholder="请输入通讯地址" v-model="ruleModel.ip" v-show="Number(ruleModel.commType) > 2 || !ruleModel.commType"></el-input>
            <el-select v-model="ruleModel.ip" filterable remote placeholder="请选择SIM卡" :remote-method="handleRemote" :loading="selectLoading"
              style="width: 100%;" v-show="Number(ruleModel.commType) < 3" @change="ipChange">
              <el-option v-for="item in simList" :key="item.iccid" :label="item.iccid" :value="item.iccid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <biz-save-button :operations="ruleOperations" @operate="operateHandler" style="margin-right: 0;">
        </biz-save-button>
      </el-dialog>
    </div>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import BizSaveButton from '@/components/BizSaveButton';

import service from '@/service/terminal-mgmt/CommunicationInfo';

export default {
  name: 'CommunicationInfo',
  components: {
    BizSaveButton,
    BizHeader,
    BizGrid
  },
  data() {
    return {
      loading: false,
      ruleTableOperations: [
        {
          label: '新增',
          name: 'addRuleOperate',
          type: 'primary',
          auth: ['caradmin:operateDevice.manage.edit']
        },
        {
          label: '删除',
          name: 'deleteRuleOperate',
          type: 'danger',
          auth: ['caradmin:operateDevice.manage.edit']
        }
      ],
      tableData: [],
      showRule: false,
      modeList: [],
      protocolList: [],
      standardList: [],
      ruleModel: this.getDefaultModel(),
      rules: {
        commType: [{ required: true, message: '请选择通信类型', trigger: 'blur' }],
        protocol: [{ required: true, message: '请选择通信协议', trigger: 'blur' }],
        standard: [{ required: true, message: '请选择通信标准', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      },
      ruleOperations: [
        {
          label: '取消',
          name: 'cancelRuleOperate'
        },
        {
          label: '保存',
          name: 'saveRuleOperate',
          type: 'primary'
        }
      ],

      simList: [],
      selectLoading: false
    };
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  created() {
    this.queryModeList();
    this.queryProtocolList();
    this.queryStandardList();
  },
  methods: {
    init() {
      if (this.itemId.id) {
        this.query();
      } else {
        this.tableData = [];
      }
    },
    ipChange() {
      this.$refs.ruleForm.clearValidate('ip');
    },
    standard() {
      this.$refs.ruleForm.clearValidate('standard');
    },
    protocol() {
      this.$refs.ruleForm.clearValidate('protocol');
    },
    commType() {
      this.$refs.ruleForm.clearValidate('commType');
    },
    typeConverter(row) {
      if (row.commType === '0') {
        return 'GPRS';
      } else if (row.commType === '1') {
        return '3G';
      } else if (row.commType === '2') {
        return '4G';
      } else if (row.commType === '3') {
        return 'BT';
      } else if (row.commType === '4') {
        return 'WIFI';
      } else if (row.commType === '5') {
        return 'LAN';
      } else {
        return '未知';
      }
    },
    query() {
      service.query(
        {
          terminalId: this.itemId.id,
          terminalTypeId: this.itemId.terminalTypeId
        },
        data => {
          this.tableData = data.data;

          // reset
          this.selections = [];
          this.showRule = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    querySimList(searchKey) {
      this.selectLoading = true;
      service.querySimList(
        {
          iccid: searchKey
        },
        data => {
          this.simList = data.content;

          this.selectLoading = false;
        },
        // result_code 不是100的处理
        ErrorData => {
          console.log(ErrorData);
          console.log('code错误');
        }
      );
    },
    queryModeList() {
      this.modeList = [
        {
          id: '20',
          name: '未知'
        },
        {
          id: '0',
          name: 'GPRS'
        },
        {
          id: '1',
          name: '3G'
        },
        {
          id: '2',
          name: '4G'
        },
        {
          id: '3',
          name: 'BT'
        },
        {
          id: '4',
          name: 'WIFI'
        },
        {
          id: '5',
          name: 'LAN'
        }
      ];
    },
    queryProtocolList() {
      this.protocolList = ['未知', 'TCP', 'UDP'];
    },
    queryStandardList() {
      this.standardList = ['未知', '非808', '808', '北斗2012'];
    },
    getSaveParams() {
      return {
        terminalTypeId: this.ruleModel.id ? undefined : this.itemId.terminalTypeId,
        terminalId: this.ruleModel.id ? undefined : this.itemId.id,
        id: this.ruleModel.id,
        commType: this.ruleModel.commType,
        protocol: this.ruleModel.protocol,
        standard: this.ruleModel.standard,
        ip: this.ruleModel.ip,
        macAddress: this.ruleModel.macAddress
      };
    },
    resetModel() {
      this.ruleModel = this.getDefaultModel();
    },
    getDefaultModel() {
      return {
        typeId: '',
        signId: '',
        macAddress: ''
      };
    },
    deleteRule(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.deleteRule(
          {
            ids: ids
          },
          data => {
            this.$message.success('删除成功');
            this.query();
          },
          // result_code 不是100的处理
          ErrorData => {
            this.$message.warning(ErrorData.errorMessage);
          }
        );
      });
    },

    operateHandler(name) {
      this[name]();
    },
    addRuleOperate() {
      this.resetModel();
      this.showRule = true;
      this.$refs.ruleForm.resetFields();
    },
    cancelRuleOperate() {
      this.showRule = false;
    },
    saveRuleOperate() {
      this.$refs.ruleForm.validate((valid, a) => {
        if (valid) {
          this.loading = true;
          if (this.ruleModel.id) {
            service.updateRule(
              this.getSaveParams(),
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.query();
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          } else {
            service.addRule(
              this.getSaveParams(),
              data => {
                this.loading = false;
                this.$message.success('保存成功');
                this.query();
              },
              // result_code 不是100的处理
              ErrorData => {
                this.loading = false;
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    deleteRuleOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteRule(ids);
      } else {
        this.$message('请选择一个规则进行删除');
      }
    },
    selectionChangeHandler(val) {
      this.selections = val;
    },
    rowDeleteClickHandler(e, model) {
      this.deleteRule([model.id]);
    },
    rowEditClickHandler(e, model) {
      this.ruleModel = Object.assign(this.getDefaultModel(), model);
      this.showRule = true;
      this.$refs.ruleForm.resetFields();
    },
    handleRemote(query) {
      if (query) {
        this.querySimList(query);
      } else {
        this.simList = [];
      }
    }
  },
  computed: {},
  watch: {
    itemId(nVal, oVal) {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.terminal-mgmt-terminal__communication-info {
  .biz-header .biz-header__operation-wrapper {
    justify-content: flex-start;
  }
  .biz-scroller {
    .box-card {
      margin-top: 20px;

      .el-card__body {
        padding: 20px 20px;
      }
    }
  }
}
</style>
