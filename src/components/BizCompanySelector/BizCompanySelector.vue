<template>
  <div class="biz-company-selector">
    <el-select
      v-model="firstCompany"
      @change="firstCompanyChange"
      placeholder="请选择一级运营商"
      clearable
    >
      <el-option v-for="item in firstCompanyList" :key="item.index" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-select
      v-model="secondCompany"
      @change="secondCompanyChange"
      placeholder="请选择二级运营商"
      clearable
      v-if="secondCompanyList.length !== 0"
    >
      <el-option v-for="item in secondCompanyList" :key="item.index" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-select
      v-model="thirdCompany"
      @change="thirdCompanyChange"
      placeholder="请选择三级运营商"
      clearable
      v-if="thirdCompanyList.length !== 0"
    >
      <el-option v-for="item in thirdCompanyList" :key="item.index" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
import service from './BizCompanySelector.js';

export default {
  name: 'BizCompanySelector',
  props: {
    value: {
      type: Object,
      default() {
        return {
          id: '',
          name: ''
        };
      }
    },
    queryParent: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data () {
    return {
      firstCompany: '',
      secondCompany: '',
      thirdCompany: '',
      firstCompanyList: [],
      secondCompanyList: [],
      thirdCompanyList: []
    };
  },
  components: {
  },
  methods: {
    queryCompanyList(id = '') {
      return new Promise((resolve, reject) => {
        let params = {
          parentId: id
        };
        service.queryList(
          params,
          data => {
            resolve(this.formatList(data.content));
          },
          ErrorData => {
            reject(ErrorData);
          }
        );
      });
    },
    firstCompanyChange(id) {
      this.secondCompany = '';
      this.thirdCompany = '';
      this.secondCompanyList = [];
      this.thridCompanyList = [];
      if (id) {
        this.$emit('input', this.findInfo(id, 0));
        this.queryCompanyList(id).then(list => {
          this.secondCompanyList = list;
        });
      }
    },
    secondCompanyChange(id) {
      this.thirdCompany = '';
      this.thridCompanyList = [];
      if (id) {
        this.$emit('input', this.findInfo(id, 1));
        this.queryCompanyList(id).then(list => {
          this.thridCompanyList = list;
        });
      }
    },
    thirdCompanyChange(id) {
      if (id) {
        this.$emit('input', this.findInfo(id, 2));
      }
    },
    findInfo(id, index) {
      let tmp = { id: id, name: '' };
      switch (index) {
        case 0:
          this.firstCompanyList.map(list => {
            if (list.id === id) {
              tmp.name = list.name;
            }
          });
          break;
        case 1:
          this.secondCompanyList.map(list => {
            if (list.id === id) {
              tmp.name = list.name;
            }
          });
          break;
        case 2:
          this.thridCompanyList.map(list => {
            if (list.id === id) {
              tmp.name = list.name;
            }
          });
          break;
        default:
          break;
      }
      return tmp;
    },
    // 格式化运营商列表
    formatList(data) {
      let list = [];
      let keys = Object.keys(data);
      let values = Object.values(data);
      for (let i = 0; i < keys.length; i++) {
        list.push({ 'id': keys[i], 'name': values[i] });
      }
      return list;
    },
    queryParentCompany(id) {
      return new Promise((resolve, reject) => {
        let params = {
          companyId: id
        };
        service.queryParent(
          params,
          data => {
            let tmp = [];
            if (data.parentCompanyTrees) {
              tmp = data.parentCompanyTrees.map(parent => {
                return parent.id;
              });
            }
            resolve(tmp);
          },
          ErrorData => {
            reject(ErrorData);
          }
        );
      });
    }
  },
  mounted() {
    this.queryCompanyList().then(list => {
      this.firstCompanyList = list;
    });
  },
  watch: {
    value(newVal, oldVal) {
      if (!newVal.id) {
        this.firstCompany = '';
        this.secondCompany = '';
        this.thirdCompany = '';
        this.secondCompanyList = [];
        this.thirdCompanyList = [];
      } else {
        if (this.queryParent) {
          this.queryParentCompany(newVal.id).then(parents => {
            if (parents[0]) {
              this.firstCompany = parents[0];
              this.firstCompanyChange(parents[0]);
              if (parents[1]) {
                this.secondCompany = parents[1];
                this.secondCompanyChange(parents[1]);
                if (parents[2]) {
                  this.thirdCompany = parents[2];
                  this.thirdCompanyChange(parents[2]);
                }
              }
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.biz-company-selector {
  .el-select:first-child {
    margin-top: 0;
  }
}
</style>
