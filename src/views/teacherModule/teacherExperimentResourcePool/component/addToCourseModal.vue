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
      :tree-data="courseList"
      @select="onSelect"
    >
      <template #icon="{ dataRef }">
        <template v-if="dataRef.children && dataRef.children.length">
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-kecheng1"></use>
          </svg>
        </template>
        <template v-if="dataRef.chapter_id">
          <svg class="icon svg-icon" aria-hidden="true">
            <use xlink:href="#icon-zhangjie"></use>
          </svg>
        </template>
      </template>
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
import { DownOutlined, SmileOutlined, FrownOutlined, FrownFilled } from '@ant-design/icons-vue';
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
  if (!selectNode.value.chapter_id) {
    message.warn("请选择课程下的章节！")
    return
  }
  http.addCoursesChapter({
    urlParams: {
      courseId: selectNode.value.course_id,
      chapterId: selectNode.value.chapter_id
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

const onSelect = (selectedKeys: string[], info: any) => {
  // console.log("selected", selectedKeys, info);
  selectNode.value = info.selectedNodes.length ? info.selectedNodes[0] : {}
};
let courseList: any = ref([]);
let defaultExpandedKeys = reactive([1]);
const getCourseChaptersTree = () => {
  http.coursesChaptersTree().then((res: IBusinessResp) => {
    courseList.value.length = 0
    res.data.forEach((item:any) => {
      let obj:any = {
        title: item.name,
        key: item.id,
        children: []
      }
      item.chapters.forEach((itemChapter:any) => {
        obj.children.push({
          title: itemChapter.chapter_name,
          key: itemChapter.chapter_id,
          course_id: itemChapter.course_id,
          chapter_id:itemChapter.chapter_id
        })
      })
      courseList.value.push(obj)
      console.log(courseList.value)
    })

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
<style lang="less">
  .ant-tree-treenode .ant-tree-switcher-noop{
    display: none;
  }
</style>
