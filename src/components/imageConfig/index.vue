<template>
  <div class="labelList flexCenter">
    <div class="item" v-for="v in configs" :key="v">
      <div class="name">{{ v.name }}</div>
      <template v-if="v.type === 'select'" class="flexCenter">
        <div class="node">
          <div class="circleBox flexCenter">
            <div class="circle" v-for="(i, idx) in v.data" :key="i" @click="selectNode(v, i.value)" :class="getClass(i.value, idx, v)">
              <div class="tips flexCenter">
                <div class="numerical flexCenter">{{ i.label }}{{ v.unit }}</div>
              </div>
            </div>
          </div>
          <div class="numBox flexCenter">
            <div
              class="num"
              v-for="(i, idx) in v.data"
              :key="i"
              :class="idx <= v.data.length - 2 ? 'numW' : ''"
            >
              {{ i.label }}{{ v.unit }}
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
          <a-radio :value="a.value" v-for="a in v.data" :key="a">{{
            a.label
          }}</a-radio>
        </a-radio-group>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, Ref, onMounted, watch } from "vue";
import request from "src/api/index";
const http = (request as any).teacherImageResourcePool;
// 采用ts专有声明，有默认值
interface Props {
  // defaultConfig: {
  //   ram:number,
  //   cpu:number,
  //   ram:number,
  //   ram:number,
  // };
  defaultConfig?: any;
}
/***
 * 参考参数
 * key 为父组件参数的键   子组件按此值返回
 */

const configs: any = reactive([
  {
    name: "内存",
    // data: [2, 4, 6, 8],
    data:[
      // {label:2,value:2048},{label:4,value:4096},{label:6,value:6144},{label:8,value:8192},
    ],
    unit: "GB",
    value: 4096,
    type: "select",
    key: "ram",
  },
  {
    name: "CPU",
    // data: [1, 2, 3, 4],
    data:[
      // {label:1,value:1},{label:2,value:2},{label:3,value:3},{label:4,value:4},
    ],
    unit: "核",
    value: 2,
    type: "select",
    key: "cpu",
  },
  {
    name: "硬盘",
    // data: [30, 40, 50, 100],
    data:[
      // {label:30,value:30},{label:40,value:40},{label:50,value:50}
    ],
    unit: "GB",
    value: 50,
    type: "select",
    key: "disk",
  },
  {
    name: "GPU",
    value: false,
    type: "radio",
    key: "gpu",
    data: [
      { label: "是", value: true },
      { label: "否", value: false },
    ],
  },
]);
const props = withDefaults(defineProps<Props>(), {
  defaultConfig: () => {},
});
watch(()=>props.defaultConfig, newVal => {
  configs.map((v: any) => {
    let arr = props.defaultConfig ? Object.keys(props.defaultConfig) : [];
    if (arr && arr.length && arr.includes(v.key) && props.defaultConfig[v.key] !== "") {
      // console.log(props.defaultConfig[v.key])
      v.value = props.defaultConfig[v.key];
    }
  });
}, {deep:true,immediate:true})

const emit = defineEmits<{
  (e: "change", val: any): void;
}>();
const params: any = reactive({});
// if (props.configs.length) {
configs.forEach((v: any) => {
  params[v.key] = v.value;
});
// }
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
  if (i === Number(v.value)) {
    v.active = idx;
    str += " active";
  }
  if (idx < v.active) {
    str += " front";
  }
  return str;
}

const initData = () => {
  http.getConfigApi({concurrent:true}).then((res: any) => {
    const {image_configs} =res.data
    configs.forEach((val:any)=>{
      if(image_configs[val.key]){
        let configobj=image_configs[val.key]
        // console.log(image_configs[val.key]);
        Object.keys(configobj).forEach((v:any)=>{
          let obj:any={
            label:Number(configobj[v]),
            value:Number(v)
          }
          val.data.push(obj)
        })
      }
    })
    // console.log(configs);
  });
};
onMounted(() => {
  emit("change", params);
  initData()
});
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
          .tips{
            display: none;
            position: absolute;
            top: -44px;
            left: -12px;
            .numerical{
              position: relative;
              width: max-content;
              padding: 0 4px;
              min-width: 33px;
              height: 33px;
              justify-content: center;
              color: #fff;
              background-color: rgba(0, 0, 0);
              &::after{
                position: absolute;
                content: "";
                width: 0; 
                height: 0;
                left: calc(50% - 5px);
                bottom: -10px;
                border-width: 5px;
                border-style: solid;
                border-color:#000 transparent transparent transparent;
              }
            }
          }
          &:hover{
            .tips{
              display: block;
            }
          }
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
