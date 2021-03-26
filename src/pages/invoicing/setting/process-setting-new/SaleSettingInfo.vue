<template>
  <biz-grid class="process-sale-bsae">
    <div slot="top" class="popup">
      <biz-save-button slot="top" :operations="operations" @operate="operate"></biz-save-button>
    </div>
    <el-form ref="form" label-width="150px" size="small" v-loading="loading" :model="formData" :rules="rules">
      <el-form-item label="流程名称" prop="name" label-width="80px">
        <el-input v-model="formData.name" placeholder="代理商销售流程"></el-input>
      </el-form-item>
      <el-form-item label="流程描述" label-width="80px">
        <el-input v-model="formData.memo" placeholder="请输入" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="流程设置" label-width="80px">
        <span style="font-size:12px">点击流程各节点可进行对应流程的设置，黄色字体的为可进行设置的节点</span>
      </el-form-item>
      <div class="image">
        <img :src="xslc" />
        <div class="step1" @click.stop="step1Click">提交销售申请</div>
        <div :class="formData.configs[0].state==='1'?'step2':'step2-disabled'" @click.stop="step2Click">销售申请审批</div>
        <div class="step3" @click.stop="step3Click">提交销售订单</div>
        <div class="step4" @click.stop="step4Click">销售订单审批</div>
      </div>
      <div class="content">
        <el-form-item label="启用" v-if="step1" prop="state" class="isRequired">
          <el-switch v-model="formData.configs[0].state" inactive-value="0" active-value="1" @change="stateChange"></el-switch>
        </el-form-item>
        <el-form-item label="提交方式" v-if="step3&&formData.configs[0].state==='1'" prop="subType" class="isRequired">
          <el-radio-group v-model="formData.configs[2].way">
            <el-radio label="0">自动提交</el-radio>
            <el-radio label="1">手动提交</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用对象" v-if="step1&&formData.configs[0].state==='1'" prop="object1" class="isRequired">
          <div class="object" v-for="(item,index) in formData.configs[0].items" :key="item.id">
            <div class="index">{{index+1}}</div>
            <el-cascader :options="serviceDatas" :props="cascaderProps" v-model="item.ids" @active-item-change="getChildList"></el-cascader>
            <i class="el-icon-delete" @click.stop="deleteRow(item)" size="small"></i>
          </div>
          <div class="addButton">
            <i class="el-icon-plus plus-cs" @click.stop="addRow" size="small"></i>
          </div>
        </el-form-item>
        <el-form-item label="适用对象" v-if="step3&&formData.configs[2].way==='1'" prop="object3" class="isRequired">
          <div v-if="formData.configs[0].state==='1'" style="fonr-size:12px;color:#666666">适用对象与提交申请处一致，如需修改请至提交申请处修改</div>
          <div class="object" v-for="(item,index) in formData.configs[2].items" :key="index">
            <div class="index">{{index+1}}</div>
            <el-cascader
              :options="serviceDatas"
              :props="cascaderProps"
              v-model="item.ids"
              @active-item-change="getChildList"
              :disabled="formData.configs[0].state==='1'"
            ></el-cascader>
            <i class="el-icon-delete" @click.stop="deleteRow(item)" size="small" v-if="formData.configs[0].state==='0'"></i>
          </div>
          <div class="addButton" v-if="formData.configs[0].state==='0'">
            <i class="el-icon-plus plus-cs" @click.stop="addRow" size="small"></i>
          </div>
        </el-form-item>
        <el-form-item v-if="step4" label="审批后自动采购" prop="autoNext" class="isRequired">
          <el-button type="text" size="small" v-popover:UnionType>
            <i class="iconfont el-icon-question"></i>
          </el-button>
          <el-popover ref="UnionType" placement="bottom-start" width="300" trigger="hover">
            <p>设置为自动采购后，系统将为您自动向供应商提交采购单，此种设置适用代销方式的门店；</p>
            <p>设置为人工采购，则需要相关人员手动创建采购单，适用直销方式的门店。</p>
          </el-popover>
          <el-switch v-model="formData.configs[3].autoNext" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="审批方式" v-if="step2||step4" prop="way" class="isRequired">
          <el-radio-group v-model="formData.configs[1].way" v-if="step2">
            <el-radio label="0">系统审批</el-radio>
            <el-radio label="1">人工审批</el-radio>
          </el-radio-group>
          <el-radio-group v-model="formData.configs[3].way" v-if="step4">
            <el-radio label="0">系统审批</el-radio>
            <el-radio label="1">人工审批</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批流程" v-if="(step2&&formData.configs[1].way==='1')||(step4&&formData.configs[3].way==='1')" class="isRequired">
          <el-steps direction="vertical" v-if="step2">
            <el-step v-for="(list,index) in formData.configs[1].items" :key="index">
              <div slot="description" class="stepItem">
                <el-form ref="processForm">
                  <el-form-item prop="process">
                    <el-cascader :options="roleDatas" :props="cascaderProps" v-model="list.ids" @active-item-change="listAdminByRoleId"></el-cascader>
                    <div style="float:right;">
                      <el-button type="text">
                        <i class="iconfont biz-icon-iconfontshanchu1" @click="deleteLevel(list)"></i>
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item prop="money">
                    审批金额标准>=
                    <el-input v-model="list.money" placeholder="请输入金额" style="width:215px;"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-step>
          </el-steps>
          <el-steps direction="vertical" v-if="step4">
            <el-step v-for="(list,index) in formData.configs[3].items" :key="index">
              <div slot="description" class="stepItem">
                <el-form ref="processForm">
                  <el-form-item prop="process">
                    <el-cascader :options="roleDatas" :props="cascaderProps" v-model="list.ids" @active-item-change="listAdminByRoleId"></el-cascader>
                    <div style="float:right;">
                      <el-button type="text">
                        <i class="iconfont biz-icon-iconfontshanchu1" @click="deleteLevel(list)"></i>
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item prop="money">
                    审批金额标准>=
                    <el-input v-model="list.money" placeholder="请输入金额" style="width:215px;"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-step>
          </el-steps>
          <div v-if="this.formData.configs[3].items.length<6&&step4&&formData.configs[3].way==='1'">
            <!-- <div class="line">
            <i class="line-inner"></i>
            </div>-->
            <div class="addButton">
              <i class="el-icon-plus plus-cs" @click.stop="addLevel" size="small"></i>
            </div>
          </div>
          <div v-if="this.formData.configs[1].items.length<6&&step2&&formData.configs[1].way==='1'">
            <!-- <div class="line">
            <i class="line-inner"></i>
            </div>-->
            <div class="addButton">
              <i class="el-icon-plus plus-cs" @click.stop="addLevel" size="small"></i>
            </div>
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
import xslc from '@/assets/images/process/05.png';
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
    let validataState = (rule, value, callback) => {
      if (this.step1 && !this.formData.configs[0].state) {
        callback(new Error('请选择状态'));
      } else {
        callback();
      }
    };
    let validateSubType = (rule, value, callback) => {
      if (this.step3 && !this.formData.configs[2].way) {
        callback(new Error('请选择提交方式'));
      } else {
        callback();
      }
    };
    let validateObject1 = (rule, value, callback) => {
      if (this.step1 && (this.formData.configs[0].items.length === 0 || this.formData.configs[0].items[0].ids.length === 0)) {
        callback(new Error('请选择适用对象'));
      } else {
        callback();
      }
    };
    let validateObject3 = (rule, value, callback) => {
      if (
        this.step3 &&
        this.formData.configs[2].way === '1' &&
        (this.formData.configs[2].items.length === 0 || this.formData.configs[2].items[0].ids.length === 0)
      ) {
        callback(new Error('请选择适用对象'));
      } else {
        callback();
      }
    };
    let validateAutoNext = (rule, value, callback) => {
      if (this.step4 && !this.formData.configs[3].autoNext) {
        callback(new Error('请选择采购方式'));
      } else {
        callback();
      }
    };
    let validateWay = (rule, value, callback) => {
      if ((this.step2 && !this.formData.configs[1].way) || (this.step4 && !this.formData.configs[3].way)) {
        callback(new Error('请选择审批方式'));
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
      xslc: xslc,
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      tableData: [],
      roleDatas: [],
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
        state: [{ required: false, message: '请选择状态', trigger: 'change' }, { validator: validataState, trigger: 'change' }],
        subType: [
          { required: false, message: '请选择提交方式', trigger: 'change' },
          { validator: validateSubType, trigger: 'change' }
        ],
        object1: [
          { required: false, message: '请选择适用对象', trigger: 'change' },
          { validator: validateObject1, trigger: 'change' }
        ],
        object3: [
          { required: false, message: '请选择适用对象', trigger: 'change' },
          { validator: validateObject3, trigger: 'change' }
        ],
        autoNext: [
          { required: false, message: '请选择自动采购方式', trigger: 'change' },
          { validator: validateAutoNext, trigger: 'change' }
        ],
        way: [{ required: false, message: '请选择审批方式', trigger: 'change' }, { validator: validateWay, trigger: 'change' }]
      }
    };
  },
  computed: {},
  watch: {
    idObject(val) {
      if (val.id) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
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
    this.queryRollList();
  },
  methods: {
    ...mapGetters(['getUser']),
    operate(name) {
      this[name]();
    },
    stateChange(val) {
      if (val === '0') {
        this.formData.configs[2].way = '1';
      } else {
        this.formData.configs[2].items = this.formData.configs[0].items;
        this.formData.configs[2].items.map(item => {
          item.id = '';
        });
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
      if (this.step1) {
        this.formData.configs[0].items.splice(this.formData.configs[0].items.indexOf(row), 1);
      }
      if (this.step3) {
        this.formData.configs[2].items.splice(this.formData.configs[2].items.indexOf(row), 1);
      }
    },
    addRow() {
      if (this.step1) {
        this.formData.configs[0].items.push({
          approver: { id: '', name: '' },
          auditId: '',
          ids: [], // 店铺，角色，管理员id的集合
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
      }
      if (this.step3) {
        this.formData.configs[2].items.push({
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
      }
    },
    step1Click() {
      this.$refs.form.clearValidate();
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    },
    step2Click() {
      this.$refs.form.clearValidate();
      if (this.formData.configs[0].state === '1') {
        this.step2 = true;
      } else {
        return false;
      }
      this.step1 = false;
      this.step3 = false;
      this.step4 = false;
    },
    step3Click() {
      this.$refs.form.clearValidate();
      if (this.formData.configs[0].state === '1') {
        this.formData.configs[2].items = this.formData.configs[0].items;
      }
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
      this.step4 = false;
    },
    step4Click() {
      this.$refs.form.clearValidate();
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
    },
    getDefaultModel() {
      return {
        name: '',
        memo: '',
        type: '1',
        configs: [
          {
            billName: '提交销售申请',
            billType: '11',
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
            billName: '销售申请审批',
            billType: '12',
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
          },
          {
            autoNext: '0',
            billName: '提交销售订单',
            billType: '13',
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
            state: '0',
            way: '0'
          },
          {
            autoNext: '0',
            billName: '销售订单审批',
            billType: '14',
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
            state: '0',
            way: '0'
          }
        ]
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
          this.formData.configs[0].items.map(item => {
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
          this.formData.configs[1].items.map(item => {
            this.$set(item, 'ids', []);
            if (item.role.id) {
              item.ids.push(item.role.id);
              this.listAdminByRoleId([item.role.id]);
              if (item.approver.id) {
                item.ids.push(item.approver.id);
              } else {
                item.ids.push('');
              }
            } else {
              this.$set(item, 'ids', ['']);
            }
          });
          this.formData.configs[2].items.map(item => {
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
          this.formData.configs[3].items.map(item => {
            this.$set(item, 'ids', []);
            if (item.role.id) {
              item.ids.push(item.role.id);
              this.listAdminByRoleId([item.role.id]);
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
    listAdminByRoleId(value) {
      let obj;
      let params = {
        roleId: value[0]
      };
      http
        .get('/admin/admin/listAdminByRoleId.jhtml', params)
        .then(data => {
          this.roleDatas.forEach(element => {
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
    queryRollList() {
      let params = {
        id: this.idObject.id,
        shopId: window.top.SHOP_ID || ''
      };
      http
        .get('/admin/admin/json/getVisibleRoles.jhtml', params)
        .then(data => {
          this.roleDatas = [{ label: '全部', value: '' }].concat(
            data.allRoles.map(item => {
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
    deleteLevel(row) {
      if (this.step2) {
        this.formData.configs[1].items.splice(this.formData.configs[1].items.indexOf(row), 1);
      }
      if (this.step4) {
        this.formData.configs[3].items.splice(this.formData.configs[3].items.indexOf(row), 1);
      }
    },
    addLevel() {
      this.isCreate = true;
      if (this.step2) {
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
      }
      if (this.step4) {
        this.formData.configs[3].items.push({
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
      }
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
          console.log(this.step2);
          console.log(this.formData.configs[1].way);
          console.log(this.formData.configs[1].items.length);
          if (
            (this.step2 &&
              this.formData.configs[1].way === '1' &&
              (this.formData.configs[1].items.length === 0 || !this.formData.configs[1].items[0].money)) ||
            (this.step4 &&
              this.formData.configs[3].way === '1' &&
              (this.formData.configs[3].items.length === 0 || !this.formData.configs[3].items[0].money))
          ) {
            this.$message.warning('请输入审批金额');
            return;
          }
          if (
            (this.step2 &&
              this.formData.configs[1].way === '1' &&
              (this.formData.configs[1].items.length === 0 || this.formData.configs[1].items[0].ids.length === 0)) ||
            (this.step4 &&
              this.formData.configs[3].way === '1' &&
              (this.formData.configs[3].items.length === 0 || this.formData.configs[3].items[0].ids.length === 0))
          ) {
            this.$message.warning('请选择审批流程');
            return;
          }
          this.formData.configs[0].items.map(item => {
            item.shop.id = item.ids.length > 0 ? item.ids[0] : '';
            item.approver.id = item.ids.length > 1 ? item.ids[1] : '';
          });
          this.formData.configs[1].items.map(item => {
            item.role.id = item.ids.length > 0 ? item.ids[0] : '';
            item.approver.id = item.ids.length > 1 ? item.ids[1] : '';
          });
          this.formData.configs[2].items.map(item => {
            item.shop.id = item.ids.length > 0 ? item.ids[0] : '';
            item.approver.id = item.ids.length > 1 ? item.ids[1] : '';
            if (this.formData.configs[0].state === '1') {
              item.id = '';
            }
          });
          this.formData.configs[3].items.map(item => {
            item.role.id = item.ids.length > 0 ? item.ids[0] : '';
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
.process-sale-bsae {
  .biz-save-button {
    justify-content: flex-start;
  }
  .el-step.is-vertical .el-step__main {
    padding-bottom: 35px;
  }
  .el-step.is-vertical .el-step__line {
    top: 10px;
  }
  .content {
    border: 1px solid #bbbbbb;
    padding: 10px;
  }
  .image {
    position: relative;
    padding: 10px 0px;
    div {
      height: 50px;
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
    }
    .step2 {
      top: 40px;
      left: 158px;
    }
    .step2-disabled {
      top: 40px;
      left: 158px;
      color: #91949e;
      cursor: default;
    }
    .step3 {
      top: 40px;
      left: 246px;
    }
    .step4 {
      top: 40px;
      left: 332px;
    }
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
