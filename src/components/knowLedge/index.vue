<template>
    <div>
       <a-form-item name="knowledgePoints">
            <template v-slot:label>
              <div>
                知识点<span class="tiptit">最多可选择3个</span>
              </div>
            </template>
            <a-cascader
              v-model:value="formState.knowledgePoints"
              :multiple="false"
              max-tag-count="responsive"
              :options="options1"
              :field-names="{ label: 'knowledge_map_name', value: 'id' }"
              placeholder="请选择"
              @change="changeHandle"
            ></a-cascader>
          </a-form-item>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { defineComponent, ref, reactive, toRefs } from 'vue'
const http = (request as any).QuestionBank;
const formState:any=reactive({
    knowledgePoints:[]
})
const options1:any =ref([]);
function getKnowledgeFirst(){
  options1.value.length = 0
  http.getKnowledgeFirst().then((res:any) => {
      options1.value=res.data
  })
}
function changeHandle(value: any, selectedOptions: any){
   console.log(options1.value,'options1.value',value,'value',selectedOptions,'selectedOptions')
   http.getKnowledgeSub({urlParams: {id:value[0]}}).then((res:any)=>{
       var children=res.data
       options1.value.forEach((item:any,index:any)=> {
           console.log(item.id,value[0],'item')
           if(item.id==value[0]){
               item.children=children
           }
       });
   })
   console.log(options1.value,'options1.value')
}
onMounted(()=>{
    getKnowledgeFirst()
})
</script> 
<style lang="less" scoped>
.tiptit{
  font-size: 12px;
  margin-left: 10px;
  color:var(--black-45);
}
</style>