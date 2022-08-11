<template>
  <div>
    <div class="label-list">
      <span
        v-for="(item, index) in props.tag"
        :key="index"
        class="active"
      >
        {{ item }}
        <i
          class="remove iconfont icon-guanbi"
          @click="removeLabel(item)"
        ></i>
      </span>
      <span class="edit-box" v-if="props.tag && props.tag.length < 3">
        <span @click="clickCustomLabel" v-show="!openCustom">
          <span class="iconfont iconbiaoqian"></span>
          + 自定义标签
        </span>
        <a-input
          ref="refCustomLabel"
          @pressEnter="customFinish"
          @blur="customFinish"
          @change="changeLabel"
          v-show="openCustom"
          v-model:value="state.customLabelV"
        />
      </span>
    </div>
    <div class="recommend" v-if="showTag && props.recommend.length">
      <div class="tit">或从推荐中选择</div>
      <div class="tagBox">
        <div v-for="v in props.recommend" :key="v">
          <span
            @click="addTag(v.value)"
            :class="props.tag.includes(v.value) ? 'act' : ''"
            >{{v.value}}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Ref,
  ref,
  reactive,
  nextTick,
} from "vue";
import { message } from "ant-design-vue";
interface Props {
  tag: any;
  recommend?:any;
}
const props = withDefaults(defineProps<Props>(), {
  tag: () => [],
  recommend: ()=> [],
});
const state: any = reactive({
  customLabelV: "",
  config: {},
});
const emit=defineEmits<{
  (e:'selectTag',val:any,arr:any):void,
  (e:'finishTag',arr:any):void,
}>()
var showTag: Ref<boolean> = ref(false);
var openCustom: Ref<boolean> = ref(false);
const refCustomLabel = ref<HTMLElement>();
function removeLabel(val: any) {
  let num = props.tag.indexOf(val);
  if (num !== -1) {
    props.tag.splice(num, 1);
  }
}
function clickCustomLabel() {
  showTag.value = true;
  openCustom.value = true;
  nextTick(() => {
    refCustomLabel.value && refCustomLabel.value.focus();
  });
}
function customFinish() {
  var reg = new RegExp("^[0-9A-Za-z\u4e00-\u9fa5]+$");
  if (state.customLabelV && !reg.test(state.customLabelV)) {
    message.warning("标签字符只能包含汉字、数字、字母");
    state.customLabelV=''
    openCustom.value = false;
    return;
  }
  if (state.customLabelV.trim()) {
    props.tag.push(state.customLabelV);
    state.customLabelV = "";
    // console.log(props.tag);
    emit('finishTag',props.tag)
  }
  openCustom.value = false;
  
}
function addTag(val: any) {
  if (props.tag.length < 3 && props.tag.includes(val) === false) {
    props.tag.push(val);
  } else {
    props.tag.length >= 3 ? message.warn("最多添加3个标签"):''
  }
  emit('selectTag',val,props.tag)
}
function changeLabel() {
  // console.log(val)
  // console.log(state.customLabelV)
  state.customLabelV =
    state.customLabelV.length > 10
      ? state.customLabelV.slice(0, 10)
      : state.customLabelV;
}
</script>
<style lang="less">
.label-list {
  display: flex;
  flex-wrap: wrap;

  > span {
    margin: 0px 5px 0px 0px;
    padding: 5px 15px;
    // background: #ebebeb;
    margin-bottom: 5px;
    position: relative;
    border-radius: 5px;
    margin-right: 10px;

    > .remove {
      position: absolute;
      font-size: 12px;
      background: red;
      width: 14px;
      height: 14px;
      top: -5px;
      right: -5px;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
      cursor: pointer;
    }

    &.active {
      background: var(--primary-color);
      color: #ffffff;
    }
  }

  .edit-box {
    margin: 0px 5px 0px 0px;
    padding: 0px 0px;
    // background: #ebebeb;
    margin-bottom: 5px;
    position: relative;
    width: 120px;
    cursor: pointer;

    > span {
      // padding: 0px 15px;
      display: block;
      text-align: center;
      width: 100%;
      line-height: 30px;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      border-radius: 5px;
      background: #ffffff;

      &:hover {
        background: var(--primary-1);
      }
    }
  }
}
.recommend {
  color: var(--black-65);
  margin-top: 1rem;
  .tagBox {
    display: flex;
    flex-wrap: wrap;
    div {
      text-align: center;
      cursor: pointer;
      width: 25%;
      padding: 6px 0;
      span {
        background: #ebebeb;
        border: 1px solid #dfdfdf;
        border-radius: 11px;
        font-size: 12px;
        color: var(--black-65);
        padding: 2px 7px;
      }
      .act {
        background: var(--primary-color);
        color: #fff;
        // color: var(--primary-color);
      }
    }
  }
}
</style>