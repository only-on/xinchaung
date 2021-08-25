<template>
  <a-tree 
    :tree-data="treeData.data" 
    show-icon 
    default-expand-all 
    v-model:selectedKeys="selectedKeys" 
    @select="selectedChange"
    :replace-fields="replaceFields"
    >
    <template #program>
      <span class="iconfont icon-program"></span>
    </template>
    <template #zhuomianshiyan>
      <span class="iconfont icon-zhuomianshiyan"></span>
    </template>
  </a-tree>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import request from 'src/api/index'

interface ITreeDataItem {
  id: number
  name: string
  sort: number
  type: string
  is_high?: boolean
  slots: any
  contents: ITreeDataItem[]
}

interface ITreeData {
  data: ITreeDataItem[]
}
interface ICourseInfo {
  type: string,
  courseId: number
  courseType: number
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
    const http=(request as any).teachCourse
    let selectedKeys = ref([532558])
    function selectedChange(selectedkeys:any, e:any) {
      console.log(selectedkeys, 'selectedChange');
      console.log(e.selectedNodes);
      if (e.selectedNodes.length && e.selectedNodes[0].props.type) {
        let node = {
          taskId: e.selectedNodes[0].props.key,
          type: e.selectedNodes[0].props.type,
          isHigh: e.selectedNodes[0].props.is_high,
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
      children: "contents",
    }
    // let treeList = reactive<TreeDataItem>([{title: ''}])
    function getTreeList() {
      http.getTreeList({urlParams: {courseId: props.courseInfo.courseId}}).then((res:any) => {
        treeData.data = res.data
        treeData.data.forEach((v) => {
          if (v.contents && v.contents.length) {
            v.contents.forEach(vv => {
              let typeList = vv.type.split('-')
              vv.slots = {}
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
    color: @theme-color;
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
</style>

