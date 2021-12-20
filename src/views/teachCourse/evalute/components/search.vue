<template>
  <a-form layout="inline" :form="form">
    <a-form-item>
      <beforeIcon icon="src/assets/images/screenicon/Group8.png">
        <a-select
          class="inputWidth"
          placeholder="请选择班级"
          v-model:value="form.classId"
          @change="handleSearch"
        >
          <a-select-option
            v-for="(item, index) in options"
            :key="index"
            :value="item.id"
            >{{ item.classname }}</a-select-option
          >
        </a-select>
      </beforeIcon>
    </a-form-item>
    <a-form-item>
      <!-- label="学号" -->
      <a-input
        class="inputWidth"
        placeholder="请输入学号"
        v-model:value="form.username"
        @pressEnter="handleSearch"
        ><template #prefix>
          <img src="src/assets/images/screenicon/Group7.png" /> </template
      ></a-input>
    </a-form-item>
    <a-form-item>
      <!-- label="姓名" -->
      <a-input
        class="inputWidth"
        placeholder="请输入姓名"
        v-model:value="form.name"
        @pressEnter="handleSearch"
      >
        <template #prefix>
          <img src="src/assets/images/screenicon/Group6.png" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSearch">查询</a-button>
      <a-button type="primary" @click="hanldeClear">清空</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from "vue";
import request from "src/api/index";
import { Ihttp } from "../../typings";
import { IBusinessResp } from "src/typings/fetch.d";
import dee from "src/components/Empty.vue";
import beforeIcon from "src/components/aiAnt/beforeIcon.vue";
interface Iform {
  classId: any;
  username: string;
  name: string;
}
interface Ioptions {
  id: string;
  classname: string;
}
export default defineComponent({
  props: ["courseId"],
  components: {
    beforeIcon,
  },
  setup(props, { emit }) {
    const http = (request as Ihttp).teachCourse;
    const form = reactive<Iform>({
      classId: undefined,
      username: "",
      name: "",
    });
    var options = reactive<Ioptions[]>([
      {
        id: "",
        classname: "全部班级",
      },
    ]);
    onMounted(() => {
      getOptions(props.courseId);
    });
    function getOptions(val: any) {
      options.length = 1;
      http.allClasses({ param: { course_id: val } }).then((res: IBusinessResp) => {
        if (res && res.data.length > 0) {
          options.push(...res.data);
        }
      });
    }
    function handleSearch() {
      emit("search", form);
    }
    function hanldeClear() {
      form.classId = undefined;
      form.username = "";
      form.name = "";
      emit("search", form);
    }
    return {
      form,
      options,
      handleSearch,
      hanldeClear,
    };
  },
});
</script>
<style lang="less" scoped>
.ant-form {
  .ant-form-item:first-child {
    width: 180px;
  }
  .ant-input {
    width: 120px;
  }
  .ant-btn {
    margin-right: 10px;
  }
}
.inputWidth {
  width: 160px;
}
</style>
