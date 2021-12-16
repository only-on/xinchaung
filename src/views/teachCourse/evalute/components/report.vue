<template>
  <div class="reportBox">
    <div class="report scrollbar2">
      <!-- 离线报告 -->
      <div id="offline" v-if="showOffline">
        <iframe v-if="showIframe" :src="reportData.pdf_url" frameborder="0" width="100%" height="500px"></iframe>
        <div v-else>文档转换中，请稍后查看！</div>
      </div>
      <!-- 在线报告 -->
      <div id="online" v-if="showOnline">
        <table>
          <template v-for="(item,index) in reportData.json_content" :key="index">
            <tr v-if="item.type === 'w1'">
              <td colspan="6" class="report-title" :align='item.fields[0].align'>{{item.fields[0].value}}</td>
            </tr>
            <tr v-if="item.type === 'w2' || item.type === 'w5'">
              <td class="w2 title-text" :align='item.fields[0].align'>{{item.fields[0].value}}</td>
              <td colspan="5" style='word-break: break-all;'>{{item.fields[1].value}}</td>
            </tr>
            <tr v-if="item.type === 'w3'">
              <td class="w2 title-text" :align='item.fields[0].align'>{{item.fields[0].value}}</td>
              <td colspan="2" style='word-break: break-all;'>{{item.fields[1].value}}</td>
              <td class="w2 title-text" :align='item.fields[0].align'>{{item.fields[2].value}}</td>
              <td colspan="2" style='word-break: break-all;'>{{item.fields[3].value}}</td>
            </tr>
            <template v-if="item.type === 'w4'|| item.type === 'w6'">
              <tr>
                <td colspan="6" class="title-text" :align='item.fields[0].align' style='height:30px;'>{{item.fields[0].value}}</td>
              </tr>
              <tr>
                <td colspan="6" style='word-break: break-all;'>{{item.fields[1].value}}</td>
              </tr>
            </template>
            <tr v-if="item.type === 'w7'">
              <td class="w2 title-text" :align='item.fields[0].align'>{{item.fields[0].value}}</td>
              <td class="" colspan="5"><antdv-markdown :preview-only="true"  v-model="item.fields[1].value"/></td>
            </tr>
            <template v-if="item.type === 'w8'">
              <tr>
                <td colspan="6" class="title-text" :align='item.fields[0].align' style='height:30px;'>{{item.fields[0].value}}</td>
              </tr>
              <tr>
                <td colspan="6"><antdv-markdown :preview-only="true" v-model="item.fields[1].value"/></td>
              </tr>
            </template>
          </template>
        </table>
      </div>
    </div>
    <div class="annotate" @click="handleAnnotate">
      <i class="iconfont icon-piyue"></i>
      <div>
        <span>报告</span>
        <span>批注</span>
      </div>
    </div>
    <!-- 抽屉 -->
    <a-drawer
      placement="right"
      :closable="false"
      v-model:visible="drawerVisible"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      :maskStyle="{background: 'transparent'}"
      :width="400"
    >
      <a-form :model="form" layout="vertical" :rules="rules" ref="formRef" @finish="handleFinish">
        <a-form-item label="分数" name="score">
          <a-input v-model:value="form.score" :disabled="annotateDisabled"/>
        </a-form-item>
        <a-form-item label="批注" name="remark">
          <a-textarea v-model:value="form.remark" :maxlength="500" :rows="6" :disabled="annotateDisabled"/>
        </a-form-item>
        <a-form-item style="text-align:center" v-if="!annotateDisabled">
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script lang="tsx">
import { defineComponent, reactive, ref, inject, watch, onMounted, VNode } from 'vue'
import { RuleObject } from 'ant-design-vue/es/form/interface';
import request from "src/api/index";
import { Ihttp } from "../../typings";
import { IBusinessResp } from "src/typings/fetch.d";
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
interface Iform{
  score: string,
  remark: string
}
let checkScore = async (rule: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject('请输入分数');
  }
  let register = /^(100|[1-9]?[0-9])$/
  if (!register.test(value)) {
    return Promise.reject('请输入0-100的整数');
  } else {
    return Promise.resolve();
  }
};
export default defineComponent({
  components: {
    'antdv-markdown':AntdvMarkdown,
  },
  props: ['reportData'],
  setup(props,{emit}) {
    const http = (request as Ihttp).teachCourse;
    const drawerVisible = ref<boolean>(false)
    var reportData = reactive<any>({})
    var showOffline = ref<boolean>(false)
    var showOnline = ref<boolean>(false)
    var annotateDisabled = ref<boolean>(false)
    var showIframe = ref<boolean>(false)
    var refresh=inject('refresh') as Function
    var form = reactive<Iform>({
      score: '',
      remark: ''
    })
    const rules = {
      score: [
        {required: true, validator: checkScore, trigger: 'blur'}
      ]
    }
    onMounted(()=>{
      setTimeout(()=>{
        Object.assign(reportData, props.reportData)
        if (reportData && reportData.template_type === 'file'&& reportData.pdf_url) {
          showOffline.value = true
          fetch(reportData.pdf_url,{
              method: 'get',
          }).then((res:any) => {     
              if (res.status === 200) {
                showIframe.value = true
              } else {
                showIframe.value = false
              }
          })
        }
        if (reportData && reportData.template_type === 'form'&& reportData.json_content.length > 0) {
          showOnline.value = true
        }
        if (reportData && (reportData.score || reportData.score == 0)) {
          form.score = reportData.score 
          form.remark = reportData.remark
        }
        if (reportData.can_teacher_update) {
          annotateDisabled.value = false
        } else {
          annotateDisabled.value = true
        }
      },400)
    })
    function handleAnnotate () {
      drawerVisible.value = true
    }
    function handleFinish (values: Iform) {
      let params = {
        id: reportData.id,
        csc_id: reportData.csc_id,
        score: values.score,
        remark: values.remark
      }
      http.reportAnnotate({param: params}).then((res:IBusinessResp) => {
        refresh()
      })
    }
    return {
      drawerVisible,
      form,
      rules,
      reportData,
      showOffline,
      showOnline,
      annotateDisabled,
      showIframe,
      handleAnnotate,
      handleFinish,
    }
  },
})
</script>
<style lang="less" scoped>
.reportBox{
  width: 100%;
  position: relative;
  height: 400px;
  overflow: hidden;
  .annotate{
    width: 85px;
    height: 50px;
    position: absolute;
    right: 2%;
    top: 10px;
    cursor: pointer;
    background: #ff9d00;
    border-radius: 8px;
    box-shadow: 0px 4px 14px 0px rgba(255,197,103,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    color: #fff;
    i{
      font-size: 32px;
    }
    div{
      display: flex;
      flex-direction: column;
      font-size: 14px;
      padding-left: 15px;
    }
  }
}
.report{
  position: relative;
  height: 100%;
  overflow: auto;
  #offline{
    &>div{
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: @theme-color
    }
  }
  :deep(table){
    width: 100%;
    border: 1px solid #e1dddd;
    color: #14191e;
    td{
      padding: 2px 5px;
      height: 70px;
      border: 1px solid #e5e5e5;
      color: #777;
    }
    .w2{
      width: 20%;
    }
    .title-text{
      font-size: 14px;
      color: #333;
    }
    .report-title{
      font-size: 16px;
      color: #333;
    }
  }
  :deep(.mark__container){
    border: none;
    .mark__body .mark__preview{
      border-left: none;
      overflow-y: auto;
      padding: 0;
    }
  }
}
</style>
