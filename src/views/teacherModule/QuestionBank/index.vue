<template>
    <div>
        <div class="quesTypeList" v-for="(item,index) in questionType" :key="index" @click="createQues(item.value,item.name)">
            {{item.name}}
        </div>
    </div>
</template>
<script lang="ts" setup>
import Vue from 'vue'
import { ref, toRefs, onMounted, Ref, inject, computed, reactive, watch } from "vue";
import { useRouter ,useRoute } from 'vue-router';
import request from 'src/api/index'
// const http=(request as any).teacherAcademicAnalysis;
// const http1=(request as any).teachCourse;
const route=useRoute()
const router = useRouter();
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name:'题库', componenttype: 0 }],
  showContent: false,
  componenttype: undefined,
  showNav:true,
});
const type:any=''
const questionType:any=[
    {value:1,name:'选择题'},
    {value:2,name:'判断题'},
    {value:3,name:'填空题'},
    {value:4,name:'解答题'},
    {value:5,name:'编程题'},
    {value:6,name:'模型题'},
    {value:7,name:'批量导入'},
    ]
function createQues(type:any,name:any){
    router.push ({path:"./QuestionBank/createQues",query:{value:type,name:name}})
}
</script>
<style lang="less" scoped>
.quesTypeList{
    display:block;
    background: white;
    width:90px;
    box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 7%);
    padding: 4px 0px;
    text-align: center;
}
.quesTypeList:hover{
    cursor: pointer;
}
</style>