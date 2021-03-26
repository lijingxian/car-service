# Aside侧边弹出

> 侧边弹出组件说明

## 举例

注意：

- 遵从Vue组件的单向规则，需要使用者手动调节`open`来进行关闭和打开操作
- 在本popup继续弹出dialog时，需要对dislog添加`append-to-body`属性

```html
<template>
  <div class="hello">
    <el-button @click="open=true">打开popup</el-button>
    <biz-popup :open="open" @close="close">
      <el-button type="primary" @click="close">关闭popup</el-button>
      <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose"  append-to-body>
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </biz-popup>
  </div>
</template>

<script>
import BizPopup from '@/components/BizPopup';

export default {
  name: 'HelloWorld',
  components: {
    BizPopup
  },
  data() {
    return {
      open: false,
      dialogVisible: false
    };
  },
  methods: {
    close() {
      this.open = false;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

```

### Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| open   | popup的打开状态 | boolean | `true`,`false` | `false` |

### Events

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| close  | 关闭事件 | — |
