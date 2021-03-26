<template>
  <div class="biz-file-uploader">
    <el-upload
      :show-file-list="true"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :data="data"
      :file-list="fileList"
      :limit="1"
      name="file"
      action="/admin/file/uploads.jhtml"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  props: {
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    data: {
      type: Object,
      default () {
        return {
          type: '3'
        };
      }
    },
    fileList: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data() {
    return {
      innerFileList: [],
      fileMap: {},
      uploadedFileList: []
    };
  },
  computed: {

  },
  methods: {
    handleRemove (file, fileList) {
      let index = this.getFileIndex(file);
      this.innerFileList.splice(index, 1);

      this.$emit('input', this.toFileUrl(this.innerFileList));
    },
    handleSuccess (res, file, fileList) {
      if (res.fis && res.fis[0]) {
        this.add(res.fis[0].url, file);
        this.$emit('fileListChange', fileList);
        // this.uploadedFileList = fileList;
      } else {
        fileList.pop();
        this.$message.warning('文件类型错误');
      }
    },
    handleError (err, file, fileList) {
      if (err) {
        this.$message.warning(err);
      } else {
        this.$message.warning('发生错误');
      }
    },

    add (url, file) {
      this.innerFileList.push({
        uid: file.uid,
        url: url
      });

      this.$emit('input', this.toFileUrl(this.innerFileList));
    },
    getFileIndex (file) {
      let index = -1;
      this.innerFileList.forEach((item, i) => {
        if (item.url === file.url) index = i;
      });

      return index;
    },
    toFileUrl (fileList) {
      let result = [];
      this.innerFileList.forEach(item => {
        result.push(item.url);
      });

      return result;
    }
    // getFileNames () {
    //   let arr = [];
    //   this.uploadedFileList.forEach(file => {
    //     arr.push(file.name);
    //   });

    //   return arr;
    // }
  },
  watch: {
    value (val) {
      let arr = [];
      val.forEach(item => {
        arr.push({ url: item });
      });
      this.innerFileList = arr;
    }
  }
};
</script>

<style lang="scss">

</style>
