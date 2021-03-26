<template>
  <div class="biz-eidtor-template" :style="templateStyle">
    <!-- 左侧导航栏 -->
    <el-menu default-active="0" @select="handleSelect">
      <el-menu-item index="0">
        <template slot="title">
          <span>样式</span>
        </template>
      </el-menu-item>
      <el-menu-item index="1">
        <template slot="title">
          <span>模板</span>
        </template>
      </el-menu-item>
    </el-menu>
    <!-- 右侧样式框 -->
    <!-- <el-tabs v-model="activeTab" type="card"> -->
    <el-tabs v-model="activeTab" v-if="selectedNav === '0'" @tab-click="getContent">
      <el-tab-pane label="标题" name="0">
        <div class="tab-item" v-for="title in tableData" :key="title.index" v-html="title.content" @click="templateSelect(title.content)">
        </div>
      </el-tab-pane>
      <el-tab-pane label="正文" name="1">
        <div class="tab-item" v-for="content in tableData" :key="content.index" v-html="content.content" @click="templateSelect(content.content)">
        </div>
      </el-tab-pane>
      <el-tab-pane label="引导" name="2">
        <div class="tab-item" v-for="guide in tableData" :key="guide.index" v-html="guide.content" @click="templateSelect(guide.content)">
        </div>
      </el-tab-pane>
      <el-tab-pane label="图文" name="3">
        <div class="tab-item" v-for="img in tableData" :key="img.index" v-html="img.content" @click="templateSelect(img.content)">
        </div>
      </el-tab-pane>
      <el-tab-pane label="布局" name="4">
        <div class="tab-item" v-for="layout in tableData" :key="layout.index" v-html="layout.content" @click="templateSelect(layout.content)">
        </div>
      </el-tab-pane>
      <el-tab-pane label="行业" name="5">
        <div class="tab-item" v-for="trade in tableData" :key="trade.index" v-html="trade.content" @click="templateSelect(trade.content)">
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="selectedNav ==='1'">
      <div class="el-tabs__header is-top">
        <div class="el-tabs__nav-wrap is-top">
          <div class="el-tabs__nav-scroll">
            <div role="tablist" class="el-tabs__nav" style="transform: translateX(0px);">
              <div style="width: 376px;text-align: center;" role="tab" tabindex="-1" class="el-tabs__item is-top">系统模板</div>
            </div>
          </div>
        </div>
      </div>
      <div class="el-tabs__content">
        <div class="tab-item" v-for="template in tableData" :key="template.index" v-html="template.content" @click="templateSelect(template.content)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import http from '@/common/http';
export default {
  name: 'BizEditorTemplate',
  props: {
    templateStyle: {
      type: Object,
      default() {
        return {
          width: '445px',
          height: '100%'
        };
      }
    }
  },
  data () {
    return {
      tableData: [],
      selectedNav: '0',
      activeTab: '0',
      styleTitles: [
        `<br>
        <p style="margin: 8px 0px 0px; padding: 0px; font-weight: bold; font-size: 16px; line-height: 28px; max-width: 100%; color: rgb(239, 112, 96); min-height: 32px; border-bottom-width: 2px; border-bottom-style: solid; border-color: rgb(239, 112, 96); text-align: justify;">
          <span class="autonum" placeholder="1" style="border-radius: 80% 100% 90% 20%; color: #FFFFFF; display: block; float: left; line-height: 20px; margin: 0px 8px 0px 0px; max-width: 100%; padding: 4px 10px; word-wrap: break-word !important; background-color: #EF7060;" data-original-title="" title="">1</span><strong class="brush" data-brushtype="text"></strong>
        </p>
        <br>`,
        `<br>
        <div style="clear: both; padding: 0px; border: 0px none; margin:5px 0px;">
          <div style="border-top-width: 2.5px; border-top-style: solid; border-color: rgb(239, 112, 96); font-size: 1em; font-weight: inherit; text-decoration: inherit; color: rgb(255, 255, 255); box-sizing: border-box;">
            <div style="border: 0px rgb(239, 112, 96); margin: 2px 0px 0px; overflow: hidden; padding: 0px; color: inherit;">
              <div style="display: inline-block; font-size: 1em; font-family: inherit; font-weight: inherit; text-align: inherit; text-decoration: inherit; color: inherit; border-color: rgb(239, 112, 96); background-color: transparent;">
                <div class="brush" data-bcless="darken" data-brushtype="text" style="display: inline-block; line-height: 1.4em; padding: 5px 10px; height: 32px; vertical-align: top; font-size: 16px; font-family: inherit; font-weight: bold; float: left; color: inherit; border-color: rgb(212, 43, 21); box-sizing: border-box !important; background: rgb(239, 112, 96);">
                  请输入标题
                </div>
                <div style="display: inline-block; vertical-align: top; font-size: 16px; width: 0px; height: 0px; border-top-width: 32px; border-top-style: solid; border-top-color: rgb(239, 112, 96); border-right-width: 32px; border-right-style: solid; border-right-color: transparent; border-top-right-radius: 4px; border-bottom-left-radius: 2px; color: inherit; box-sizing: border-box !important;">
                </div>
              </div>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="margin: 0.8em 0 0.5em 0;font-size: 16px;line-height: 32px; font-weight: bold;">
          <div style="display: inline-block; float: left; min-width: 32px; height: 32px; vertical-align: top; text-align: center;  ">
            <div style="display: table; width: 100%; color: inherit; border-color: rgb(72, 192, 163);" data-width="100%">
              <div style="display: table-cell;text-indent: 0; vertical-align: middle; font-style: normal; color: rgb(255, 255, 255); border-color: rgb(72, 192, 163);">
                <span class="autonum" style="color:#C6C6C7; font-size:50px" data-original-title="" title="">1</span></div>
              <div style="height: 70px;margin-left: -6px; margin-top:5px;border-left:1px solid rgb(198,198,199);background-color: rgb(254,254,254); box-sizing: border-box;transform: rotate(35deg);-webkit-transform: rotate(35deg);-moz-transform: rotate(35deg);-o-transform: rotate(35deg);"></div>
            </div>
          </div>
          <div style="margin-left: 40px;padding-top:18px; font-style:normal;font-size:30px; color: #737373; border-color: rgb(72, 192, 163);">
            <span class="brush" data-brushtype="text" style="color:#737373; font-size:20px">请输入标题</span></div>
        </div>
        <br>`,
        `<br>
        <div class="" style="border-left:5px solid #666765;font-size: 16px;font-weight:bold; line-height: 32px;color:#666;padding: 5px 10px; margin: 10px 0px;">
          <p>
            你在跳一个深坑之前，要知道它有多深才行。当你在这个世界上还有快乐可寻的时候，万不可走绝路，否则不久你也许会觉醒，那时后悔就太迟了。 by 席勒
          </p>
        </div>
        <br>`
      ],
      styleContents: [
        `<br>
        <div style="margin-top: 0px; padding: 0px 5px; line-height: 10px; color: inherit; border: 1px solid rgb(226, 121, 97);">
          <div style="padding: 0px; font-size: 16px; color: inherit; height: 8px; margin: -8px 0px 0px 140px; width: 50%; background-color: rgb(254, 254, 254);" data-width="50%">
            <div style="width: 8px; height: 8px; border-radius: 100%; line-height: 1; box-sizing: border-box; font-size: 18px; text-decoration: inherit; border-color: rgb(226, 121, 97); display: inline-block; margin: 0px; color: inherit; background-color: rgb(226, 121, 97);"></div>
          </div>
          <div class="brush" data-style="text-indent: 2em;" style="padding: 0px; line-height: 2em; color: rgb(62, 62, 62); font-size: 14px; margin: 15px;">
            <p style="text-indent: 2em;">
              我这个二十岁的人，一再严肃地反省到自己由于孤儿根性养成的怪脾气，我正因为受不了那种令人窒息的忧郁感，这才走上伊豆的旅程。
            </p>&#8203;<br>
            <p style="text-indent: 2em;">
              ——川端康成《伊豆的舞女》
            </p>
          </div>
          <div style="padding: 0px; background-color: rgb(254, 254, 254); font-size: 16px; color: inherit; text-align: right; height: 10px; margin: 0px 0px -4px 25px; width: 65%;" data-width="65%">
            <div style="margin: 0px auto 1px; border-radius: 100%; line-height: 1; box-sizing: border-box; text-decoration: inherit; border-color: rgb(226, 121, 97); display: inline-block; height: 8px; width: 8px; color: inherit; background-color: rgb(226, 121, 97);"></div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="color: inherit; font-size: 16px; padding: 5px 10px 0px 35px; margin-left: 27px; border-left-width: 2px; border-left-style: dotted; border-left-color: rgb(228, 228, 228);">
          <div class="autonum" style="width: 32px; height: 32px; margin-left: -53px; margin-top: 23px; color: rgb(255, 255, 255); text-align: center; line-height: 32px; border-radius: 16px; background: rgb(157, 180, 194);" data-original-title="" title="">
            1
          </div>
          <div class="" style="margin-top: -30px;padding-bottom: 10px; color: inherit;">
            <p>
              是真的有过那种，巴不得把自己的生活全盘托出奉献给谁，那人却讪笑着推诿着时远时近的经历，才开始觉得，比起一段风雨飘摇的感情，最该关照的永远是自己。 by 陈大力
            </p>
          </div>
        </div>
        <br>`,
        `<br>
        <blockquote style="margin: 3px; padding: 10px 15px; border-width: 3px; border-color: rgb(102, 142, 104); border-top-left-radius: 50px; border-bottom-right-radius: 50px; box-shadow: rgb(165, 165, 165) 5px 5px 2px; background-color: rgb(250, 250, 250);">
          <div class="brush" data-style="margin-top: 15px; margin-bottom: 0px; padding: 0px; color: rgb(107, 77, 64); line-height: 2em; font-size: 20px; border-color: rgb(107, 77, 64);font-size: 18px;font-weight:bold;">
            <p style="margin-top: 15px; margin-bottom: 0px; padding: 0px; color: rgb(102, 142, 104); line-height: 2em; font-size: 20px; border-color: rgb(102, 142, 104);">
              <span style="font-size:18px"><strong style="border-color: rgb(102, 142, 104); color: inherit;">读而思</strong></span>
            </p>
          </div>
          <p style="margin-top: -10px; margin-bottom: 0px; padding: 0px; line-height: 2em; min-height: 1.5em; color: inherit;">
            <span style="font-size:12px"><strong class="brush" data-brushtype="text" style="border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; color: rgb(255, 255, 255); font-size: 13px; padding: 0px 15px; background-color: rgb(102, 142, 104);">duersi</strong></span>
          </p>
          <div class="brush" data-style="margin-top: 0px; margin-bottom: 0px; padding: 0px; line-height: 2em; font-size: 14px; min-height: 1.5em; color: inherit;">
            <p>
              <span style="font-size:14px">编辑完成后，将内容复制粘贴到微信后台素材管理的编辑器中即可。</span>
            </p>
            <p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; line-height: 2em; font-size: 16px; min-height: 1.5em; color: inherit;">
              <br>
            </p>
          </div>
        </blockquote>
        <br>`,
        `<br>
        <div class="layout" style="margin: 5px auto; border: 3px solid rgb(89, 155, 171); padding: 5px;">
          <div data-bcless="lighten" style="border: 1px solid rgb(157, 196, 205); padding: 15px; text-align: center; color: inherit;">
            <p class="title" style="color: inherit;font-size: 12px;">
              <span class="brush" data-brushtype="text"></span>
            </p>
            <p style="color:inherit;">
              <strong style="color:inherit"><span class="brush" style="color:inherit; font-size:16px">操作方便才是硬道理</span></strong>
            </p>
          </div>
        </div>
        <br>`,
        `<br>
        <div class="layout" style="border: 0px; margin: 5px auto; box-sizing: border-box; padding: 0px;">
          <div style="height: 25px; box-sizing: border-box; color: inherit;">
            <div style="height: 100%; width: 50px; float: left; border-top-width: 2px; border-top-style: solid; border-color: rgb(172, 29, 16); border-left-width: 2px; border-left-style: solid; box-sizing: border-box; color: inherit;"></div>
            <div style="display: inline-block; color: rgb(172, 29, 16); clear: both; box-sizing: border-box; border-color: rgb(172, 29, 16);"></div>
          </div>
          <div class="brush" data-style="color: rgb(51, 51, 51); font-size: 1em; line-height: 1.75em; word-break: break-all; word-wrap: break-word; text-align: justify;" style="margin: -0.8em 0.3em; padding: 0.8em; box-sizing: border-box; color: inherit;">
            <p style="color: rgb(51, 51, 51); font-size: 1em; line-height: 1.75em; word-break: break-all; word-wrap: break-word; text-align: justify;">
              反正人生不是在此处失败，就是在彼处失败。失败者才不管别的有多重要。任性一回，不然一辈子都憋屈。 by 毛利
            </p>
          </div>
          <div style="height: 25px; box-sizing: border-box; color: inherit;">
            <div style="height: 100%; width: 50px; float: right; border-bottom-width: 2px; border-bottom-style: solid; border-color: rgb(172, 29, 16); border-right-width: 2px; border-right-style: solid; box-sizing: border-box; color: inherit;"></div>
          </div>
        </div>
        <br>`
      ],
      styleGuides: [
        `<br>
        <p style="text-align:center;">
          <img data-id="87820" data-role="guide-img" title="引导关注" src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei9pYW5xMDNVVVdHbUt6Y2V0amhySjBUaWE5UHhUZFNLcWJWam9HNXNYM3hpYmRGbkdlZ1NSSldhVFRqQzR3d0VhVUxaUWhZT1duVnVsU2liNkJWd3BQOGljV2VRLzA/d3hfZm10PWdpZg==" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei9pYW5xMDNVVVdHbUt6Y2V0amhySjBUaWE5UHhUZFNLcWJWam9HNXNYM3hpYmRGbkdlZ1NSSldhVFRqQzR3d0VhVUxaUWhZT1duVnVsU2liNkJWd3BQOGljV2VRLzA/d3hfZm10PWdpZg==" style="display: inline;width:95%">
        </p>
        <br>`,
        `<br>
        <div style="border: none; width: 98%; margin-right: auto; margin-left: auto;" data-width="98%">
          <div style="width: 100%; border: 1px solid rgb(53, 49, 53); padding-bottom: 3em;box-sizing:border-box;" data-width="100%">
            <div style="width: 100%; background: rgb(53, 49, 53); height: auto; overflow: hidden; box-sizing: border-box; padding: 3em 2em 6em; text-align: center;" data-width="100%">
              <div style="margin-right: 8px;width: 100%;font-size: 3em;font-family: arial;color: #fff;line-height: 0.8em;display: inline-block;text-align:center;font-weight: bolder;vertical-align: top;" data-width="100%"></div><br>
              <div class="brush" style="font-size:1em;line-height:1.5em;color:#fff;">
                <p>
                  谁可相依？近处，要有可以依傍的亲人朋友，远处，要有神或者佛；实处，要有金钱，虚处，要有信仰。远近都有，虚实结合，才能填补人生的各种窟窿，抵挡生命中各种不妥，不至于凄云惨雾。 by 韩松落
                </p>
              </div>
            </div>
            <div style="width: 40%; margin-right: auto; margin-left: auto; overflow: hidden; margin-top: -4em;" data-width="40%">
              <img style="width:100%;border:1px solid #1F1E20;" src="/resources/admin/images/article/qrcode.jpg" data-ke-src="/resources/admin/images/article/qrcode.jpg" data-width="100%">
            </div>
            <div style="width: 100%; font-size: 1.4em; margin-top: 0.2em; margin-bottom: 0.2em; text-align: center;" data-width="100%">
              V服爱车
            </div>
            <div style="width: 100%; font-size: 1em; color: rgb(126, 126, 126); margin-top: 0.2em; margin-bottom: 0.2em; text-align: center;" data-width="100%">
              长按识别二维码，关注V服爱车
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <p class="brush" style="margin-top: 0px; margin-bottom: 0px; font-size: 15.5556px; padding: 0px; max-width: 100%; min-height: 1.5em; line-height: 2em; word-wrap: break-word; word-break: normal; border-radius: 5px; color: rgb(255, 255, 255); text-align: center; background-color: rgb(128, 177, 53);" data-brushtype="text">
          ↓↓↓ 点击"阅读原文" 【查看更多信息】 &nbsp;
        </p>
        <br>`,
        `<br>
        <div style="border: none; margin: 0.8em 0px 0.3em; box-sizing: border-box; padding: 0px;">
          <div style="text-align: center; text-decoration: inherit; color: rgb(255, 255, 255); border-color: rgb(123, 154, 181); box-sizing: border-box;">
            <div style="width: 0px; margin: 0px 0px 0px 90px; border-bottom-width: 0.8em; border-bottom-style: solid; border-bottom-color: rgb(123, 154, 181); border-top-color: rgb(123, 154, 181); box-sizing: border-box; height: 10px; color: inherit; border-left-width: 0.8em !important; border-left-style: solid !important; border-left-color: transparent !important; border-right-width: 0.8em !important; border-right-style: solid !important; border-right-color: transparent !important;"></div>
            <div class="brush" data-brushtype="text" style="padding: 0.5em; line-height: 1.2em; font-size: 1em; box-sizing: border-box; color: inherit; border-color: rgb(123, 154, 181); border-radius: 4px; background-color: rgb(123, 154, 181);">
              <strong style="color:inherit">点击标题下「蓝色微信名」可快速关注</strong>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <p style="text-align:center;">
          <img title="猫抓毛线球引导分享" src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei9jWlYyaFJwdUFQak9qSUVBMU9qU2ljWEhjaWE5TWo5UlFqc09RVTh4R1hpYVlYWWZpYm9Nb0FKbXJyVHpPSjRtWDgxOXZqaGpYaG9EZ0lzZXBBdEs2S3k2OEEvMA==" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei9jWlYyaFJwdUFQak9qSUVBMU9qU2ljWEhjaWE5TWo5UlFqc09RVTh4R1hpYVlYWWZpYm9Nb0FKbXJyVHpPSjRtWDgxOXZqaGpYaG9EZ0lzZXBBdEs2S3k2OEEvMA==" style="display: inline;">
        </p>
        <br>`
      ],
      styleImgs: [
        `<br>
        <div style="border: 0px; box-sizing: border-box; width: 100%; clear: both; overflow: hidden; padding: 0px;" data-width="100%">
          <div class="layout" style="box-sizing: border-box; width: 65%; float: left; padding: 0px 0.1em 0px 0px;" data-width="65%">
            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUVhUSW9LTkZBN29tSUFCUkRXMlhpYTAzSlNxZU01UFM5Q3loM3JFZXdtVmljYXNZcU5XSWVwMnlBLzA/d3hfZm10PWpwZWc=" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUVhUSW9LTkZBN29tSUFCUkRXMlhpYTAzSlNxZU01UFM5Q3loM3JFZXdtVmljYXNZcU5XSWVwMnlBLzA/d3hfZm10PWpwZWc=" style="box-sizing: border-box; margin: 0px; height: auto !important; visibility: visible !important; width: 100%;" width="100%" height="auto" border="0" opacity="" mapurl="" title="" alt="" data-width="100%">
          </div>
          <div class="layout" style="display: inline-block; width: 35%; box-sizing: border-box; float: left; padding: 0px 0px 0px 0.1em;" data-width="35%">
            <div class="brush" data-brushtype="text" style="box-sizing: border-box; margin-right: 4px; padding: 4px 6px; border-bottom-width: 2px; border-bottom-style: solid; font-size: 1.2em; font-weight: bold;color: rgb(102,97,91); border-color: rgb(102,97,91);">
              机会论
            </div>
            <div class="brush" data-styel="line-height: 2em;" style="box-sizing: border-box; margin-right: 0.3em; padding: 0.3em 0.5em; color: rgb(102,97,91); font-size: 0.9em;">
              <p style="line-height: 2em;">
                机会是给有准备的人
              </p>
              <p style="line-height: 2em;">
                但准备的人多了
              </p>
              <p style="line-height: 2em;">
                机会
              </p>
              <p style="line-height: 2em;">
                决定摇号
              </p>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="text-align:center;">
          <div style="display:inline-block;text-align:right;">
            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUTE0cng2aWJocGdSUWhSYTdpYzBjeWtqSmxoQUFXZlM4aWFkYkx4aDlnMVpzUHBWWUdWT0V3QVRxUS8wP3d4X2ZtdD1qcGVn" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUTE0cng2aWJocGdSUWhSYTdpYzBjeWtqSmxoQUFXZlM4aWFkYkx4aDlnMVpzUHBWWUdWT0V3QVRxUS8wP3d4X2ZtdD1qcGVn" style="border-radius: 50%; display: inline-block; width: 110px; margin: 0px; height: 110px !important;" width="110" height="110" border="0" opacity="" mapurl="" title="" alt="">
          </div>
          <div style="border-left-width: 1px; border-left-style: solid; border-color: rgb(173, 167, 105); padding-left: 1em; text-align: left; display: inline-block; height: 6em; vertical-align: top; color: rgb(173, 167, 105); margin-top: 0.5em; margin-left: 10px; padding-top: 5px;">
            <div class="brush" data-brushtype="text" style="width: 100%; height: 50%; font-size: 1.4em; border-color: rgb(173, 167, 105); color: inherit; margin-bottom: 0.5em;" data-width="100%">
              计划
            </div>
            <div class="brush" data-brushtype="text" style="font-size: 16px; border-color: rgb(173, 167, 105); color: inherit;">
              = Planning =
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="text-align: center;">
          <div style="display: inline-block; vertical-align: top; width:50%;" data-width="50%">
            <div style="width: 8em;display:inline-block;">
              <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUWFrMHY1Um9SaWNsOWxOcmlheUlyOG83aWF5NFpBekMySGliWkxaRURUOTZON0NWT2dEUHQzajRCSXcvMD93eF9mbXQ9anBlZw==" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUWFrMHY1Um9SaWNsOWxOcmlheUlyOG83aWF5NFpBekMySGliWkxaRURUOTZON0NWT2dEUHQzajRCSXcvMD93eF9mbXQ9anBlZw==" style="border-radius: 50%; width: 8em; margin: 0px; height: auto !important;" width="8em" height="auto" border="0" opacity="" mapurl="" title="" alt="">
            </div>
          </div>
          <div style="display: inline-block; vertical-align: top; border-left-width: 1px;box-sizing:border-box; border-left-style: solid; border-left-color: rgb(139, 162, 176); padding-bottom: 2em; width: 50%; padding-top: 0.5em;" data-width="50%">
            <div style="border: 1px solid;box-sizing:border-box; color: rgb(255, 255, 255); font-size: 18px; width: 0.8em; height: 0.8em; line-height: 0.8em; margin-left: -0.42em; border-radius: 100%; margin-top: 3em; background-color: rgb(139, 162, 176);"></div>
            <div style="padding-left: 20px;box-sizing:border-box;margin-top:-4.5em;">
              <div style="border: 1px solid rgb(139, 162, 176); padding: 10px;box-sizing:border-box;" class="brush">
                <p style="text-align: left; line-height: 1.75em;">
                  <span style="font-size: 14px;">一个爱我的人，</span>
                </p>
                <p style="text-align: left; line-height: 1.75em;">
                  <span style="font-size: 14px;">如果爱得讲话结结巴巴，</span>
                </p>
                <p style="text-align: left; line-height: 1.75em;">
                  <span style="font-size: 14px;">语无伦次，</span>
                </p>
                <p style="text-align: left; line-height: 1.75em;">
                  <span style="font-size: 14px;">我就知道他爱我</span>
                </p>
                <p style="text-align: left; line-height: 1.75em;">
                  <span style="font-size: 14px;">——木心</span>
                </p>
              </div>
            </div>
          </div>
          <div style="vertical-align: top;box-sizing:border-box; width: 50%; border-right-width: 1px; border-right-style: solid; border-right-color: rgb(139, 162, 176); display: inline-block; margin-right: -2px;" data-width="50%">
            <div style="padding-right:20px;box-sizing:border-box;">
              <div style="box-sizing:border-box;border: 1px solid rgb(139, 162, 176); padding: 10px;" class="brush">
                <p style="text-align: right; line-height: 1.75em;">
                  <span style="font-size: 14px;">一个爱我的人</span>
                </p>
                <p style="text-align: right; line-height: 1.75em;">
                  <span style="font-size: 14px;">如果爱得讲话结结巴巴</span>
                </p>
                <p style="text-align: right; line-height: 1.75em;">
                  <span style="font-size: 14px;">语无伦次</span>
                </p>
                <p style="text-align: right; line-height: 1.75em;">
                  <span style="font-size: 14px;">我就知道他爱我</span>
                </p>
                <p style="text-align: right; line-height: 1.75em;">
                  <span style="font-size: 14px;">——木心</span>
                </p>
              </div>
            </div>
          </div>
          <div style="display: inline-block; vertical-align: top; width: 50%; padding-bottom: 2em;box-sizing:border-box;" data-width="50%">
            <div style="border: 1px solid; color: rgb(255, 255, 255); font-size: 18px; width: 0.8em; height: 0.8em; line-height: 0.8em; border-radius: 100%; margin-top: 3em; margin-left: -0.34em; background-color: rgb(139, 162, 176);"></div>
            <div style="width: 8em;display:inline-block;">
              <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUVFpYmRtZU5wS0tUeGpjWVF1eG9XZ3dFZ0NPZmlhaWE3MEJodTFNZHBpYkFWUEdBTVFDTEpZTWljMGliZy8wP3d4X2ZtdD1qcGVn" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUVFpYmRtZU5wS0tUeGpjWVF1eG9XZ3dFZ0NPZmlhaWE3MEJodTFNZHBpYkFWUEdBTVFDTEpZTWljMGliZy8wP3d4X2ZtdD1qcGVn" style="border-radius: 50%; width: 8em; margin: -64px 0px 0px; height: auto !important;" width="8em" height="auto" border="0" opacity="" mapurl="" title="" alt="">
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="padding:5px;margin:0 auto;text-align:center;">
          <div style="display:inline-block;">
            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei9jWlYyaFJwdUFQamczc3hvVHR5OGRNSDM2U2lhUWxuMG9pY3EzcDRhRTU4aWNSZ0tIUEwyVW9WeFVVTnRkMmNuWm1rT2lhTGtIRUZmelRpYlB4aWFKUG1xSXYwdy8w" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei9jWlYyaFJwdUFQamczc3hvVHR5OGRNSDM2U2lhUWxuMG9pY3EzcDRhRTU4aWNSZ0tIUEwyVW9WeFVVTnRkMmNuWm1rT2lhTGtIRUZmelRpYlB4aWFKUG1xSXYwdy8w" style="width:290px;height:auto !important;" class="assistant">
          </div>
          <div style="margin-left: 1%; margin-right: 1%; margin-top: -45px; padding: 15px; color: rgb(123, 123, 111); background: rgb(245, 245, 244);">
            <div style="border: solid 1px rgb(198,198,198);box-shadow:rgb(220,220,220) 0px 0px 5px;padding:8px;">
              <img style="width: 100%; margin: 0px;" src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkdObGJjam4yVXd3a21Yc25qU2VqRzJzZnVzUFBNdUliY3Z6RWpXZlBiOGlidTVBdGR4Y1FhbnVqSXlIdzlpYlpHUUYzRktrb2xFYzl6QS8wP3d4X2ZtdD1qcGVn" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkdObGJjam4yVXd3a21Yc25qU2VqRzJzZnVzUFBNdUliY3Z6RWpXZlBiOGlidTVBdGR4Y1FhbnVqSXlIdzlpYlpHUUYzRktrb2xFYzl6QS8wP3d4X2ZtdD1qcGVn" width="100%" height="" border="0" opacity="" mapurl="" title="" alt="" data-width="100%">
              <div style="margin-top:15px;margin-bottom:5px;" class="brush">
                <p style="line-height: 1.75; font-size: 14px; color: rgb(112, 112, 112); text-align: justify;">
                  你是你自己的裁决者。你过去和现在做得有多好，由你自己说了算。别人永远不能审判你，就算是神。
                </p>
                <p style="line-height: 1.75; font-size: 14px; color: rgb(112, 112, 112); text-align: right;">
                  <span style="line-height: 1.75;">——《与神对话》</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="position:relative;width:50%;float:left;" data-width="50%">
          <div style="width:100%;height:80%;overflow:hidden;" data-width="100%">
            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9qcGcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2M0pJVmpTVHZITFJpYWx4Q2dCM3FEV205azdQc0Frc1NZaHFBcVc5RFFkbGJrRU52ckRiNVYwUS8wP3d4X2ZtdD1qcGVn" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9qcGcvemlhZEREUXhiQ0pGYVhuWGZnZjg5anVvSVE1VTF1MWd2M0pJVmpTVHZITFJpYWx4Q2dCM3FEV205azdQc0Frc1NZaHFBcVc5RFFkbGJrRU52ckRiNVYwUS8wP3d4X2ZtdD1qcGVn" style="width: 100%; margin: 0px;" width="100%" height="" border="0" mapurl="" title="" alt="" data-width="100%">
          </div>
        </div>
        <div style="float:left;width:44%;margin-top:3%;margin-left:4%;" data-style="color:rgb(125,125,125);border-bottom:1px dashed rgb(192,192,192);font-size: 12px;line-height:2em;" class="brush" data-width="44%">
          <p style="color:rgb(125,125,125);border-bottom:1px dashed rgb(192,192,192);font-size: 12px;line-height:2em;" class="brush" data-brushtype="text">
            在季节的车上，
          </p>
          <p style="color:rgb(125,125,125);border-bottom:1px dashed rgb(192,192,192);font-size: 12px;line-height:2em;" class="brush" data-brushtype="text">
            如果你要提前下车，
          </p>
          <p style="color:rgb(125,125,125);border-bottom:1px dashed rgb(192,192,192);font-size: 12px;line-height:2em;" class="brush" data-brushtype="text">
            请别推醒装睡的我，
          </p>
          <p style="color:rgb(125,125,125);border-bottom:1px dashed rgb(192,192,192);font-size: 12px;line-height:2em;" class="brush" data-brushtype="text">
            这样我可以沉睡到终点，
          </p>
          <p style="color:rgb(125,125,125);border-bottom:1px dashed rgb(192,192,192);font-size: 12px;line-height:2em;" class="brush" data-brushtype="text">
            假装不知道你已经离开。
          </p>
          <p style="color:rgb(125,125,125);border-bottom:1px dashed rgb(192,192,192);font-size: 12px;line-height:2em;" class="brush" data-brushtype="text">
            ——张嘉佳
          </p>
        </div>
        <div style="clear:both;"></div>
        <br>`
      ],
      styleLayouts: [
        `<br>
        <div style="border: 0px none; padding: 0px; position: relative;">
          <div style="border-color: rgb(157, 180, 194); color: rgb(255, 255, 255); padding: 35px; background-color: rgb(157, 180, 194);">
            <div class="layout" style="margin: 0px auto; ">
              <p class="brush" data-brushtype="text" style="font-size: 24px; font-weight: bold; border-color: rgb(157, 180, 194); color: inherit;">
                纯底色大边距大段内容
              </p>
              <div class="brush" style="border-color: rgb(157, 180, 194); color: inherit;">
                <p style="border-color: rgb(157, 180, 194); color: inherit;">
                  日本的设计师提出过一个配色黄金比例，是70：25：5，其中的70%为大面积使用的主色，25%为辅助色，5%为点缀色。一般情况下建议画面色彩不超过3种，3种是指的3种色相，比如深红和暗红既可以视为一种色相。
                </p>
                <p style="border-color: rgb(157, 180, 194); color: inherit;">
                  <br>
                </p>
                <p style="border-color: rgb(157, 180, 194); color: inherit;">
                  一般来说颜色用的越少越好，颜色越少画面越简洁，作品会显得更加成熟。
                </p>
              </div>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="margin-right: auto; margin-left: auto; clear: both; position: relative; width: 100%; overflow: hidden;" data-width="100%">
          <div style="margin: 0.5em 0.5em 1.5em; border: 0px;">
            <div style="margin-top: 0em; border: 2px solid rgb(0, 0, 0); border-radius: 0.8em; color: rgb(51, 51, 51); font-size: 1em; box-shadow: rgb(189, 189, 189) 0px 3px 5px;">
              <div class="brush" style="font-size: 14px;padding: 1.4em 5em 1em 1em;line-height: 1.4; text-decoration: inherit;">
                <p>
                  有时想想，独居斗室和天涯浪迹好像是一件事情，身处寂寞和身处喧嚣其实也没什么两样，身外的整个世界都是镜子，我们必须自己认得自己。——马良《人间卧底》
                </p>
              </div>
            </div>
            <div style="margin-top:-3.5em;margin-right: 10px; line-height: 1.4; text-align: right;">
              <div style="width:50px;display:inline-block;">
                <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei84ZmJBNmJNVENlSktpYUlZcURSYXAwVGZEcVg5Unh0Z0N6aWFJVXNjZVhLaWJvdExjdmliNlJXUVJZU2liZjNZa1Q0QmlhS21qOHhrdjJMNklhd1hXdFdKbldlZy8wP3d4X2ZtdD1wbmc=" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei84ZmJBNmJNVENlSktpYUlZcURSYXAwVGZEcVg5Unh0Z0N6aWFJVXNjZVhLaWJvdExjdmliNlJXUVJZU2liZjNZa1Q0QmlhS21qOHhrdjJMNklhd1hXdFdKbldlZy8wP3d4X2ZtdD1wbmc=" style="width:100%" data-width="100%">
              </div>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="border: 0px none; padding: 0px;">
          <div class="layout" style="margin:10px auto;width:70%" data-width="70%">
            <div class="_editor" style="border: 0px none; padding: 0px; margin: 0px; position: relative;">
              <p class="brush" data-brushtype="text" style="font-size: 16px; margin: 10px 0px; padding: 10px; max-width: 100%; border-top-style: solid; border-top-width: 1px; border-left-width: 0px; border-bottom-style: solid; border-bottom-width: 1px; line-height: 25px; color: rgb(33, 33, 34); text-align: center; border-color: rgb(33, 33, 34);">
                大边距居中
              </p>
            </div>
            <p style="text-align:right; color: inherit;">
              自由调整两侧边距
            </p>
            <div class="brush" data-style="font-size:14px;text-align:center" style="line-height: 25px; color: inherit;">
              <p style="color: inherit; text-align: center;">
                单列居中样式，
              </p>
              <p style="color: inherit; text-align: center;">
                内部嵌套插入其它样式，
              </p>
              <p style="color: inherit; text-align: center;">
                内容宽度的自定义，
              </p>
              <p style="color: inherit; text-align: center;">
                让自己的文章更与众不同。<br>
              </p>
              <p style="color: inherit;">
                <br>
              </p>
              <p style="color: inherit; text-align: center;">
                <span style="color: inherit;"></span><br>
              </p>
              <p style="color: inherit; text-align: center;">
                <span style="line-height: 25px; text-align: center;">缩短</span>您的排版时间，
              </p>
              <p style="color: inherit; text-align: center;">
                提升排版体验，
              </p>
              <p style="color: inherit; text-align: center;">
                工作就应该成为享受！
              </p>
              <p>
                <br>
              </p>
              <p>
                <br>
              </p>
              <p style="color: inherit;">
                <br>
              </p>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="border: 0px none; padding: 0px; position: relative;">
          <div style="margin-top:5px;">
            <div style="width:50%;display:inline-block;box-sizing:border-box;float:left;padding-right:10px" class="layout" data-width="50%">
              <div style="padding:20px 25px;box-sizing:border-box;border:1px solid #e7e7e7;text-align:center;">
                <p>
                  <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUTZTYm1sWlJ3TU9XeWdiaWFFU0dTNHJUb0RpYXFIakN4QzVmZGJXNTNYOFBQRm9LWEd4TmlhTFAyZy8wP3d4X2ZtdD1qcGVn" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUTZTYm1sWlJ3TU9XeWdiaWFFU0dTNHJUb0RpYXFIakN4QzVmZGJXNTNYOFBQRm9LWEd4TmlhTFAyZy8wP3d4X2ZtdD1qcGVn" style="margin: 0px 0px 15px; height: 50px !important;" width="" height="50" border="0" opacity="" mapurl="" title="" alt="">
                </p>
                <p class="brush" data-brushtype="text" style="font-size:16px;font-weight:bold;margin:0 0 10px 0;">
                </p>
                <div class="brush" data-style="clear:none;">
                  <p style="clear:none;margin:0 0;line-height:1.5em;">
                    生而排版
                  </p>
                  <p style="clear:none;margin:0 0;line-height:1.5em;">
                    <span style="text-align:center">为你而美</span>
                  </p>
                </div>
              </div>
            </div>
            <div style="padding-left:10px;box-sizing:border-box;width:50%;display:inline-block;text-align:center;" class="layout" data-width="50%">
              <div style="padding:20px 25px;box-sizing:border-box;border:1px solid #e7e7e7;">
                <p>
                  <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUXVtVjNldEJzV2RpYWlhbkljUnFRcURobE1jWHJKN2NVRm1YMGRPQVVjTWgybUtpY1VWbk9yNDhLUS8wP3d4X2ZtdD1qcGVn" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkZTUG9XZ2lhTXNPaGtpYzZ0VGowdXRnUXVtVjNldEJzV2RpYWlhbkljUnFRcURobE1jWHJKN2NVRm1YMGRPQVVjTWgybUtpY1VWbk9yNDhLUS8wP3d4X2ZtdD1qcGVn" style="margin: 0px 0px 15px; height: 50px !important;" width="" height="50" border="0" opacity="" mapurl="" title="" alt="">
                </p>
                <p class="brush" data-brushtype="text" style="font-size:16px;font-weight:bold;margin:0 0 10px 0;">
                  秒刷
                </p>
                <div class="brush" data-style="clear:none;margin:0 0;line-height:1.5em;">
                  <p style="clear:none;margin:0 0;line-height:1.5em;">
                    一键排版
                  </p>
                  <p style="clear:none;margin:0 0;line-height:1.5em;">
                    珍惜生命
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="margin:2px;text-algin:center;">
          <div style="border: 2px groove rgb(252, 180, 43); padding-bottom: 1.2em; font-weight: inherit; text-align: center; text-decoration: inherit; box-sizing: border-box; color: inherit; margin: 0px; background-color: transparent;display: inline-block;">
            <div class="layout" style="width: 40%; float: left; display: inline-block; padding:20px 15px; text-align: left; box-sizing: border-box; color: inherit; margin: 0px;" data-width="40%">
              <div style="box-sizing: border-box; color: rgb(252, 180, 43); border-color: rgb(252, 180, 43); padding: 0px; margin: 0px;">
                <div style="border-color: rgb(252, 180, 43); box-sizing: border-box; color: inherit; display: inline-block; font-size: 24px; font-weight: inherit; line-height: 1.5em; text-align: left; text-decoration: inherit; padding: 0px; margin: 0px;">
                  <span style="box-sizing:border-box; color:#262626; margin:0px; padding:0px"><strong class="brush" data-brushtype="text" style="box-sizing:border-box; color:inherit; margin:0px; padding:0px"></strong></span>
                </div>
              </div>
              <div style="color: rgb(252, 180, 43); margin: 0px; font-size: 1.5em; line-height: 1em; font-weight: inherit; text-align: inherit; text-decoration: inherit; box-sizing: border-box; border-color: rgb(252, 180, 43); padding: 0px;">
                <div style="box-sizing: border-box; color: inherit; border-color: rgb(252, 180, 43); padding: 0px; margin: 0px;">
                  <span style="box-sizing:border-box; color:#262626; font-size:24px; margin:0px; padding:0px"><strong style="border-color:rgb(252, 180, 43); box-sizing:border-box; color:inherit; font-size:24px; margin:0px; padding:0px"><span class="brush" data-brushtype="text" style="box-sizing:border-box; color:inherit; font-size:24px; margin:0px; padding:0px">编辑器</span></strong></span>
                </div>
              </div>
            </div>
            <div class="layout" style="display: inline-block; float: right; border-left-width: 2px; border-left-style: groove; border-color: rgb(252, 180, 43); width: 60%; margin-top: 15px; padding-left: 1.5em; vertical-align: middle; box-sizing: border-box; font-weight: inherit; text-align: left; text-decoration: inherit; color: inherit;" data-width="60%">
              <div class="brush" data-style="color: inherit; font-size: 14px; margin-bottom:0.8em; box-sizing: border-box; padding: 0px; line-height: 1.2em;font-weight:bold;" style="width: 100%; box-sizing: border-box; color: inherit; padding: 0px; margin:3px 0px;" data-width="100%">
                <p style="color: inherit; font-size: 24px; margin-bottom:0.8em; box-sizing: border-box; padding: 0px; line-height: 1em;">
                  <strong style="box-sizing:border-box; color:inherit; margin:0px; padding:0px"><span style="box-sizing:border-box; color:inherit; font-size:14px; line-height:1em; margin:0px; padding:0px">V服编辑器是一款在线编辑工具，为您提供丰富的样式，精美的模板</span></strong>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br>`
      ],
      styleTrades: [
        `<br>
        <div style="padding: 20px; color: rgb(255, 255, 255); background-color: rgb(226, 121, 97);">
          <div style="padding: 10px; color: rgb(255, 255, 255); margin: 0px; border: 2px solid rgba(254, 254, 254, 0.8); background: rgb(226, 121, 97);">
            <div style="border: 0px; box-sizing: border-box; width: 100%; clear: both;  padding: 0px; text-align: center; color: rgb(255,255,255);height:60px" data-width="100%">
              <div style="box-sizing: border-box; width: 42%; float: left; padding:3px 0px; text-align: right; color: inherit;" data-width="42%">
                <div style="color: inherit;padding:0px;">
                  <p style="box-sizing: border-box; margin-top: 3px; margin-bottom: 0; margin-right: 0.2em; padding: 3px 0px 0px; color: inherit; line-height: 1.3em; text-align: right; font-size: 18px; border-color: rgb(226, 121, 97);">
                    <strong><span class="sh" data-brushtype="text" style="border-color: #E27961; color: inherit; font-size: 18px;">SAVE</span></strong>
                  </p>
                  <p style="box-sizing: border-box; margin-top: 0; margin-bottom: 0; margin-right: 0.2em; padding: 0px 0px 3px; line-height: 1.2em; text-align: right; font-size: 18px; text-indent: 0em; border-color: rgb(226, 121, 97);">
                    <strong><span class="brush" data-brushtype="text" style="border-color: #E27961; color: inherit; font-size: 18px;">UPTO</span></strong>
                  </p>
                </div>
              </div>
              <div style="display: inline-block; width: 58%; box-sizing: border-box; float: right; padding: 0px; text-align: left; color: inherit;" data-width="58%">
                <div style="color: inherit;height:60px">
                  <p style="box-sizing: border-box; margin-top: 0; margin-bottom: 0; margin-right: 0.2em; padding: 3px 0px; color: inherit; line-height: 3.5em; text-align: left; border-color: rgb(226, 121, 97);">
                    <span style="color:inherit"><strong><span class="brush" data-brushtype="text" style="border-color: #E27961; color: inherit; font-size: 55px;">50%</span></strong></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br>`,
        `<br>
        <div style="margin: 16px 0% 8px; text-align: center; position: static;">
            <div style="padding: 32px 16px 16px; box-sizing:border-box;white-space: normal; background-image: -webkit-repeating-linear-gradient(135deg, transparent, transparent 4px, white 4px, white 12px); background-color: rgb(226, 223, 223);">
              <div style="width: 32px; margin: -40px auto; font-size: 64px; line-height: 1; color: rgb(226, 223, 223); background: white;">
                  “
              </div>
              <div style="padding: 8px; box-sizing:border-box;background-color: rgb(255, 255, 255);">
                <div style="margin-top: -35px; margin-right: 0%; margin-left: 0%; position: static;">
                  <div style="display: inline-block; width: 55%; vertical-align: top; background-color: rgb(254, 255, 255);" data-width="55%">
                    <div style="position: static;">
                      <div style="color: rgb(133, 118, 106); font-size: 20px;">
                        <div>
                          <p>
                            全场满100<strong>包邮</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style="position: static;">
                      <div style="text-align: left; font-size: 12px; color: rgb(160, 160, 160); letter-spacing: 1px;">
                        <p style="text-align: center;">
                          9.22 10:00 - 9.28 10:00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="position: static;margin-top:20px;margin-bottom:10px;">
                  <div style="display: inline-block; vertical-align: top; width: 50%; padding: 5px;box-sizing:border-box;" data-width="50%">
                    <div style="position: static;">
                      <div style="letter-spacing: 1px;">
                        <div>
                          <p>
                            <span style="font-size: 7px;">￥&nbsp;</span><span style="font-size: 35px;"><strong><span style="line-height: 1.6;">10</span></strong></span><span style="font-size: 14px;"><strong><span style="line-height: 1.6;">优惠券</span></strong></span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style="margin-right: 0%; margin-bottom: 8px; margin-left: 0%; position: static;">
                      <div style="border-top: 1px dotted rgb(11, 11, 11);"></div>
                    </div>
                    <div style="position: static;">
                      <div style="position: static;">
                        <p style="font-size: 13px;">
                          订单满150元使用
                        </p>
                      </div>
                    </div>
                    <div style="position: relative;">
                      <div style="margin-top: 10px; margin-bottom: 10px; position: static;">
                        <div class="" style="display: inline-block;border: 2px solid rgb(133, 118, 106);box-sizing:border-box;padding: 0.1em 0.5em;border-radius: 3px;color: rgb(255, 255, 255);font-size: 14px;background-color: rgb(133, 118, 106);">
                          <p>
                            抢先领取&gt;&gt;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="display: inline-block; vertical-align: top; width: 50%;" data-width="50%">
                    <div style="display: inline-block; width: 100%; border-width: 0px 0px 0px 1px; border-style: solid; border-left-color: rgb(226, 223, 223); border-right-color: rgb(226, 223, 223); padding: 5px;box-sizing:border-box;" data-width="100%">
                      <div style="position: static;">
                        <div style="letter-spacing: 1px;">
                          <p>
                            <span style="font-size: 7px;">￥&nbsp;</span><span style="font-size: 35px;"><strong><span style="line-height: 1.6;">50</span></strong></span><span style="font-size: 14px;"><strong><span style="line-height: 1.6;">优惠券</span></strong><strong><span style="line-height: 1.6;"></span></strong></span>
                          </p>
                        </div>
                      </div>
                      <div style="position: static;">
                        <div style="margin-right: 0%; margin-bottom: 8px; margin-left: 0%; position: static;">
                          <div style="border-top: 1px dotted rgb(11, 11, 11);"></div>
                        </div>
                      </div>
                      <div style="position: static;">
                        <div style="font-size: 13px;">
                          <p>
                            订单满350元使用
                          </p>
                        </div>
                      </div>
                      <div style="position: static;">
                        <div style="margin-top: 10px; margin-bottom: 10px; position: static;">
                          <div style="display: inline-block;border: 2px solid rgb(133, 118, 106);box-sizing:border-box;padding: 0.1em 0.5em;border-radius: 3px;color: rgb(255, 255, 255);font-size: 14px;background-color: rgb(133, 118, 106);">
                            <p>
                              抢先领取&gt;&gt;
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br>`,
        `<br>
        <div style="background-color:#fbfbfb;padding:10px;">
            <p style="font-family:'Microsoft Yahei';color:#333;margin:0;padding:10px;">
              <strong class="brush" data-brushtype="text">联系我们</strong>
            </p>
            <div style="overflow:hidden;border-bottom:1px solid #ddd;font-size:14px;color:#545454;background-color:#fbfbfb;">
              <span style="background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhFRkZpYkdhcjVJZTNVWm95SDdhaWFybGo2aWNkeGtBYkJDT3VJTjVoNjZPUGdPcFhGR3p0WDQ0cUVpY1gydEJnamFSNGZYeGJjY3dUTHhnLzA=);background-position:0 -135px ; background-repeat:no-repeat;display:block;width:24px;height:24px;float:left;margin-top:6px;margin-left:10px;"></span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">电话：</span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">155xxxxxxxx</span><span style="display:block;float:right;margin-right:10px;font-weight:bold;line-height:38px;width:20px;height:36px;background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhFRkZpYkdhcjVJZTNVWm95SDdhaWFybGo2aWNkeGtBYkJDT3VJTjVoNjZPUGdPcFhGR3p0WDQ0cUVpY1gydEJnamFSNGZYeGJjY3dUTHhnLzA=);background-repeat:no-repeat;background-position:0 -197px;"></span>
            </div>
            <div style="overflow:hidden;border-bottom:1px solid #ddd;font-size:14px;color:#545454;background-color:#fbfbfb;">
              <span style="background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhFRkZpYkdhcjVJZTNVWm95SDdhaWFybGo2aWNkeGtBYkJDT3VJTjVoNjZPUGdPcFhGR3p0WDQ0cUVpY1gydEJnamFSNGZYeGJjY3dUTHhnLzA=);background-position:0 -472px ; background-repeat:no-repeat;display:block;width:24px;height:24px;float:left;margin-top:6px;margin-left:10px;"></span><span style="display:block;float:left;margin-left:11px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">QQ：</span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">25822xxxx</span>
            </div>
            <div style="overflow:hidden;border-bottom:1px solid #ddd;font-size:14px;color:#545454;background-color:#fbfbfb;">
              <span style="background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhFRkZpYkdhcjVJZTNVWm95SDdhaWFybGo2aWNkeGtBYkJDT3VJTjVoNjZPUGdPcFhGR3p0WDQ0cUVpY1gydEJnamFSNGZYeGJjY3dUTHhnLzA=);background-position:0 0px ; background-repeat:no-repeat;display:block;width:24px;height:24px;float:left;margin-top:8px;margin-left:10px;"></span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">微信：</span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">xxxx</span>
            </div>
            <div style="overflow:hidden;border-bottom:1px solid #ddd;font-size:14px;color:#545454;background-color:#fbfbfb;">
              <span style="background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhFRkZpYkdhcjVJZTNVWm95SDdhaWFybGo2aWNkeGtBYkJDT3VJTjVoNjZPUGdPcFhGR3p0WDQ0cUVpY1gydEJnamFSNGZYeGJjY3dUTHhnLzA=);background-position:0 -270px ; background-repeat:no-repeat;display:block;width:24px;height:24px;float:left;margin-top:6px;margin-left:10px;"></span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">地址：</span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">xx省xx市xx区xx</span><span style="display:block;float:right;margin-right:10px;font-weight:bold;line-height:38px;"></span>
            </div>
            <div style="overflow:hidden;border-bottom:1px solid #ddd;font-size:14px;color:#545454;background-color:#fbfbfb;">
              <span style="background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei9RS0R4clZZZWhpY2ViZ3d6Y1JkZjlXZmRFWHBWRjFlQkREekc4b3FEdmdYQjBseURNaGljbFlxa21nY295QjkycFF4Y3doOTVGWWlhdlBlZG5raWJuSWlhcEJBLzA/d3hfZm10PXBuZw==);background-position:0 -31px ; background-repeat:no-repeat;display:block;width:24px;height:24px;float:left;margin-top:6px;margin-left:10px;"></span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">官网：</span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">www.135editor.com/</span><span style="display:block;float:right;margin-right:10px;font-weight:bold;line-height:38px;width:20px;height:36px;background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhFRkZpYkdhcjVJZTNVWm95SDdhaWFybGo2aWNkeGtBYkJDT3VJTjVoNjZPUGdPcFhGR3p0WDQ0cUVpY1gydEJnamFSNGZYeGJjY3dUTHhnLzA=);background-repeat:no-repeat;background-position:0 -197px;"></span>
            </div>
            <div style="overflow:hidden;font-size:14px;border-bottom:1px solid #ddd;color:#545454;background-color:#fbfbfb;">
              <span style="background-image:url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkhFRkZpYkdhcjVJZTNVWm95SDdhaWFybGo2aWNkeGtBYkJDT3VJTjVoNjZPUGdPcFhGR3p0WDQ0cUVpY1gydEJnamFSNGZYeGJjY3dUTHhnLzA=);background-position:0 -99px ; background-repeat:no-repeat;display:block;width:24px;height:24px;float:left;margin-top:6px;margin-left:10px;"></span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">邮箱：</span><span style="display:block;float:left;margin-left:10px;line-height:38px;font-family:'Microsoft Yahei';" class="brush" data-brushtype="text">xxxxx@xxxx.xx</span>
            </div>
          </div>
          <br>`,
        `<br>
        <div style="text-align:center;">
            <div style="width:280px;height:auto !important;padding:16px 5px;background-image: url(http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkZkVDVTZ2traWJlZGpQcUhtSGd1Z3ZTZERpYmU0ZUJrYlN6aWJEZ3hLTjhkczM1Q1NOdmljQVRBcEdvRGpUeFV0TUZpYlFYNHY4blcxZ1E3US8wP3d4X2ZtdD1wbmc=); background-size:contain; background-repeat: no-repeat;background-position:50% 0;display:inline-block;">
              <div class="brush" style="margin: 3px auto; padding:5px 16px;color: rgb(62, 62, 62);border:2px solid rgba(254,254,254,0.3);display:inline-block;">
                <p style="text-align: center; margin-top: 0; margin-bottom: 0;">
                  <span style=";font-size: 18px;;color: #FFFFFF;">￥5优惠券</span>
                </p>
                <div style="padding:6px 50px; font-size: 18px; text-align: center; background-color: rgb(254, 254, 254);display:inline-block;">
                  <strong><span style="color: #CB254E;" class="brush" data-brushtype="text">立即领取</span></strong>
                </div>
                <p style="text-align: center; margin-top: 0; margin-bottom: 0;">
                  <span style="color: #FFFFFF;" class="brush" data-brushtype="text">（满10元使用）</span>
                </p>
              </div>
            </div>
          </div>
          <br>`,
        `<br>
        <div style="display:inline-block;transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-o-transform: rotate(0deg);">
            <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkVLS2RKUk1aZWlhREV3Z2RrVGJZb0dhWmlhOGF0c1FpYVRPT2pQNlBER2tIanNNUDY2T2NlcHFYSW0xSGoxVlZIZGdHZEZySWZwQlI2ZEEvMD93eF9mbXQ9cG5n" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei95cVZBcW9adkRpYkVLS2RKUk1aZWlhREV3Z2RrVGJZb0dhWmlhOGF0c1FpYVRPT2pQNlBER2tIanNNUDY2T2NlcHFYSW0xSGoxVlZIZGdHZEZySWZwQlI2ZEEvMD93eF9mbXQ9cG5n" style="width: 120px !important; height: auto !important;" class="assistant">
          </div>
          <div style="color: inherit;margin-top: -5.8em;">
            <p style="line-height: 1.75em; font-size: 12px; text-align: center;">
              <img src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkVMZGx6Ym1hYjBZRVF1RFNKcTU1YXAxd3JpYmJKRzFtSlNUWVBYTThwOHlCWk5YUXdMZWVENExkUGlhcFBPSEN5VkEyOWdqSFd3UXNzdy8wP3d4X2ZtdD1qcGVn" data-ke-src="http://image3.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpei96aWFkRERReGJDSkVMZGx6Ym1hYjBZRVF1RFNKcTU1YXAxd3JpYmJKRzFtSlNUWVBYTThwOHlCWk5YUXdMZWVENExkUGlhcFBPSEN5VkEyOWdqSFd3UXNzdy8wP3d4X2ZtdD1qcGVn" style="width: 100%; margin: 0px;" width="100%" height="" border="0" opacity="" mapurl="" title="" alt="" data-width="100%">
            </p>
            <p style="line-height: 1.75em; font-size: 12px; text-align: center;">
              <span style="font-size: 14px;" class="brush" data-brushtype="text">渐变色衬衫 ￥140</span>
            </p>
          </div>
          <br>`
      ],
      templates: [
        `<br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <div>
            <img src="/resources/admin/images/article/bottom.png" data-ke-src="/resources/admin/images/article/bottom.png" width="100%">
          </div>
          <br>`,
        `<br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <div>
            <img src="/resources/admin/images/article/bottom1.png" data-ke-src="/resources/admin/images/article/bottom1.png" width="100%" height="150">
          </div>
          <br>`
      ]
    };
  },
  components: {
  },
  mounted() {
    this.getContent();
  },
  methods: {
    ...mapGetters(['getUser']),
    templateSelect(template) {
      this.$emit('templateSelect', template);
    },
    handleSelect(key, keyPath) {
      this.selectedNav = key;
      this.getContent();
    },
    getQueryParams() {
      return {
        userId: this.getUser().id,
        type: [this.activeTab]
      };
    },
    getContent(template) {
      this.loading = true;
      let url = '';
      if (this.selectedNav === '0') {
        url = '/admin/materialTemplate/styleList.jhtml';
      } else {
        url = '/admin/materialTemplate/materialList.jhtml';
      }
      http
        .post(url, this.getQueryParams())
        .then(data => {
          this.tableData = data.dataList;
          // this.pagination.total = Number(data.total);
        })
        .catch(errData => {
          console.log(errData);
          console.log('code错误');
          if (errData.errorMessage) this.$message.warning(errData.errorMessage);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.biz-eidtor-template {
  // width: 445px;
  // height: 100%;
  border: 1px solid #e7e7eb;;
  border-radius: 3px 0 0 3px;
  display: flex;
  .el-tabs__item,
  .el-tabs--top .el-tabs__item.is-top:nth-child(2),
  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding: 0 17.2px;
    height: 41px;
  }
  .el-tabs__active-bar {
    background-color: #e7e7eb;;
    height: 0;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #ccc;
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content {
    p {
      margin-top: 0;
      margin-bottom: 0;
    }
    overflow: auto;
    height: 699px;
    padding: 0 10px 10px 10px;
  }
  .tab-item {
    padding: 10px;
    border-bottom: 1px dashed #e7e7eb;;
    user-select: none;
    cursor: pointer;
  }
  img {
    width:auto;
    height:auto;
    max-width:100%;
    max-height:100%;
  }
}
</style>
