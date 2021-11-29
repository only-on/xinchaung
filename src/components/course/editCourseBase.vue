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
      <a-form-item label="课程方向" name="course_category_id">
        <a-select v-model:value="formData.course_category_id" placeholder="请选择课程方向">
          <a-select-option
            v-for="item in categoryList"
            :key="item.id"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
    </div>
    <div v-if="currentRole === 3" class="col-2 time-item">
      <a-form-item label="开始时间">
        <a-date-picker
          :disabled-date="disabledStartDate"
          v-model:value="formData.created_at"
        />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker
          :disabled-date="disabledDate"
          v-model:value="formData.end_time"
        />
      </a-form-item>
    </div>
    <div class="col-2">
      <a-form-item label="职业方向" name="course_direction_id">
        <a-select v-model:value="formData.course_direction_id" placeholder="请选择职业方向">
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
          v-model:value="formData.introduce"
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
          :uploadUrl="formData.url"
          @img-src="urlChange"
          :createOrEdit="type ? 'create' : 'edit'"
        ></upload-image>
      </a-form-item>
    </div>
  </a-form>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  watch,
  toRaw,
} from "vue";
import storage from "src/utils/extStorage";
import uploadImage from "./uploadImage.vue";
import request from "src/api/index";
import { useRoute } from "vue-router";
import moment from "moment";
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";

type TreactiveData = {
  // formData:any,
  rules: any;
  categoryList: any[];
  directionsList: any[];
};
export default defineComponent({
  components: {
    "upload-image": uploadImage,
  },
  props: {
    type: {
      default: true,
      type: Boolean,
    },
    modelValue: {
      default: {},
      type: Object,
      require: true,
    },
  },
  setup(props, { emit }) {
    const courseApi = request.teachCourse;
    const route = useRoute();
    const course_id = route.query.course_id;
    const formDom = ref(null);
    const formData:any=ref({})
    watch(()=>props.modelValue,()=>{
      console.log(props.modelValue)
      formData.value=props.modelValue
      // formData.value.courseDescriptions=props.modelValue.introduce
    },{deep:true,immediate:true})
    
    const type = props.type;
    const currentRole = storage.lStorage.get("role");

    const reactiveData: TreactiveData = reactive({
      rules: {
        name: [{ required: true, message: "课程名称不能为空" }],
        course_category_id: [{ required: true, message: "课程方向不能为空" }],
        course_direction_id: [{ required: true, message: "职业方向不能为空" }],
        created_at: [{ required: true, message: "时间不能为空" }],
        end_time: [{ required: true, message: "时间不能为空" }],
      },
      categoryList: [],
      directionsList: [],
    });

    onMounted(() => {
      // if (course_id) {
        // getCourseDetail();
        getCategory();
        getDirections();
      // }
    });
    // 获取课程详情
    // function getCourseDetail() {
    //   courseApi
    //     .getCourseDetailApi({ urlParams: { course_id: course_id } })
    //     .then((res: any) => {
    //       console.log(res);
    //       reactiveData.formData = res.data;
    //       (reactiveData.formData as any).created_at=moment(res.data.created_at);
    //       (reactiveData.formData as any).end_time=moment(res.data.end_time)
    //     });
    // }
    // 获取课程方向
    function getCategory() {
      courseApi.getCategoryApi({}).then((res: any) => {
        if (res.data&&res.data.list) {
          reactiveData.categoryList = res.data.list;
        }else{
          reactiveData.categoryList = res.data;
        }
        
      });
    }
    // 获取职业方向
    function getDirections() {
      courseApi.getDirectionsApi({}).then((res: any) => {
        if (res.data&&res.data.list) {
          reactiveData.directionsList = res.data.list;
        }else{
          reactiveData.directionsList = res.data;
        }
        
      });
    }
    // 获取选择的封面
    function urlChange(fileUrl: string) {
      formData.value.url = fileUrl;
    }

    // 限制开始时间选择
    function disabledStartDate(current: any) {
      return current && current < moment().endOf("day").subtract(1, "days");
    }

    // 现在结束时间
    function disabledDate(current: any) {
      return current && current < formData.value.created_at;
    }
    function validate() {
     return  (formDom.value as any).validate()
        
    }
    return {
      ...toRefs(reactiveData),
      formDom,
      type,
      currentRole,
      moment,
      formData,
      urlChange,
      disabledStartDate,
      disabledDate,
      validate
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
