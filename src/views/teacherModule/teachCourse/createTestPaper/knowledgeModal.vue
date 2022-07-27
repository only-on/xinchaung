<template>
<a-modal 
  okText="保存"
  cancelText="关闭"
  :visible="isShow" 
  title="选择知识点" 
  @ok="handleOk"
  @cancel="handleCancel"
  :width="540"
>
  <div class="prompt">最多选择3个知识点</div>
  <div class="search_input">
    <a-input-search  enter-button
      v-model:value="keyword"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      width="340px"
    />
  </div>
  <div class="tree textScrollbar">
    <a-tree
      v-if="treeData.length"
      checkable
      :show-line="false"
      :show-icon="false" 
      defaultExpandAll
      @check="onCheck"
      v-model:checkedKeys="checkedKeys"
      :tree-data="treeData"
      :replace-fields="replaceFields"
    >
      <!-- <template #switcherIcon><down-outlined /></template> -->
    </a-tree>
    <empty v-else :type="keyword ? 'searchEmpty' : 'empty'"></empty>
  </div>
</a-modal>
</template>
<script lang="ts">
// import { CarryOutOutlined, DownOutlined  } from '@ant-design/icons-vue';
import { defineComponent, ref, nextTick, onMounted, reactive, toRefs, computed, PropType, watch } from 'vue';
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { message } from 'ant-design-vue'
import Empty from 'src/components/Empty.vue';
export default defineComponent({
  name: 'knowledge',
  components: {
    Empty
    // CarryOutOutlined,
    // DownOutlined ,
  },
  props: {
    isShow: Boolean,
    selectedList: {
      type: Array as PropType<ItreeData[]>,
      default: []
    },
  },
  emits: ['update:isShow', 'update:selectedList'],
  setup(props, {emit}) {
    const replaceFields = {
      title: 'text',
      key: 'id'
    };
    let checkedKeys = ref<string[]>([])
    const http = (request as any).teachCourse
    let data = reactive<Idata>({
      treeData: []
    })
    let checkedNodes: ItreeData[] = props.selectedList
    const getKnowledgeList = () => {
      checkedKeys.value =  []
      http.getKnowledgeList({param: {type: 'tree', keyword: keyword.value}})
        .then((res: IBusinessResp) => {
          if (!res.data?.length) {
            data.treeData = []
          }
          let list= res.data.data
          // console.log(list)
          data.treeData = [{
            children: list.children,
            id: list.id,
            text: list.text,
            disabled: true
          }]
          nextTick(() => {
            if (keyword.value) {
              checkedNodes?.map(v => {
                if (v.text.indexOf(keyword.value)!=-1) {
                  checkedKeys.value.push(v.id)
                }
              })
            } else {
              checkedKeys.value =  checkedNodes?.map(v => v.id)
            }
          })
        })
        .catch((error:any)=>{
          // console.log(error)
           data.treeData = []
        })
    }
    const onCheck1 = (key: string[], e: any) => {
      let arr = e.checkedNodes
      if (arr.length) {
        checkedNodes = []
        arr.forEach((v:any) => {
          if (!(v.props.dataRef.children && v.props.dataRef.children.length)) {
            checkedNodes.push(v.props.dataRef)
          }
        })
      } else {
        checkedNodes = []
      }
      checkedKeys.value = checkedNodes.map(v => v.id)
    }
    const onCheck = (key: string[], e: any) => {
      checkedNodes = [...checkedNodes]
      let arr = e.checkedNodes
      let node = e.node
      function handle(node: any) {
        if (node.children&&node.children.length) {
          node.children.forEach((v: any) => {
            handle(v)
          })
        } else {
          checkedNodes.filter((v: any, k: number) => {
            if (v.id === node.id) {
              checkedNodes.splice(k, 1)
            }
          })
        }
      }
      if (!e.checked) {
        handle(node.dataRef)
      } else {
        // checkedNodes = []
        arr.forEach((v:any) => {
          if (!(v.props.dataRef.children && v.props.dataRef.children.length)) {
            if (!checkedNodes.filter((vv: any) => vv.id===v.props.dataRef?.id)[0]) {
              checkedNodes.push(v.props.dataRef)
            }
          }
        })
      } 
      // checkedKeys.value = checkedNodes.map(v => v.id)
    }
    const handleOk = () => {
      if (checkedNodes.length > 3) {
        message.warn('此处最多选择3个知识点！')
        return
      }
      emit('update:selectedList', checkedNodes)
      emit('update:isShow', false)
      keyword.value = ''
    }
    const handleCancel = () => {
      emit('update:selectedList', props.selectedList)
      emit('update:isShow', false)
      keyword.value = ''
    }

    // 关键字搜索
    const keyword = ref('')
    const onSearch = () => {
      console.log(keyword.value)
      getKnowledgeList()
    }
    onMounted(() => {
      getKnowledgeList()
    })
    watch(
      () => props.isShow,
      (newVal) => {
        if (newVal) {
          checkedKeys.value =  props.selectedList?.map(v => v.id)
          checkedNodes = props.selectedList
          getKnowledgeList()
        }
      },
      {deep: true}
    )
    return {
      onCheck1,
      onCheck,
      checkedKeys,
      replaceFields,
      ...toRefs(data),
      handleOk,
      handleCancel,
      keyword,
      onSearch,
    };
  },
});
interface Idata {
  treeData: ItreeData[]
}
interface ItreeData {
  id: string
  text: string
  children?: ItreeData[]
  disabled?: boolean
}
</script>

<style lang="less" scoped>
.search_input {
  margin-bottom: 16px;
  .ant-input-search {
    width: 340px;
  }
}
.tree {
  height: 352px;
  overflow: auto;
}
.prompt {
  position: absolute;
  top: 18px;
  left: 116px;
  // color: blue;
  font-size: 14px;
  color: var(--primary-color);
}
// :deep(.ant-tree li span.ant-tree-switcher.ant-tree-switcher_open .ant-tree-switcher-icon) {
//   display: none;
// }
// :deep(.ant-tree li span.ant-tree-switcher.ant-tree-switcher_close .ant-tree-switcher-icon) {
//   display: none;
// }
// :deep(.ant-tree-switcher.ant-tree-switcher_open) {
//   background: url('src/assets/tianjia.png') center no-repeat;
//   background-size: 14px 14px;
// }
// :deep(.ant-tree-switcher.ant-tree-switcher_close) {
//   background-size: 14px 14px;
//   background: url('src/assets/images/bg1.jpg') center no-repeat;
// }
:deep(.ant-modal-body) {
  height: 710px;
  overflow: auto;
}
</style>

