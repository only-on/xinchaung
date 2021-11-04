<template>
  <div v-layout-bg class="create-image-box">
        <a-form layout="vertical">
            <a-form-item label="镜像文件" required>
                <upload-image></upload-image>
            </a-form-item>
            <div class='create-img-middle'>
                <div>
                    <a-form-item label="镜像名称">
                        <a-input class="form-input" v-model:value="image.name"></a-input>
                    </a-form-item>
                     <a-form-item label="镜像类型">
                        <a-input class="form-input" v-model:value="image.imageType"></a-input>     
                    </a-form-item>
                </div>
                <div>
                    <a-form-item label="系统类型">
                        <a-select class="form-input" v-model:value="image.systemType" placeholder='请选择系统类型'>
                            <a-select-option :value="item" v-for="(item,index) in config.image_classify" :key="index.toString()">
                              {{item}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="镜像标签">
                        <a-checkbox-group v-model:value="image.tag" @change="onChange">
                            <a-checkbox v-for="(item,index) in config.tags" :key="index.toString()" :value='item'>{{item}}</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                </div>
            </div>
            <a-form-item label="描述">
                <a-textarea placeholder="镜像描述"  class="ant-input-desc" v-model:value="image.desc"></a-textarea>
            </a-form-item>
        </a-form>
    
        <div class="form-bottom">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="create">创建</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  Ref,
  ref,
  inject,
  reactive,
  toRefs,
  onMounted,
} from "vue";
import {createMirrorApi,getConfigApi} from '../api'
import { includes } from "lodash";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import uploadImage from './uploadImage/index.vue'
interface ImageType{
    name:string,
    imageType:any,
    systemType:any,
    tag:any,
    desc:any,
}
interface Istate {
    image:ImageType,
    config:any
}
export default defineComponent({
  components: {uploadImage},
  setup() {
    const router = useRouter();
    var updata = inject("updataNav") as Function;
    const state:Istate=reactive({
      image:{
        name:'',
        imageType:'',
        systemType:undefined,
        tag:[],
        desc:'',
      },
      config:{},
    })
    updata({
      tabs: false,
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const methods={
        cancel(){
            router.push({
                path: "/teacher/Workbench",
                query: {
                currentTab:1,
                },
            });
        },
        onChange(e:any){
            console.log(e)
            console.log(state.image.tag)
        },
        create(){
            console.log(state.image.name)
            console.log(state.image.systemType)
            console.log(state.image.tag)
            console.log(state.image.desc)
            createMirrorApi({param:state.image}).then((res:any)=>{
                console.log(res)
            })
        },
        getConfig(){
            getConfigApi().then((res:any)=>{
            console.log(res)
            state.config=res.data
            })
        }
    }
    onMounted(() => {
         methods.getConfig()
    });
    return {...methods,...toRefs(state)};
  },
});
</script>

<style lang="less">
.create-image-box{
  width: 1000px;
  margin: 0 auto;
  height: 100%;
//   .uploadBtn{
//       display: flex;
//   }
//   .upload{
//       .ant-upload.ant-upload-drag .ant-upload-btn{
//           padding: 40px;
//       }
//   }
  .ant-input-desc{
      height: 115px; 
      min-height: 115px; 
      max-height: 136px; 
      overflow-y: hidden;
  }
  .form-bottom {
      width: 100%;
      margin-top: auto;
      text-align: center;
      > button {
        margin-right: 40px;
      }
    }
}
.create-img-middle{
    display: flex;
    justify-content:space-between;
    >div{
        width: 45%;
        .form-input{
            width:100%;
        }
    }
}

</style>
