<template>
<a-modal 
  okText="保存"
  cancelText="关闭"
  :visible="isShow" 
  title="选择知识点" 
  @ok="handleOk"
  @cancel="handleCancel"
  :width="600"
>
  <div class="prompt">最多选择3个知识点</div>
  <div class="tree">
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
  </div>
</a-modal>
</template>
<script lang="ts">
// import { CarryOutOutlined, DownOutlined  } from '@ant-design/icons-vue';
import { defineComponent, ref, onMounted, reactive, toRefs, computed, PropType, watch } from 'vue';
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'knowledge',
  components: {
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
    const getKnowledgeList = () => {
      http.getKnowledgeList({param: {type: 'tree'}})
        .then((res: IBusinessResp) => {
          let list= res.data.data
          // console.log(list)
          data.treeData = [{
            children: list.children,
            id: list.id,
            text: list.text,
            disabled: true
          }]
        })
        .catch((error:any)=>{
          // console.log(error)
           data.treeData = [{
            children: error.data.children,
            id: error.data.id,
            text: error.data.text,
            disabled: true
          }]
        })
    }
    let checkedNodes: ItreeData[] = props.selectedList
    const onCheck = (key: string[], e: any) => {
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
    const handleOk = () => {
      if (checkedNodes.length > 3) {
        message.warn('此处最多选择3个知识点！')
        return
      }
      emit('update:selectedList', checkedNodes)
      emit('update:isShow', false)
    }
    const handleCancel = () => {
      emit('update:selectedList', props.selectedList)
      emit('update:isShow', false)
    }

    onMounted(() => {
      getKnowledgeList()
    })
    watch(
      () => props.isShow,
      (newVal) => {
        if (newVal) {
          checkedKeys.value =  props.selectedList?.map(v => v.id)
        }
      },
      {deep: true}
    )
    return {
      onCheck,
      checkedKeys,
      replaceFields,
      ...toRefs(data),
      handleOk,
      handleCancel,
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
.tree {
  height: 600px;
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

