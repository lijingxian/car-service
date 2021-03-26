## 单个资源

| 方法   | 参数位置    | 举例               | 说明             |
| ------ | ----------- | ------------------ | ---------------- |
| GET    | URL         | `good?id=1`        | 查看单个商品详情 |
| POST   | RequestBody | `{"name":"商品1"}` | 创建单个商品     |
| PUT    | RequestBody | `{"name":"商品1"}` | 更新单个商品     |
| DELETE | URL         | `good?id=1`        | 删除单个商品     |

## 多个资源

| 方法   | 参数位置        | 举例                                        | 说明             |
| ------ | --------------- | ------------------------------------------- | ---------------- |
| GET    | URL             | `good?type=1`                               | 查看多个商品集合 |
| PUT    | URL+RequestBody | `good?type=1`+`{"ids":["id":"1","id":"2"]}` | 改变多个商品状态 |
| DELETE | RequestBody     | `{"ids":["id":"1","id":"2"]}`               | 删除多个商品     |