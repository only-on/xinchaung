<template>
  <a-directory-tree 
    :tree-data="treeData.data" 
    show-icon 
    default-expand-all 
    v-model:selectedKeys="selectedKeys" 
    @select="selectedChange"
    :replace-fields="replaceFields"
    >
    <template #zhangjie></template>
    <template #program>
      <span class="iconfont icon-program"></span>
    </template>
    <template #zhuomianshiyan>
      <span class="iconfont icon-zhuomianshiyan"></span>
    </template>
  </a-directory-tree>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import request from 'src/api/index'
import { Ihttp, ICourseInfo } from './typings'
import { IBusinessResp } from 'src/typings/fetch'

interface Isolts {
  icon: string
}
interface ITreeDataItem {
  id: number
  name: string
  sort: number
  type: string
  is_high?: boolean
  slots: Isolts
  contents: ITreeDataItem[]
}
interface ITreeData {
  data: ITreeDataItem[]
}
export default defineComponent({
  emit: ['selectNode'],
  props: {
    courseInfo: {
      type: Object as PropType<ICourseInfo>,
      default: {}
    }
  },
  setup(props, {emit}) {
    const http = (request as Ihttp).teachCourse
    let selectedKeys = ref([532558])
    function selectedChange(selectedkeys:string[] | number[], e:any) {
      if (e.selectedNodes.length && e.selectedNodes[0].dataRef.type) {
        let node = {
          taskId: e.selectedNodes[0].dataRef.id,
          type: e.selectedNodes[0].dataRef.type,
          isHigh: e.selectedNodes[0].dataRef.is_high,
          grouped: 0
        }
        emit('selectNode', node)
      } else {
        emit('selectNode', '')
      }
    }
    let treeData = reactive<ITreeData>({
      data: []
    })
    let replaceFields = {
      title: "name",
      key: "id",
      ishigh: 'is_high',
      type: "type",
      children: "contents",
    }
    // let treeList = reactive<TreeDataItem>([{title: ''}])
    function getTreeList() {
      http.getTreeList({urlParams: {courseId: props.courseInfo.courseId}}).then((res: IBusinessResp) => {
        treeData.data = res.data
        treeData.data.forEach((v) => {
          if (v.contents && v.contents.length) {
            v.slots = {icon: ''}
            v.slots.icon = 'zhangjie'
            v.contents.forEach(vv => {
              let typeList = vv.type.split('-')
              vv.slots = {icon: ''}
              switch (typeList[typeList.length - 1]) {
                case '1': 
                  // vv.class='ishigh'   // 设置单个节点的class
                  vv.slots.icon = 'zhuomianshiyan'
                  break;
                case '2': 
                  vv.slots.icon = 'sheji'
                  break;
                case '3': 
                  vv.slots.icon = 'zhuomianshiyan'
                  break;
                case '4': 
                  vv.slots.icon = 'program'
                  break;
              }
              vv.slots.icon = typeList[typeList.length - 1] === '4' ? 'program' : 'zhuomianshiyan'
            })
          }
        })
        let first = treeData.data[0].contents
        let node = {
          taskId: first[0].id,
          type: first[0].type,
          isHigh: first[0].is_high,
          grouped: 0
        }
        emit('selectNode', node)
        // return treeList
      })
    }
      
    onMounted(() => {
      getTreeList()
      // let nodes = treeData[0].children[0]
      // let node = {
      //   taskId: treeData[0].children[0].key
      // }
      // emit('selectNode', node)
    })
    return {
      selectedKeys,
      treeData,
      selectedChange,
      replaceFields,
    };
  },
});
</script>

<style lang="less" scope>
.ant-tree li .ant-tree-child-tree {
  .ant-tree-node-content-wrapper.ant-tree-node-selected {
    color: @theme-color!important;
    background-color: #eaeaea;
  } 
  .ant-tree-node-content-wrapper:hover {
    color: @icon-color-hover;
    background-color: #eaeaea;
  }
  .ant-tree-node-content-wrapper:hover .ant-tree-title {
    color:  @theme-color;
    background-color: #eaeaea;
  }
  .ant-tree-iconEle .anticon svg {
    color: @theme-color;
  }
  .ant-tree-iconEle {
    color: @theme-color;
  }
  .ant-tree-switcher  {
    display: none;
  }
}
.ant-tree li .ishigh .ant-tree-node-content-wrapper,
.ant-tree li .ishigh .ant-tree-child-tree .ant-tree-iconEle {
  color: orange;
}

.ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper::before, 
.ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper::before {
  background: #eaeaea!important;
  color: @theme-color!important;
}
.ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-switcher, 
.ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-switcher {
  background: #eaeaea!important;
  color: @theme-color!important;
}
.ant-tree.ant-tree-directory > li span.ant-tree-node-content-wrapper.ant-tree-node-selected, 
.ant-tree.ant-tree-directory .ant-tree-child-tree > li span.ant-tree-node-content-wrapper.ant-tree-node-selected {
  color: @theme-color!important;
}
</style>

