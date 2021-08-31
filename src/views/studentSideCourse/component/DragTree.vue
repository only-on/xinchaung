<template>
  <a-tree
    v-if="tree.length !== 0"
    class="draggable-tree course-left-tree"
    draggable
    @drop="onDrop"
    @select="handleSelected"
    @expand="onExpand"
    :expandedKeys="expandedKeys"
    :defaultExpandedKeys="[tree[0].id]"
    @dragstart="dragstart"
    :showIcon="false"
    :defaultSelectedKeys="[tree[0].id]"
  >
    <a-tree-node v-for="item in tree" :key="item.id">
      <template v-slot:title>
        <div
          :class="selectid.id === item.id ? 'tree-first-title selectbac' : 'tree-first-title'"
          @click="selectChapter(item)"
        >
          <div>
            <span class="icon-zhangjie iconfont chapter-cion"></span>
            <span class="chapter-name">{{ item.chapter_name }}</span>
            <span class="action-icon-box">
              <span class="open-close-cion iconshouqi iconfont"></span>
            </span>
          </div>
        </div>
      </template>
      <a-tree-node v-for="ct in item.task_list" :key="ct.id">
        <template v-slot:title>
          <!-- <div class="tree-second-title" @click="selectExperiment(ct)"> -->
          <div
            :class="selectid.id === ct.id ? 'tree-second-title selectbac' : 'tree-second-title'"
            @click="selectExperiment(ct)"
          >
            <div :class="ct.is_high ? 'height-experiment' : ''">
              <span class="experiment-type">
                <span
                  class="iconfont type-icon"
                  :class="ct.is_high ? 'iconjinzhi' : getExperimentClassName(ct.type, 'icon')"
                ></span>
                <span class="type-name">{{ getExperimentClassName(ct.type, 'name') }}</span>
              </span>
              <span :title="ct.name" class="experiment-name">{{ ct.name }}</span>
            </div>
          </div>
        </template>
      </a-tree-node>
    </a-tree-node>
  </a-tree>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,inject ,reactive,computed,watch,toRefs,ComputedRef} from 'vue'
import { useRouter } from 'vue-router';
interface ItreeItem{
  id?:string;
}
interface selected{
  id?:string;
}
export default defineComponent({
  name: 'Resources',
  components: {
   
  },
  props:{
    tree: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var selectid:selected=reactive({})
    var tree:any[]=reactive([])
    var expandedKeys:any[]=reactive([])
    // const tree =computed(()=>{
    //   return props.tree
    // })

    watch(()=>{return props.tree},(val:any)=>{
      tree.push(...val)
      // console.log(val)
      if (val.length) {
        Object.assign(selectid,val)
        expandedKeys.push(val[0].id)
        // $emit('select-chapter', this.treeData[0])
      }
    })
    onMounted(()=>{
     
    })
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning/ContinueLearningSon')
    }
    function onDrop(val:any) {
      console.log(val)
    }
    function handleSelected(val:any) {
      console.log(val)
    }
    function onExpand(val:any) {
      console.log(val)
      expandedKeys = val
    }
    function dragstart(val:any) {
      console.log(val)
    }
    function selectChapter(val:any) {
      console.log(val)
    }
    function selectExperiment(val:any) {
      console.log(val)
    }
    function getExperimentClassName(val:any,icon:any) {
      // console.log(val,icon)
    }
    return { tree,selectid,expandedKeys,onDrop,handleSelected,onExpand,dragstart,selectChapter,selectExperiment,getExperimentClassName};
  },
})
</script>

<style scoped lang="less">
.course-left-tree {
  li {
    padding: 0px !important;
  }
  li span.ant-tree-switcher {
    display: none !important;
  }
  > li > .ant-tree-node-content-wrapper {
  }
  li .ant-tree-node-content-wrapper {
    display: block !important;
    height: auto !important;
    line-height: inherit !important;
  }
  li ul {
    padding: 0px !important;
  }
  .ant-tree-treenode-selected {
    .tree-first-title {
      > div {
        border-bottom: none !important;
      }
    }
  }
  .ant-tree-treenode-switcher-open {
    .open-close-cion {
      display: inline-block;
      transform: rotate(90deg) !important;
    }
  }
  .ant-tree-treenode-switcher-close {
    .open-close-cion {
      display: inline-block;
      transform: rotate(179deg) !important;
    }
  }
  .tree-first-title {
    padding: 0 27px;
    > div {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid #e6e6e6 !important;
      height: 45px;
      align-items: center;
      .chapter-cion {
        // width: 18px;
        // height: 18px;
        // margin-right: 5px;
        // flex-shrink: 0;
        // background: @theme-color;
        // line-height: 17px;
        // text-align: center;
        // font-size: 10px;
        // border-radius: 50%;
        // color: #fff;
        width: 18px;
        height: 18px;
        margin-right: 5px;
        flex-shrink: 0;
        background: #8955b5;
        line-height: 18px;
        text-align: center;
        font-size: 12px;
        border-radius: 50%;
        color: #fff;
      }
      .chapter-name {
        width: 100%;
        color: #050101;
        font-size: 16px;
      }
      .action-icon-box {
        flex-shrink: 0;
        .iconfont {
          margin-left: 5px;
          font-size: 14px;
          color: @theme-color;
          display: none;
          &.open-close-cion {
            width: 14px;
            font-size: 14px;
            color: #000000;
            display: inline-block;
          }
        }
      }
    }
    &:hover {
      .action-icon-box {
        .iconbianji1,
        .iconshanchu {
          display: inline-block;
        }
      }
    }
  }
  .selectbac {
    background-color: #e4dae8;
  }
  .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: transparent !important;
  }
  .tree-second-title {
    padding: 0px 27px 0px 42px;
    > div {
      display: flex;
      flex-direction: row;
      height: 40px;
      align-items: center;
      .experiment-type {
        flex-shrink: 0;
        margin-right: 9px;
        .type-icon {
          color: #bb9cd6;
          font-size: 14px;
          &.iconjinzhi {
            color: #eab362;
          }
        }
      }
      .type-name {
        font-size: 12px;
        color: #bb9cd6;
        margin-left: 5px;
      }
    }
    .experiment-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .action-cion-box {
      flex-shrink: 0;
      .iconfont {
        margin-left: 5px;
        font-size: 12px;
        color: @theme-color;
        display: none;
      }
    }
    &:hover {
      .action-cion-box {
        .iconbianji1,
        .iconshanchu {
          display: inline-block;
        }
      }
    }
  }
  div.height-experiment {
    .experiment-type {
      .type-name {
        color: #eab362;
      }
    }
    .experiment-name {
      color: #eab362;
    }
  }
}
</style>
