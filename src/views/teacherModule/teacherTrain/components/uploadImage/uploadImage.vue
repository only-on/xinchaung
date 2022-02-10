<template>
    <div class="uploadImage">
        <a-radio-group v-model:value="value" @change="onChange" :disabled='edit'>
          <div :class="createOrEdit==='create'?'createuploadImgdiv':'uploadImgdiv'">
             <div class="uploadDiv">
                <div v-if="imgSrc">
                  <div :class="value==='upload'?'imgdiv active':'imgdiv'">
                    <img class="imgHasUpload" :src="imgSrc"/>
                    <a-radio class="radio" value='upload'></a-radio>
                    <!-- :class='edit?"noevents delete":"delete"' -->
                    <span v-if="!edit" @click.stop="deledeImg" class="iconfont icon-shanchu-copy"></span>
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
                      <!-- <p class="ant-upload-hint">支持格式jpg、png</p>
                      <p class="size-limit">尺寸限制：525px*300px</p> -->
                      <p class='ant-upload-hint'>上传图片</p>
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
import cover1 from 'src/assets/images/teacher-default/cover1.png'
import cover2 from 'src/assets/images/teacher-default/cover2.png'
import cover3 from 'src/assets/images/teacher-default/cover3.png'
import cover4 from 'src/assets/images/teacher-default/cover4.png'
import cover5 from 'src/assets/images/teacher-default/cover5.png'
export default defineComponent({
    name:'uploadImage',
    props:['trainId','uploadUrl','edit','createOrEdit'],
    components:{},
    setup(props,context) {
      const http=(request as any).teacherTrain
      let development=process.env.NODE_ENV == 'development' ? true : false;
      let baseurl=development?'http://192.168.101.130:85/':""
      const state:Istate=reactive({
          defaultImg:[
          {
            id: 0,
            src:cover1,
          },
          {
            id: 1,
            src:cover2,
          },
          {
            id: 2,
            src:cover3,
          },
          {
            id: 3,
            src:cover4,
          },
          {
            id: 4,
            src:cover5,
          }
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
          console.log('删除qqqqqq')
          state.imgSrc=''
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
            state.imgSrc =baseurl+res.datas.url
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
         if(props.uploadUrl){
          methods.pictureEcho()
        }
      },{
        deep:true,
        immediate:true
      })
      onMounted(()=>{
        })
      return {...methods,...toRefs(state)}
    }
})
</script>
<style lang="less" scoped>
.uploadImgdiv{
  width:100%;
  display: flex;
  flex-wrap: wrap;
  .uploadDiv{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 285px;
    height: 164px;
    border: 1px dashed var(--primary-color);
    border-radius: 4px;
    position: relative;
    .icon-shanchu-copy{
      color:#ffcc33;
      font-size:20px;
      position: absolute;
      right: 10px;
      bottom:10px;
      z-index: 200;
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
    right: 0px;
    top: 0px;
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
.createuploadImgdiv{
  width:100%;
  display: flex;
  flex-wrap: wrap;
  // background-color: aqua;
  .uploadDiv,.imgdiv{
    width: 32%;
    height: 85px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:10px;
    border-radius: 4px;
    position: relative;

  }
   .uploadDiv{
    border: 1px dashed var(--primary-color);
    >div{
      width: 100%;
      text-align: center;
    }
      .imgdiv{
        width: 100%;
        margin-top: 0px;
        border: none;
      }
      .imgHasUpload{
        width: 100%;
        height: 100%;
      }
      .icon-shanchu-copy{
      color:#ffcc33;
      font-size:14px;
      position: absolute;
      right:5px;
      bottom:5px;
      z-index: 1000;
    }
    .upload-text{
      text-align: center;
      color: var(--primary-color);;
    }
  }
  .imgdiv:nth-child(2){
    margin-left:10px;
  }
  .imgdiv:nth-child(3){
    margin-left:10px;
  }
   .imgdiv:nth-child(5){
    margin-left:10px;
  }
  .imgdiv:nth-child(6){
    margin-left:10px;
  }
  .imgdiv img{
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  .radio{
    position: absolute;
    right:0px;
    top:0px;
  }
}
</style>

