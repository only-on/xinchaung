<template>
  <div class="content">
    <NavTab :tabs="tabs" @tabSwitch="tabSwitch" />
    <div>
      <a-form :model="ForumSearch" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-item label="帖子名称">
            <a-input v-model:value="ForumSearch.title" />
          </a-form-item>
          <a-form-item label="发帖类型">
            <a-select v-model:value="ForumSearch.type" placeholder="please select your zone">
              <a-select-option value="shanghai">Zone one</a-select-option>
              <a-select-option value="beijing">Zone two</a-select-option>
            </a-select>
          </a-form-item>
      </a-form>
      <a-button type="primary">发布问题</a-button>
    </div>
    <div class="content_box">
      <a-table :columns="columns" :data-source="list" rowKey="id" class="components-table-demo-nested">
        <template #action>
          <a>回帖</a>
          <a>删除</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,UnwrapRef  } from 'vue'
import request from '../../api/index'
interface Iitems{

}
interface IforumSearch{
  title:string,
  type:number
}
const columns=[
  {
    title: '帖子名称',
    key: 'title',
    align:'center'
  },
  {
    title: '类型',
    key: 'type',
    align:'center'
  },
  {
    title: '发帖人/发帖时间',
    key: 'creat',
    align:'center'
  },
  {
    title: '回复数/查看数',
    key: 'replyViews',
    align:'center'
  },
  {
    title: '最近回帖人/最近回帖时间',
    key: 'reply',
    align:'center'
  },
  {
    title: '操作',
    key: 'operation',
    align:'center'
  }
]
export default defineComponent({
  name: 'forumindex',
  components: {
   
  },
  setup: (props,{emit}) => {
    const tabs=[{name:'随堂论坛',componenttype:0},{name:'我的提问',componenttype:1},{name:'我参与的帖子',componenttype:2}]
    const http=(request as any).forum
    const apiName=['pubIndex','myself','attend']
    var type=ref(0)
    const list:Array<any>=reactive([{title:'铁汁',type:'分享',creat:'创建',replyViews:'回复数',reply:'回帖人', id: 2,operation:''}])
    function tabSwitch(val:any){
      if(val.componenttype!==type.value){
        type.value=val.componenttype
        // initData()
      }
    }
    var ForumSearch:UnwrapRef<IforumSearch>=reactive({
      title:'',
      type:0
    })
    function initData(){
      http[apiName[type.value]]().then((res:any)=>{

      })
    }
    onMounted(()=>{
    //  initData()
    })
    // pubIndex  myself   attend
    return {tabs ,tabSwitch,list,columns,ForumSearch};
  },
})
</script>

<style scoped lang="less">
.content{
    width: 1330px;
    margin: 20px auto 0;
    background: #fff;
    height: 100%;
    .content_box{
      width: 100%;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0px 0 5px 5px rgb(0 0 0 / 10%);
      border-radius: 3px;
      padding: 10px;
      margin-top: 20px;
      height: calc(100% - 102px);
      overflow: auto;
    }
  }
</style>
