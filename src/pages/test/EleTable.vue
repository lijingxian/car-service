<template>
  <div>
    <biz-flex-table :tableData="handleTableDataNew" :span-method="objectSpanMethodNew">
      <el-table-column prop="col1Name" label="一级分类">
      </el-table-column>
      <el-table-column prop="col2Name" label="二级分类">
      </el-table-column>
      <el-table-column prop="col3Name" label="三级分类">
      </el-table-column>
      <el-table-column prop="col4Name" label="四级分类">
      </el-table-column>
      <el-table-column label="属性">
      </el-table-column>
    </biz-flex-table>
  </div>
</template>

<script>
import { BizFlexTable } from '@/components/BizTable';

export default {
  data() {
    return {
      testData: [
        {
          id: '1',
          name: '我是以及',
          childrenTagCategoryData: [
            {
              id: '11',
              name: '二级',
              children: [
                {
                  id: '111',
                  name: '三级',
                  children: [
                    {
                      id: '1111',
                      name: '4级'
                    },
                    {
                      id: '1112',
                      name: '4级1'
                    }
                  ]
                },
                {
                  id: '112',
                  name: '三级',
                  children: [
                    {
                      id: '1121',
                      name: '4级'
                    },
                    {
                      id: '1122',
                      name: '4级1'
                    }
                  ]
                }
              ]
            },
            {
              id: '12',
              name: '二级21',
              children: [
                {
                  id: '121',
                  name: '三级',
                  children: [
                    {
                      id: '1211',
                      name: '4级'
                    },
                    {
                      id: '1212',
                      name: '4级1'
                    }
                  ]
                },
                {
                  id: '122',
                  name: '三级',
                  children: [
                    {
                      id: '1221',
                      name: '4级'
                    },
                    {
                      id: '1222',
                      name: '4级1'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: '2',
          name: '我是以及',
          childrenTagCategoryData: [
            {
              id: '21',
              name: '二级',
              children: [
                {
                  id: '211',
                  name: '三级',
                  children: [
                    {
                      id: '2111',
                      name: '4级'
                    },
                    {
                      id: '2112',
                      name: '4级1'
                    }
                  ]
                },
                {
                  id: '212',
                  name: '三级',
                  children: [
                    {
                      id: '2121',
                      name: '4级'
                    },
                    {
                      id: '2122',
                      name: '4级1'
                    }
                  ]
                }
              ]
            },
            {
              id: '22',
              name: '二级21',
              children: [
                {
                  id: '221',
                  name: '三级',
                  children: [
                    {
                      id: '2211',
                      name: '4级'
                    },
                    {
                      id: '2212',
                      name: '4级1'
                    }
                  ]
                },
                {
                  id: '222',
                  name: '三级',
                  children: [
                    {
                      id: '2221',
                      name: '4级'
                    },
                    {
                      id: '2222',
                      name: '4级1'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  },
  computed: {
    handleTableDataNew() {
      let array = [];
      for (const col1 of this.testData) {
        for (const col2 of col1.childrenTagCategoryData) {
          for (const col3 of col2.children) {
            for (const col4 of col3.children) {
              array.push({
                col1Id: col1.id,
                col1Name: col1.name,
                col2Id: col2.id,
                col2Name: col2.name,
                col3Id: col3.id,
                col3Name: col3.name,
                col4Id: col4.id,
                col4Name: col4.name
              });
            }
          }
        }
      }

      return array;
    }
  },
  components: {
    BizFlexTable
  },
  methods: {
    objectSpanMethodNew({ row, column, rowIndex, columnIndex }) {
      // 第一列
      if (columnIndex === 1) {
        if (this.isHead1(row)) {
          return {
            rowspan: this.getRows1(row),
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      } else if (columnIndex === 2) {
        if (this.isHead2(row)) {
          return {
            rowspan: this.getRows2(row),
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      } else if (columnIndex === 3) {
        if (this.isHead3(row)) {
          return {
            rowspan: this.getRows3(row),
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    isHead1(row) {
      let tempArray = [];
      for (const iterator of this.handleTableDataNew) {
        if (iterator.col1Id === row.col1Id) {
          tempArray.push(iterator);
        }
      }
      if (tempArray[0].col4Id === row.col4Id) {
        return true;
      }

      return false;
    },
    getRows1(row) {
      let tempArray = [];
      for (const iterator of this.handleTableDataNew) {
        if (iterator.col1Id === row.col1Id) {
          tempArray.push(iterator);
        }
      }
      return tempArray.length;
    },
    isHead2(row) {
      let tempArray = [];
      for (const iterator of this.handleTableDataNew) {
        if (iterator.col2Id === row.col2Id) {
          tempArray.push(iterator);
        }
      }

      if (tempArray[0].col4Id === row.col4Id) {
        return true;
      }
      return false;
    },
    getRows2(row) {
      let tempArray = [];
      for (const iterator of this.handleTableDataNew) {
        if (iterator.col2Id === row.col2Id) {
          tempArray.push(iterator);
        }
      }
      return tempArray.length;
    },
    isHead3(row) {
      let tempArray = [];
      for (const iterator of this.handleTableDataNew) {
        if (iterator.col3Id === row.col3Id) {
          tempArray.push(iterator);
        }
      }

      if (tempArray[0].col4Id === row.col4Id) {
        return true;
      }
      return false;
    },
    getRows3(row) {
      let tempArray = [];
      for (const iterator of this.handleTableDataNew) {
        if (iterator.col3Id === row.col3Id) {
          tempArray.push(iterator);
        }
      }
      return tempArray.length;
    }
  }
};
</script>
