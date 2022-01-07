<template>
  <div class="treeDrag setScrollbar" :class="isDraging ? 'draging' : ''">
    <div>
      <div class="firstLevel" v-for="(item, index) in treeData" :key="item.id">
        <div class="leverFirst" :class="openList.includes(item.id) || isOpentTree === index ? 'active' : ''">
          <div @click="open(item, index)">
            <div>
              <slot name="first" :data="item"></slot>
            </div>
            <div class="open-icon-box">
              <span :class="['iconfont', openList.includes(item.id) ? 'icon-shouqi' : 'icon-zhankai']"></span>
            </div>
          </div>
        </div>
        <div
          class="tree-children "
          :style="openList.includes(item.id) ? childrenHeight(item.children.length) : 'height: 0'"
        >
          <div class="item forbid add-chapter-action">
            <slot name="add" :data="item"></slot>
          </div>
          <transition-group>
            <div class="SecondLevel" v-for="(it, ind) in item.children" :key="it.id">
              <div
                class="leverSecond"
                @click="active(it)"
                :class="[currentNode === it.id ? 'active' : '', !isDraging ? 'drag' : '']"
              >
                <slot name="two" :data="{ data: it, parent: item, idx: ind }"></slot>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, onMounted, PropType } from 'vue'
import _ from 'lodash'
export default defineComponent({
  name: 'Tree',
  props: {
    isDisabled: {
      type: Boolean,
      default: true
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array as PropType<ITreeList[]>,
      default: []
    },
    currentTab: Number
  },
  emit: ['open'],
  setup(prop, {emit}) {
    let currentNode: any = ref()  // 当前选中节点
    let isDraging = ref<boolean>(false)
    let openList = reactive<number[]>([])
    let isOpentTree = ref(0)  // 判断当前tree展开状态

    // 初始化
    function init() {
      currentNode.value = prop.treeData[0]?.children[0]?.id
      openList.length = 0
      openList.push(prop.treeData[0]?.id)
    }
    function open(e: ITreeList, index: number) {
      if (prop.isMultiple) {
        if (openList.includes(e.id)) {
          console.log(111)
          isOpentTree.value = index
          openList = _.filter(openList, o => {
            return o != e.id
          })
        } else {
          isOpentTree.value = -1
          openList.push(e.id)
          emit('open', e.id, index)
        }
      } else {
        if (openList.includes(e.id)) {
          isOpentTree.value = index
          openList.length = 0
        } else {
          isOpentTree.value = -1
          openList.length = 0
          openList.push(e.id)
          emit('open', e, index)
        }
      }

      console.log(openList)
    }
    watch(() => {return prop.treeData}, (val: ITreeList[]) => {
      openList.length = 0
      if (val.length) {
        currentNode.value = val[0].children[0]?.id
        openList.push(val[0].id)
      }
    }, { deep: true, immediate: true })

    function active(e: ITreeList) {
      currentNode.value = e.id
    }
    // 恢复选中章节
    function resetSelectChapter(id: any) {
      currentNode.value = id
    }
    // 恢复树1极
    function resetSelect(id: any) {
      openList.length = 0
      openList.push(id)
    }
    function childrenHeight(num: number) {
      if (prop.currentTab === 0) {
        return { height: 66 + 42 * num + 'px' }
      } else {
        return { height: 42 * num + 'px' }
      }
    }
    return {
      currentNode,
      isDraging,
      openList,
      isOpentTree,
      open,
      childrenHeight,
      active,
      resetSelect,
      resetSelectChapter,
      init,
    }
  }
})
interface ITreeList {
  contents_share_count: number
  contents_count: number
  id: number
  name: string 
  children: ITreeList[]
}
</script>

<style lang="less" scoped>
.treeDrag {
    width: 100%;

    .firstLevel {
        .leverFirst {
            >div:nth-child(1) {
                display: flex;
                justify-content: space-between;
                flex-direction: row;

            }

            &.active {
                background: rgba(var(--purpleblue-6), 0.5);

            }

            .open-icon-box {
                flex-shrink: 0;
                cursor: pointer;
            }
        }

        .tree-children {
            // .add-chapter-action {
            //     // height: 66px;
            // }

            height: 0;
            overflow: hidden;
            // overflow: auto;
            transition: 0.5s;

            // &.open {
            //     // height: auto;
            // }

            .SecondLevel {
                height: 42px;
                position: relative;
                margin: 2px 0;



                :deep(.leverSecond) {


                    &:hover {
                        background: @theme-light-color;
                        color: #ffffff !important;

                        span {
                            color: #ffffff !important;
                        }
                    }

                    &.active {
                        background: rgba(var(--purpleblue-6), 0.8);
                        color: #ffffff !important;

                        &::before {
                            position: absolute;
                            content: "";
                            height: 41px;
                            width: 4px;
                            background: var(--purpleblue-6);
                        }

                        div {
                            color: #ffffff !important;
                        }

                        span {
                            color: #ffffff !important;
                        }
                    }
                }
            }
        }

        .children-item {
            height: 0;
            overflow: hidden;

            &.open {
                height: 100%;
            }
        }

    }
}

</style>
