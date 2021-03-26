<template>
  <biz-grid class="shipping-setting-info">
    <div slot="top" class="popup">
      <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    </div>
    <el-form ref="form" label-width="80px" size="small" v-loading="loading" :model="formData" :rules="rules" :inline-message="true">
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="formData.name" placeholder="发货流程"></el-input>
      </el-form-item>
      <el-form-item label="流程描述">
        <el-input v-model="formData.memo" placeholder="请输入" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="流程设置">
        <span style="font-size:12px">点击流程各节点可进行对应流程的设置，黄色字体的为可进行设置的节点</span>
      </el-form-item>
      <div class="image">
        <img :src="fhlc">
        <div class="step2" @click.stop="step2Click">发货</div>
      </div>
      <div class="content">
        <el-form-item label="发货顺序" prop="subType" class="isRequired">
          <el-radio-group v-model="formData.configs[1].way">
            <el-radio label="0">付款前发货</el-radio>
            <el-radio label="1">付款后发货</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用对象" prop="object1" class="isRequired">
          <div class="object" v-for="(item,index) in formData.configs[1].items" :key="item.id">
            <div class="index">{{index+1}}</div>
            <el-cascader :options="serviceDatas" :props="cascaderProps" v-model="item.ids" @active-item-change="getChildList">
            </el-cascader>
            <i class="el-icon-delete" @click.stop="deleteRow(item)" size="small"></i>
          </div>
          <div class="addButton">
            <i class="el-icon-plus plus-cs" @click.stop="addRow" size="small"></i>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </biz-grid>
</template>

<script>
import http from '@/common/http';
import urls from '@/common/urls';
import BizSaveButton from '@/components/BizSaveButton';
import fhlc from '@/assets/images/process/07.png';
import { BizGrid } from '@/components/BizGrid';
import { mapGetters } from 'vuex';

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
    let validateSubType = (rule, value, callback) => {
      if (!this.formData.configs[1].way) {
        callback(new Error('请选择发货顺序'));
      } else {
        callback();
      }
    };
    let validateObject1 = (rule, value, callback) => {
      if (this.formData.configs[1].items.length === 0 || this.formData.configs[1].items[0].ids.length === 0) {
        callback(new Error('请选择适用对象'));
      } else {
        callback();
      }
    };
    return {
      addFormVisible: false,
      loading: false,
      isCreate: false,
      serviceDatas: [],
      cascaderProps: {
        label: 'label',
        value: 'value',
        children: 'children'
      },
      fhlc: fhlc,
      step1: true,
      step2: false,
      tableData: [],
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ],
      formData: this.getDefaultModel(),
      rollList: [],
      rollDatas: [],
      roleName: '',
      rules: {
        name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
        subType: [
          { required: false, message: '请选择发货方式', trigger: 'change' },
          { validator: validateSubType, trigger: 'change' }
        ],
        object1: [
          { required: false, message: '请选择适用对象', trigger: 'change' },
          { validator: validateObject1, trigger: 'change' }
        ]
      }
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
        this.formData = this.getDefaultModel();
      }
    }
  },
  created() {
    this.queryagencyList();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    stateChange(val) {
      if (val === '0') {
        this.formData.configs[1].way = '1';
      } else {
        this.formData.configs[1].items = this.formData.configs[0].items;
      }
    },
    getChildList(value) {
      let obj;
      let params = {
        cooperationId: value[0],
        cooperationType: 1,
        pageSize: 1000
      };
      http
        .get('/admin/cooperationInfo/admins.jhtml', params)
        .then(data => {
          this.serviceDatas.forEach(element => {
            if (element.value === value[0]) {
              element.children = [{ label: '全部', value: '' }];
              data.dataList.forEach(item => {
                obj = {};
                obj.label = item.name;
                obj.value = item.id;
                element.children.push(obj);
              });

              return false;
            }
          });
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    deleteRow(row) {
      this.formData.configs[1].items.splice(this.formData.configs[1].items.indexOf(row), 1);
    },
    addRow() {
      this.formData.configs[1].items.push({
        approver: { id: '', name: '' },
        auditId: '',
        ids: [''], // 店铺，角色，管理员id的集合
        id: '',
        money: '0',
        role: {
          id: '',
          name: '',
          type: ''
        },
        shop: {
          id: '',
          name: '',
          type: ''
        }
      });
    },
    step1Click() {
      this.$refs.form.clearValidate();
      this.step1 = true;
      this.step2 = false;
    },
    step2Click() {
      this.$refs.form.clearValidate();
      if (this.formData.configs[0].state === '1') {
        this.step2 = true;
      } else {
        return false;
      }
      this.step1 = false;
    },
    getDefaultModel() {
      return {
        name: '',
        memo: '',
        type: '3',
        configs: [
          {
            billName: '提交订单',
            billType: '31',
            flowId: '',
            id: '',
            items: [
              {
                approver: { id: '', name: '' },
                auditId: '',
                ids: [''], // 店铺，角色，管理员id的集合
                id: '',
                money: '0',
                role: {
                  id: '',
                  name: '',
                  type: ''
                },
                shop: {
                  id: '',
                  name: '',
                  type: ''
                }
              }
            ],
            remark: '',
            state: '1'
          },
          {
            autoNext: '0',
            billName: '发货',
            billType: '32',
            flowId: '',
            id: '',
            items: [
              {
                approver: { id: '', name: '' },
                auditId: '',
                id: '',
                ids: [''], // 店铺，角色，管理员id的集合
                money: '0',
                role: {
                  id: '',
                  name: '',
                  type: ''
                },
                shop: {
                  id: '',
                  name: '',
                  type: ''
                }
              }
            ],
            remark: '',
            way: '0'
          }]
      };
    },
    refresh(id = '') {
      let params = {
        id: this.idObject.id || id,
        shopId: window.top.SHOP_ID || ''
      };
      this.loading = true;
      http
        .get(urls.invoicing.shopApprovalFlow, params)
        .then(data => {
          this.formData = data.data;
          this.formData.configs[1].items.map(item => {
            this.$set(item, 'ids', []);
            if (item.shop.id) {
              item.ids.push(item.shop.id);
              this.getChildList([item.shop.id]);
              if (item.approver.id) {
                item.ids.push(item.approver.id);
              } else {
                item.ids.push('');
              }
            } else {
              this.$set(item, 'ids', ['']);
            }
          });
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
    queryagencyList() {
      let params = {
        cooperationType: '1',
        shopId: window.top.SHOP_ID || '',
        pageSize: 1000
      };
      http
        .get('/admin/cooperationInfo/cooperationInfos.jhtml', params)
        .then(data => {
          this.serviceDatas = [{ label: '全部', value: '' }].concat(
            data.dataList.map(item => {
              return { label: item.name, value: item.id, children: [] };
            })
          );
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
    deleteRegion(ids, index) {
      this.tableData.splice(index, 1);
    },
    updateRegion() {
      http
        .put(urls.invoicing.shopApprovalFlow, this.formData)
        .then(data => {
          this.$message.success('保存成功');
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
    createRegion() {
      http
        .post(urls.invoicing.shopApprovalFlow, this.formData)
        .then(data => {
          this.$message.success('保存成功');
          this.refresh(data.id);
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formData.configs[1].items.map(item => {
            item.shop.id = item.ids.length > 0 ? item.ids[0] : '';
            item.approver.id = item.ids.length > 1 ? item.ids[1] : '';
          });
          if (this.idObject.id) {
            this.updateRegion();
          } else {
            this.createRegion();
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.shipping-setting-info {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-step.is-vertical .el-step__main {
    padding-bottom: 10px;
  }
  .content {
    border: 1px solid #bbbbbb;
    padding: 10px;
  }
  .image {
    position: relative;
    padding: 10px 0px;
    div {
      height: 45px;
      width: 60px;
      position: absolute;
      top: 35px;
      left: 72px;
      font-size: 12px;
      font-weight: bold;
      line-height: 20px;
      padding: 10px 5px;
      text-align: center;
      color: #ff7300;
      background: #fff;
      cursor: pointer;
      z-index: 11;
    }
    .step1 {
      top: 40px;
      left: 72px;
      color: #666666;
    }
    .step2 {
      top: 32px;
      left: 218px;
    }
    .step2-disabled {
      top: 40px;
      left: 158px;
      color: #91949e;
      cursor: default;
    }
  }
  .addButton {
    margin-left: 20px;
  }
  .plus-cs {
    cursor: pointer;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #333;
    color: #fff;
    font-size: 15px;
    line-height: 25px;
    text-align: center;
    z-index: 2;
    margin-top: 10px;
  }
  .object {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .index {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      background: #d6d6d9;
      text-align: center;
      line-height: 25px;
    }
    .el-icon-delete {
      font-size: 20px;
    }
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
