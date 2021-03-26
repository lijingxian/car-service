<template>
  <biz-grid class="terminal-mgmt-class__terminal-class-ability" v-loading="loading">
    <div v-show="!errorMessage">
      <biz-header :operations="ruleTableOperations" @operate="handleOperate">
      </biz-header>
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" @row-click="handleRowClick">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="length" label="车型数量" width="80">
        </el-table-column>
        <el-table-column prop="title" label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleRowDeleteClick($event, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="showRule" center append-to-body width="500px" v-loading="ruleLoading" custom-class="box-card">
        <el-form ref="ruleForm" size="small" label-width="110px" :model="ruleModel" :rules="rules" :inline-message="true">
          <el-form-item label="名称" prop="name" class="name">
            <el-input v-model="ruleModel.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <div class="car-list">
              <div class="car-item" v-for="(item, index) in ruleModel.selectedBrands" :key="index">
                <div class="button-wrapper">
                  <el-button type="text" class="close" @click="handleBrandCloseClick(index, $event)"><i
                      class="el-icon-circle-close"></i></el-button>
                  <el-button type="text" class="add" @click="handleBrandAddClick"><i class="el-icon-circle-plus"></i></el-button>
                </div>
                <div class="select-wrapper">
                  <el-select v-model="ruleModel.selectedBrands[index]" placeholder="请选择" filterable style="width: 100%;"
                    @change="handleBrandChange">
                    <el-option v-for="(item, index) in brandList" :key="index" :label="item.brandName" :value="item.brandId">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="车系">
            <div class="car-list">
              <div class="car-item" v-for="(item, index) in ruleModel.selectedSerieses" :key="index">
                <div class="button-wrapper">
                  <el-button type="text" class="close" @click="handleSeriesCloseClick(index, $event)"><i
                      class="el-icon-circle-close"></i></el-button>
                  <el-button type="text" class="add" @click="handleSeriesAddClick"><i class="el-icon-circle-plus"></i></el-button>
                </div>
                <div class="select-wrapper">
                  <el-select v-model="ruleModel.selectedSerieses[index]" placeholder="请选择" filterable style="width: 100%;"
                    @change="handleSeriesChange">
                    <el-option v-for="(item, index) in seriesList" :key="index" :label="item.seriesName" :value="item.seriesId">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="车型">
            <div class="car-list">
              <div class="car-item" v-for="(item, index) in ruleModel.selectedModes" :key="index">
                <div class="button-wrapper">
                  <el-button type="text" class="close" @click="handleModeCloseClick(index, $event)"><i
                      class="el-icon-circle-close"></i></el-button>
                  <el-button type="text" class="add" @click="handleModeAddClick"><i class="el-icon-circle-plus"></i></el-button>
                </div>
                <div class="select-wrapper">
                  <el-select v-model="ruleModel.selectedModes[index]" placeholder="请选择" filterable style="width: 100%;"
                    @change="handleModeChange">
                    <el-option v-for="(item, index) in modeList" :key="index" :label="item.typeName" :value="item.typeId">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(category, index) in abilityList" :key="index" :title="category.name" :name="index">
              <el-checkbox-group v-model="ruleModel.abilities" class="terminal-mgmt-class__class-ability-setting__checkbox-group">
                <div v-for="item in category.capacityData" :key="item.id" class="checkbox-item">
                  <el-checkbox :label="item.id" @change="handleCheckChange(item.id, item.capacityData, $event)">{{item.name}}
                  </el-checkbox>
                  <!-- <div v-if="item.name==='空调开关'">
                    <el-radio-group v-model="radio">
                      <el-radio label="">关闭</el-radio>
                      <el-radio label="60S">60S</el-radio>
                      <el-radio label="30S">30S</el-radio>
                      <el-radio label="15S">15S</el-radio>
                    </el-radio-group>
                    <el-checkbox v-model="checkbox" v-show="radio">手动输入</el-checkbox>
                  </div> -->
                  <div v-if="item.capacityData" class="checkbox-sub" v-show="ruleModel.abilities.indexOf(item.id) >= 0">
                    <div v-for="sub in item.capacityData" :key="sub.id" class="checkbox-item">
                      <el-checkbox :label="sub.id">{{sub.name}}</el-checkbox>
                      <div v-if="sub.capacityData" class="checkbox-sub" v-show="ruleModel.abilities.indexOf(sub.id) >= 0">
                        <div v-for="sub1 in sub.capacityData" :key="sub1.id" class="checkbox-item">
                          <el-checkbox :label="sub1.id">{{sub1.name}}</el-checkbox>
                          <div v-show="ruleModel.abilities.indexOf(sub1.id) >= 0 && sub1.type === '1'">
                            <div style="display:flex;justify-content:space-between">
                              <label class="title-label" v-if="sub1.name==='方向盘打死提醒'">方向盘转向角度</label>
                              <label class="title-label" v-if="sub1.name==='转向辅助转向灯'">转向灯转向角度</label>
                              <label class="title-label" v-if="sub1.name==='油量最低阈值提醒'">油量预警值</label>
                              <label class="title-label" v-if="sub1.name==='电池电压异常提醒'">电压预警值</label>
                              <label class="title-label" v-if="sub1.name==='车辆喇叭音量高低调节'">喇叭音量大小</label>
                              <label class="title-label" v-if="sub1.name==='伴我回家'">大灯延迟关闭时间</label>
                              <label class="title-label" v-if="sub1.name==='行车落锁'">车速值</label>
                              <label class="title-label" v-if="sub1.name==='自动大灯'">自动大灯灵敏度</label>
                              <el-switch v-model="sub1.closed" active-value="1" inactive-value="0" active-text="关闭" :width="30">
                              </el-switch>
                            </div>
                            <el-radio-group v-model="sub1.value" v-if="sub1.closed==='0'">
                              <el-radio label="400" v-if="sub1.name==='方向盘打死提醒'">400°</el-radio>
                              <el-radio label="500" v-if="sub1.name==='方向盘打死提醒'">500°</el-radio>
                              <el-radio label="110" v-if="sub1.name==='转向辅助转向灯'">110°</el-radio>
                              <el-radio label="90" v-if="sub1.name==='转向辅助转向灯'">90°</el-radio>
                              <el-radio label="70" v-if="sub1.name==='转向辅助转向灯'">70°</el-radio>
                              <el-radio label="2" v-if="sub1.name==='油量最低阈值提醒'">2L</el-radio>
                              <el-radio label="5" v-if="sub1.name==='油量最低阈值提醒'">5L</el-radio>
                              <el-radio label="12" v-if="sub1.name==='油量最低阈值提醒'">12L</el-radio>
                              <el-radio label="11" v-if="sub1.name==='电池电压异常提醒'">11V</el-radio>
                              <el-radio label="60" v-if="sub1.name==='伴我回家'">60S</el-radio>
                              <el-radio label="30" v-if="sub1.name==='伴我回家'">30S</el-radio>
                              <el-radio label="15" v-if="sub1.name==='伴我回家'">15S</el-radio>
                              <el-radio label="30" v-if="sub1.name==='行车落锁'">30km/h</el-radio>
                              <el-radio label="20" v-if="sub1.name==='行车落锁'">20km/h</el-radio>
                              <el-radio label="10" v-if="sub1.name==='行车落锁'">10km/h</el-radio>
                              <el-radio label="1" v-if="sub1.name==='自动大灯'||sub1.name==='车辆喇叭音量高低调节'">高</el-radio>
                              <el-radio label="2" v-if="sub1.name==='自动大灯'||sub1.name==='车辆喇叭音量高低调节'">中</el-radio>
                              <el-radio label="3" v-if="sub1.name==='自动大灯'||sub1.name==='车辆喇叭音量高低调节'">低</el-radio>
                            </el-radio-group>
                            <el-switch v-model="sub1.userDefined" active-value='1' inactive-value='0' active-text="自定义"
                              :width="30" v-if="sub1.closed==='0'">
                            </el-switch>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <biz-save-button :operations="ruleOperations" @operate="handleOperate" style="margin-top: 10px;">
        </biz-save-button>
      </el-dialog>
    </div>
    <p v-show="errorMessage">{{errorMessage}}</p>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import { BizHeader } from '@/components/BizTable';
import BizSaveButton from '@/components/BizSaveButton';

import { terminalMgmt } from '@/common/urls';
import http from '@/common/http';

const tableData = {
  data: {
    radio: '',
    checkbox: false,
    loading: false,
    errorMessage: '',
    ruleTableOperations: [
      {
        label: '新增',
        name: 'addRuleOperate',
        type: 'primary'
      },
      {
        label: '删除',
        name: 'deleteRuleOperate',
        type: '',
        disabled: true
      }
    ],
    tableData: []
  },
  events: {
    handleSelectionChange(val) {
      this.ruleTableOperations[1].disabled = true;
      if (val.length > 0) {
        this.ruleTableOperations[1].disabled = false;
      }
      this.selections = val;
    },
    handleRowDeleteClick(e, model) {
      e.stopPropagation();

      this.deleteRule([model.id]);
    },
    handleRowClick(model, e) {
      let obj = Object.assign(getDefaultRuleModel(), model);
      obj.abilities = (model.abilityList && model.abilityList.map(item => { return item.ability; })) || [];
      console.log('obj.abilities' + obj.abilities);
      // 将品牌、车系、车型转换为可用的值
      let brand = [];
      if (obj.carBrands && obj.carBrands.length > 0) {
        this.doQuerySeriesList(obj.carBrands);
        obj.carBrands.forEach(item => {
          brand.push(item.brandId);
        });
        obj.selectedBrands = brand;
      }
      let series = [];
      if (obj.carSerieses && obj.carSerieses.length > 0) {
        this.doQueryModelList(obj.carSerieses);
        obj.carSerieses.forEach(item => {
          series.push(item.seriesId);
        });
        obj.selectedSerieses = series;
      }
      let carModel = [];
      if (obj.carTypes && obj.carTypes.length > 0) {
        obj.carTypes.forEach(item => {
          carModel.push(item.typeId);
        });
        obj.selectedModes = carModel;
      }
      this.initRule(obj);
    },

    deleteRuleOperate() {
      if (this.selections && this.selections.length > 0) {
        let ids = [];
        this.selections.forEach(element => {
          ids.push(element.id);
        });
        this.deleteRule(ids);
      } else {
        this.$message('请选择一个配置项删除');
      }
    },
    addRuleOperate() {
      this.initRule();
    }
  },
  methods: {
    init() {
      if (this.itemId.id) {
        this.query();
      } else {
        this.tableData = [];
      }

      this.showRule = false;
    },
    query() {
      this.loading = true;
      http
        .get(terminalMgmt.TerminalClassAbility.list, { terminalType: this.itemId.id })
        .then(data => {
          this.tableData = data.dataList ? data.dataList : [];

          // reset
          this.selections = [];
          this.showRule = false;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.resultCode === '800') {
            this.errorMessage = errData.errorMessage;
          } else {
            this.$message.warning(errData.errorMessage);
          }
        })
        .finally(data => {
          this.loading = false;
        });
    },

    deleteRule(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        http
          .post(terminalMgmt.TerminalClassAbility.delete, { ids: ids })
          .then(data => {
            this.$message.success('删除成功');
            this.query();
          })
          .catch(errData => {
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(data => {
            this.loading = false;
          });
      });
    }
  }
};

const getDefaultRuleModel = () => {
  return {
    selectedBrands: [''],
    selectedSerieses: [''],
    selectedModes: [''],
    abilities: []
  };
};
const ruleData = {
  data: {
    ruleLoading: false,
    showRule: false,
    ruleModel: getDefaultRuleModel(),
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

    activeNames: [],
    abilityList: [],
    saveAbilityList: []
  },
  events: {
    cancelRuleOperate() {
      this.showRule = false;
    },
    saveRuleOperate() {
      this.$refs.ruleForm.validate((valid, a) => {
        if (valid) {
          const success = data => {
            this.$message.success('保存成功');
            this.query();
            this.showRule = false;
          };
          const fail = errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          };
          const final = data => {
            this.ruleLoading = false;
          };

          this.ruleLoading = true;
          http
            .post(
              this.ruleModel.id ? terminalMgmt.TerminalClassAbility.update : terminalMgmt.TerminalClassAbility.add,
              this.getRuleSaveParams()
            )
            .then(success)
            .catch(fail)
            .finally(final);
        } else {
          return false;
        }
      });
    },

    handleCheckChange(id, list, val) {
      console.log(list);
      // 如果存在子项，则在该节点选中状态变化时需要更新子项的选中状态
      if (list && list.length > 0) {
        // 如果是非选中状态，需要清空子项的选中状态
        if (!val) {
          list.forEach(item => {
            let index = this.ruleModel.abilities.indexOf(item.id);
            if (index >= 0) {
              this.ruleModel.abilities.splice(index, 1);
            }
          });
        }
      }
    }
  },
  methods: {
    queryAbilityList() {
      http
        .get(terminalMgmt.TerminalClassAbility.abilityList, {})
        .then(data => {
          this.abilityList = data.data;
          console.log(data.data);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(data => {
          this.ruleLoading = false;
        });
    },

    initRule(model) {
      if (model) this.ruleModel = Object.assign(this.getDefaultRuleModel(), model);
      else this.ruleModel = this.getDefaultRuleModel();

      this.activeNames = [];

      this.showRule = true;
      this.showRule = true;

      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
    },
    getDefaultRuleModel() {
      return getDefaultRuleModel();
    },
    resetRuleModel() {
      this.ruleModel = Object.assign({}, this.getDefaultRuleModel());
    },
    setObj(datas) {
      // 遍历树
      for (let i in datas) {
        if (this.ruleModel.abilities.includes(datas[i].id)) {
          this.saveAbilityList.push({
            ability: datas[i].id,
            abilityCategory: 'basic',
            checked: '1',
            name: datas[i].name,
            type: datas[i].type,
            value: datas[i].value,
            userDefined: datas[i].userDefined,
            closed: datas[i].closed
          });
        }
        if (datas[i].capacityData) {
          this.setObj(datas[i].capacityData);
        }
      }
    },
    getRuleSaveParams() {
      let brandList = [];
      this.ruleModel.selectedBrands.forEach(item => {
        if (item) brandList.push(this.brandMap.get(item));
      });
      let seriesList = [];
      this.ruleModel.selectedSerieses.forEach(item => {
        if (item) seriesList.push(this.seriesMap.get(item));
      });
      let modelList = [];
      this.ruleModel.selectedModes.forEach(item => {
        if (item) modelList.push(this.modelMap.get(item));
      });
      this.saveAbilityList = [];
      console.log('this.abilityList' + this.abilityList);
      console.log('this.ruleModel.abilities' + this.ruleModel.abilities);
      this.setObj(this.abilityList);
      return {
        terminalType: this.itemId.id,
        id: this.ruleModel.id,
        name: this.ruleModel.name,
        carBrands: brandList,
        carSerieses: seriesList,
        carTypes: modelList,
        abilities: this.ruleModel.abilities.join(','),
        abilityList: this.saveAbilityList
      };
    }
  }
};

const carData = {
  data: {
    brandList: [],
    seriesList: [],
    modeList: []
  },
  events: {
    handleBrandChange(val, pass) {
      this.resetSeries(this.ruleModel.selectedBrands);
      this.resetMode();
    },
    handleBrandAddClick(e) {
      this.ruleModel.selectedBrands.push('');
    },
    handleBrandCloseClick(index, e) {
      this.ruleModel.selectedBrands.splice(index, 1);

      this.resetSeries(this.ruleModel.selectedBrands);
      this.resetMode();
    },

    handleSeriesChange(val) {
      this.resetMode(this.ruleModel.selectedSerieses);
    },
    handleSeriesAddClick(e) {
      this.ruleModel.selectedSerieses.push('');
    },
    handleSeriesCloseClick(index, e) {
      this.ruleModel.selectedSerieses.splice(index, 1);

      this.resetMode(this.ruleModel.selectedSerieses);
    },

    handleModeChange(val) {},
    handleModeAddClick(e) {
      this.ruleModel.selectedModes.push('');
    },
    handleModeCloseClick(index, e) {
      this.ruleModel.selectedModes.splice(index, 1);
    }
  },
  methods: {
    initBrandMap(arr) {
      this.brandMap = new Map();
      arr.forEach(item => {
        this.brandMap.set(item.brandId, item);
      });
    },
    initSeriesMap(arr) {
      this.seriesMap = new Map();
      arr.forEach(item => {
        this.seriesMap.set(item.seriesId, item);
      });
    },
    initModelMap(arr) {
      this.modelMap = new Map();
      arr.forEach(item => {
        this.modelMap.set(item.typeId, item);
      });
    },

    queryBrandList() {
      http
        .get(terminalMgmt.TerminalClassAbility.brandList, {})
        .then(data => {
          let arr = data.dataList;
          arr.unshift({ brandId: '', brandName: '全部' });
          this.brandList = arr;

          this.initBrandMap(data.dataList);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    querySeriesList(brands) {
      // 仅存在有效值时才进行查询
      let arr = [];
      if (brands) {
        brands.forEach(item => {
          if (item) arr.push(this.brandMap.get(item));
        });
      }
      if (arr.length > 0) {
        this.doQuerySeriesList(arr);
      }
    },
    doQuerySeriesList(arr) {
      http
        .post(terminalMgmt.TerminalClassAbility.seriesList, { carBrands: arr })
        .then(data => {
          let arr = data.dataList;
          arr.unshift({ seriesId: '', seriesName: '全部' });
          this.seriesList = arr;

          this.initSeriesMap(data.dataList);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },
    queryModelList(serieses) {
      // 仅存在有效值时才进行查询
      let arr = [];
      if (serieses) {
        serieses.forEach(item => {
          if (item) arr.push(this.seriesMap.get(item));
        });
      }
      if (arr.length > 0) {
        this.doQueryModelList(arr);
      }
    },
    doQueryModelList(arr) {
      http
        .post(terminalMgmt.TerminalClassAbility.modelList, { carSerieses: arr })
        .then(data => {
          let arr = data.dataList;
          arr.unshift({ typeId: '', typeName: '全部' });
          this.modeList = arr;

          this.initModelMap(data.dataList);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        });
    },

    resetSeries(brands) {
      this.querySeriesList(brands);

      this.$set(this.ruleModel, 'selectedSerieses', ['']);
    },
    resetMode(serieses) {
      this.queryModelList(serieses);

      this.$set(this.ruleModel, 'selectedModes', ['']);
    }
  }
};

export default {
  name: 'TerminalClassAbility',
  components: {
    BizSaveButton,
    BizGrid,
    BizHeader
  },
  props: {
    itemId: {
      type: Object,
      default() {
        return { id: '' };
      }
    }
  },
  data() {
    return {
      // 规则列表
      ...tableData.data,

      // 规则内容
      ...ruleData.data,

      rules: {
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }]
      },

      ...carData.data
    };
  },
  methods: {
    handleOperate(name) {
      this[name]();
    },

    ...tableData.events,
    ...tableData.methods,

    ...ruleData.events,
    ...ruleData.methods,

    ...carData.events,
    ...carData.methods
  },
  computed: {
    computedValue: {
      get() {
        return this.getValue(this.propModel);
      },
      set(val) {
        if (this.propModel.type === '1') {
          this.propModel.options = val.split(',');
        } else if (this.propModel.type === '2') {
          let temp = val.split('-');
          this.propModel.value1 = temp[0] ? temp[0] : '';
          this.propModel.value2 = temp[1] ? temp[1] : '';
        } else {
          this.propModel.value1 = val;
        }
      }
    }
  },
  watch: {
    itemId(nVal, oVal) {
      this.init();
    }
  },
  created() {
    this.queryBrandList();
    this.queryAbilityList();
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.box-card {
  .car-list {
    .car-item {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      .select-wrapper {
        margin-right: 75px;
      }

      .button-wrapper {
        float: right;
        width: 65px;

        .el-button {
          padding: 2px 0;

          i {
            font-size: 28px;
          }

          &.close {
            color: #f56c6c;
          }
        }

        .el-button + .el-button {
          margin-left: 0;
        }
      }

      &:first-child:last-child {
        .close {
          display: none;
        }
      }

      &:not(:last-child) {
        .add {
          display: none;
        }
      }
    }
  }
  .terminal-mgmt-class__class-ability-setting__checkbox-group {
    .checkbox-item {
      .checkbox-sub {
        border: 1px solid #eee;
        padding: 15px 20px 5px;
        margin-bottom: 10px;
        .title-label {
          color: #606266;
          font-weight: 500;
          line-height: 1;
          position: relative;
          cursor: pointer;
          display: inline-block;
          white-space: nowrap;
          outline: none;
          font-size: 14px;
          margin-right: 30px;
        }
      }
      .el-radio {
        padding: 5px 0px;
        margin-right: 8px;
      }
      .el-switch {
        float: right;
        .el-switch__core {
          height: 15px;
        }
        .el-switch__core:after {
          width: 10px;
          height: 10px;
        }
      }
      .el-checkbox {
        display: block;
        padding-bottom: 10px;
        margin-right: 0px;

        & + .el-checkbox {
          margin-left: 0;
        }

        .el-checkbox__input {
          float: right;
          margin-top: 8px;
        }

        .el-checkbox__label {
          padding-left: 0;
        }
      }
    }
  }
}
.terminal-mgmt-class__terminal-class-ability {
  .biz-header .biz-header__operation-wrapper {
    justify-content: flex-start;
  }
  .biz-scroller {
    .box-card {
      margin-top: 20px;
      .el-input {
        width: 235px;
      }
      .el-card__body {
        padding: 20px 20px;
      }
    }

    .coding-rule__value-table {
      .cell {
        padding-left: 3px;
        padding-right: 3px;
      }
    }
  }
}
</style>
