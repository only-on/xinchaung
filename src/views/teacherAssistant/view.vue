<template>
  <div class="view" v-layout-bg>
    <ul>
      <li>
        <span>帐号：</span>
        <span>{{lookDetail.username}}</span>
      </li>
      <li>
        <span>姓名：</span>
        <span>{{lookDetail.name}}</span>
      </li>
      <li>
        <span>性别：</span>
        <span>{{lookDetail.sex}}</span>
      </li>
      <li>
        <span>所属教师：</span>
        <span>{{lookDetail.teacher}}</span>
      </li>
      <li>
        <span>状态：</span>
        <span>{{lookDetail.status}}</span>
      </li>
      <li>
        <span>创建时间：</span>
        <span>{{lookDetail.createTime}}</span>
      </li>
      <li>
        <span>更新时间：</span>
        <span>{{lookDetail.updateTime}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITableList, IHttp } from './typings'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'assistant-view',
  components: {},
  props: {
    id: Number,
    lookDetail: {
      type: Object as PropType<ITableList>,
      default: {}
    }
  },
  emits: [],
  setup(props, {emit}) {
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,backOff:true})

    const http = (request as IHttp).teacherAssistant
    const route = useRoute()
    const { id } = route.query
    console.log(id)
    let lookDetail = reactive<ITableList>({
      id: 0,
      username: '',
      name:'',
      sex: '',
      phone: '',
      email: '',
      status: 0,
      teacher: '',
      createTime: '',
      updateTime: ''
    })
    function getAssistantDetail() {
      // http.getAssistantDetail().then((res: IBusinessResp) => {
      //   console.log(res)
      // })
    }
    onMounted(() => {
      getAssistantDetail()
    })
    return {
      lookDetail,
    }
  },
})
</script>

<style lang="less" scoped>
  .view {
    li {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px dashed #e7e7e7;
      display: flex;
      span:nth-child(1) {
        text-align: right;
        width: 150px;
        display: inline-block;
        font-size: 14px;
        box-sizing: border-box;
      }
      span:nth-child(2) {
        flex: 1;
        font-size: 14px;
        padding-left: 30px;
      }
    }
  }
</style>
