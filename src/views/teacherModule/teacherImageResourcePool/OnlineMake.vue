<template>
  <div class="reference">
    <div class="addBox">
      <div class="add flexCenter">
        <span
          class="addCircular iconfont icon-tianjia"
          @click="OnlineAdd"
        ></span>
      </div>
    </div>
  </div>
  <a-spin :spinning="loading" size="large" tip="Loading...">
    <div class="flexCenter mainBox">
      <div class="imageBox" v-for="(v, k) in list" :key="v" :class="getClass(k)">
        <div class="image">
          <!-- imgType 四种-->
          <div class="top flexCenter" :class="v.image && v.image.ostype">
            <div class="left">
              <div class="tit">{{v.image && v.image.name}}</div>
              <div class="text single_ellipsis">{{v.image && v.image.description}}</div>
              <div class="parameter flexCenter">
                <div class="item">
                  <span>内存</span>
                  <span>{{v.flavor && v.flavor.ram_text}}</span>
                </div>
                <div class="item">
                  <span>CPU</span>
                  <span>{{v.flavor && v.flavor.cpu_text}}</span>
                </div>
                <div class="item">
                  <span>硬盘</span>
                  <span>{{v.flavor && v.flavor.disk_text}}</span>
                </div>
                <div class="item">
                  <span>GPU</span>
                  <span>{{v.use_gpu_text}}</span>
                </div>
              </div>
              <!-- <div class="name single_ellipsis">{{v.dataset[0]}}</div> -->
              <div class="name">数据集</div>
              <div class="miaoshu single_ellipsis flexCenter">
                <div class="one single_ellipsis">{{v.dataset && v.dataset[0] && v.dataset[0].name}}</div>
                <div class="more" v-if="v.dataset && v.dataset.length>1">
                  <a-popover>
                    <template #content>
                      <div style="">
                        <div v-for="i in v.dataset">{{i.name}}</div>
                        <!-- <div>skdhskdfhsdfhs</div>
                        <div>暗杀的急啊姐姐和</div> -->
                      </div>
                    </template>
                    <span class="iconfont icon-chakangengduo"></span>
                  </a-popover>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="time">存活倒计时</div>
              <div class="flexCenter">
                <div>
                  <span class="tian">{{v.is_permanent.split(":")[0]}}</span>
                  <span class="unit">{{v.is_permanent.split(":")[1]}}</span>
                </div>
                <!-- 小时 -->
              </div>
            </div>
          </div>
          <div class="caoZuo flexCenter">
            <a-button type="text" @click="deleteFun(v)">删除</a-button>
            <a-button :type="v.status?'link':'text'" :loading="v.status" v-if="statusList[k]?.status=='ACTIVE'"  @click="enterFun(v)">{{v.status?'进入中...':'进入'}}</a-button>
            <a-button class='cursor' :type="v.generateLoad?'link':'text'" v-else @click="openEnv(statusList[k].id,k,'开启')">
              <span v-if="!v.opening&&statusList[k]?.status!=='none'">开启</span>
              <span v-if='v.opening||statusList[k]?.status=="none"' class="openStatus">
                <LoadingOutlined></LoadingOutlined>
                准备中...
              </span>
          </a-button>
            <a-button :type="v.generateLoad?'link':'text'" :loading="v.generateLoad"  @click="GenerateImage(v,k)">{{v.generateLoad?'镜像生成中...':'生成镜像'}}</a-button>
          </div>
        </div>
      </div>
      <Empty v-if="!list.length && !loading" />
    </div>
  </a-spin>
  <a-modal class="save-image-modal" :visible="saveVisible" @cancel='cancel'>
         <template v-slot:title>保存镜像</template>
          <div>
            <a-form ref="createForm" :model="createFormData" :rules="rules">
              <a-form-item has-feedback required label="镜像名称" name="name">
                <a-input v-model:value="createFormData.name" placeholder="请在这里输入镜像标题" />
              </a-form-item>
              <a-form-item has-feedback required label="镜像描述" name="description">
                <a-textarea
                  v-model:value="createFormData.description"
                  placeholder="请在这里输入镜像描述文字"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-item>
            </a-form>
          </div>
          <template v-slot:footer>
            <div>
              <a-button @click="cancel">取消</a-button>
              <a-button type="primary" @click="saveImage">确定</a-button>
            </div>
          </template> 
          
        </a-modal>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  createVNode,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import { ExclamationCircleOutlined,LoadingOutlined } from "@ant-design/icons-vue";
import { getWorkbenchInfoApi, deleteWorkbenchApi } from "./api";
import Submit from "src/components/submit/index.vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
const opening:any=ref(false)
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
const statusList:any=ref([])
const taskState:any=ref('')
updata({
  tabs: [{ name: "在线镜像制作台", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});
const saveVisible:any=ref(false)
const createFormData=reactive({
    name:'',
    description:''
})
const createForm:any=ref()
// 镜像名称校验
const nameValidator = (rule: any, value: any, callback: any) => {
      var reg = /^[a-zA-Z0-9_]+$/g;
      if (value === "") {
        callback("请输入镜像名称");
      } else if (value.length > 30) {
        callback("镜像名称最长30个字");
      } else if (!reg.test(value)) {
        callback("镜像名称只能由英文字母数字下划线组成");
      } else {
        callback();
      }
    };
const rules: any = {
      name: [{ validator: nameValidator, trigger: "change" }],
      description: [
        {
          required: false,
          max: 200,
          message: "镜像描述最长200个字",
          trigger: "change",
        },
      ],
    };
const imageid:any=ref()
const saveIndex:any=ref()
const OnlineAdd = () => {
  if(list && list.length >= 5 ){
    message.warning("最多存在5个容器")
    return 
  }
  router.push("/teacher/teacherImageResourcePool/createWorkbench");
};
const getClass = (k: number) => {
  let minArr = [2, 5, 8, 11];
  let rigArr = [3, 6, 9, 12];
  let str = "";
  if (minArr.includes(k + 1)) {
    str = "textMid";
  }
  if (rigArr.includes(k + 1)) {
    str = "textRig";
  }
  return str;
};
const flag:any=ref(false)
const getWorkbenchStatus=(operate?:any,index?:any)=>{
      flag.value=false
      http.getWorkbenchStatusApi().then((res: any) => {
        statusList.value=res.data
        statusList.value.forEach((item:any)=>{
          if(item.status=='none'||item.task_state!==null){
            flag.value=true
          }
        })
        // 1.开启的时候
        if(!flag.value&&list[index]?.opening){
          message.warning('开启成功！')
          list[index].opening=false
        }
        if(flag.value){
          setTimeout(()=>{
            getWorkbenchStatus(operate,index)
          },100)
        }
      })
};
const enterFun = (val: any) => {
  console.log(val)
  let tags: any[] = val.image.tags;
  let id = val.id;
  val.status=true
  // let status = val.vm.status;

  // if (status === 0) {
  //   message.warn("请先开启工作台，在重新进入");
  //   return;
  // }
  // {urlParams:{imageID:val.id}}
 getWorkbenchInfoApi({id:val.id}).then((res: any) => {
      val.status=false
      if (tags.indexOf("jupyter") > -1) {
        const { href } = router.resolve({
          path: "/teacher/teacherCourse/open-jupyte",
          query: {
            id: id,
          },
        });
        window.open(href, "_blank");
      } else {
        const { href } = router.resolve({
          path: "/teacher/teacherCourse/open-vnc",
          query: {
            id: id,
          },
        });
        window.open(href, "_blank");
      }
      getWorkbenchStatus() 
  }).catch(() => {
    val.status=false
  })
};
const openEnv=(val:any,index:any,operate:any)=>{
  // opening.value=true
  list[index].opening=true
  http.openWorkbenchApi({urlParams:{id:val}}).then((res:any)=>{
    // message.success('开启成功！')
    // list[index].opening=false
    getWorkbenchStatus(operate,index);
  })
}
const deleteFun = (val: any) => {
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.deleteWorkbenchApi({urlParams: {imageID: val.id}}).then((res: any) => {
        message.success("删除成功");
          initData();
      });
    },
  });
};
const GenerateImage = (val: any,k:any) => {
  createFormData.name=''
  createFormData.description=''
  saveVisible.value=true
  imageid.value=val.id
  saveIndex.value=k
  createForm.value.resetFields();
};
const saveImage=()=>{

  if(!createFormData.name){
    message.warning('镜像名称不能为空！')
    return
  }
  if(!createFormData.description){
    message.warning('镜像描述不能为空！')
    return
  }
  // createForm.value.validate().then((res:any)=> {

  // }).catch((err:any)=>{message.warning(err)})
   let obj={
    name:createFormData.name,
    description:createFormData.description
  }
  list[saveIndex.value].generateLoad=true
  // val.generateLoad=true
  http.GenerateImage({urlParams:{imageID:imageid.value},param:{...obj}}).then((res: IBusinessResp) => {
    message.success("生成成功");
    saveVisible.value=false
    list[saveIndex.value].generateLoad=false
  //  val.generateLoad=false
  })
  .catch(() => {
    // val.generateLoad=false
    list[saveIndex.value].generateLoad=false
  })
}
const cancel=()=>{
  saveVisible.value=false
}
var loading: Ref<boolean> = ref(false);
var list: any = reactive([]);
const initData = () => {
  loading.value = true;
  list.length=0
  http.getWorkBenchList().then((res: IBusinessResp) => {
    // let arr=['docker-Linux','kvm-Linux','kvm-windows','KVM-ARM-欧拉']
    // ostype  classify
    let data=res.data.list
    data.map((v:any)=>{
      v.opening=false
      v.generateLoad=false
      v.status=false
    })
    list.push(...data);
    loading.value = false;
  });
};

onMounted(() => {
  // initData();
  init()
});
async function init() {
    await initData();
    getWorkbenchStatus();
}
</script>
<style scoped lang="less">
.reference {
  position: fixed;
  width: 100%;
  top: 110px;
  left: 0;
  height: 50px;
  .addBox {
    width: var(--center-width);
    margin: 0 auto;
    .add {
      justify-content: end;
      .addCircular {
        margin-left: 20px;
      }
    }
  }
}
.mainBox {
  flex-wrap: wrap;
  margin-top: 2rem;
  min-height: 200px;
  .imageBox {
    width: 33.33%;
    margin-bottom: 1rem;
  }
  .textRig {
    display: flex;
    justify-content: end;
  }
  .textMid {
    display: flex;
    justify-content: center;
  }
  .image {
    width: 384px;
    // height: 224px;
    color: var(--white);
    .top {
      justify-content: space-between;
      padding: 1rem;
      height: 180px;
      border-radius: 14px 14px 0 0;
      background-image: url("src/assets/images/teacherImageResourcePool/kVM-Linux.jpg");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .left {
        width: 70%;
        .tit {
          color: var(--white-65);
          font-size: 12px;
        }
        .parameter {
          margin: 14px 0 20px 0;
          flex-wrap: wrap;
          width: 80%;
          font-size: 12px;
          .item {
            color: var(--white-65);
            width: 25%;
            display: flex;
            flex-direction: column;
          }
        }
        .name {
          color: var(--white-65);
          font-size: 12px;
        }
        .miaoshu {
          width: 80%;
          height: 32px;
          justify-content: space-between;
          padding-right: 4px;
          cursor: pointer;
          .one{
            width:80%;
          }
          .more{
            .icon-chakangengduo{
              font-size: 26px;
            }
          }
        }
      }
      .right {
        height: 100%;
        color: #fffa75;
        .time {
          font-size: 12px;
        }
        .tian {
          font-size: 22px;
        }
        .unit{
          font-size: 12px;
        }
      }
    }
    .Docker-Linux{
      background-image:url('src/assets/images/teacherImageResourcePool/ARM.png');
    }
    .KVM-ARM{
      background-image:url('src/assets/images/teacherImageResourcePool/docker.png');
    }
    .kVM-Linux{
      background-image:url('src/assets/images/teacherImageResourcePool/KVM-Linux.png');
    }
    .KVM-windows{
      background-image:url('src/assets/images/teacherImageResourcePool/KVM-Windows.png');
    }

    .caoZuo {
      height: 44px;
      justify-content: space-around;
      color: var(--black-65);
      background-color: #fff;
      border-radius: 10px;
      span:hover {
        // cursor: pointer;
        color: var(--primary-color);
      }
    }
  }
}
.cursor{
  cursor: pointer;
}
.openStatus{
  color: var(--primary-color);
}
</style>
