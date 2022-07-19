<template>
  <div v-show="loading">

  </div>
  <h3 class="title">实验环境</h3>
  <div v-if="props.type">
    <ConfigModal
      :imageList="imageList"
      @selectedImage="selectedImage"
      :defaultConfig="defaultConfig"
    />
  </div>
  <div class="selectList flexCenter" v-else>
    <div
      class="add item flexCenter"
      @click.stop="selectList.length >= 3 ? '' : (visible = true)"
      :class="selectList.length >= 3 ? 'not-allowed' : ''"
    >
      <div class="tianjia">
        <span class="iconfont icon-tianjia"></span>
        <span>添加实验环境</span>
      </div>
      <div class="limit">最多添加三个环境</div>
    </div>
    <div class="item" v-for="(v, idx) in selectList" :key="v">
      <div class="single_ellipsis" :title="v.imageName">
        {{ v.imageName }}
      </div>
      <div class="content">
        <div class="info flexCenter">
          <span>内存：{{ v.flavor.ram / 1024 }}GB</span>
          <span>CPU：{{ v.flavor.cpu }}核</span>
          <span>硬盘：{{ v.flavor.disk }}GB</span>
          <span>GPU：{{ v.flavor.gpu ? "是" : "否" }}</span>
        </div>
        <div class="caozuo">
          <span class="iconfont icon-bianji1" @click.stop="edit(v, idx)"></span>
          <span class="iconfont icon-shanchu" @click.stop="Delete(idx)"></span>
        </div>
      </div>
    </div>
  </div>
  <a-modal
    v-model:visible="visible"
    title="设置实验环境"
    :destroyOnClose="true"
    @cancel="cancel"
  >
    <ConfigModal
      :imageList="imageList"
      @selectedImage="selectedImage"
      :defaultConfig="defaultConfig"
    />
    <template #footer>
      <Submit @submit="handleOk" @cancel="cancel" :loading="loading"></Submit>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import Submit from "src/components/submit/index.vue";
import ConfigModal from "./ConfigModal.vue";
import ImageConfig from "src/components/imageConfig/index.vue";
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  defineProps,
  withDefaults,
  watch
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const http = (request as any).teacherImageResourcePool;
interface IFlavor{
  cpu:number
  disk:number
  gpu:boolean
  ram:number
}
interface envListItem{
  imageName:string
  image_id:number
  flavor:IFlavor
}
interface Props {
  type: boolean;     // true单环境    false 多环境
  imageType:string      //  筛选镜像类型
  envList?: envListItem[]
}
const props = withDefaults(defineProps<Props>(), {
  type: false,    // true单环境    false 多环境
  imageType:'vnc',
  envList: () => []
});
var visible: Ref<boolean> = ref(false);
const selectList: any = reactive([]);
const currentImage: any = reactive({
  flavor: {
    cpu: "",
    disk: "",
    ram: "",
    gpu: false,
  },
  imageName: "",
  image_id:'',
});
const defaultConfig: any = reactive({
  flavor: {},
  imageName: "",
  image_id:'',
  editIdx: "",
});
watch(()=>props.envList, newVal => {
  if (!newVal.length) return
  selectList.length = 0
  selectList.push(...JSON.parse(JSON.stringify(newVal)))
  // 单环镜
  if (props.type) {
    defaultConfig.flavor = selectList[0].flavor
    defaultConfig.flavor.gpu = selectList[0].is_use_gpu
    defaultConfig.image_id = selectList[0].image_id
  }
}, {deep: true, immediate: true})
const emit = defineEmits<{
  (e: "handleOk", val: any): void;
}>();
const handleOk = () => {
  if(!currentImage.image_id) {
    message.warn('请选择镜像！')
    return
  }
  var obj = {
    flavor: { ...currentImage.flavor },
    imageName: currentImage.imageName,
    image_id:currentImage.image_id,
  };
  if (defaultConfig.editIdx === "") {
    selectList.push(obj);
  } else {
    selectList[defaultConfig.editIdx] = obj;
  }

  currentImage.flavor = { cpu: "", disk: "", ram: "", gpu: false };
  currentImage.imageName = "";
  currentImage.image_id = ''
  // console.log(selectList)
  emit("handleOk", selectList);
  cancel()
};
const cancel = () => {
  defaultConfig.flavor = { cpu: "", disk: "", ram: "", gpu: false };
  defaultConfig.imageName = "";
  defaultConfig.image_id='',
  defaultConfig.editIdx = "";
  visible.value = false;
};
const edit = (val: any, k: number) => {
  visible.value = true;
  const {flavor,image_id,imageName}=val
  defaultConfig.flavor = flavor;
  defaultConfig.image_id = image_id
  defaultConfig.imageName =imageName;
  defaultConfig.editIdx = k;
};
const Delete = (k: number) => {
  selectList.splice(k, 1);
  emit("handleOk", selectList);
};
const selectedImage = (val: any) => {
  // console.log('已选择好的配置=》',val)
  const {flavor,image_id,imageName}=val
  currentImage.image_id =image_id
  currentImage.imageName = imageName;
  currentImage.flavor =flavor;
  if (props.type) {
    emit("handleOk", [currentImage]);
  }
};
const imageList:any=reactive([])
var loading: Ref<boolean> = ref(false);
const initData = () => {
  loading.value=true
  imageList.length=0
  let obj={
    page:1,
    limit:99999,
    tags:[props.imageType]
  }
  http.imagesList({param:{...obj}}).then((res: IBusinessResp) => {
    const data= res.data.list;
    imageList.push(...data)
    loading.value=false
  });
};
onMounted(() => {
  initData();
});
</script>
<style scoped lang="less">
h3 {
  padding-bottom: 2rem;
}
.title {
  padding: 15px 0;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 16px;
}
.configs {
  margin: 2rem 0 1rem 0;
}
.selectList {
  .item {
    width: 240px;
    height: 100px;
    background: #fafafb;
    border-radius: 10px;
    margin-right: 1rem;
    padding: 10px;
    .single_ellipsis {
      color: var(--black-85);
    }
    .content {
      display: flex;
      margin-top: 14px;
      .info {
        flex-wrap: wrap;
        width: 80%;
        span {
          width: 50%;
          font-size: 12px;
          color: var(--black-45);
        }
      }
      .caozuo {
        display: flex;
        align-items: end;
        flex: 1;
        justify-content: space-around;
        span {
          cursor: pointer;
          color: var(--black-65);
        }
        span:hover{
          color: var(--black-85);
        }
      }
    }
  }
  .add {
    cursor: pointer;
    background: #ffffff;
    border: 1px dashed var(--primary-color);
    color: var(--primary-color);
    flex-direction: column;
    justify-content: center;
    .limit {
      color: var(--black-25);
      font-size: 12px;
      padding-top:6px;
    }
  }
  .not-allowed {
    cursor: not-allowed;
  }
}
</style>
