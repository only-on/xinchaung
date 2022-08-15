<template>
    <div>
       <a-form-item :rules="{
           message:knowledgePoints?.length>3?'知识点最多可选三个':'',
          }">
            <template v-slot:label>
              <div>
                知识点<span class="tiptit">最多可选择3个</span>
              </div>
            </template>
            <a-cascader
              class="knowLedge"
              v-model:value="knowledgePoints"
              multiple
              :options="options1"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择"
              :load-data="loadData"
              @change='changeData'
            >
            </a-cascader>
          </a-form-item>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { defineComponent, ref, reactive, toRefs } from 'vue'
const http = (request as any).QuestionBank;
interface Props { 
knowledgePoints:any[];
}
const props = withDefaults(defineProps<Props>(),{
 knowledgePoints:()=>[]
});
const emit = defineEmits<{
  (e: "update:knowledgePoints", val: any): void;
}>();
function changeData(value:any, selectedOptions:any){
  if(selectedOptions.length<4){
    emit("update:knowledgePoints",props.knowledgePoints)
  }
}
const options1:any =ref([]);
function getKnowledgeFirst(){
  options1.value.length = 0
  http.allCourseDir().then((res:any) => {
      options1.value=res.data
      options1.value.forEach((item:any)=>{
        item.isLeaf=false
      })
  })
}
function loadData(selectedOptions:any){
      const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        console.log(selectedOptions.length,'selectedOptions.length')
        if(selectedOptions.length==2){
           http.allknowledges({urlParams:{ID:selectedOptions[selectedOptions.length - 1]?.id}}).then((res:any) => {
          console.log(res.data,'res.data')
            targetOption.loading = false
            targetOption.children = res.data
            targetOption.children.forEach((item:any)=>{
                item.isLeaf=true
            })
        })
        }else{
          http.allCourseOfDir({urlParams:{tagName:selectedOptions[selectedOptions.length - 1]?.name}}).then((res:any) => {
          console.log(res.data,'res.data')
            targetOption.loading = false
            targetOption.children = res.data
            targetOption.children.forEach((item:any)=>{
                item.isLeaf=false
            })
        })
        }
    };
onMounted(()=>{
    getKnowledgeFirst()
})
</script> 
<style lang="less">
.tiptit{
  font-size: 12px;
  margin-left: 10px;
  color:var(--black-45);
}
.ant-select-dropdown .ant-cascader-menus .ant-cascader-menu:nth-child(1) .ant-cascader-menu-item .ant-cascader-checkbox{
  display: none;
}
.ant-select-dropdown .ant-cascader-menus .ant-cascader-menu:nth-child(2) .ant-cascader-menu-item .ant-cascader-checkbox{
  display: none;
}
</style>