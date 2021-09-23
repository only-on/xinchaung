<template>
  <div class="report">
    <!-- 离线报告 -->
    <div id="offline">
      <iframe src="http://192.168.101.150/plugin/PDF/viewer.html?file=http://192.168.101.150/upload/report_records/pdf/0/0/56_1622792420.pdf" frameborder="0" width="100%" height="500px"></iframe>
    </div>
    <!-- 在线报告 -->
    <div id="online">

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
      title="Basic Drawer"
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
          <a-input v-model:value="form.score" type="number"/>
        </a-form-item>
        <a-form-item label="批注" name="remark">
          <a-textarea v-model:value="form.remark" :maxlength="500" :rows="6" />
        </a-form-item>
        <a-form-item style="text-align:center">
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, inject } from 'vue'
import { RuleObject } from 'ant-design-vue/es/form/interface';
import request from "src/api/index";
import { Ihttp } from "../typings";
import { IBusinessResp } from "src/typings/fetch.d";
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
  setup(props,{emit}) {
    const http = (request as Ihttp).teachCourse;
    const drawerVisible = ref<boolean>(false)
    const formRef = ref();
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
    function handleAnnotate () {
      drawerVisible.value = true
    }
    function handleFinish (values: Iform) {
      let params = {
        id: 0,
        csc_id: 0,
        score: values.score,
        remark: values.remark
      }
      refresh(111)
      // http.reportAnnotate({param: params}).then((res:IBusinessResp) => {
      //   refresh(111)
      // })
    }
    return {
      drawerVisible,
      form,
      rules,
      handleAnnotate,
      handleFinish
    }
  },
})
</script>
<style lang="less" scoped>
.report{
  position: relative;
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
</style>
