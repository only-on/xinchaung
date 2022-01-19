<template>
  <div v-layout-bg class="create-image-box">
        <a-form layout="vertical" ref="formRef" :model="image"  :rules="rules">
            <a-form-item label="镜像文件" required>
                <upload-image @upload-imageinfo='uploadImageinfo'></upload-image>
                <!-- action="/api/instance/uploads/file"
                resumeAction='/api/instance/uploads/chunk' 
                deleteAction="/api/instance/uploads/delete"
                mergedAction="/api/instance/uploads/merge" -->
            </a-form-item>
            <div class='create-img-middle'>
                <div>
                    <a-form-item label="镜像名称" name="name">
                        <a-input class="form-input" v-model:value="image.name"></a-input>
                    </a-form-item>
                     <a-form-item label="镜像类型" required>
                        <a-input class="form-input" disabled v-model:value="image.imageType"></a-input>     
                    </a-form-item>
                </div>
                <div>
                    <a-form-item label="系统类型" name="classify_id">
                        <a-select class="form-input" v-model:value="image.classify_id" placeholder='请选择系统类型'>
                            <a-select-option :value="Number(index)" v-for="(item,index) in config.image_classify" :key="index.toString()">
                              {{item}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="镜像标签" name="tag">
                        <a-checkbox-group v-model:value="image.tag" @change="onChange">
                            <a-checkbox  v-for="(item,index) in config.tags" :key="index.toString()" :value='Number(index)'>{{item}}</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                </div>
            </div>
            <a-form-item label="镜像描述">
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
import uploadImage from './uploadImage.vue'
interface ImageType{
    name:string,
    imageType:any,
    classify_id:any,
    tag:any,
    desc:any,
    fileName:any,
    fileSize:any,
}
interface Istate {
    image:ImageType,
    config:any,
    formRef:any,
}
export default defineComponent({
  components: {uploadImage},
  setup() {
    const router = useRouter();
    var updata = inject("updataNav") as Function;
    const rules={
            name: [{ required: true, message: '请输入镜像名称'}],
            classify_id: [{ required: true, message: '请选择系统类型'}],
            tag:[{required: true, message: '请选择镜像标签'}],
            }
    const state:Istate=reactive({
      formRef:'formRef',
      image:{
        name:'',
        imageType:'',
        classify_id:undefined,
        tag:[],
        desc:'',
        fileSize:'',
        fileName:'',
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
        uploadImageinfo(name:any,size:any,url:any){
            state.image.fileName=name
            state.image.fileSize=size
            state.image.imageType=state.image.fileName.split('.')[state.image.fileName.split('.').length-1]
            state.image.classify_id=state.image.imageType==='qcow2'?2:1
        },
        onChange(tag:any){
            if(tag[tag.length-1]===1){
                const index=tag.indexOf(2)
                if(index!==-1){
                    tag.splice(index,1)
                }    
            }else if(tag[tag.length-1]===2){
                const index=tag.indexOf(1)
                if(index!==-1){
                    tag.splice(index,1)
                } 
            }
        },
        cancel(){
            router.push({
                path: "/teacher/Workbench",
                query: {
                currentTab:1,
                },
            });
        },
        create(){
                state.formRef.validate().then(() => {
                     const parmas= {
                        name:state.image.name,
                        file_path:"/www/tusd/uploads/"+state.image.fileName,
                        file_size:state.image.fileSize,
                        classify_id:state.image.classify_id,
                        tag:state.image.tag,
                        description:state.image.desc,
                        ssh_user:" ",
                        ssh_pass:" ",
                        is_use_gpu:state.image.tag.indexOf(3)!==-1?1:0,
                    }
                    createMirrorApi(parmas).then((res:any)=>{
                        methods.cancel()
                    })
                })
        },
        getConfig(){
            getConfigApi().then((res:any)=>{
            state.config=res.data
            })
        }
    }
    onMounted(() => {
         methods.getConfig()
    });
    return {...methods,...toRefs(state),rules};
  },
});
</script>

<style lang="less">
.create-image-box{
  width: 1000px;
  margin: 0 auto;
  height: 100%;
  font-size: 14px;
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
        margin-right: 16px;
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
