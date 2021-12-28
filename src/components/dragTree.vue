<template>
  <a-tree
    v-if="treeData.length !== 0"
    class="draggable-tree course-left-tree"
    :draggable="draggable"
    @drop="onDrop"
    @select="handleSelected"
    @expand="onExpand"
    :expandedKeys="expandedKeys"
    :defaultExpandedKeys="[treeData[0].id]"
    @dragstart="dragstart"
    :showIcon="false"
    :defaultSelectedKeys="[treeData[0].id]"
  >
    <a-tree-node v-for="item in treeData" :key="item.id">
      <template v-slot:title>
        <div
          :class="
            selectid === item.id ? 'tree-first-title selectbac' : 'tree-first-title'
          "
          @click="selectChapter(item)"
        >
          <div>
            <span class="icon-zhangjie iconfont chapter-cion"></span>
            <span class="chapter-name">{{ item.name }}</span>
            <span class="action-icon-box">
              <span
                v-if="isOperation"
                @click.stop="editNode(item)"
                class="icon-bianji1 iconfont"
              ></span>
              <span
                v-if="isOperation"
                @click.stop="deleteNode(item)"
                class="icon-shanchu iconfont"
              ></span>
              <span class="open-close-cion icon-shouqi iconfont"></span>
            </span>
          </div>
        </div>
      </template>
      <a-tree-node v-for="ct in item.contents" :key="ct.id">
        <template v-slot:title>
          <!-- <div class="tree-second-title" @click="selectExperiment(ct)"> -->
          <div
            :class="
              selectid === ct.id ? 'tree-second-title selectbac' : 'tree-second-title'
            "
            @click="selectExperiment(ct)"
          >
            <div :class="ct.is_high ? 'height-experiment' : ''">
              <span class="experiment-type">
                <span
                  class="iconfont type-icon"
                  :class="
                    ct.is_high ? 'icon-jinzhi' : getExperimentClassName(ct.type, 'icon')
                  "
                ></span>
                <span class="type-name">{{
                  getExperimentClassName(ct.type, "name")
                }}</span>
              </span>
              <span :title="ct.name" class="experiment-name">{{ ct.name }}</span>
              <div class="action-cion-box" v-if="isOperation">
                <span @click.stop="editNode(ct)" class="icon-bianji1 iconfont"></span>
                <span @click.stop="deleteNode(ct)" class="icon-shanchu iconfont"></span>
              </div>
            </div>
          </div>
        </template>
      </a-tree-node>
    </a-tree-node>
  </a-tree>
  <a-modal v-model:visible="visible" :title="'编辑' + title" @ok="handleOk">
    <span>{{ title }}名称：</span>
    <a-input v-model:value="name" :placeholder="'请输入' + title + '名称'" />
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
  createVNode,
  computed,
  watch,
  inject,
} from "vue";
import { TreeDragEvent, DropEvent, SelectEvent } from "ant-design-vue/es/tree/Tree";
import { Modal } from "ant-design-vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import extStorage from "src/utils/extStorage";
interface ITreeDataItem {
  id: number;
  name: string;
  sort: number;
  type: string;
  is_high?: boolean;
  contents: ITreeDataItem[];
}
export default defineComponent({
  props: {
    treeData: {
      type: Array as PropType<ITreeDataItem[]>,
      default: [],
    },
    isDefaultSelectChapter: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["updateData", "selectChapter", "selectExperiment", "editNode", "deleteNode"],
  setup(props, { emit }) {
    const { lStorage } = extStorage;
    const role = lStorage.get("role");
    const tab: any = inject("tab");
    const isOperation = computed(() => {
      return role === 1 || role === 3;
    });
    const draggable = ref<boolean>(false);
    let selectid = ref<number>(); // 当前选中的节点
    let datas = reactive<ITreeDataItem[]>([]); // 暂存的自己及父级的id 层级数组 例如：[爷爷级Id, 父级Id, 自己Id]
    // 选择章节树
    function selectChapter(val: ITreeDataItem) {
      console.log(val, "aaaaaa");
      if (props.isDefaultSelectChapter) {
        selectid.value = val.id;
        emit("selectChapter", val, true); // val选中的数据，true 是否初始化右侧
      }
    }
    // 选择实验树
    function selectExperiment(val: ITreeDataItem) {
      // console.log(val)
      selectid.value = val.id;
      emit("selectExperiment", val);
    }
    // 删除节点
    let title = ref("");
    function deleteNode(val: ITreeDataItem) {
      title.value = !val.type ? "章节" : "实验";
      Modal.confirm({
        title: `确定删除${title.value}吗?`,
        icon: createVNode(QuestionCircleOutlined),
        // content: 'Some descriptions',
        okText: "确定",
        okType: "primary",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          emit("deleteNode", val);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
    // 编辑节点
    const visible = ref<boolean>(false);
    let name = ref("");
    let nodeId: number = 0;
    function editNode(val: ITreeDataItem) {
      title.value = !val.type ? "章节" : "实验";
      visible.value = true;
      name.value = val.name;
      nodeId = val.id;
    }
    const handleOk = (e: MouseEvent) => {
      console.log(name.value);
      emit("editNode", name.value, nodeId);
      visible.value = false;
    };

    function getExperimentClassName(type: string | number, typeName: string) {
      if (type === "1-1" || type === "1-" || type === 1) {
        return typeName === "icon" ? "icon-zhuomianshiyan" : "实验";
      }
      if (type === "1-4") {
        return typeName === "icon" ? "icon-program" : "实验";
      }
      if (type === 2) {
        return typeName === "icon" ? "icon-shubiao" : "实训";
      }
      if (type === 3) {
        return typeName === "icon" ? "icon-shipin" : "视频";
      }
      if (type === 4) {
        return typeName === "icon" ? "icon-wendang" : "文档";
      }
    }
    // 开启拖拽
    function dragstart(info: TreeDragEvent) {
      console.log("开始拖拽", props.treeData);
      console.log(info);
    }
    // 递归 获得自己的层级id数组
    function getItemAndParentsIdArr(arr: ITreeDataItem[], id: number) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          datas.push(arr[i]);
          return true;
        } else {
          if (arr[i].contents && getItemAndParentsIdArr(arr[i].contents, id)) {
            datas.push(arr[i]);
            return true;
          }
        }
      }
    }
    // 获得自己的父级id
    function getFirstParentId(strings: string, id: number) {
      console.log("strings", strings, "key", id);
      const stringsArr = strings.split("/");
      const index = stringsArr.indexOf(id.toString());
      let parenId;
      console.log(index);
      console.log(stringsArr[-1]);
      if (index !== 0) {
        parenId = stringsArr[index - 1];
      } else {
        // parenId = stringsArr[index];
        parenId = "";
      }
      return parenId;
    }
    // 点击文字触发
    let expandedKeys = ref<number[]>([]);
    function handleSelected(keys: number[], info: SelectEvent) {
      // console.log('点击树节点触发', info.node.eventKey)
      // console.log('点击文字:', info.node.eventKey)

      const itemKey = info.node.eventKey;
      if (expandedKeys.value.length > 0) {
        if (expandedKeys.value.includes(itemKey)) {
          let arr = [...expandedKeys.value];
          arr.splice(arr.indexOf(itemKey), 1);
          expandedKeys.value = arr;
        } else {
          expandedKeys.value = [...expandedKeys.value, itemKey];
        }
      } else {
        expandedKeys.value = [itemKey];
      }
    }
    // 点击图标触发
    function onExpand(info: number) {
      console.log("点击图标:", info);
      expandedKeys.value = [info];
    }
    // 拖动完成触发
    function onDrop(info: DropEvent) {
      console.log("拖动完成:", info);
      const dropKey = info.node.eventKey; // 目标节点的id
      const dragKey = info.dragNode.eventKey; // 拖拽节点的id
      const dropPos = info.node.pos.split("-");
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data: ITreeDataItem[], id: number, callback: Function) => {
        data.forEach((item: ITreeDataItem, index: number, arr: any) => {
          if (item.id === id) {
            return callback(item, index, arr);
          }
          if (item.contents) {
            return loop(item.contents, id, callback);
          }
        });
      };
      const data = [...props.treeData];

      // Find dragObject
      let dragObj: ITreeDataItem = {
        id: 0,
        name: "",
        sort: 0,
        type: "",
        contents: [],
      };

      // 如果拖动到内部
      if (!info.dropToGap) {
        return;
      } else if (
        (info.node.contents || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        return;
      } else {
        // 获得拖拽节点的层级id数组 this.datas
        getItemAndParentsIdArr(data, dragKey);
        const dragKeyString = datas
          .reverse()
          .map((v, i) => {
            console.log(i);
            return v.id;
          })
          .join("/");

        // 拖拽节点父级id
        const dragKeyParentId = getFirstParentId(dragKeyString, dragKey);
        /**
         * --------------------------------分割线---------------------------------------
         */
        // 获得目标节点的层级id数组 this.datas
        getItemAndParentsIdArr(data, dropKey);
        const dropKeyString = datas
          .reverse()
          .map((v, i) => {
            console.log(datas, i);
            return v.id;
          })
          .join("/");

        // 目标节点父级id
        const dropKeyParentId = getFirstParentId(dropKeyString, dropKey);
        console.log("拖拽父级id", dragKeyParentId);
        console.log("目标父级id", dropKeyParentId);
        /**
         * --------------------------------分割线---------------------------------------
         */
        // 只允许在同父级id下进行拖动
        if (dragKeyParentId === dropKeyParentId) {
          loop(
            data,
            dragKey,
            (item: ITreeDataItem, index: number, arr: ITreeDataItem[]) => {
              arr.splice(index, 1);
              dragObj = item;
            }
          );
          let ar: ITreeDataItem[] = [];
          let i: number = 0;
          loop(
            data,
            dropKey,
            (item: ITreeDataItem, index: number, arr: ITreeDataItem[]) => {
              console.log(item, index, arr);
              ar = arr;
              i = index;
            }
          );
          if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
          } else {
            ar.splice(i + 1, 0, dragObj);
          }
          console.log(props.treeData);
          emit("updateData", data, dragKeyParentId);
          // this.treeData = data
        }
      }
    }
    onMounted(() => {
      draggable.value = role === 2 || tab?.value === 1 ? false : true;
    });
    watch(
      () => {
        return props.treeData;
      },
      (val) => {
        if (val.length) {
          if (props.isDefaultSelectChapter) {
            selectid.value = props.treeData[0].id;
            expandedKeys.value = [props.treeData[0].id];
            emit("selectChapter", props.treeData[0]);
          } else {
            selectid.value =
              props.treeData[0].contents && props.treeData[0].contents.length
                ? props.treeData[0].contents[0].id
                : 0;
            expandedKeys.value = [props.treeData[0].id];
            emit("selectExperiment", props.treeData[0].contents[0]);
          }
        }
      },
      { deep: true }
    );
    return {
      isOperation,
      ...toRefs(props),
      expandedKeys,
      selectid,
      onDrop,
      draggable,
      handleSelected,
      onExpand,
      dragstart,
      selectChapter,
      editNode,
      deleteNode,
      selectExperiment,
      getExperimentClassName,
      visible,
      handleOk,
      title,
      name,
    };
  },
});
</script>

<style lang="less">
// @theme-color: #8955B5;
@node-icon-color: #bb9cd6;
@high-color: #eab362; // 高配颜色
@hover-bgcolor: #f1e6f5;
.course-left-tree {
  li {
    padding: 0px !important;
  }
  li span.ant-tree-switcher {
    display: none !important;
  }
  > li > .ant-tree-node-content-wrapper {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    &:hover {
      background-color: @hover-bgcolor;
    }
  }
  li .ant-tree-node-content-wrapper {
    display: block !important;
    height: auto !important;
    line-height: inherit !important;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    &:hover {
      background-color: @hover-bgcolor;
    }
  }
  li ul {
    padding: 0px !important;
  }
  // .ant-tree-treenode-selected {
  //   .tree-first-title {
  //     > div {
  //       border-bottom: none !important;
  //     }
  //   }
  // }
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
      box-sizing: content-box;
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
        background: @theme-color;
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
        .icon-bianji1,
        .icon-shanchu {
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
          color: @node-icon-color;
          font-size: 14px;
          &.icon-jinzhi {
            color: @high-color;
          }
        }
      }
      .type-name {
        font-size: 12px;
        color: @node-icon-color;
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
        .icon-bianji1,
        .icon-shanchu {
          display: inline-block;
        }
      }
    }
  }
  div.height-experiment {
    .experiment-type {
      .type-name {
        color: @high-color;
      }
    }
    .experiment-name {
      color: @high-color;
    }
  }
  &.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #fff;
  }
}
</style>
