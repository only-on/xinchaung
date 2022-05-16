<template>
  <a-modal
    :visible="props.isShow"
    title="添加到"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-tree
      :show-line="true"
      :show-icon="true"
      :default-expanded-keys="defaultExpandedKeys"
      @select="onSelect"
    >
      <!-- <template #icon><carry-out-outlined /></template> -->
      <a-tree-node v-for="list in courseList" :key="list.id" :title="list.name" :courseId="list.id">
        <template #icon>
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-kecheng1"></use>
          </svg>
        </template>
        <a-tree-node
          v-for="item in list.chapters"
          :title="item.chapter_name"
          :key="item.chapter_id"
          :courseId="item.course_id"
          :chapterId="item.chapter_id"
        >
          <template #icon>
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-zhangjie"></use>
            </svg>
          </template>
          <template #switcherIcon></template>
        </a-tree-node>
      </a-tree-node>
    </a-tree>
  </a-modal>
</template>

<script lang="ts" setup="props">
import {
  reactive,
  ref,
  toRefs,
  onMounted,
  provide,
  inject,
  watch,
  nextTick,
} from "vue";
import { SelectEvent } from "ant-design-vue/es/tree/Tree";
import { CarryOutOutlined, FormOutlined } from "@ant-design/icons-vue";
import { IBusinessResp } from "src/typings/fetch.d";
import request from "src/api/index";
import { Modal, message } from "ant-design-vue"; //
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const { id } = route.query;
const http = (request as any).teachCourse;
const props = withDefaults(defineProps<{ isShow: boolean }>(), {
  isShow: false,
});
const emit = defineEmits<{
  (e: "update:isShow", isShow: boolean): void;
}>();
const selectNode: any = ref({})

const handleOk = () => {
  if (!selectNode.value.chapterId) {
    message.warn("请选择课程下的章节！")
    return
  }
  http.addCoursesChapter({
    urlParams: {
      courseId: selectNode.value.courseId,
      chapterId: selectNode.value.chapterId
    },
    param: {
      "content_ids":[id],
      "type":1 // 1-为实验, 2-实训, 3-视频, 4-文档]

    }
  }).then((res: IBusinessResp) => {
    message.success("添加成功！")
    emit("update:isShow", false);
  })
};
const handleCancel = () => {
  emit("update:isShow", false);
};

const onSelect = (selectedKeys: string[], info: SelectEvent) => {
  // console.log("selected", selectedKeys, info);
  selectNode.value = info.selectedNodes.length ? info.selectedNodes[0].props : {}
};
let courseList: any = ref([]);
let defaultExpandedKeys = reactive([1]);
const getCourseChaptersTree = () => {
  http.coursesChaptersTree().then((res: IBusinessResp) => {
    courseList.value = res.data
  })
}
onMounted(() => {
  getCourseChaptersTree()
})
</script>

<style lang="less" scoped>
.ant-tree {
  max-height: 500px;
  overflow: auto;
  .ant-tree-iconEle .icon {
    width: 16px;
    height: 16px;
    margin-bottom: -2px;
  }
}
</style>
