<template>
  <div v-layout-bg>
    <div class="header">
      <div class="left">
        <a-form :model="ForumSearch" :label-col="{span: 4}" labelAlign="left" :wrapper-col="{span: 18}" :rules="rules" ref="'formRef'">
          <a-form-item label="试卷名称" name="name">
            <a-input v-model:value="ForumSearch.name" />
          </a-form-item>
          <a-form-item label="试卷描述" name="desc">
            <a-textarea v-model:value="ForumSearch.desc" />
          </a-form-item>
        </a-form>
      </div>
      <div class="right"></div>
    </div>
    <div class="questions">
      <div class="title">
        <div class="info">
          <div class="tit">试卷试题</div>
          <div class="fraction">
            （<span class="num1">已选试题：<span class="num">{{'70'}}</span>个</span><span>试题总分：<span class="num">{{'100'}}</span>分</span>）
          </div>
        </div>
        <div>
          <a-button type="primary" @click.prevent="selectquestion">选择试题</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref,inject } from 'vue'
import { useRouter } from 'vue-router';
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
interface IlistItem{

}
interface IforumSearch{
  name:string,
  desc:string,
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var list:IlistItem[]=reactive([])
    var loading:Ref<boolean> =ref(false)
    const http=(request as any).teacherExam
    const ForumSearch:IforumSearch=reactive({
      name:'',
      desc:''
    })
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside',backOff:true})
    const rules={
        name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur'},
        ],
        desc: [{ required: true, message: '请输入试卷描述类型', trigger: 'blur' }],
      }
    function initData(){
      loading.value=true
      http.TestPaper().then((res:IBusinessResp)=>{
        //  console.log(res)
        loading.value=false
        list.push(...res.data)
        
      })
    }
    function selectquestion(){

    }
    
    var updata=inject('updataNav') as Function

    onMounted(()=>{
    //  initData()
    })
    return {list,loading,ForumSearch,rules,selectquestion};
  },
})
</script>
<style  scoped lang="less">
.header{
  display: flex;
  align-items: center;
  .left{
    flex-grow: 1;
  }
  .right{
    width: 254px;
    height: 193px;
    background: url(src/assets/images/teacherExam/creatExam.png) no-repeat;
    background-size:100% 100%;
  }
}
.questions{
  font-size: 16px;
  border: 1px solid #d5d5d5;
  .title{
    height: 58px;
    display: flex;
    padding: 0 40px;
    align-items: center;
    justify-content: space-between;
     border-bottom: 1px solid #d5d5d5;
    .info{
       display: flex;
       justify-content: space-between;
       align-items: center;
       .tit{
         margin-right: 50px;
       }
       .fraction{
         font-size: 14px;
         color: rgb(5, 1, 1,.45);
         .num{
           font-size: 18px;
            color: @theme-color;
            padding: 0 10px;
         }
         .num1{
           margin-right: 40px;
         }
       }
    }
  }
}
</style>