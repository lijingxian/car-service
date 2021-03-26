<template>
  <biz-grid class="shop-publicity-publish-setting">
    <div slot="top" class="btn-descrip" style="align-items: end;">
      <biz-save-button slot="top" :operations="operations" @operate="operate" v-if="isEdit"></biz-save-button>
    </div>
    <div class="publish-setting-area" v-loading="loading">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item name="1" title="通用设置">
          <div>
            <div class="style-all">
              <span class="publish-title">推送渠道</span>
              <div style="width:80%">
                <div style="flex-wrap: wrap;display:flex;">
                  <span v-if="isShowVF" style="padding-top:10px;margin-right:-20px">V服</span>
                  <div v-for="item in form" :key="item.index" @change="checkChange" style="padding-left:30px;padding-right:30px">
                    <el-checkbox
                      true-label="1"
                      false-label="0"
                      :disabled="isDisabled || !!Number(item.isDefault)"
                      v-model="item.isChecked"
                      v-if="item.type!=='8'&&item.type!=='9'&&item.type!=='10'"
                    >{{ typeList[item.type] }}</el-checkbox>
                    <el-button v-if="item.type==='0'" type="text" size="mini" v-popover:codePop0>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-button v-if="item.type==='1'" type="text" size="mini" v-popover:codePop1>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-button v-if="item.type==='2'" type="text" size="mini" v-popover:codePop2>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-button v-if="item.type==='3'" type="text" size="mini" v-popover:codePop3>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-button v-if="item.type==='4'" type="text" size="mini" v-popover:codePop4>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-button v-if="item.type==='5'" type="text" size="mini" v-popover:codePop5>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-button v-if="item.type==='6'" type="text" size="mini" v-popover:codePop6>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-popover ref="codePop0" placement="top-start" trigger="hover">
                      服务推荐，用户进入服务页时在推荐栏以信息流形式展现；
                    </el-popover>
                    <el-popover ref="codePop1" placement="bottom-start" trigger="hover">
                      爱车频道，用户进入爱车频道功能时以信息流形式展现；
                    </el-popover>
                    <el-popover ref="codePop2" placement="bottom-start" trigger="hover">
                      APP启动，用户启动APP时首屏展现；
                    </el-popover>
                    <el-popover ref="codePop3" placement="bottom-start" trigger="hover">
                      近期活动，用户进入近期功能时以弹出框形式展现；
                    </el-popover>
                    <el-popover ref="codePop4" placement="bottom-start" trigger="hover">
                      最新促销，用户进入最新促销功能时以弹出框形式展现；
                    </el-popover>
                    <el-popover ref="codePop5" placement="bottom-start" trigger="hover">
                      V商宣传，用户进入V商功能时在上方banner处展示。
                    </el-popover>
                    <el-popover ref="codePop6" placement="bottom-start" trigger="hover">
                      领优惠券，用户进入领优惠券功能时以弹出框形式展现；
                    </el-popover>
                  </div>
                </div>
                <div style="flex-wrap: wrap;display:flex;">
                  <span v-if="isShowBaidu&&(article.typeStr==='11'||article.typeStr==='12')" style="padding-top:10px;margin-right:-20px">头条</span>
                  <div v-for="item in form" :key="item.index" @change="checkChange">
                    <el-checkbox
                      true-label="1"
                      false-label="0"
                      v-model="item.isChecked"
                      v-if="item.type==='8'&&(article.typeStr==='11'||article.typeStr==='12')"
                      style="padding-left:30px;"
                    >{{ typeList[item.type] }}</el-checkbox>
                    <el-button v-if="item.type==='8'&&(article.typeStr==='11'||article.typeStr==='12')" type="text" size="mini" v-popover:codePop8>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-popover ref="codePop8" placement="bottom-start" trigger="hover">
                      今日头条信息流：投放后将在今日头条展示。
                    </el-popover>
                  </div>
                </div>
                <div style="flex-wrap: wrap;display:flex;">
                  <span v-if="isShowBaidu&&(article.typeStr==='11'||article.typeStr==='12')" style="padding-top:10px;margin-right:-20px">百度</span>
                  <div v-for="item in form" :key="item.index" @change="checkChange">
                    <el-checkbox
                      true-label="1"
                      false-label="0"
                      v-model="item.isChecked"
                      v-if="(item.type==='9'||item.type==='10')&&(article.typeStr==='11'||article.typeStr==='12')"
                      style="padding-left:30px"
                    >{{ typeList[item.type] }}</el-checkbox>
                    <el-button v-if="item.type==='9'&&(article.typeStr==='11'||article.typeStr==='12')" type="text" size="mini" v-popover:codePop9>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-popover ref="codePop9" placement="bottom-start" trigger="hover">
                      百度信息流：投放后将在百度信息流展示。
                    </el-popover>
                    <el-button v-if="item.type==='10'&&(article.typeStr==='11'||article.typeStr==='12')" type="text" size="mini" v-popover:codePop10>
                      <i class="iconfont el-icon-question"></i>
                    </el-button>
                    <el-popover ref="codePop10" placement="bottom-start" trigger="hover">
                      百度搜索推广：投放后用户在百度搜索时将能够按设置的关键词搜索到您的内容。
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
            <div class="style-all">
              <span class="publish-title">推送开始时间</span>
              <el-date-picker :disabled="isDisabled" type="date" size="small" value-format="yyyy-MM-dd" v-model="beginDate" clearable></el-date-picker>
            </div>
            <div class="style-all">
              <span class="publish-title">推送结束时间</span>
              <el-date-picker :disabled="isDisabled" type="date" size="small" value-format="yyyy-MM-dd" v-model="endDate" clearable></el-date-picker>
            </div>
            <div class="style-all" v-if="showTTBudget||showBDBudget||showBDSBudget">
              <span class="publish-title">预算</span>
              <div style="width:75%">
                <span style="float:left">总预算￥{{beginDate&&endDate?dateInterval(beginDate,endDate)*totalAmount:0}}，当前账户可用余额￥{{availableAmount}}
                  <el-button size="small" type="text" @click="recharge">充值</el-button>
                </span>
                <el-table :data="tableBuget" style="width: 100%;margin-bottom: 10px;margin-top: 10px;" size="small">
                  <el-table-column label="渠道" prop="name"></el-table-column>
                  <el-table-column label="日预算" prop="budget" min-width="110">
                    <template slot="header">
                      <div slot="label">
                        日预算
                        <el-button type="text" size="small" v-popover:budgetPop>
                          <i class="iconfont el-icon-question"></i>
                        </el-button>
                        <el-popover ref="budgetPop" placement="bottom-start" width="300" trigger="hover">
                          <p>预算是指您愿意每天为该推送支付的价格上限，费用按照第三方渠道的真实收费进行收取</p>
                        </el-popover>
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <el-input style="width:110px" size="mini" v-model="scope.row.budget" @change="budgetChange"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="点击出价" prop="bid" min-width="120">
                    <template slot="header">
                      <div slot="label">
                        点击出价
                        <el-button type="text" size="small" v-popover:bidPop>
                          <i class="iconfont el-icon-question"></i>
                        </el-button>
                        <el-popover ref="bidPop" placement="bottom-start" width="300" trigger="hover">
                          <p>点击出价是指您愿意为每次点击支付的目标价格。价格的高低会影响您获得的转化次数。例如，如果设置的目标价格过低，您可能会错失一部分转化。</p>
                        </el-popover>
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <el-input style="width:110px" size="mini" v-model="scope.row.bid" :disabled="scope.row.isDisabled"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="style-all">
              <span class="publish-title">推送人群性别</span>
              <el-radio-group v-model="sex" style="padding:5px">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
                <el-radio label="2">不限</el-radio>
              </el-radio-group>
            </div>
            <div class="style-all">
              <span class="publish-title">推送人群年龄</span>
              <el-checkbox-group v-model="ageGroup" style="width: 300px;text-align: left;margin-top: -10px;" @change="ageChange">
                <el-checkbox label :disabled="isCanCelect0">不限</el-checkbox>
                <el-checkbox label="1" :disabled="isCanCelect">青年</el-checkbox>
                <el-checkbox label="2" :disabled="isCanCelect">中青年</el-checkbox>
                <el-checkbox label="3" :disabled="isCanCelect">中年</el-checkbox>
                <el-checkbox label="4" :disabled="isCanCelect">中老年</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="style-all">
              <span class="publish-title">推送人群地域</span>
              <div style="text-align:left;width:350px">
                <el-radio-group v-model="radioButton" style="padding:5px;" @change="areaChange">
                  <el-radio label value>不限</el-radio>
                  <el-radio label="1">自定义</el-radio>
                </el-radio-group>
                <el-cascader v-if="radioButton==='1'" :options="options" :props="props" v-model="areas" style="width:100%"></el-cascader>
              </div>
            </div>
            <div v-show="showKeyWords">
              <span class="keyword-title" v-popover:keywordsPop>
                竞价关键词
                <i class="iconfont el-icon-question" style="color: #ff7300"></i>
                <el-popover ref="keywordsPop" placement="left" width="300" trigger="hover">
                  <div>
                    <p>在百度搜索时，系统会自动跳转对应的关键词，将推广结果展现在网民面前。关键词的合理设置有助于提高推广内容的展示机会。</p>
                    <p>以下列出了几类常见的关键词：</p>
                    <p>1、产品词，可以是您提供的产品/服务的大类，也可以是产品细类，可能具体到种类、型号、品牌等。前者如“汽车”，这类词搜索量较大，能够覆盖更多的潜在客户，竞争可能较为激烈；后者如““奥迪A4价格”，这类词的搜索意图一般较为明确，建议您着重突出您的产品特色，明确传达价格、促销等卖点。</p>
                    <p>2、通俗词，即网民可能使用的一些口语式表达，可能以疑问句式和陈述句式出现，如“宝马x3和奥迪q5哪个好”，使用这类词的一般为个人消费者，搜索目的可能以信息获取为主，对商业推广结果的关注程度不同，给您带来的转化效果和商业价值也有所不同，建议您根据自身业务特点进行尝试。</p>
                    <p>3、地域词，即以上产品词、通俗词等与地域名称的组合，如“北京宝马团购”。搜索这类词的网民的商业意图更为明确，一般希望本地消费/购买，建议您在创意中突出产品/服务的地域便利性。</p>
                    <p>4、品牌词，即含有您的自有品牌的关键词，如“V服”。</p>
                  </div>
                </el-popover>
              </span>
              <el-button type="primary" size="small" @click="addKeyWord">选择关键词模板</el-button>
              <el-table :data="bidKeywords" style="width: 75%;margin-left: 110px;margin-bottom: 10px;margin-top: 10px;" size="small">
                <el-table-column label="关键词" prop="name"></el-table-column>
                <el-table-column label="出价" prop="price">
                  <div slot-scope="scope">
                    <div class="biz-customcol" style="width: 100px">
                      <el-input size="mini" v-model="scope.row.price" @change="calcRate(scope.row)"></el-input>
                    </div>
                  </div>
                </el-table-column>
                <el-table-column label="命中率" prop="hitRate">
                  <template slot-scope="scope">{{scope.row.hitRate?scope.row.hitRate:'60'}}%</template>
                </el-table-column>
                <el-table-column prop="title" label="操作" min-width="90px">
                  <template slot-scope="scope">
                    <div class="biz-customcol">
                      <el-button type="text" size="mini" @click="rowDeleteClickHandler(scope)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="add-tag">
                <el-input v-model="newTagName" :maxlength="18" style="margin-right:10px;" placeholder="请输入自定义关键词"></el-input>
                <el-button @click="addNewTag" type="primary" style="padding: 7px 15px;">添加</el-button>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" title="个性化样式设置">
          <div v-for="item in form" :key="item.index">
            <div v-if="!!Number(item.isChecked)">
              <el-collapse v-model="stypeSetting" accordion class="settingClass">
                <el-collapse-item name="0" v-if="item.type==='0'">
                  <template slot="title">
                    <span class="title-style">V服-服务推荐</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                </el-collapse-item>
                <el-collapse-item name="1" v-if="item.type==='1'">
                  <template slot="title">
                    <span class="title-style">V服-爱车频道</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                </el-collapse-item>
                <el-collapse-item name="2" v-if="item.type==='2'">
                  <template slot="title">
                    <span class="title-style">V服-APP启动</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" :disabled="item.type === '1'">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">图片</span>
                      <biz-avatar-uploader-recommend
                        v-model="item.setting.imagePaths"
                        :showUploader="item.setting.imagePaths&&item.setting.imagePaths.length>=1?false:true"
                      ></biz-avatar-uploader-recommend>
                    </div>
                    <div
                      class="style-all"
                      v-if="item.setting.showType === '1'"
                    >
                      <span class="publish-title">描述</span>
                      <el-input v-model="item.setting.content" type="textarea" placeholder="请输入描述" maxlength="40"></el-input>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="3" v-if="item.type==='3'">
                  <template slot="title">
                    <span class="title-style">V服-近期活动</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" :disabled="item.type === '1'">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">图片</span>
                      <biz-avatar-uploader-recommend
                        v-model="item.setting.imagePaths"
                        :showUploader="item.setting.imagePaths&&item.setting.imagePaths.length>=1?false:true"
                      ></biz-avatar-uploader-recommend>
                    </div>
                    <div
                      class="style-all"
                      v-if="item.setting.showType === '1'"
                    >
                      <span class="publish-title">描述</span>
                      <el-input v-model="item.setting.content" type="textarea" placeholder="请输入描述" maxlength="40"></el-input>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="4" v-if="item.type==='4'">
                  <template slot="title">
                    <span class="title-style">V服-最新促销</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" :disabled="item.type === '1'">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">图片</span>
                      <biz-avatar-uploader-recommend
                        v-model="item.setting.imagePaths"
                        :showUploader="item.setting.imagePaths&&item.setting.imagePaths.length>=1?false:true"
                      ></biz-avatar-uploader-recommend>
                    </div>
                    <div
                      class="style-all"
                      v-if="item.setting.showType === '1'"
                    >
                      <span class="publish-title">描述</span>
                      <el-input v-model="item.setting.content" type="textarea" placeholder="请输入描述" maxlength="40"></el-input>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="5" v-if="item.type==='5'">
                  <template slot="title">
                    <span class="title-style">V服-V商宣传</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" :disabled="item.type === '1'">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">图片</span>
                      <biz-avatar-uploader-recommend
                        v-model="item.setting.imagePaths"
                        :showUploader="item.setting.imagePaths&&item.setting.imagePaths.length>=1?false:true"
                      ></biz-avatar-uploader-recommend>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="6" v-if="item.type==='6'">
                  <template slot="title">
                    <span class="title-style">V服-优惠券</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" :disabled="item.type === '1'">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">图片</span>
                      <biz-avatar-uploader-recommend
                        v-model="item.setting.imagePaths"
                        :showUploader="item.setting.imagePaths&&item.setting.imagePaths.length>=1?false:true"
                      ></biz-avatar-uploader-recommend>
                    </div>
                    <div
                      class="style-all"
                      v-if="item.setting.showType === '1'"
                    >
                      <span class="publish-title">描述</span>
                      <el-input v-model="item.setting.content" type="textarea" placeholder="请输入描述"></el-input>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="7" v-if="item.type === '8'&&(article.typeStr==='11'||article.typeStr==='12')">
                  <template slot="title">
                    <span class="title-style">头条-信息流</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings" v-show="!!Number(item.isChecked)">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" @change="showTypeChange">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">标题</span>
                      <el-input v-model="item.setting.title" style="width:220px" placeholder="请输入标题"></el-input>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">图片</span>
                      <div>
                        <biz-avatar-uploader-recommend
                          :showMode="item.type==='8'&&item.setting.showType==='0'?'2':'3'"
                          v-model="item.setting.imagePaths"
                          :imageForm="imageForm"
                          @handleImageHL="handleImageHL"
                          :showUploader="item.setting.imagePaths&&((item.setting.showType==='1'&&item.setting.imagePaths.length>=3) || ((item.setting.showType==='0'||item.setting.showType==='2'||item.type==='10')&&item.setting.imagePaths.length>=1))?false:true"
                        ></biz-avatar-uploader-recommend>
                        <div
                          v-if="item.type==='8'&&item.setting.showType==='0'"
                          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px;max-width:310px"
                        >建议最佳：宽高比16:9,1280*720≤尺寸≤2560*1440,支持JPG、PNG等图片格式，图片不超过500K</div>
                        <div
                          v-if="item.type==='8'&&(item.setting.showType==='1'||item.setting.showType==='2')"
                          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px;max-width:310px"
                        >建议最佳：宽高比1.52,456*300≤尺寸≤1368*900,支持JPG、PNG等图片格式，图片不超过500K</div>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="8" v-if="item.type === '9'&&(article.typeStr==='11'||article.typeStr==='12')">
                  <template slot="title">
                    <span class="title-style">百度-信息流</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings" v-show="!!Number(item.isChecked)">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" @change="showTypeChange">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">标题</span>
                      <el-input v-model="item.setting.title" style="width:220px" placeholder="请输入标题"></el-input>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">图片</span>
                      <div>
                        <biz-avatar-uploader-recommend
                          :showMode="item.type==='9'&&item.setting.showType==='0'?'4':'5'"
                          v-show="item.type === '9'"
                          v-model="item.setting.imagePaths"
                          :imageForm="imageForm"
                          @handleImageBDL="handleImageBDL"
                          :showUploader="item.setting.imagePaths&&((item.setting.showType==='1'&&item.setting.imagePaths.length>=3) || ((item.setting.showType==='0'||item.setting.showType==='2')&&item.setting.imagePaths.length>=1))?false:true"
                        ></biz-avatar-uploader-recommend>
                        <div
                          v-if="item.type==='9'&&item.setting.showType==='0'"
                          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px;max-width:310px"
                        >建议最佳：尺寸1140*640,支持JPG、PNG等图片格式，图片不超过500K</div>
                        <div
                          v-if="item.type==='9'&&(item.setting.showType==='1'||item.setting.showType==='2')"
                          style="color:rgba(0, 0, 0, 0.65);text-align:left;font-size:13px;max-width:310px"
                        >建议最佳：尺寸370*245,支持JPG、PNG等图片格式，图片不超过200K</div>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="9" v-if="item.type === '10'&&(article.typeStr==='11'||article.typeStr==='12')">
                  <template slot="title">
                    <span class="title-style">百度-搜索推广</span>
                    <el-button type="text" @click="preview(item)">预览</el-button>
                  </template>
                  <div class="settings" v-show="!!Number(item.isChecked)">
                    <div class="style-all">
                      <span class="publish-title">推送样式</span>
                      <el-radio-group class="type-group" v-model="item.setting.showType" @change="showTypeChange">
                        <el-radio :disabled="isDisabled" v-for="showType in showTypeList[item.type]" :key="showType.index" :label="showType.type">
                          <img :src="showType.img" alt />
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">标题</span>
                      <el-input v-model="item.setting.title" style="width:220px" placeholder="请输入标题"></el-input>
                    </div>
                    <div class="style-all">
                      <span class="publish-title">描述</span>
                      <el-input v-model="item.setting.content" type="textarea" placeholder="请输入描述" maxlength="40"></el-input>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <publish-preview :itemId="itemId" :previewDialog.sync="showPreview" :form="article" :formlist="articleVfu" :type="previewType" :open="showPreview"></publish-preview>
    <publish-preview-third :itemId="itemId" :previewDialog.sync="showPreviewThird" :formlist="article3" :type="previewType" :open="showPreviewThird"></publish-preview-third>
    <biz-dialog-selector
      title="关键词包选择"
      :visibility.sync="showDialog"
      :tableData="giftList"
      :appendToBody="true"
      :selectionMode="'single'"
      :isClear="false"
      :pagination="dialogPagination"
      :filters="dialogFilters"
      @pageSizeChange="dialogPageSizeChange"
      @currentPageChange="dialogCurrentPageChange"
      class="product-info-dailog"
      @confirmed="confirmedSelect"
      @filterDataChange="dialogFilterDataChange"
    >
      <el-table-column label="关键词包" prop="name"></el-table-column>
      <el-table-column label="关键词举例">
        <template slot-scope="scope">
          <template v-for="(keyword,index) in scope.row.keywords">
            {{keyword.name}}
            <template v-if="index < scope.row.keywords.length - 1">{{separator}}</template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="关键词个数">
        <template slot-scope="scope" v-if="scope.row.keywords">
          <div style="display: flex;align-items: center;">
            <div>{{getKeyWordNumber(scope.row.keywords)}}</div>
            <el-button type="text" size="mini" style="margin-left: 15px;" @click.stop="detail(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </biz-dialog-selector>
    <el-dialog :visible.sync="showDetail" center append-to-body custom-class="close-order-dialog">
      <el-button size="mini" type style="margin-bottom:10px;" @click.stop="backClick">返回</el-button>
      <el-table :data="detailData" size="small" ref="table" stripe tooltip-effect="dark" style="width: 100%" border highlight-current-row>
        <el-table-column label="关键词" prop="name"></el-table-column>
        <el-table-column label="推荐出价" prop="price">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="授权提示" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" custom-class="paymentDialog">
      <span style="display:block;font-size:16px;font-weight:700;margin-bottom:10px">
        <i class="el-icon-warning" style="color:#ff7300;margin-right:5px"></i>请您在新打开的页面中完成授权
      </span>
      <span>
        没有弹出窗口，说明您的浏览器禁止窗口弹出，请修改浏览器设置。
        <div>
          <span v-popover:codePop class="helpClass">查看帮助</span>
        </div>
      </span>
      <el-popover ref="codePop" placement="top-start" width="300" trigger="hover">
        <slot name="description">
          <p>查看"弹出窗口阻止程序"是否勾选的方法</p>
          <p>1、IE：打开IE浏览器菜单中选择“工具”--“Internet选项”，在新弹出来的对话框里找到“隐私”--“阻止显示大多数弹出框口”，将针对此项的勾选操作取消掉，点击“确定”，再进行支付。</p>
          <p>2、谷歌：工具栏右上角三道杠（设置）--显示高级设置--隐私设置--点击内容设置--允许所有网站显示弹出式窗口</p>
          <p>3、火狐：点击浏览器右上角“三道杠”图标--选项--内容--弹出式窗口--拦截弹出式窗口。若都没有勾选，您可以清理一下浏览器的缓存，清理成功后再关机重启试下。</p>
        </slot>
      </el-popover>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">授权遇到问题</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">授权完成</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showConfirmDialog" center append-to-body custom-class="confirm-dialog">
      <div style="font-size:16px;font-weight:bold;">
        <i class="el-icon-warning" style="padding:10px;color:#ff7300"></i>确定推送以下内容？
      </div>
      <div style="margin-top:10px;margin-left:35px">以下设置效果是否满足您的预期，如需要修改，请取消并修改。</div>
      <el-carousel arrow="always" style="height: 930px;">
        <el-carousel-item v-for="(list,index) in confirmData" :key="index">
          <h4 style="text-align: center;">{{list.type==='8'?'今日头条信息流':list.type==='9'?'百度信息流':list.type==='10'?'百度搜索推广':'V服渠道'}}</h4>
          <confirm-dialog :form="article" :formlist="list"></confirm-dialog>
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="close-button">
        <el-button @click="showConfirmDialog = false" size="mini" type>取消</el-button>
        <el-button @click="confirmSave" size="mini" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAmount" center append-to-body width="350px">
      <div style="font-size:12px;font-weight:bold;">
        <i class="el-icon-warning" style="padding:10px;color:#ff7300"></i>总预算需冻结资金额度超过账户可用余额，请前往【联盟-店铺管理-V服账户】充值
      </div>
      <div slot="footer" class="close-button">
        <el-button @click="dialogAmount = false" size="mini" type>知道了</el-button>
        <el-button @click="recharge" size="mini" type="primary">去充值</el-button>
      </div>
    </el-dialog>
  </biz-grid>
</template>

<script>
import { BizGrid } from '@/components/BizGrid';
import BizSaveButton from '@/components/BizSaveButton';
import BizDialogSelector from '@/components/BizDialogSelector';
import PublishPreview from './PublishPreview';
import PublishPreviewThird from './PublishPreviewThird';
import ConfirmDialog from './ConfirmDialog';
import { contentMgmt } from '@/common/urls';
import http from '@/common/http';
import { BizAvatarUploaderRecommend } from '@/components/BizForm';
import startA from '@/assets/images/push-preview/app-a.png';
import startB from '@/assets/images/push-preview/app-b.png';
import listA from '@/assets/images/push-preview/list-a.png';
import listB from '@/assets/images/push-preview/list-b.png';
import listC from '@/assets/images/push-preview/list-c.png';
import popB from '@/assets/images/push-preview/pop-b.png';
import slideA from '@/assets/images/push-preview/slide-a.png';
import listD from '@/assets/images/push-preview/word-list.png';
import listE from '@/assets/images/push-preview/big-pic.png';
import listF from '@/assets/images/push-preview/little-pic.png';
// import listG from '@/assets/images/push-preview/pic-word.png';
import listH from '@/assets/images/push-preview/group-pic.png';
import { mapGetters } from 'vuex';
export default {
  name: 'PublishSetting',
  props: {
    showPushToOtherShop: {
      type: Boolean,
      default() {
        return false;
      }
    },
    articleType: {
      type: String,
      default() {
        return '0';
      }
    },
    isDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    itemId: {
      type: Object,
      default() {
        return {
          id: ''
        };
      }
    },
    isEdit: {
      type: Boolean,
      default() {
        return true;
      }
    },
    article: {
      type: Object,
      default() {
        return {
          seoDescriptions: ''
        };
      }
    },
    activeNames: {
      type: Array,
      default() {
        return ['1', '2'];
      }
    },
    stypeSetting: {
      type: Array,
      default() {
        return ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      }
    }
  },
  data() {
    return {
      // 预览
      article3: {},
      articleVfu: {},
      previewType: '',
      availableAmount: '',
      totalAmount: 0,
      showPreview: false,
      dialogVisible: false,
      showPreviewThird: false,
      showDialog: false,
      showDetail: false,
      dialogAmount: false,
      showConfirmDialog: false,
      giftList: [],
      budget: '1000.00',
      bid: '1.00',
      beginDate: '',
      endDate: '',
      sex: '2',
      ageGroup: [''],
      radioButton: '',
      areas: [],
      bidKeywords: [],
      props: { multiple: true, value: 'id', label: 'name' },
      options: [],
      detailData: [],
      confirmData: [],
      newTagName: '',
      separator: '、',
      imageForm: [],
      tableBuget: [],
      imageSizeHL: {},
      imageSizeBDL: {},
      imageSizeBDS: {},
      isShowHL: false,
      isShowBaidu: false,
      isShowVF: false,
      showTTBudget: false,
      showBDBudget: false,
      showBDSBudget: false,
      showKeyWords: false,
      isCanCelect0: false,
      isCanCelect: true,
      dialogPagination: {
        pageSize: 20,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      dialogFilters: [
        {
          type: 'input',
          label: '',
          placeholder: '请输入关键词包名称',
          name: 'searchValue',
          value: ''
        }
      ],
      loading: false,
      operations: [
        {
          label: '保存',
          name: 'save',
          type: 'primary',
          disabled: false
        }
      ],
      form: this.resetForm(),
      // 推送类型列表
      typeList: {
        '0': '服务推荐',
        '1': '爱车频道',
        '2': 'APP启动',
        '3': '近期活动',
        '4': '最新促销',
        '5': 'V商宣传',
        '6': '优惠券',
        '7': '社区动态',
        '8': '今日头条信息流',
        '9': '百度信息流',
        '10': '百度搜索推广'
      },
      // 展示形式列表
      showTypeList: {
        // '0': [{ type: '0', img: listA }, { type: '1', img: listB }, { type: '2', img: listC }],
        '1': [
          { type: '0', img: listA },
          { type: '1', img: listB },
          { type: '2', img: listC }
        ],
        '2': [
          { type: '0', img: startA },
          { type: '1', img: startB }
        ],
        '3': [{ type: '0', img: popB }],
        '4': [{ type: '0', img: popB }],
        '5': [{ type: '0', img: slideA }],
        '6': [{ type: '0', img: popB }],
        '7': [
          { type: '0', img: listA },
          { type: '1', img: listB },
          { type: '2', img: listC }
        ],
        '8': [
          { type: '0', img: listE },
          { type: '1', img: listH },
          { type: '2', img: listF }
        ],
        '9': [
          { type: '0', img: listE },
          { type: '1', img: listH },
          { type: '2', img: listF }
        ],
        '10': [{ type: '0', img: listD }]
      },
      pubToOtherShop: false
    };
  },
  components: {
    BizGrid,
    BizSaveButton,
    PublishPreview,
    BizAvatarUploaderRecommend,
    BizDialogSelector,
    PublishPreviewThird,
    ConfirmDialog
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
    operate(name) {
      this[name]();
    },
    dateInterval(val, val1) {
      if (val && val1) {
        let dateBegin = new Date(val);
        let dateEnd = new Date(val1);
        let dateDiff = dateEnd.getTime() - dateBegin.getTime();
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
        return dayDiff;
      }
    },
    resetForm() {
      return [];
    },
    clear() {
      this.form = this.resetForm();
    },
    getKeyWordNumber(keywords) {
      return keywords.length;
    },
    recharge() {
      this.$router.replace({ path: '/union/shop/shop-account' });
    },
    checkChange() {
      this.tableBuget = [];
      for (let i = 0; i < this.form.length; i++) {
        if (this.form[i].type === '8' && this.form[i].isChecked === '1') {
          this.showTTBudget = true;
          this.tableBuget.push({ name: '头条-信息流', budget: '1000.00', bid: '1.00', isDisabled: false });
        }
        if (this.form[i].type === '9' && this.form[i].isChecked === '1') {
          this.showBDBudget = true;
          this.tableBuget.push({ name: '百度-信息流', budget: '1000.00', bid: '1.00', isDisabled: false });
        }
        if (this.form[i].type === '10' && this.form[i].isChecked === '1') {
          this.showBDSBudget = true;
          this.showKeyWords = true;
          this.tableBuget.push({ name: '百度-搜索推广', budget: '1000.00', bid: '--', isDisabled: true });
        }
        if (this.form[i].type === '8' && this.form[i].isChecked === '0') {
          this.showTTBudget = false;
        }
        if (this.form[i].type === '9' && this.form[i].isChecked === '0') {
          this.showBDBudget = false;
        }
        if (this.form[i].type === '10' && this.form[i].isChecked === '0') {
          this.showBDSBudget = false;
          this.showKeyWords = false;
        }
      }
      this.totalAmount = 0;
      this.tableBuget.forEach(item => {
        this.totalAmount += Number(item.budget);
      });
    },
    budgetChange(val) {
      for (const item of this.tableBuget) {
        if (
          (item.name === '头条-信息流' || item.name === '百度-信息流' || item.name === '百度-搜索推广')
        ) {
          if (val === '') {
            this.$message.warning('请输入预算');
            return;
          }
          if (!/^[0-9]+\.?[0-9]*$/.test(val)) {
            this.$message.warning('预算必须为数字值！');
            return;
          }
        }
        if (item.name === '头条-信息流' && Number(val) < 100) {
          this.$message.warning('预算请输入大于等于100的数');
          return;
        }
        if (
          item.name === '百度-信息流' &&
          (Number(val) < 100 || Number(val) > 10000)
        ) {
          this.$message.warning('预算请输入100-10000之间的数');
          return;
        }
        if (
          item.name === '百度-搜索推广' &&
          (Number(val) < 50 || Number(val) > 10000)
        ) {
          this.$message.warning('预算请输入50-10000之间的数');
          return;
        }
      };
      this.totalAmount = 0;
      this.tableBuget.forEach(item => {
        this.totalAmount += Number(item.budget);
      });
    },
    ageChange(val) {
      if (val[0] === '') {
        this.isCanCelect = true;
      } else if (val[0] === '1' || val[0] === '2' || val[0] === '3' || val[0] === '4') {
        this.isCanCelect0 = true;
      } else {
        this.isCanCelect0 = false;
        this.isCanCelect = false;
      }
    },
    areaChange(val) {
      if (val === '') {
        this.areas = [];
      } else {
        this.getAreas();
        for (const item of this.options) {
          if (item.children) {
            for (const child of item.children) {
              if (child.id === this.article.shop.area) {
                this.areas = [[item.id, this.article.shop.area]];
              }
            }
          }
        }
      }
    },
    showTypeChange(val) {
      for (let i = 0; i < this.form.length; i++) {
        if (this.form[i].type === '8' || this.form[i].type === '9') {
          if (val === '0' || val === '2') {
            if (this.form[i].setting.imagePaths.length > 1) {
              this.form[i].setting.imagePaths = this.form[i].setting.imagePaths.slice(0, 1);
            }
          }
        }
      }
    },
    rowDeleteClickHandler(val) {
      for (let i = 0; i < this.form.length; i++) {
        if (this.form[i].type === '10') {
          this.bidKeywords.splice(val.$index, 1);
        }
      }
    },
    detail(row) {
      this.showDetail = true;
      this.detailData = row.keywords;
    },
    backClick() {
      this.showDetail = false;
      this.showDialog = true;
    },
    refresh() {
      this.loading = true;
      let params = {
        id: this.itemId.id,
        type: this.articleType,
        shopId: this.getUser.shop.id
      };
      http
        .get(contentMgmt.publicity.push.query, params)
        .then(data => {
          this.loading = false;
          // let defaultImg = [];
          this.form = data.dataList;
          this.availableAmount = data.availableAmount;
          this.imageForm = this.form;
          this.getAreas();
          this.tableBuget = [];
          for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].isChecked === '1') {
              this.beginDate = this.form[i].setting.beginDate;
              this.endDate = this.form[i].setting.endDate;
              this.sex = this.form[i].setting.sex ? this.form[i].setting.sex : '2';
              this.ageGroup = this.form[i].setting.ageGroup ? this.form[i].setting.ageGroup : [''];
              if (this.ageGroup.length > 0) {
                for (const age of this.ageGroup) {
                  if (age === '') {
                    this.isCanCelect = true;
                  } else if (age === '1' || age === '2' || age === '3' || age === '4') {
                    this.isCanCelect0 = true;
                  } else {
                    this.isCanCelect0 = false;
                    this.isCanCelect = false;
                  }
                }
              }
            }
            if (
              (this.form[i].type === '2' ||
                this.form[i].type === '3' ||
                this.form[i].type === '4' ||
                this.form[i].type === '5' ||
                this.form[i].type === '6' ||
                this.form[i].type === '7') &&
              this.form[i].setting.imagePaths &&
              this.form[i].setting.imagePaths.length === 0
            ) {
              // for (let j = 0; j < 8; j++) {
              //   defaultImg.push(this.article.titleImage);
              // }
              if (this.article.titleImage && this.article.titleImage !== '') {
                this.form[i].setting.imagePaths[0] = this.article.titleImage;
              } else {
                this.form[i].setting.imagePaths = [];
              }
            }
            if (this.form[i].type === '8' && this.form[i].isChecked === '1') {
              this.showTTBudget = true;
              this.tableBuget.push({
                name: '头条-信息流',
                budget: this.form[i].setting.budget,
                bid: this.form[i].setting.bid,
                isDisabled: false
              });
            }
            if (this.form[i].type === '9' && this.form[i].isChecked === '1') {
              this.showBDBudget = true;
              this.tableBuget.push({
                name: '百度-信息流',
                budget: this.form[i].setting.budget,
                bid: this.form[i].setting.bid,
                isDisabled: false
              });
            }
            if (this.form[i].type === '10' && this.form[i].isChecked === '1') {
              this.showBDSBudget = true;
              this.showKeyWords = true;
              this.tableBuget.push({
                name: '百度-搜索推广',
                budget: this.form[i].setting.budget,
                bid: this.form[i].setting.bid,
                isDisabled: true
              });
              this.bidKeywords = this.form[i].setting.bidKeywords;
            }
            if (this.form[i].type === '8' && this.form[i].isChecked === '0') {
              this.showTTBudget = false;
            }
            if (this.form[i].type === '9' && this.form[i].isChecked === '0') {
              this.showBDBudget = false;
            }
            if (this.form[i].type === '10' && this.form[i].isChecked === '0') {
              this.showBDSBudget = false;
              this.showKeyWords = false;
            }
            if (this.form[i].type === '9' || this.form[i].type === '10') {
              this.isShowBaidu = true;
            }
            if (this.form[i].type === '8') {
              this.isShowHL = true;
            }
            if (this.form[i].type !== '8' && this.form[i].type !== '9' && this.form[i].type !== '10') {
              this.isShowVF = true;
            }
            this.totalAmount = 0;
            this.tableBuget.forEach(item => {
              this.totalAmount += Number(item.budget);
            });
          }
        })
        .catch(ErrorData => {
          this.loading = false;
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    handleImageHL(img) {
      this.imageSizeHL = img;
    },
    handleImageBDL(img) {
      this.imageSizeBDL = img;
    },
    handleImageBDS(img) {
      this.imageSizeBDS = img;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    calcRate(row) {
      let flg = true;
      let pFlg = true;
      let empFlg = true;
      if (!row.price) {
        this.$message.warning('请输入出价');
        this.loading = false;
        empFlg = false;
      } else if (!/^[0-9]+\.?[0-9]*$/.test(row.price)) {
        this.$message.warning('推荐出价格式错误!');
        this.loading = false;
        flg = false;
      } else if (!/^\d+\.?\d{0,2}$/.test(row.price)) {
        this.$message.warning('出价小数点后最多两位小数');
        this.loading = false;
        pFlg = false;
      }
      if (flg && pFlg && empFlg) {
        this.loading = true;
        let params = {
          store: window.top.SHOP_ID || ''
        };
        http
          .get('/admin/keyword/keywords.jhtml', params)
          .then(data => {
            data.dataList.forEach((item, index) => {
              item.keywords.forEach((key, index) => {
                if (key.id === row.id) {
                  if (!key.price) {
                    row.hitRate = '--';
                  } else {
                    row.hitRate = (Number(row.hitRate) + Number((row.price - key.price) / key.price)).toFixed(2);
                    if (Number(row.hitRate) > 99.99) {
                      row.hitRate = '99.99';
                    } else if (Number(row.hitRate) < 0.01) {
                      row.hitRate = '0.01';
                    } else {
                    }
                  }
                }
              });
            });
          })
          .catch(errData => {
            console.log(errData);
            console.log('code错误');
            if (errData.errorMessage) this.$message.warning(errData.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        return false;
      }
    },
    save() {
      this.confirmData = [];
      this.form.map(item => {
        if (item.isChecked === '1') {
          if (item.type === '8' || item.type === '9' || item.type === '10') {
            if (item.setting.showType === '1' || item.setting.showType === '2') {
              if (item.setting.title.length > 40) {
                item.setting.title = item.setting.title.substr(0, 40) + '...';
              }
            }
          }
          this.confirmData.push(item);
        }
      });
      if (this.confirmData.length > 0) {
        if (this.endDate && this.beginDate > this.endDate) {
          this.$message.warning('推送截止时间不能早于开始时间');
          return;
        }

        for (let i = 0; i < this.form.length; i++) {
          if (this.form[i].isChecked === '1' && this.form[i].type !== '10' && this.beginDate === '') {
            this.$message.warning('请选择推送开始时间');
            return;
          }
          if (this.form[i].isChecked === '1' && this.form[i].type !== '10' && this.endDate === '') {
            this.$message.warning('请选择推送结束时间');
            return;
          }
          if (this.ageGroup.length === 0) {
            this.$message.warning('请选择推送人群年龄');
            return;
          }
          for (const item of this.tableBuget) {
            if (
              this.form[i].isChecked === '1' &&
              (item.name === '头条-信息流' || item.name === '百度-信息流' || item.name === '百度-搜索推广')
            ) {
              if (item.budget === '') {
                this.$message.warning('请输入预算');
                return;
              }
              if (!/^[0-9]+\.?[0-9]*$/.test(item.budget)) {
                this.$message.warning('预算必须为数字值！');
                return;
              }
            }
            if (this.form[i].isChecked === '1' && item.name === '头条-信息流' && Number(item.budget) < 100) {
              this.$message.warning('预算请输入大于等于100的数');
              return;
            }
            if (
              this.form[i].isChecked === '1' &&
              item.name === '百度-信息流' &&
              (Number(this.budget) < 100 || Number(item.budget) > 10000)
            ) {
              this.$message.warning('预算请输入100-10000之间的数');
              return;
            }
            if (
              this.form[i].isChecked === '1' &&
              item.name === '百度-搜索推广' &&
              (Number(this.budget) < 50 || Number(item.budget) > 10000)
            ) {
              this.$message.warning('预算请输入50-10000之间的数');
              return;
            }
            if (
              this.form[i].isChecked === '1' &&
              (item.name === '头条-信息流' || item.name === '百度-信息流') &&
              item.bid === ''
            ) {
              this.$message.warning('请输入点击出价');
              return;
            }
            if (
              this.form[i].isChecked === '1' &&
              (item.name === '头条-信息流' || item.name === '百度-信息流') &&
              !/^[0-9]+\.?[0-9]*$/.test(item.bid)
            ) {
              this.$message.warning('点击出价必须为数字值！');
              return;
            }
            if (
              this.form[i].isChecked === '1' &&
              (item.name === '头条-信息流' || item.name === '百度-信息流') &&
              (Number(item.bid) < 0.2 || Number(item.bid) > 100)
            ) {
              this.$message.warning('点击出价请输入0.2~100的数');
              return;
            }
          }

          if (this.form[i].isChecked === '1' && this.form[i].type === '10') {
            if (this.bidKeywords.length > 0) {
              for (const keyword of this.bidKeywords) {
                if (!keyword.price) {
                  this.$message.warning('请输入出价');
                  return;
                }
                if (!/^[0-9]+\.?[0-9]*$/.test(keyword.price)) {
                  this.$message.warning('出价必须为数字值！');
                  return;
                }
                if (!/^\d+\.?\d{0,2}$/.test(keyword.price)) {
                  this.$message.warning('出价小数点后最多两位小数');
                  return;
                }
              }
            } else {
              this.$message.warning('请选择竞价关键词');
              return;
            }
          }

          let validHLBig = true;
          let validHLSmall = true;
          let validBDLBig = true;
          let validBDLSmall = true;
          // let validBDLSearch = true;
          if (this.imageSizeHL.width && this.imageSizeHL.height) {
            if (
              (this.imageSizeHL.width <= 2560 || this.imageSizeHL.width >= 1280) &&
              (this.imageSizeHL.height <= 1440 || this.imageSizeHL.height >= 720) &&
              this.imageSizeHL.width / this.imageSizeHL.height === 16 / 9
            ) {
              validHLBig = true;
            } else {
              validHLBig = false;
            }
            if (
              (this.imageSizeHL.width <= 1368 || this.imageSizeHL.width >= 456) &&
              (this.imageSizeHL.height <= 900 || this.imageSizeHL.height >= 300) &&
              this.imageSizeHL.width / this.imageSizeHL.height === 1.52
            ) {
              validHLSmall = true;
            } else {
              validHLSmall = false;
            }
          } else {
            validHLBig = true;
            validHLSmall = true;
          }
          if (this.imageSizeBDL.width && this.imageSizeBDL.height) {
            console.log(213);
            if (this.imageSizeBDL.width === 1140 && this.imageSizeBDL.height === 640) {
              validBDLBig = true;
            } else {
              validBDLBig = false;
            }
            if (this.imageSizeBDL.width === 370 && this.imageSizeBDL.height === 245) {
              validBDLSmall = true;
            } else {
              validBDLSmall = false;
            }
          } else {
            validBDLBig = true;
            validBDLSmall = true;
          }

          if (
            this.form[i].isChecked === '1' &&
            (this.form[i].type === '8' || this.form[i].type === '9' || this.form[i].type === '10') &&
            this.form[i].setting.title === ''
          ) {
            this.$message.warning('请输入标题');
            return;
          }
          if (
            this.form[i].isChecked === '1' &&
            this.form[i].type !== '0' &&
            this.form[i].type !== '1' &&
            this.form[i].type !== '10' &&
            (!this.form[i].setting.imagePaths ||
              (this.form[i].setting.imagePaths && this.form[i].setting.imagePaths.length === 0))
          ) {
            this.$message.warning('请选择图片');
            return;
          }
          if (
            this.form[i].isChecked === '1' &&
            this.form[i].type === '8' &&
            this.form[i].setting.showType === '0' &&
            !validHLBig
          ) {
            this.$message.warning('头条信息流图片不符合要求，建议最佳：宽高比16:9,1280*720≤尺寸≤2560*1440');
            return;
          }
          if (
            this.form[i].isChecked === '1' &&
            this.form[i].type === '8' &&
            (this.form[i].setting.showType === '1' || this.form[i].setting.showType === '2') &&
            !validHLSmall
          ) {
            this.$message.warning('头条信息流图片不符合要求，建议最佳：宽高比1.52,456*300≤尺寸≤1368*900');
            return;
          }
          if (
            this.form[i].isChecked === '1' &&
            this.form[i].type === '9' &&
            this.form[i].setting.showType === '0' &&
            !validBDLBig
          ) {
            this.$message.warning('百度信息流图片不符合要求，建议最佳：尺寸1140*640');
            return;
          }
          if (
            this.form[i].isChecked === '1' &&
            this.form[i].type === '9' &&
            (this.form[i].setting.showType === '1' || this.form[i].setting.showType === '2') &&
            !validBDLSmall
          ) {
            this.$message.warning('百度信息流图片不符合要求，建议最佳：尺寸370*245');
            return;
          }
          if (
            this.form[i].isChecked === '1' &&
            (this.form[i].type === '8' || this.form[i].type === '9') &&
            this.form[i].setting.showType === '1' &&
            this.form[i].setting.imagePaths.length < 3
          ) {
            this.$message.warning('请选择3张图片上传');
            return;
          }
          if (
            this.form[i].isChecked === '1' &&
            (this.form[i].type === '10' || (this.form[i].type === '2' && this.form[i].setting.showType === '1')) &&
            this.form[i].setting.content === ''
          ) {
            this.$message.warning('请输入描述');
            return;
          }
        }
        for (let i = 0; i < this.form.length; i++) {
          if (this.endDate && this.form[i].type !== '10' && this.form[i].isChecked === '1' && this.countTime(this.endDate) < 0) {
            this.$confirm('因您的推送截止时间早于当前时间会导致推送内容过期，确定继续推送？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.showConfirmDialog = true;
              // this.submit();
            });
            return false;
          }
        }
        this.showConfirmDialog = true;
      } else {
        this.submit();
      }
    },
    confirmSave() {
      this.submit();
      this.showConfirmDialog = false;
    },
    countTime(date) {
      // 获取当前时间
      let dateTime = new Date();
      let now = dateTime.getTime();
      // 设置截止时间
      let endDate = new Date(date);
      let end = endDate.getTime();
      // 时间差
      let leftTime = end - now;
      return leftTime;
    },
    submit() {
      // if (!this.itemId.id) {
      //   this.create();
      // } else {
      this.update();
      // }
    },
    create() {
      this.loading = true;
      this.form.map(item => {
        if (item.type !== '8' && item.type !== '9' && item.type !== '10' && item.isChecked === '1') {
          item.setting.title = '';
        }
      });
      let params = Object.assign({}, this.form);
      http
        .post(contentMgmt.publicity.push.save, params)
        .then(data => {
          this.loading = false;
          this.$message.success('创建成功');
          this.refresh();
        })
        .catch(ErrorData => {
          console.log('ERR_CREATE: ', ErrorData.errorMessage);
          this.$message.warning(ErrorData.errorMessage);
        });
    },
    update() {
      this.loading = true;
      let flg = true;
      let checkGroup = [];
      this.form.map(item => {
        if (item.setting.refId === '') {
          item.setting.refId = this.itemId.id;
        }
        if (item.type !== '8' && item.type !== '9' && item.type !== '10' && item.isChecked === '1') {
          item.setting.title = '';
        }

        if (item.isChecked === '1') {
          item.setting.beginDate = this.beginDate;
          item.setting.endDate = this.endDate;
          item.setting.sex = this.sex;
          item.setting.ageGroup = this.ageGroup;
          let areaNew = [];
          if (this.areas.length > 0) {
            this.areas.forEach(item => {
              areaNew.push(item[1]);
            });
          }
          item.setting.areas = areaNew;
        }
        if (item.type === '8' && item.isChecked === '1') {
          for (const list of this.tableBuget) {
            if (list.name === '头条-信息流') {
              item.setting.budget = list.budget;
              item.setting.bid = list.bid;
            }
          }
        }
        if (item.type === '9' && item.isChecked === '1') {
          for (const list of this.tableBuget) {
            if (list.name === '百度-信息流') {
              item.setting.budget = list.budget;
              item.setting.bid = list.bid;
            }
          }
        }
        if (item.type === '10' && item.isChecked === '1') {
          item.setting.bidKeywords = this.bidKeywords;
          for (const list of this.tableBuget) {
            if (list.name === '百度-搜索推广') {
              item.setting.budget = list.budget;
            }
          }
        }
      });
      for (const item of this.form) {
        if (item.isChecked === '1') {
          checkGroup.push(item);
        }
      }
      if (checkGroup.length === 0) {
        this.loading = false;
        this.$message.warning('请选择推送渠道');
        flg = false;
      } else {
        flg = true;
      }
      if (flg) {
        let params = {
          refId: this.itemId.id,
          source: this.articleType,
          positionList: this.form
        };
        http
          .post(contentMgmt.publicity.push.save, params)
          .then(data => {
            this.loading = false;
            this.$message.success('更新成功');
            this.refresh();
          })
          .catch(ErrorData => {
            this.loading = false;
            if (ErrorData.resultCode === '1201') {
              this.dialogVisible = true;
              http
                .post('/admin/recommend/oauth.jhtml', {})
                .then(data => {
                  this.loading = false;
                  window.open(data.oauthURL);
                })
                .catch(() => {
                  this.loading = false;
                });
            } else if (ErrorData.resultCode === '1198') {
              this.dialogAmount = true;
            } else {
              this.$message.warning(ErrorData.errorMessage);
            }
          });
      } else {
        return false;
      }
    },
    preview(item) {
      console.log(item);
      let type = item.setting.showType;
      switch (item.type) {
        case '0':
          //   this.previewType = 'list1-' + type;
          //   break;
          // case '1':
          // case '7':
          this.previewType = 'list1-' + type;
          break;
        case '1':
          this.previewType = 'article-' + type;
          break;
        case '7':
          this.previewType = 'list-' + type;
          break;
        case '2':
          this.previewType = 'app-' + type;
          break;
        case '3':
        case '4':
          this.previewType = 'pop-' + type;
          break;
        case '6':
          this.previewType = 'pop-coupon-' + type;
          break;
        case '5':
          this.previewType = 'slide-' + type;
          break;
        case '8':
        case '9':
          this.previewType = 'list3-' + type;
          break;
        case '10':
          this.previewType = 'search-' + type;
          break;
        default:
          break;
      }
      console.log(this.previewType);
      if (item.type === '8' || item.type === '9' || item.type === '10') {
        if (item.setting.showType === '1' || item.setting.showType === '2') {
          if (item.setting.title.length > 40) {
            this.article3.title = item.setting.title.substr(0, 40) + '...';
          } else {
            this.article3.title = item.setting.title;
          }
        } else {
          this.article3.title = item.setting.title;
        }

        this.article3.showType = item.setting.showType;
        this.article3.type = item.type;
        this.article3.content = item.setting.content ? item.setting.content.substr(0, 43) + '...' : '';
        this.$set(this.article3, 'beginDate', item.setting.beginDate);
        this.$set(this.article3, 'imagePaths', item.setting.imagePaths);
        this.showPreviewThird = true;
      } else {
        this.articleVfu.title = item.setting.title;
        this.articleVfu.showType = item.setting.showType;
        this.articleVfu.type = item.type;
        this.$set(this.articleVfu, 'beginDate', item.setting.beginDate);
        this.$set(this.articleVfu, 'endDate', item.setting.endDate);
        this.$set(this.articleVfu, 'imagePaths', item.setting.imagePaths);
        this.articleVfu.content = item.setting.content;
        this.showPreview = true;
      }
    },
    getAreas() {
      http
        .get('/admin/area/cityList.jhtml', {})
        .then(data => {
          this.options = data.areas;
          for (const item of data.areas) {
            item.label = item.name;
            item.value = item.id;
            if (item.children) {
              for (const child of item.children) {
                child.label = child.name;
                child.value = child.id;
              }
            }
          }
          for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].setting.areas.length > 0) {
              this.radioButton = '1';
              for (const item of data.areas) {
                if (item.children) {
                  for (const child of item.children) {
                    for (const area of this.form[i].setting.areas) {
                      if (child.id === area) {
                        this.areas.push([item.id, area]);
                      }
                    }
                  }
                }
              }
            } else {
              this.radioButton = '';
              this.areas = [];
            }
          }
        })
        .catch(errData => {
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {});
    },
    addKeyWord() {
      this.showDialog = true;
      this.giftList = [];
      this.getKeyWordList();
    },
    getKeyWordList() {
      this.loading = true;
      let params = {
        store: window.top.SHOP_ID || '',
        pageSize: this.dialogPagination.pageSize,
        pageNumber: this.dialogPagination.currentPage,
        searchValue: this.dialogFilters[0].value
      };
      http
        .get('/admin/keyword/keywords.jhtml', params)
        .then(data => {
          this.giftList = data.dataList;
          this.dialogPagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    confirmedSelect(selectionKeys, selections) {
      for (let i = 0; i < this.form.length; i++) {
        if (this.form[i].type === '10') {
          if (this.bidKeywords.length > 0) {
            for (const select of selections[0].keywords) {
              for (const keyword of this.bidKeywords) {
                if (select.name === keyword.name) {
                  return false;
                } else {
                  this.bidKeywords = [...new Set(this.bidKeywords.concat(select))];
                }
              }
            }
          } else {
            this.bidKeywords = selections[0].keywords;
          }
        }
      }
    },
    addNewTag() {
      const newName = String(this.newTagName).trim();
      if (!newName) {
        this.$message.warning('请输入自定义关键词');
        return false;
      }
      for (let i = 0; i < this.form.length; i++) {
        if (this.form[i].type === '10') {
          for (const keyword of this.bidKeywords) {
            if (keyword.name === newName) {
              this.$message.warning('该关键词已存在，请重新添加');
              return false;
            }
          }
          this.bidKeywords = [
            ...new Set(
              this.bidKeywords.concat({ id: '', category: '', name: newName, price: '1.00', hitRate: '60' })
            )
          ];
        }
        this.newTagName = '';
      }
    },
    handleOperate(name) {
      this[name]();
    },
    dialogPageSizeChange(val) {
      this.dialogPagination.pageSize = val;
      this.dialogPagination.currentPage = 1;
      this.getKeyWordList();
    },
    dialogCurrentPageChange(val) {
      this.dialogPagination.currentPage = val;
      this.getKeyWordList();
    },
    dialogFilterDataChange() {
      this.getKeyWordList();
    }
  },
  mounted() {
    this.operations[0].disabled = this.isDisabled;
    this.refresh();
  },
  watch: {
    itemId(newVal, oldVal) {
      this.clear();
      if (newVal.id !== '') {
        this.operations[0].disabled = this.isDisabled;
        this.refresh();
      }
    }
  }
};
</script>

<style lang="scss">
.shop-publicity-publish-setting {
  &.biz-grid {
    .biz-save-button {
      justify-content: flex-start;
    }
    .publish-setting-area {
      padding: 0 20px 20px 20px;
      .el-collapse {
        border: none;
        .settingClass {
          .el-collapse-item__header {
            background: #FFFFFF;
          }
          .el-collapse-item {
            border: 1px solid #EBEEF5;
          }
        }
      }
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item {
        margin-bottom: 10px;
        margin-top: 10px;
      }
      .el-collapse-item__header {
        border: none;
        line-height: 42px;
        height: 42px;
        ;
        background: #F8F8F8;;
      }
      .style-all {
        display: flex;
        margin-bottom: 10px;
        text-align: right;
        .publish-title {
          font-size: 14px;
          color: #606266;
          display: inline-block;
          padding-right: 10px;
          width: 120px;
        }
        .disabled .el-upload--picture-card {
          display: none;
        }
        .publish-title:before {
          content: '*';
          color: #f56c6c;
          margin-right: 4px;
        }
      }
      .title-style {
        font-weight: 700;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        font-style: normal;
        letter-spacing: 0px;
        line-height: 21px;
        width: 120px;
      }
      .keyword-title {
        font-size: 14px;
        color: #606266;
        display: inline-block;
        padding-right: 10px;
        width: 120px;
        text-align: right;
      }
      .keyword-title:before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
      .add-tag {
        margin-left: 110px;
      }
      .el-date-editor.el-input {
        width: 140px;
      }
      .el-textarea {
        width: 70%;
      }
      .el-input {
        width: 80%;
        font-size: 13px;
      }
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      .el-input-group {
        width: 70%;
      }
      .el-checkbox {
        padding: 12px 0;
      }
      .type-group {
        display: flex;
        // flex-wrap: wrap;
        padding: 5px 0;
        width: 70%;
        .el-radio {
          margin-left: 0;
          display: flex;
          align-items: flex-start;
        }
        img {
          max-width: 160px;
          height: 100px;
        }
      }
      .settings {
        padding-bottom: 13px;
        padding-top: 20px;
      }
    }
  }
}
.paymentDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e1e1e1;
    border-top: 1px solid #e1e1e1;
  }
}
.confirm-dialog {
  .el-carousel__container {
    height: 920px;
  }
}
.helpClass {
  color: #ff7300;
}
.close-order-dialog {
  .el-dialog__body {
    border: none;
  }
}
</style>
