<template>
  <div class="testCase">
    <div class="testCaseIndex" v-for="(item,index) in inputAndOut" :key="index">
      <div class="exhand">
        <span>测试用例{{index+1}}</span>
        <div>
          <span class="del pointer" v-if="index > 0" @click="deleteTest(index)">删除</span>
          <span
            v-if="item.ifShow"
            @click="item.ifShow=!item.ifShow"
            class="icon iconfont icon-icon_function_zhankai"
          ></span>
          <span
            v-else
            @click="item.ifShow=!item.ifShow"
            class="icon iconfont icon-icon_function_zhankai-copy"
          ></span>
        </div>
      </div>
      <div class="exhand_content">
        <a-row v-if="item.ifShow" :gutter="24">
          <a-col :span="12">
            <a-form-item label="输入" name="inputCon" >
              <a-textarea v-model:value="item.inputCon" :rows="4" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="输出" name="inputCon" >
              <a-textarea v-model:value="item.outCon" :rows="4" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
interface inputAndOutType{
    inputCon:any;
    outCon:any;
    ifShow:any;
}
interface Props {
  inputAndOut: inputAndOutType[];
}
const props = withDefaults(defineProps<Props>(), {});
function deleteTest(index: number) {
  props.inputAndOut.splice(index, 1)
}
</script>
<style lang="less" scoped>
.testCaseIndex{
     margin-top: 20px;
     background: #f9f9f9;
}
.exhand {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d4d4d4;
  height: 50px;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 24px;
}
.exhand_content {
  padding: 0 24px;
  color: var(--black-65);
}
.icon-icon_function_zhankai,
.icon-icon_function_zhankai-copy {
  width: 22px;
  height: 22px;
  // border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  text-align: center;
  line-height: 23px;
  margin-left: 24px;
}
</style>