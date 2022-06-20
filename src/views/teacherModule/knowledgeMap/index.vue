<template>
  <div class="knowledgeMap">
    <div class="left">
      <!-- <div class="saveimg" @click="handleImg"></div> -->
      <div id="jsmind_container" @click="handleClick" @contextmenu.prevent="handleContextMenu($event)"></div>  
    </div>
    <div class="right">
      <div class="title">
        <span><i class="iconfont icon-lianjie"></i></span>
        <span>所选知识点相关内容链接</span>
      </div>
      <ul v-if="contentList.length > 0" class="setScrollbar">
          <li v-for="(item,index) in contentList" :key="index" :title="item.name" @click="handleJump(item.id)">{{item.name}}</li>      
      </ul>
      <div v-else class="noData"><span>该知识点无关联实验！</span></div>
    </div>
    <!-- 菜单 -->
    <div id="menu" v-show="showMenu">
      <li @click="addNode">添加</li>
      <template v-if="showEdit">
        <li @click="editNode">编辑</li>
        <li @click="delNode">删除</li>
      </template>
    </div>
  </div>
  
</template>
<script lang="ts">
import { defineComponent,ref, onMounted, reactive, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import 'jsmind/style/jsmind.css'
import jsMind from 'jsmind/js/jsmind.js'
import request from "src/api/index";
import { Ihttp } from "./typings";
import { IBusinessResp } from "src/typings/fetch.d";
import message, {MessageApi} from "ant-design-vue/lib/message"
import {screenshot} from 'src/utils/manipulatePicture'
import { theme } from 'src/utils/theme'
import {lStorage} from 'src/utils/extStorage'
interface IpageInfo{
  count: number,
  index: number,
  size: number,
  knowledge_map_id: number | string
}
interface ImapData{
  data: any[],
  meta: Imeta,
  role: number,
  format: string
}
interface Imeta{
  name?: string,
  author?: string,
  version?: string
}
interface Icontent{
  id: any
  name: string
}

const knowledgeMap = {
  1: 'mapList',
  2: 'examMapList'
}
export default defineComponent({
  props: {
    tabsName :[String, Number]
  },
  setup(props,{emit}) {
    const http = (request as any).TeachingResourceManagement
    const $message:MessageApi = inject('$message')!
    const router = useRouter()
    var jm = ref<any>(null)
    var selectNode = reactive<any>({})
    const showMenu = ref<boolean>(false)
    const showEdit = ref<boolean>(true)
    const isShow = ref<boolean>(false)
    var updata=inject('updataNav') as Function
    updata({tabs:[{ name: props.tabsName, componenttype: 0 }],navPosition:'outside',navType:true,showContent:true,showNav:true, backOff:false,showPageEdit:false})
    const mapData = reactive<ImapData>({
      data: [],
      meta: {},
      role: lStorage.get('role'),
      format: 'node_array'
    })
    const contentList = reactive<Icontent[]>([])
    const pageInfo = reactive<IpageInfo>({
      count: 1,
      index: 1,
      size: 10,
      knowledge_map_id: ''
    })
    const getMapdata = () => {
      http.knowledgesList().then((res:IBusinessResp) => {
        if (res && res.data) {
          // mapData.role = res.data.role
          initData(res.data)
        }
      })
    }
    const initData = (data: any) => {
      document.getElementById('jsmind_container')!.innerHTML = ''
      mapData.meta = data.meta
      mapData.data = data.data
      const options = {
        container: 'jsmind_container', // 必选，容器ID
        editable: true, // 可选，是否启用编辑
        theme: 'success', // 可选，主题
        mode: 'full', // 显示模式
      }
      jm = jsMind.show(options, mapData)
      document.getElementsByClassName('jsmind-inner')[0].classList.add('setScrollbar')
    }
    function canvasCopy($source:any, $target:any) {
        var source = $source;
        var target = $target;
        var context = target.getContext('2d');
        context.drawImage(source, 0, 0, source.width, source.height);
    }
    // 修改节点颜色
    const setbgColor = () => {
      let nodeList = document.querySelectorAll('jmnode')
      for (let i =0;i < nodeList.length; i++) {
        (nodeList[i] as any).style.background = theme.themeColor
      }
    }
    const handleImg = ()=>{
      setbgColor()
      var content:any = document.getElementById('jsmind_container')
      var canvas:any = content.getElementsByTagName('canvas')[0]
      var clone:any = content.cloneNode(true)
      clone.style = `position:fixed;
            left: '6%';
            top: 0;
            z-index:-1000;width:${canvas.getAttribute('width')}px;height:${canvas.getAttribute('height')}px`
      canvasCopy(canvas, clone.getElementsByTagName('canvas')[0]);
      document.body.appendChild(clone)
      setTimeout(() => {
        screenshot(clone).then(canva => {
          var link = document.createElement('a');
          link.href = canva.toDataURL('image/jpeg', 1.0);
          link.target = '_blank';
          link.download = '知识图谱';
          link.click();
        })
      }, 400);
    }
    const handleClick = (event:any)=>{
      setMenuStatus(false)
      if (event.target.nodeName == "DIV" || event.target.nodeName == "JMEXPANDER" || event.button == 2) {
          return;
      }
      selectNode = jm.get_selected_node()
      if (selectNode) {
        pageInfo.index = 1
        pageInfo.knowledge_map_id = selectNode.id
        getSelectedNodeData()
      }
    }
    // 鼠标右击事件
    const handleContextMenu = (event:any) => {
      let clickEle =document.getElementById('jsmind_container')?.getBoundingClientRect()
      if (mapData.role == 3 || mapData.role == 5){
        return;
      }
      selectNode = jm.get_selected_node()
      if (selectNode) {
        setMenuStatus(true, selectNode.data.nodes_number)
        let menu:any = document.getElementById('menu')
        menu.style.left = event.pageX - clickEle!.left + 'px'
        menu.style.top = event.pageY - clickEle!.top + 80 + 'px'
      }
      jm.select_clear()
    }
    const setMenuStatus = (status:boolean, nodeNumber?: string) => {
      showMenu.value = status
      // 根节点，编辑/删除不显示
      if (nodeNumber === '1') {
        showEdit.value = false
      } else {
        showEdit.value = true
      }
    }
    const addNode = (event:any) => {
      setMenuStatus(false)
      if (selectNode.data.nodes_number >= 5) {
        message.warn('已达节点上限，请重新规划图谱')
        setMenuStatus(false)
        jm.select_clear();
        return false
      }
      let nodeid = jsMind.util.uuid.newid()
      let topic = 'new Node'
      let newNode = jm.add_node(selectNode, nodeid, topic)
      if (newNode) {
        jm.select_node(newNode);
        jm.begin_edit(newNode)
      }
      handleBlur('add')
    }
    const editNode = () => {
      setMenuStatus(false)
      if (selectNode.data.is_factory) {
          jm.select_clear();
          return false;
      }
      jm.select_node(selectNode);
      jm.begin_edit(selectNode)
      handleBlur('edit')
    }
    const handleBlur = (type:string) => {
      let params:any={}
      let ele:any =document.getElementsByClassName('jsmind-editor')[0]
      ele.addEventListener('blur', setParams)
      function setParams () {
         if (type === 'add') {
          params.parentID = selectNode.id;
          params.nodesNumber = selectNode.data.nodes_number;
          params.topicName = ele.value;
          ele.removeEventListener('blur', setParams)
          http.addKnowledgeMap({param: params}).then((res:IBusinessResp) => {
            console.log('添加成功')
            message.success('添加成功')
            getMapdata()
            // initData(res.data)
          })
        } else {
          params.parentID = selectNode.parent.id;
          params.nowID = selectNode.id;
          params.topicName = ele.value;
          ele.removeEventListener('blur', setParams)
          http.editKnowledgeMap({urlParams: {nodeID: selectNode.id}, param: params}).then((res:IBusinessResp) => {
            message.success('修改成功')
            getMapdata()
          })
        }
      }
    }
    const delNode = () => {
      setMenuStatus(false)
      if (selectNode.data.is_factory) {
          jm.select_clear();
          return false;
      }
      http.delKnowledgeMap({urlParams: {nodeID: selectNode.id}}).then((res:IBusinessResp) => {
        jm.remove_node(selectNode.id)
        message.success('删除成功')
        getMapdata()
      })
    }
    const getSelectedNodeData = () => {
      isShow.value = true
      contentList.length = 0
      http.getContentlist({urlParams: {nodeID: selectNode.id}}).then((res:IBusinessResp) => {
        if (res&&res.data.length > 0) {
          contentList.push(...res.data)
        } else {
          $message.warning('该知识点无关联实验!')
        }
      })
    }
    const handleJump = (id: any) => {
      router.push({
        // path: "/teacher/teacherExperimentResourcePool/experimentDetail",
        path: "/admin/TeachingResourceManagement/DirectionPlanning/experimentDetail",
        query: {
          sign: 'direction',
          id,
        },
      });
    }
    onMounted(()=>{
      getMapdata()
    })
    return {
      handleClick,
      handleContextMenu,
      handleImg,
      addNode,
      delNode,
      editNode,
      handleBlur,
      handleJump,
      router,
      contentList,
      showMenu,
      showEdit,
      isShow,
      props
    }
  },
})
</script>
<style lang="less" scoped>
.knowledgeMap{
  min-height:750px;
  margin: 0 auto;
  display: flex;
  .left{
    flex: 1;
    position: relative;
    .saveimg{
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      z-index: 999;
      background: url(src/assets/images/green-camera.png) no-repeat left top;
      min-width: 23px;
      min-height: 20px;
    }
    :deep(#jsmind_container){
      width: 100%;
      height: 100%;
      jmnodes.theme-success jmnode{
        background: var(--primary-color) !important;
        &.selected{
          background: #f90 !important;
        }
      }
      input{
        color: #000;
        background:var(--white-100);
      }
    }
  }
  .right{
    width: 320px;
    background: #FAFAFA;
    .title{
      padding: 0 30px;
      line-height: 56px;
      background: var(--primary-2);
      color: #31394D;
      font-size: 16px;
      display: flex;
      align-items:center;
      justify-content: flex-start;
      >span:first-child{
        display: inline-block;
        width: 34px;
        height: 34px;
        background: var(--primary-3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        margin-right: 10px;
      }
    }
    ul{
      padding: 18px 20px;
      max-height: 700px;
      overflow: auto;
      li{
        line-height: 45px;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--primary-color);
        position: relative;
        padding-left: 15px;
        cursor: pointer;
        &::before{
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          background: var(--primary-color);
          border-radius: 50%;
          position: absolute;
          left: 0;
          top:0;
          bottom: 0;
          margin-top:auto;
          margin-bottom: auto;
        }
      }
    }
    .more{
      cursor: pointer;
      text-align: center;
      color: var(--primary-color);
    }
    .noData{
      height: 240px;
      background: url(src/assets/images/admin/teachingResource/noData.png) no-repeat center  76%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      color: var(--primary-color);
      font-size: 16px;
      span{
        margin-left: 25px;
      }
    }
  }
  #menu{
    width: 120px;
    padding: 10px 0;
    border-radius: 5px;
    background:var(--white-100);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    li{
      cursor: pointer;
      line-height: 28px;
      transition: all 0.2s;
      text-align: center;
      &:hover{
        background: var(--primary-1);
      }
    }
  }
}
</style>
