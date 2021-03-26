<template>
  <div class="screen-mgmt">
    <biz-flex-table ref="table" v-loading="loading" :operations="operations" @operate="operate" :tableData="tableData"
      :filters="filters" :pagination="pagination" @row-click="rowClick" @selection-change="handleSelectionChange"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" @filter-data-change="filterDataChange">
      <el-table-column prop="name" label="挪车码名称" min-width="100">
      </el-table-column>
      <el-table-column label="激活数量/生成数量" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.usedCount}}/{{scope.row.count}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="来源" prop="source" min-width="100" :formatter="sourceFormatter">
      </el-table-column>
      <el-table-column label="操作信息" min-width="100">
        <template slot-scope="scope">
          <div style="width:100%">
            <div class="overflow">
              {{scope.row.operator?scope.row.operator.name:''}}
            </div>
            <div class="overflow">
              {{scope.row.createDate}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 注意，biz-column-operation里面需要使用v-if控制按钮显示逻辑 -->
          <biz-column-operation :row="scope.row">
            <el-button type="text" size="mini" @click.stop="deleteRow(scope.row.id)">
              删除
            </el-button>
            <el-button type="text" size="mini" @click.stop="load(scope.row)">
              下载
            </el-button>
            <el-button type="text" size="mini" @click.stop="printClick(scope.row)">
              打印
            </el-button>
          </biz-column-operation>
        </template>
      </el-table-column>
    </biz-flex-table>
    <biz-popup-tabs v-model="tabName" :open="openPopup" @close="openPopup = false;">
      <el-tab-pane label="基本信息" name="baseinfo">
        <BaseInfo ref="baseinfo" :open="openPopup" :id="itemId" @created="refresh">
        </BaseInfo>
      </el-tab-pane>
      <el-tab-pane label="挪车码列表" name="list" v-if="itemId">
        <MoveCodeList ref="list" :id="itemId" @created="refresh" :shopId="shopId">
        </MoveCodeList>
      </el-tab-pane>
    </biz-popup-tabs>
    <div class="code-div">
      <ul id="codeImgviewer" v-if="codePicList != null && codePicList.length != 0">
        <li v-for="(item,index) in codePicList" :key="index">
          <div :id="'codeimg' + index" style="page-break-after: always;">
            <div style="position:relative">
              <!-- <img :src="item.moveCodeBg" width="600px" height="500px" /> -->
              <img :src="item.code" class="code" style="width: 600px;height: 500px" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';
import { BizPopupTabs } from '@/components/BizPopup';
import http from '@/common/http';
import BaseInfo from './BaseInfo';
import MoveCodeList from './MoveCodeList';
import moveCodeBg from '@/assets/images/moveCodeBg.png';
import ColumnsMixin from '@/common/mixin/ColumnsMixin.js';
export default {
  name: 'WechatUrlMgmt',
  data() {
    return {
      loading: false,
      openPopup: false,
      itemId: '',
      shopId: '',
      moveCodeBg: moveCodeBg,
      tabName: 'baseinfo',
      codePicList: [],
      multipleSelection: [],
      filters: [
        {
          type: 'select',
          label: '所属店铺',
          name: 'searchValue',
          filterable: true,
          value: '',
          options: []
        },
        {
          type: 'select',
          label: '来源',
          name: 'source',
          value: '',
          options: [
            { value: '', label: '全部' },
            { value: '4', label: '用户申请' },
            { value: '1', label: '店铺发放' },
            { value: '0', label: '平台发放' }
          ]
        },
        {
          type: 'input',
          label: '',
          placeholder: '请输入挪车码名称',
          name: 'searchValue',
          value: ''
        }
      ],
      operations: [
        {
          label: '新增',
          name: 'add',
          type: 'primary'
        },
        {
          disabled: true,
          label: '删除',
          name: 'deleteList',
          type: ''
        },
        {
          label: '刷新',
          name: 'refresh',
          type: ''
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      }
    };
  },
  components: {
    BizFlexTable,
    BaseInfo,
    BizPopupTabs,
    MoveCodeList
  },
  mixins: [ColumnsMixin],
  created() {
    this.refresh();
    this.getShop();
  },
  mounted() {},
  methods: {
    operate(name) {
      this[name]();
    },
    refresh() {
      this.openPopup = false;
      this.getList();
    },
    load(row) {
      if (!row.range) {
        this.$message.warning('挪车码正在生成中，请稍候下载');
        return;
      }
      let text =
        document.location.protocol +
        '//' +
        window.location.host +
        '/vfuhuizhong/html/wxqrcode.html?type=5&id=' +
        row.store.id +
        'XXXXXXXXXX&shopId=' +
        row.store.id +
        '               ' +
        'XXXXXXXXXX范围：' +
        row.range;
      this.downLoad(row.name, text);
      this.updateState(row);
    },
    downLoad(filename, text) {
      let pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      pom.setAttribute('download', filename);
      if (document.createEvent) {
        let event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    },
    getShop() {
      http
        .get('/admin/store/pullDownShops.jhtml', {})
        .then(data => {
          this.filters[0].options = [{ label: '全部', value: '' }].concat(
            data.shops.map(item => {
              return { label: item.name, value: item.id };
            })
          );
        })
        .catch(ErrorData => {
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    sourceFormatter(row) {
      switch (row.source) {
        case '0':
          return '平台发放';
        case '1':
          return '店铺发放';
        case '4':
          return '用户申请';
        default:
          break;
      }
    },
    getList() {
      this.loading = true;
      let params = {
        shopId: this.filters[0].value || window.top.SHOP_ID || '',
        searchValue: this.filters[2].value,
        pageNumber: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        source: this.filters[1].value
      };
      http
        .get('/admin/movecar/moveCars.jhtml', params)
        .then(data => {
          this.loading = false;
          this.tableData = data.dataList;
          this.pagination.total = Number(data.total);
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    updateState(row) {
      let params = {
        count: row.count,
        id: row.id,
        type: row.type,
        name: row.name,
        state: '1',
        createDate: row.createDate,
        store: { id: row.store.id },
        company: { id: row.company.id }
      };
      http
        .put('/admin/movecar/moveCar.jhtml', params)
        .then(data => {
          this.loading = false;
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    // 批量操作-删除
    deleteList() {
      let ids = [];
      for (const iterator of this.multipleSelection) {
        ids.push(iterator.id);
      }
      this.delete(ids);
    },
    // 快捷操作-删除
    deleteRow(id) {
      let ids = [];
      ids.push(id);
      this.delete(ids);
    },
    // 后台删除
    delete(ids) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ids
          };
          http
            .delete('/admin/movecar/moveCar.jhtml', params)
            .then(data => {
              this.$message.success('删除成功');
              this.refresh();
            })
            .catch(ErrorData => {
              this.$message.warning(ErrorData.errorMessage);
            });
        })
        .catch(() => {});
    },
    // 添加推荐
    add() {
      this.tabName = 'baseinfo';
      this.itemId = '';
      this.openPopup = true;
      this.$refs.baseinfo.setDefaultModel();
    },
    handleSelectionChange(val) {
      this.operations[1].disabled = true;
      if (val.length > 0) {
        this.operations[1].disabled = false;
      }
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.refresh();
    },
    rowClick(row) {
      this.openPopup = true;
      this.itemId = row.id;
      this.shopId = row.store.id;
    },
    // 过滤器发生变动
    filterDataChange(val) {
      this.pagination.currentPage = 1;
      this.getList();
    },

    printClick(row) {
      this.$confirm('确定打印' + row.count + '个挪车码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          pageSize: 1000,
          pageNumber: 1,
          moveCarId: row.id || ''
        };
        this.loading = true;
        http
          .get('/admin/movecar/moveCarCodes.jhtml', params)
          .then(data => {
            this.loading = false;
            this.codePicList = [];
            data.dataList.map(item => {
              this.codePicList.push({ moveCodeBg: this.moveCodeBg, code: item.path });
            });
            if (this.codePicList === null || this.codePicList.length === 0) {
              return;
            }
            let newWin = window.open(''); // 新打开一个空窗口
            for (let i = 0; i < this.codePicList.length; i++) {
              let imageToPrint = document.getElementById('codeimg' + i); // 将要被打印的图片
              newWin.document.write(imageToPrint.outerHTML); // 将图片添加进新的窗口
            }
            newWin.document.close(); // 在IE浏览器中使用必须添加这一句
            newWin.focus(); // 在IE浏览器中使用必须添加这一句
            setTimeout(function() {
              newWin.print(); // 打印
              newWin.close(); // 关闭窗口
            }, 100);
            this.updateState(row);
          })
          .catch(ErrorData => {
            this.loading = false;
            this.$message.warning(ErrorData.errorMessage || '操作出现错误', 'warning');
            console.log('ERR_REFRESH: ', ErrorData);
          });
      });
    }
  }
};
</script>

<style lang="scss">
.screen-mgmt {
  .biz-customcol {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-button {
      margin-right: 10px;
    }
  }
  .delete-btn {
    color: red;
  }
  .selection-column {
    text-align: center;
  }
}
.code-div {
  margin: 0 auto;
  display: none;
}
</style>
