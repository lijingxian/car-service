<template>
  <div class="sms-specification">
    <biz-flex-table ref="table" :operations="operations" @operate="operate" :tableData="tableData" @row-click="rowClick"
      :checkable="false">
      <el-table-column prop="name" label="数量">
        <div slot-scope="scope">
          <el-select size="small" v-model="scope.row.name" placeholder="请选择"
            @change="timeSelectionChange(scope.row.id,scope.row.name)">
            <el-option v-for="option in optionsItem" :key="option.id" :label="option.name" :value="option.id">
            </el-option>
          </el-select>
        </div>
      </el-table-column>
      <el-table-column width="130" label="操作">
        <div slot-scope="scope">
          <div class="biz-customcol">
            <el-button type="text" size="mini" @click.stop="rowDeleteClickHandler(scope.row.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-table-column>
    </biz-flex-table>
  </div>
</template>
<script>
import service from '@/service/services-mgmt/services-specification/serviceSpecification';
import http from '@/common/http';
import { BizFlexTable } from '@/components/BizTable';
export default {
  name: 'ServiceSpecification',
  data() {
    return {
      tableData: [],
      speId: '',
      plusButtonClick: false,
      optionsItem: [
        {
          name: '100条',
          id: '100'
        },
        {
          name: '200条',
          id: '200'
        },
        {
          name: '500条',
          id: '500'
        },
        {
          name: '1000条',
          id: '1000'
        },
        {
          name: '2000条',
          id: '2000'
        },
        {
          name: '5000条',
          id: '5000'
        },
        {
          name: '10000条',
          id: '10000'
        },
        {
          name: '50000条',
          id: '50000'
        }
      ],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          label: '保存',
          name: 'save',
          type: 'primary'
        }
      ]
    };
  },
  props: {
    id: {
      type: String
    }
  },
  components: {
    BizFlexTable
  },
  created() {
    this.getServiceSpecification();
  },
  methods: {
    operate(name) {
      this[name]();
    },
    rowClick() {},
    getServiceSpecification() {
      let params = {
        categoryType: 'smsService'
      };
      http
        .get('/admin/businessProductSpecification/query/v201901.jhtml', params)
        .then(data => {
          this.tableData = data.dataList;
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          this.$message.warning(errData.errorMessage);
        });
    },
    timeSelectionChange(id, name) {
      if (this.speId === '') {
        this.speId = id;
        this.name = name;
      } else {
        this.updateService(this.speId);
        this.name = name;
      }
    },
    save() {
      let flag = false;
      this.tableData.map(item => {
        if (!item.name) {
          this.$message.warning('请选择规格');
          flag = true;
        }
      });
      if (flag) {
        return;
      }
      if (this.speId === '') {
        this.createSms(this.name);
      } else {
        this.updateSms(this.speId, this.name);
      }
    },
    createSms(name) {
      let params = {
        name: name,
        categoryType: 'smsService'
      };
      http
        .post('/admin/businessProductSpecification/specification/v201901.jhtml', params)
        .then(data => {
          this.$message.success('操作成功');
          this.getServiceSpecification();
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    updateSms(id, name) {
      let params = {
        id: id,
        name: name
      };
      http
        .put('/admin/businessProductSpecification/specification.jhtml', params)
        .then(data => {
          this.getServiceSpecification();
        })
        .catch(errData => {
          this.$message.warning(errData.errorMessage);
        });
    },
    rowDeleteClickHandler(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          ids.push(id);
          if (id === '') {
            this.tableData.splice(0, 0);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getServiceSpecification();
          } else {
            let params = {
              ids: ids
            };
            service.deleteSpecification(
              params,
              data => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getServiceSpecification();
              },
              ErrorData => {
                this.$message.warning(ErrorData.errorMessage);
              }
            );
          }
        })
        .catch(() => {});
    },
    defaultService() {
      return {
        name: '',
        id: ''
      };
    },
    add() {
      this.speId = '';
      let emptyDataList = {
        id: '',
        name: '',
        type: '0',
        sort: 'null'
      };
      this.tableData.push(emptyDataList);
    }
  }
};
</script>

<style lang="scss">
.sms-specification {
  .service-Content {
    // margin-left: 50px;
    padding: 20px 50px;
    // padding-left: 180px;
  }
  .biz-header .biz-header__operation-wrapper {
    float: left;
  }
  .time {
    font-size: 14px;
    clear: #606266;
  }
  .tag {
    font-size: 14px;
    clear: #606266;
  }
}
</style>
