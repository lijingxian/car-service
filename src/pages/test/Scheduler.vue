<template>
  <biz-grid class="product-info">
    <div id="test" slot="top" style="margin-top:70px">
      <div id="top">
        <span>
          <el-button type="text" @click="handleadd" style="color:white">添加任务</el-button>
        </span>
      </div>
      <br />
      <el-input placeholder="请输入内容" v-model="criteria" style="padding-bottom:10px;">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="任务名" value="jobName"></el-option>
          <el-option label="任务描述" value="description"></el-option>
        </el-select>
        <el-button slot="append" icon="search" v-on:click="search"></el-button>
      </el-input>
    </div>
    <el-table ref="testTable" v-loading="loading" :data="tableData" style="width:100%" border :default-sort="{prop: 'jobName', order: 'ascending'}"
      @selection-change="handleSelectionChange" @row-click="handleclick" :row-class-name="tableRowClassName">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="schedName" label="调度器" sortable>
      </el-table-column>
      <el-table-column prop="jobName" label="任务名" width="260" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="jobGroup" label="任务组" sortable>
      </el-table-column>

      <el-table-column prop="description" label="任务描述" sortable>
      </el-table-column>
      <el-table-column prop="cronExpression" label="表达式" sortable>
      </el-table-column>

      <el-table-column prop="triggerState" label="状态" sortable>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

          <el-button size="small" type="warning" @click="handlePause(scope.$index, scope.row)">暂停</el-button>

          <el-button size="small" type="info" @click="handleResume(scope.$index, scope.row)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="bottom">
      <biz-pagination :pagination="pagination" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></biz-pagination>
    </div>
    <el-dialog title="添加任务" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="任务名称" label-width="120px" style="width:55%">
          <el-input v-model="form.jobName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" label-width="120px" style="width:55%">
          <el-input v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务分组" label-width="120px" style="width:55%">
          <el-input v-model="form.jobGroup" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="表达式" label-width="120px" style="width:55%">
          <el-input v-model="form.cronExpression" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改任务" :visible.sync="updateFormVisible">
      <el-form :model="updateform">
        <el-form-item label="表达式" label-width="120px" style="width:55%">
          <el-input v-model="updateform.cronExpression" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </biz-grid>
</template>
<script>
import http from '@/common/http';
import { BizGrid } from '@/components/BizGrid';
import { BizPagination } from '@/components/BizTable';
export default {
  name: 'Scheduler',
  components: {
    BizGrid,
    BizPagination
  },
  data() {
    return {
      // 表格当前页数据
      tableData: [],
      loading: true,
      // 添加对话框默认可见性
      dialogFormVisible: false,
      // 修改对话框默认可见性
      updateFormVisible: false,
      // 提交的表单
      form: {
        jobName: '',
        jobGroup: '',
        description: '',
        cronExpression: ''
      },
      updateform: {
        jobName: '',
        jobGroup: '',
        description: '',
        cronExpression: ''
      },
      formLabelWidth: '120px',
      // 多选数组
      multipleSelection: [],
      // 请求的URL
      api: {
        search: '/admin/qrtzJobDetails/list.jhtml',
        add: '/admin/qrtzJobDetails/add.jhtml',
        edit: '/admin/qrtzJobDetails/edit.jhtml',
        delete: '/admin/qrtzJobDetails/delete.jhtml',
        pause: '/admin/qrtzJobDetails/pause.jhtml',
        resume: '/admin/qrtzJobDetails/resume.jhtml'
      },
      // 搜索条件
      criteria: '',
      // 下拉菜单选项
      select: '',
      // 默认每页数据量
      pagesize: 20,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 100,
      pagination: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        pagerCount: 2
      }
    };
  },
  created() {
    this.loadData(this.criteria);
  },
  methods: {
    // 从服务器读取数据
    loadData: function(criteria) {
      let param = {};
      param[this.select] = criteria;
      param.pageNumber = this.pagination.currentPage;
      param.pageSize = this.pagination.pageSize;
      http
        .get(this.api.search, param)
        .then(data => {
          this.loading = false;
          this.tableData = data.datas;
          this.pagination.total = Number(data.total);
        })
        .catch(res => {
          this.$message.warning(res.errorMessage);
          this.loading = false;
        });
    },
    // 添加
    add: function() {
      http
        .post(this.api.add, {
          jobName: this.form.jobName,
          jobGroup: this.form.jobGroup,
          cronExpression: this.form.cronExpression,
          description: this.form.description
        })
        .then(data => {
          this.$message.success('添加成功');
          this.loadData(this.criteria);
          this.dialogFormVisible = false;
        })
        .catch(res => {
          this.$message.warning(res.errorMessage);
          this.loading = false;
        });
    },
    // 更新任务
    update: function() {
      http
        .post(this.api.edit, {
          jobName: this.updateform.jobName,
          jobGroup: this.updateform.jobGroup,
          cronExpression: this.updateform.cronExpression
        })
        .then(data => {
          this.$message.success('更新成功');
          this.loadData(this.criteria);
          this.updateFormVisible = false;
        })
        .catch(res => {
          this.$message.warning(res.errorMessage);
          this.loading = false;
        });
    },
    // 单行删除
    handleDelete: function(index, row) {
      http
        .post(this.api.delete, {
          jobName: row.jobName,
          jobGroup: row.jobGroup
        })
        .then(data => {
          this.$message.success('删除成功');
          this.loadData(this.criteria);
        })
        .catch(res => {
          this.$message.warning(res.errorMessage);
          this.loading = false;
        });
    },
    // 暂停任务
    handlePause: function(index, row) {
      http
        .post(this.api.pause, {
          jobName: row.jobName,
          jobGroup: row.jobGroup
        })
        .then(data => {
          this.$message.success('操作成功');
          this.loadData(this.criteria);
        })
        .catch(res => {
          this.$message.warning(res.errorMessage);
          this.loading = false;
        });
    },
    // 恢复任务
    handleResume: function(index, row) {
      http
        .post(this.api.resume, {
          jobName: row.jobName,
          jobGroup: row.jobGroup
        })
        .then(data => {
          this.$message.success('操作成功');
          this.loadData(this.criteria);
        })
        .catch(res => {
          this.$message.warning(res.errorMessage);
          this.loading = false;
        });
    },
    // 多选响应
    handleSelectionChange: function(val) {
      this.multipleSelection = val;
    },
    // 点击行响应
    handleclick: function(row, event, column) {
      this.highlightId = row.jobName + '.' + row.jobGroup;
    },
    // 编辑
    handleEdit: function(index, row) {
      console.log(row);
      this.updateform = row;
      this.updateFormVisible = true;
    },
    // 弹出对话框
    handleadd: function() {
      this.dialogFormVisible = true;
    },
    // 搜索
    search: function() {
      this.loadData(this.criteria);
    },
    dialogdd: function() {
      this.dialogFormVisible = true;
    },
    // 多项删除
    deletenames: function() {
      if (this.multipleSelection.length === 0) return;
      let array = [];
      this.multipleSelection.forEach(item => {
        array.push(item.id);
      });
      http
        .post('../delete', {
          array: array
        })
        .then(function(res) {
          this.$message.success('操作成功');
          this.loadData(this.criteria);
        })
        .catch(res => {
          this.$message.warning(res.errorMessage);
          this.loading = false;
        });
    },
    // 改变当前点击的行的class，高亮当前行
    tableRowClassName: function(row, index) {},
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagination.pageSize = val;
      this.loadData(this.criteria);
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.pagination.currentPage = val;
      this.loadData(this.criteria);
    }
  }
};
</script>

<style lang="scss">
.el-select .el-input {
  width: 110px;
}

.el-table .info-row {
  background: #c9e5f5;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

#top {
  background: #20a0ff;
  padding: 5px;
  overflow: hidden;
}
</style>
