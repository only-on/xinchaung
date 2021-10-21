<template>
    <div class="uploadImage">
        <a-radio-group v-model:value="value" @change="onChange" :disabled='edit'>
          <div class="uploadImgdiv">
             <div class="uploadDiv">
                <div v-if="imgSrc">
                  <div :class="value==='upload'?'imgdiv active':'imgdiv'">
                    <img class="imgHasUpload" :src="imgSrc"/>
                    <a-radio class="radio" value='upload'></a-radio>
                    <!-- :class='edit?"noevents delete":"delete"' -->
                    <span v-if="!edit" @click="deledeImg" class="iconfont icon-shanchu-copy"></span>
                   </div>
                </div>
                <div v-else>
                  <a-upload
                  accept=".jpg,.png,.image"
                  :disabled='edit'
                  :show-upload-list='false'
                  :before-upload='beforeUpload'>
                    <div class="upload-text">
                      <i class="iconfont icon-upload"></i>
                      <p class="ant-upload-hint">支持格式jpg、png</p>
                      <p class="size-limit">尺寸限制：525px*300px</p>
                    </div>
                </a-upload>
                </div>
              </div>
            <div :class="value===item.id?'imgdiv active':'imgdiv'" v-for="(item,index) in defaultImg" :key="index.toString()">
              <img :src='item.src'/>
            <a-radio class="radio" :value='item.id'></a-radio>
            </div>
          </div>
        </a-radio-group>
    </div>
</template>
<script lang="ts">
interface imgType{
  id:number,
  src:string,
}
interface Istate{
  defaultImg:imgType[],
  imgSrc:string,
  value:any,
  file:any
}
import { message, Upload } from 'ant-design-vue'
import { defineComponent,reactive,toRefs,onMounted, onBeforeMount,watch} from 'vue'
import request from 'src/api/index'
export default defineComponent({
    name:'uploadImage',
    props:['trainId','uploadUrl','edit'],
    components:{},
    setup(props,context) {
      const http=(request as any).teacherTrain
      let development=process.env.NODE_ENV == 'development' ? true : false;
      let baseurl=development?'http://192.168.101.150:85/':""
      const state:Istate=reactive({
          defaultImg:[
          {
            id: 0,
            src:`src/assets/images/teacher-default/cover1.png`,
          },
          {
            id: 1,
            src:`src/assets/images/teacher-default/cover2.png`,
          },
          {
            id: 2,
            src:`src/assets/images/teacher-default/cover3.png`,
          },
          {
            id: 3,
            src:`src/assets/images/teacher-default/cover4.png`,
          },
          {
            id: 4,
            src:`src/assets/images/teacher-default/cover5.png`,
          },
          {
            id: 5,
            src:`src/assets/images/teacher-default/cover6.png`,
          },
          {
            id: 6,
            src:`src/assets/images/teacher-default/cover7.png`,
          },
        ],
        imgSrc:'',
        value:'',
        file:''
       })
      const methods={
        onChange(e:any){
        console.log(e.target.value)
          if(e.target.value==='upload'){
            state.file=state.imgSrc
          }else{
            state.file=state.defaultImg[e.target.value].src
          }
          console.log(state.file)
          context.emit('img-src',state.file)
        },
        deledeImg(){
          state.imgSrc=''
          // context.emit('img-src','')
          console.log(state.imgSrc,'hh')
        },
        beforeUpload(file:any){
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
          if (!isJpgOrPng) {
            message.error('只能上传图片')
          }
          state.file=file
          if(isJpgOrPng){
            const fd = new FormData()
            fd.append('upload_type','image')
            fd.append('train_id',props.trainId)
            fd.append('file', state.file)
            http.trainUploadImage({param:fd}).then((res: any) => {
            state.value='upload'
            console.log(res)
            console.log(window.location.origin,'window.location.origin')
            state.imgSrc =baseurl+res.datas.url
            // state.imgSrc =res.datas.url
            context.emit('img-src',res.datas.url)
        })
        .catch(() => {
          message.error('网络错误')
        })
          }
          return false
        },
        pictureEcho(){
          state.imgSrc=''
          let flag:boolean=false
          let id:any=''
          state.defaultImg.forEach((item:any)=>{
            console.log(item.src,props.uploadUrl)
            if(item.src===props.uploadUrl){
              flag=true
              id=item.id
              }
           })
            if(flag){
              return state.value=id
            }else{
              state.imgSrc=baseurl+props.uploadUrl
              return state.value='upload'
            }
        }
      }
      watch(()=>props.uploadUrl,(val)=>{
        methods.pictureEcho()
      })
      onMounted(()=>{
        methods.pictureEcho()
        })
      return {...methods,...toRefs(state)}
    }
})
</script>
<style lang="less">
.uploadImgdiv{
  width:100%;
  display: flex;
  flex-wrap: wrap;
  // .uploadDiv:hover .delete{
  //     display:block;
  // }
  .uploadDiv{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 285px;
    height: 164px;
    border: 1px dashed @theme-color;
    border-radius: 4px;
    position: relative;
    // .delete{
    //   display: none;
    // }
    // .noevents{
    //   // pointer-events: none;
    //   cursor: no-drop;
    // }
    .icon-shanchu-copy{
      color:#ffcc33;
      font-size:20px;
      position: absolute;
      right: 10px;
      bottom:10px;
    }
    .upload-text{
      text-align: center;
      color:rgba(0, 0, 0, 0.45);
    }
  }
  .imgHasUpload{
    border-radius: 4px;
  }
  .imgHasUpload:hover{
    .uploadDiv .icon-shanchu-copy{
      display: block;
    }
  }
  .imgdiv{
    margin-top: 10px;
    position: relative;
    img{
      opacity: 1.5;
    }
  }
  .imgdiv::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    background-color: rgba(0,0,0,.5);
    transition: background-color .3s;
    border-radius: 4px;
  }
  .imgdiv.active::before {
    background-color: rgba(0,0,0,0);
  }
  .imgdiv:hover::before{
     background-color: rgba(0,0,0,0);
  }
  .imgdiv:nth-child(1){
    margin-top: 0px;
  }
  .uploadDiv{
    margin-top: 10px;
  }
  .imgdiv:nth-child(2n){
    margin-left: 10px;
  }
  img{
    width: 285px;
    height: 164px;
    border-radius:4px;
  }
  .radio{
    position: absolute;
    left: 10px;
    top: 10px;
    .ant-radio-inner{
      width: 20px;
      height: 20px;
  }
  .ant-radio-input{
      width: 16px;
      height: 16px;
  }
  /* 单选选中样式 */
  .ant-radio-checked .ant-radio-inner {
    background-color:#ffcc33;
    border: none;
  }
  .ant-radio-inner::after {
    content: '';
    width: 12px;
    height: 8px;
    border: 2px solid white;
    border-top: transparent;
    border-right: transparent;
    text-align: center;
    display: block;
    position: absolute;
    top: 4px;
    left: 4px;
    transform: rotate(-45deg);
    border-radius: 0px;
    background: none;
  }
  }
}
</style>

