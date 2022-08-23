<template>
    <div>
       <a-form-item :rules="{
           message:knowledgePoints?.length>maxNum?`知识点最多可选${NoToCh(maxNum)}个`:'',
          }"
          >
            <template v-slot:label>
              <div>
                知识点<span class="tiptit">最多可选择{{maxNum}}个</span>
              </div>
            </template>
            <div style="display:flex">
              <a-cascader
              :style="ifEdit?'width:89.1%;margin-right:10px':''"
              ref="cascaderRef"
              :disabled='(ifEdit?true:false)&&disabled'
              dropdownClassName="knowLedge"
              v-model:value="knowledgePoints"
              multiple
              :options="options1"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择"
              :load-data="loadData"
              @change='changeData'
              @dropdownVisibleChange="dropdownVisibleChange"
            ></a-cascader>
            <a-button v-if="ifEdit" type="primary" @click="againSelect">重新选择</a-button>
            </div>
          </a-form-item>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from "@vue/runtime-core";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { defineComponent, ref, reactive, toRefs } from 'vue'
import {NoToCh} from 'src/utils/common'
const http = (request as any).QuestionBank;
interface Props { 
knowledgePoints:any[];
maxNum?: number;
ifEdit?:boolean
}
const props = withDefaults(defineProps<Props>(),{
 knowledgePoints:()=>[],
 maxNum: 3,
 ifEdit:false
});
const emit = defineEmits<{
  (e: "update:knowledgePoints", val: any): void;
  (e: "close"): void;
}>();
const arr = ref<any>([])
const disabled:any=ref(true)
function changeData(value:any, selectedOptions:any){
  arr.value = value
  let a:any= []
  selectedOptions.forEach((item:any,index:any) => {
    // 第三级全选中
    if (item.length === 2) {
      item[1].children.forEach((cItem:any) => {
        a.push([item[0].id, item[1].id, cItem.id])
      } )
      arr.value.splice(index,1,...a)
    }
    // 第二级只有一个且第三级全选中
    if (item.length === 1) {
      item[0].children[0].children.forEach((cItem:any) => {
        a.push([item[0].id, item[0].children[0].id, cItem.id])
      })
      arr.value.splice(index,1,...a)
    }
  })
  console.log(arr.value)
  if(arr.value.length > props.maxNum){
    arr.value.splice(arr.value.length - 2, 1)
  }
  emit("update:knowledgePoints",arr.value)
}
function dropdownVisibleChange(value:any) {
  if (!value) {
    emit('close')
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

function againSelect(){
  emit("update:knowledgePoints",[])
  disabled.value=false
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
:deep(.ant-form-item){
  display: flex;
  flex-direction: column;
  .ant-form-item-label{
    text-align: left;
  }
}
</style>
<style lang="less">

.knowLedge{
 &.ant-select-dropdown .ant-cascader-menus .ant-cascader-menu{
    &:nth-child(1) .ant-cascader-menu-item .ant-cascader-checkbox{
      display: none;
    }
    &:nth-child(2) .ant-cascader-menu-item .ant-cascader-checkbox{
      display: none;
    }
  }
}
</style>