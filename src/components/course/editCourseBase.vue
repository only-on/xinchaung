<template>
  <a-form
    class="edit-course-base-form"
    ref="formDom"
    :model="formData"
    :rules="rules"
    layout="vertical"
  >
    <div class="col-2">
      <a-form-item label="课程名称" name="name">
        <a-input v-model:value="formData.name" />
      </a-form-item>
    </div>
    <div class="col-2">
      <a-form-item label="课程方向" name="category">
        <a-select v-model:value="formData.course_category_id">
          <a-select-option
            v-for="item in categoryList"
            :key="item.id"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
    </div>
    <div v-if="currentRole === 4" class="col-2 time-item">
      <a-form-item label="开始时间">
        <a-date-picker v-model:value="formData.created_at"/>
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker v-model:value="formData.end_time"/>
      </a-form-item>
    </div>
    <div class="col-2">
      <a-form-item label="职业方向" name="direction">
        <a-select v-model:value="formData.course_direction_id">
          <a-select-option
            v-for="item in directionsList"
            :key="item.id"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
    </div>
    <div :class="type ? 'col-2' : 'col-1'">
      <a-form-item label="课程介绍">
        <a-textarea
        v-model:value="formData.courseDescriptions"
          placeholder="请输入课程介绍"
          :auto-size="{ minRows: 7, maxRows: 15 }"
        />
      </a-form-item>
    </div>
    <div :class="type ? 'col-2' : 'col-1'">
      <a-form-item>
        <template #label
          >课程封面
          <i class="hint">支持格式:jpg、png，限制尺寸525*300px</i></template
        >
        <upload-image
          uploadUrl="/api/course/courses/upload"
          @img-src="formData.url"
          :createOrEdit="type ? 'create' : 'edit'"
        ></upload-image>
      </a-form-item>
    </div>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import storage from "src/utils/extStorage";
import uploadImage from "./uploadImage.vue";
import request from "src/api/index";
import { useRoute } from "vue-router";
import moment from "moment"

type TreactiveData={
    formData:any,
    rules:any,
    categoryList:any[],
    directionsList:any[]
}
export default defineComponent({
  components: {
    "upload-image": uploadImage,
  },
  props: {
    type: {
      default: true,
      type: Boolean,
    },
  },
  setup(props) {
    const courseApi = request.teachCourse;
    const route = useRoute();
    const course_id = route.query.course_id;
    const formDom = ref(null);
    const type = props.type;
    const currentRole = storage.lStorage.get("role");
    const reactiveData:TreactiveData = reactive({
      formData: {},
      rules: {
          name:[{ required: true, message: '课程名称不能为空' }],
          category:[{ required: true, message: '课程方向不能为空' }],
          direction:[{ required: true, message: '职业方向不能为空' }],
          created_at:[{ required: true, message: '时间不能为空' }],
          end_time:[{ required: true, message: '时间不能为空' }]
      },
      categoryList: [],
      directionsList: [],
    });
    onMounted(() => {
      if (course_id) {
        getCourseDetail();
        getCategory();
        getDirections();
      }
    });
    // 获取课程详情
    function getCourseDetail() {
      courseApi
        .getCourseDetailApi({ urlParams: { course_id: course_id } })
        .then((res: any) => {
          console.log(res);
          reactiveData.formData = res.data;
          (reactiveData.formData as any).created_at=moment(res.data.created_at);
          (reactiveData.formData as any).end_time=moment(res.data.end_time)
        });
    }
    // 获取课程方向
    function getCategory() {
      courseApi.getCategoryApi({}).then((res: any) => {
        reactiveData.categoryList = res.data;
      });
    }
    // 获取职业方向
    function getDirections() {
      courseApi.getDirectionsApi({}).then((res: any) => {
        reactiveData.directionsList = res.data;
      });
    }
    return {
      ...toRefs(reactiveData),
      formDom,
      type,
      currentRole,
      moment
    };
  },
});
</script>

<style lang="less">
.edit-course-base-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .col-2 {
    width: 48%;
    &.time-item {
      display: flex;
      justify-content: space-between;
      > div {
        width: 48%;
      }
    }
  }
  .hint {
    font-size: 12px;
    margin-left: 0px;
    font-style: normal;
    transform: scale(0.85);
  }
}
</style>
