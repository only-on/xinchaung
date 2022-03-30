<template>
  <div class="paper-content-list" v-for="(list, index) in modelValue" :key="list.id">
    <p>{{ index + 1 }}、{{ list.question }}</p>
    <!-- 单选题 -->
    <a-radio-group
      class="radioclass"
      v-model:value="list.answers[0].answer"
      v-if="list.type_id === 1"
    >
      <ul>
        <li v-for="(item, i) in list.options" :key="i">
          <a-radio disabled :value="item.id" />
          <span>{{ options[i] }}：{{ item.option }}</span>
          <span class="answer" v-if="Number(list.answers[0].answer) === item.id"
            >(正确答案)</span
          >
        </li>
      </ul>
    </a-radio-group>
    <!-- 多选题 -->
    <a-checkbox-group
      class="radioclass"
      v-model:value="list.answersList"
      v-if="list.type_id === 2"
    >
      <ul>
        <li v-for="(item, i) in list.options" :key="i">
          <a-checkbox disabled :value="item.id" />
          <span>{{ options[i] }}：{{ item.option }}</span>
          <span class="answer" v-if="multipleAnswers(list.answers, item.id)"
            >(正确答案)</span
          >
        </li>
      </ul>
    </a-checkbox-group>
    <!-- 判断 -->
    <a-radio-group v-model:value="list.answers[0].answer" v-if="list.type_id === 3">
      <ul>
        <li v-for="(item, i) in list.options" :key="i">
          <a-radio :value="item.id" disabled>{{ item.option }}</a-radio>
          <span class="answer" v-if="list.answers[0].answer == item.id">(正确答案)</span>
        </li>
      </ul>
    </a-radio-group>
    <!-- 填空 -->
    <ul v-if="list.type_id === 4">
      <li v-for="(item, i) in list.answers" :key="item.id">
        <span>答案{{ i + 1 }}</span>
        <span class="answer">{{ item.answer }}</span>
      </li>
    </ul>
    <!-- 简答 -->
    <div v-if="list.type_id === 5">
      <li v-for="(item, i) in list.answers" :key="item.id">
        <span>答案{{ i + 1 }}</span>
        <span class="answer">{{ item.answer }}</span>
      </li>
    </div>
    <div class="icons">
      <span class="iconfont icon-yichu1" @click="del(index)"></span>
      <span class="iconfont icon-shangyi1" @click="remove(index)"></span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  provide,
  inject,
  watch,
  nextTick,
  PropType,
} from "vue";
import { IPaperList, Ilist } from "./typings";
import { useRoute } from "vue-router";
import request from "src/api/index";
export default defineComponent({
  name: "",
  components: {},
  props: {
    modelValue: Array as PropType<Ilist[]>,
  },
  emit: ["update:modelValue"],
  setup(props, { emit }) {
    const route = useRoute();
    const paper_id = route.query.paper_id;
    const examApi = request.teachCourse;
    function del(i: number) {
      let arr: any = props.modelValue;
      if (paper_id) {
        examApi
          .deleteQuestionPaperApi({
            urlParams: { entity_type: "test", entity_id: paper_id },
            param: { questions: [arr[i].id] },
          })
          .then((res: any) => {
            arr?.splice(i, 1);
            emit("update:modelValue", arr);
          });
      } else {
        arr?.splice(i, 1);
        emit("update:modelValue", arr);
      }
    }
    function remove(i: number) {
      if (i === 0) return;
      let arr = props.modelValue;
      arr?.splice(i, 1, ...arr.splice(i - 1, 1, arr[i]));
      emit("update:modelValue", arr);
    }

    function multipleAnswers(answer: any[], currentOpt: any) {
      let flag = answer.find((item: any) => {
        return item.answer == currentOpt;
      });
      return flag;
    }
    return {
      options: ["A", "B", "C", "D"],
      del,
      remove,
      multipleAnswers,
    };
  },
});
</script>

<style lang="less" scoped>
.paper-content-list {
  position: relative;
  margin-bottom: 32px;
  &>p{
    margin-bottom: 6px;
  }
  .icons {
    position: absolute;
    top: -12px;
    right: -60px;
    color: var(--purpleblue-6);
    .iconfont {
      cursor: pointer;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
  &:first-child {
    .icons .iconfont:nth-child(2) {
      color: rgba(5, 1, 1, 0.25);
    }
  }
  .answer {
    color: #ff8f00;
    margin-left: 8px;
  }
  .ant-checkbox-wrapper{
    margin-right: 8px;
  }
}
</style>
