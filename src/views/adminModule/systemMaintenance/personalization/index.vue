<template>
    <div class="personalization">
      <div class="name">
          <a-form layout='vertical' :model="systemInfo" ref="formRef">
            <a-form-item label="系统名称" name='site_name' :rules="rules">
            <a-input style="width:570px" v-model:value="systemInfo.site_name" :disabled="!isEdit" placeholder="请在这里输入系统名称"/>
          </a-form-item>
          </a-form>
      </div>
      <div class="logo">
        <div>LOGO</div>
        <div class="upload-logo-box">
          <div class="upload-logo">
              <a-upload
                v-model:file-list="fileList"
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader login-logo"
                action="/api/instance/uploads/file"
                :disabled="!isEdit"
                :show-upload-list="false"
                :beforeUpload="logUploadBefore"
                accept='.png'
                @change="handleChange"
              >
                <img :src="systemInfo.logo_url" alt="">
                <div class="mask">
                  <span class="icon-zhongzhi iconfont"></span>
                </div>
              </a-upload>
          </div>
          <div class="logo-size">60x60px</div>
          <div class="logo-hint">支持小于20K的png文件</div>
        </div>
      </div>
      <div class="themeStyle">
        <div class="tit">主题风格</div>
        <chooseStyle titleInfo='系统主题色' type='color' v-model:checkVal="systemInfo.theme" :data='themeData.color' :disabled="!isEdit"></chooseStyle>
      </div> 
      <div class="loginScreen">
        <div class="tit">系统登录界面</div>
        <chooseStyle titleInfo='尺寸1920X1080px' type='img' v-model:checkVal="systemInfo.theme" :data='themeData.img' :disabled="!isEdit"></chooseStyle>
      </div>
      <div class="bottomBtn">
        <a-button type='primary' @click="handleSave">{{isEdit ? '保存' : '编辑'}}</a-button>
        <a-button type='primary' class="brightBtn" :disabled="!isEdit" @click="handleInit">设置初始化</a-button>
      </div>
    </div>
</template>
<script lang="ts" setup>
  import {
    defineComponent,
    ref,
    onMounted,
    reactive,
    inject
  } from "vue";
  import chooseStyle from './chooseStyle/index.vue'
  import { message } from "ant-design-vue";
  import {useStore} from "vuex"
  import request from "src/api/index";
  import { IBusinessResp } from "src/typings/fetch";
  import {loginStyleList,themeColorList} from 'src/utils/theme'
  import {sStorage} from "src/utils/extStorage";
  import {cloneDeep} from 'lodash'
  const http = (request as any).systemMaintenance;
  const store = useStore()
  const formRef = ref<any>()
  const isEdit = ref<boolean>(false)
  var configuration: any = inject("configuration");
  var updata = inject("updataNav") as Function;
  updata({
    tabs: [
      { name: "个性化设置", componenttype: 0 }
    ],
    showContent: true,
    componenttype: undefined,
    showNav:true,
  });
  
  const rules = [
    { required: true, message: `请输入系统名称`, trigger: "blur" },
    { max: 20, message: `名称最多20个字符`, trigger: "blur" },
  ]
  const themeData = reactive<any>({
    img: loginStyleList,
    color: themeColorList
  })
  const systemInfo:any=reactive({
    logo_url:'',
    site_name: '',
    theme: '',
    login: ''
  })
  const fileList = ref<any>([])
  function logUploadBefore(file:any){
    console.log(file)
    return new Promise((resolve, reject) => {
      const isPng = file.type === 'image/png';
      if (!isPng) {
        message.warn('支持格式为png!');
        reject(false)
      }
      resolve(true)
      // if (file.size / 1024 > 20) {
      //   message.warn('文件大小超过20K!');
      //   reject(false)
      // }
      let reader = new FileReader()
      reader.readAsDataURL(file)
      // reader.onload= ()=>{
      //   const image=new Image()
      //   image.src= reader.result as string
      //   image.onload=()=>{
      //     let w=image.width
      //     let h=image.height
      //     if (w > 60 || h > 60) {
      //       message.warn('图片尺寸不能超过60*60px')
      //       reject(false)
      //     } else {
      //       resolve(true);
      //     }
      //   }
      // }
    })
  }
  function handleChange (info:any) {
    let fileArr = info.fileList
    if (info.file.status === 'done') {
      const { response } = info.file;
      if (response.code === 1) {
        systemInfo.logo_url = response.data.url
      }
      fileList.value = fileArr
    }
  }
  function changeStyle (type:string, value: number) {
    console.log(type, value)
    systemInfo[type === 'color' ? 'theme' : 'login'] = value
  }
  // 保存
  function handleSave () {
    if (!isEdit.value) {
      isEdit.value = !isEdit.value
      return
    }
    formRef.value.validate().then(()=>{
      systemInfo.login = systemInfo.theme
      http.systemPersonalSet({param: systemInfo}).then((res:IBusinessResp) => {
        message.success('保存成功')
        isEdit.value = false
        setStyle()
      })
    })
  }
  // 设置初始化
  function handleInit () {
    http.systemPersonalShow().then((res:IBusinessResp) => {
      if (isEdit.value) {
        isEdit.value = false
        message.success('初始化成功')
      }
      Object.assign(systemInfo, res.data)
      setStyle()
    })
  }
  function setStyle () {
    store.commit('setSystemInfo', cloneDeep(systemInfo))
  }
  onMounted(()=>{
    handleInit()
  })
</script>
<style lang="less" scoped>
.personalization{
  width:100%;
  padding: 30px 60px;
  background: var(--white-100);
}
  .upload-logo-box {
    margin-top: 20px;
    .logo-size{
      font-size: 12px;
      color: #808294;
      padding: 5px 10px 10px;
    }
    .logo-hint {
      font-size: 12px;
      color: #808294;
      width: 240px;
      border-top: 1px dashed rgba(0, 0, 0, 0.25);
      padding-top: 6px;
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
  .tit{
      font-size: 16px;
    }
  .themeStyle{
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .bottomBtn{
    width: 100%;
    display: flex;
    margin-top: 40px;
    justify-content:center;
  }
  .brightBtn{
    margin-left: 10px;
  }
  :deep(.ant-upload.ant-upload-select-picture-card){
    width: 60px;
    height: 60px;
    margin-right: 0px;
    margin-bottom: 0px;
    border-radius: 4px;
    position: relative;
    .mask{
      position: absolute;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      background: rgba(5,1,1,0.50);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white-100);
    }
  }
</style>