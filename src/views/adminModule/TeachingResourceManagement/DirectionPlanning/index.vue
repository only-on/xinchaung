<template>
 <a-tabs   @change="changeTab" defaultActiveKey="1">
    <a-tab-pane v-for="(tab,i) in planTtab" :key="i" :tab=tab.tabList  >
      <div class="search-plan">
          <a-select
            v-show="i==0||i==1"
            v-model:value="selectvalue"
            show-search
            placeholder="Select a person"
            style="width: 245px"
            :options="options"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
          >
          </a-select>
        <!-- <a-button type="primary" class="add-time-btn"  @click="addDirection"
            >添加{{tab.title}}</a-button
          > -->
       <a-input v-show="i==2||i==4" style="width: 245px" v-model:value="searchValue" placeholder="Basic usage" />

      </div>
      
        <logicDiagram 
            v-if="i==3"
            :tabsName ="tabsName"
        />
      <a-table align="center" :columns="columns" :data-source="data"   v-if="i!=3">
        <template >
          <a>{{ tab.title }}</a>
        </template>
        <template #customTitle>
          <span>
            {{ tab.title }}
          </span>
        </template>
        <template #action="{ record }">
          <span>
            <a   @click="revise(record.key)"> 修改</a>
            <a-divider type="vertical" />
            <a   @click="onDelete(record.key)">删除</a>
            <a-divider type="vertical" />
          
          </span>
        </template>
      </a-table>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { SelectTypes } from 'ant-design-vue/es/select';
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import logicDiagram from "src/views/teacherModule/knowledgeMap/index.vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const activeKey = ref<string>('0')
const searchValue =ref<any>('')
const tabsName =ref<any>("方向规划") 
updata({
  tabs: [{ name: "方向规划", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

 const planTtab:any =[{tabList:'课程方向规划',title:'课程方向'},
                      {tabList:'职业方向规划',title:'职业方向'},
                      {tabList:'技术方向规划',title:'技术方向'},
                      {tabList:'知识图谱规划',title:'知识图谱'},
                      {tabList:'标签规划',title:'标签'}]
 const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' },
    align:'center'
  },
 
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
    align:'center'
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
   {
    key: '2',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
];
/**
 * 下拉框
 */
const selectvalue = ref<string | undefined>(undefined)
const options = ref<SelectTypes['options']>([
      { value: 'jack', label: 'Jack' },
      { value: 'lucy', label: 'Lucy' },
      { value: 'tom', label: 'Tom' },
    ]);
const handleChange = (value: string) => {
  console.log(value);
};
const handleBlur = () => {
  console.log('blur');
};
const handleFocus = () => {
  console.log('focus');
};
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const onDelete = (key:any) => {
  // 删除
}
const revise = (key:any) => {
// 修改

}
const changeTab = (activeKey:any) => {
//  切换tab标签
console.log(activeKey)
}
 const addDirection = ()=>{
  //  添加课程方向
 }
</script>
<style scoped lang="less">
  .search-plan{
    margin-bottom: 20px;
  }
  .ant-tabs{
    margin: 0 auto;
    width:  var(--center-width);
  }
  .knowledgeMap{
    width:  var(--center-width);
    .jsmind-inner{
      overflow: inherit;
    }
  }
  
</style>
