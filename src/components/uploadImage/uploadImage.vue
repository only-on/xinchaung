<template>
    <div class="uploadImage">
        <a-radio-group v-model:value="value" @change="onChange">
          <div class="uploadImgdiv">
             <div class="uploadDiv">
                 <a-upload
                  accept=".jpg,.png,.image"
                  :show-upload-list='false'
                  :before-upload='beforeUpload'>
                  <div>
                     <img v-if="imgSrc" :src="imgSrc" alt="avatar" />
                    <div v-else>
                      <a-icon />
                      <div class="ant-upload-text">
                        Upload
                      </div>
                    </div>
              </div>
            </a-upload>
              </div>
            <div class="imgdiv" v-for="(item,index) in defaultImg" :key="index.toString()">
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
  value:any
}
import { message } from 'ant-design-vue'
import { defineComponent,reactive,toRefs} from 'vue'
import request from 'src/api/index'
export default defineComponent({
    name:'uploadImage',
    props:['trainId'],
    components:{},
    setup(props,context) {
      const http=(request as any).teacherExperimental
       const state:Istate=reactive({
          defaultImg:[
          {
            id: 0,
            src:`src/assets/images/teacher-default/cover1.png`,
          },
          {
            id: 1,
            // src: this.baseUrl + `img/default/d2.jpg`,
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
        value:''
       })
      const methods={
        onChange(e:any){
        console.log(e.target.value)
        },
        beforeUpload(file:any){
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
          if (!isJpgOrPng) {
            message.error('只能上传图片')
          }
          if(isJpgOrPng){
            const fd = new FormData()
            fd.append('upload_type','image')
            fd.append('train_id',props.trainId)
            fd.append('file', file)
            http.trainUploadImage({param:fd}).then((res: any) => {
            console.log(res)
            state.imgSrc = res.datas.url
        })
        .catch(() => {
          message.error('网络错误')
        })
          }
        }
      }
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
    border: 1px dashed @theme-color;
    border-radius: 4px;
  }
  .imgdiv{
    margin-top: 10px;
     position: relative;
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
    border-radius:4px;
  }
  .radio{
    position: absolute;
    left: 10px;
    top: 10px;
  }
}
</style>

