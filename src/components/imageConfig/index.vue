<template>
  <div class="labelList flexCenter">
    <div class="item" v-for="(v, k) in props.configs" :key="v">
      <div class="name">{{ v.name }}</div>
      <template v-if="v.type === 'select'" class="flexCenter">
        <div class="node">
          <div class="circleBox flexCenter">
            <div
              class="circle"
              v-for="(i, idx) in v.data"
              @click="selectNode(v, i)"
              :class="getClass(i, idx, v)"
            ></div>
          </div>
          <div class="numBox flexCenter">
            <div
              class="num"
              v-for="(i, idx) in v.data"
              :class="idx <= v.data.length - 2 ? 'numW' : ''"
            >
              {{ i }}{{ v.unit }}
            </div>
          </div>
        </div>
      </template>
      <template v-if="v.type === 'radio'">
        <a-radio-group
          name="radioGroup"
          v-model:value="v.value"
          @change="change(v.key, v.value)"
        >
          <a-radio :value="a.value" v-for="a in v.data">{{ a.name }}</a-radio>
        </a-radio-group>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, Ref } from "vue";
// 采用ts专有声明，有默认值
interface Props {
  configs: any[]; //  数组对象或者 纯  string[]   都行
}
/***
 * 参考参数
 * key 为父组件参数的键   子组件按此值返回
 */

// const configs:any=reactive([
//   {name:'内存',data:[2,4,6,8],unit:'GB',value:4,type:'select',key:'ram'},
//   {name:'CPU',data:[1,2,3,4],unit:'GB',value:3,type:'select',key:'cpu'},
//   {name:'硬盘',data:[30,40,50,100],unit:'GB',value:40,type:'select',key:'disk'},
//   {name:'GPU',data:[{name:'是',value:true},{name:'否',value:false}],value:false,type:'radio',key:'gpu'},
// ])
const props = withDefaults(defineProps<Props>(), {
  configs: () => [],
});

const emit = defineEmits<{
  (e: "change", val: any): void;
}>();
const params: any = reactive({});
if (props.configs.length) {
  props.configs.forEach((v: any) => {
    params[v.key] = v.value;
  });
}

emit("change", params);
const selectNode = (v: any, i: any) => {
  v.value = i;
  params[v.key] = v.value;
  emit("change", params);
};
const change = (key: string, value: boolean) => {
  params[key] = value;
  emit("change", params);
};
const getClass = (i: any, idx: number, v: any) => {
  let str = "";
  if (idx < v.data.length - 1) {
    str = "haveAfter";
  }
  if (i === v.value) {
    v.active = idx;
    str += " active";
  }
  if (idx < v.active) {
    str += " front";
  }
  return str;
};
</script>
<style scoped lang="less">
.labelList {
  flex-direction: column;
  .item {
    width: 100%;
    display: flex;
    margin-bottom: 1rem;
    .name {
      // margin-right: 1rem;
      max-width: 80px;
      width: max-content;
      min-width: 60px;
      overflow: hidden;
    }
    .node {
      // flex-direction: column;
      flex: 1;
      .circleBox {
        .circle {
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.04);
          width: 12px;
          height: 12px;
          position: relative;
          cursor: pointer;
        }
        .haveAfter {
          margin-right: 100px;
          &::after {
            position: absolute;
            content: "";
            width: 100px;
            height: 2px;
            left: 100%;
            top: 50%;
            background: rgba(0, 0, 0, 0.04);
          }
        }
        .active {
          width: 14px;
          height: 14px;
          border: 2px solid var(--primary-color);
        }
        .front {
          border: 1px solid #ffd5b5;
          &::after {
            background-color: var(--primary-color);
          }
        }
      }
      .numBox {
        width: 100%;
        padding-top: 8px;
        .numW {
          width: 102px;
        }
      }
    }
  }
}
</style>
