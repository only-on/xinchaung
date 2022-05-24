<template>
    <div class="personalization">
      <div class="name">
          <a-form layout='vertical'>
            <a-form-item label="系统名称" name='systemName' required>
            <a-input style="width:570px" v-model:value="systemName" placeholder="请在这里输入系统名称"/>
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
                action=""
                :show-upload-list="false"
                :beforeUpload="logUploadBefore"
                accept='.jpg,.png'
                @change="handleChange"
              >
                <div 
                class="login_logo_bg" 
                :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`"></div>
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
        <chooseStyle titleInfo='建议尺寸1920X268px' type='color' :data='colordata'></chooseStyle>
      </div> 
      <div class="loginScreen">
        <div class="tit">系统登录界面</div>
        <chooseStyle titleInfo='尺寸1920X1080px' type='img' :data='imgdata'></chooseStyle>
      </div>
      <div class="bottomBtn">
        <a-button type='primary' @click="handleSave">保存</a-button>
        <a-button type='primary' class="brightBtn">设置初始化</a-button>
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
    import loginImg1 from 'src/assets/images/admin/systemmain/login1.png'
    import loginImg2 from 'src/assets/images/admin/systemmain/login1.png'
    import loginImg3 from 'src/assets/images/admin/systemmain/login1.png'
    import chooseStyle from './chooseStyle/index.vue'
    const env = process.env.NODE_ENV == "development" ? true : false;
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
    const systemName:any=ref('')
    const colordata:any=ref(['#000000','#659BFE','#C665FE'])
    const imgdata:any=ref([loginImg1,loginImg2,loginImg3])
    const systemBaseInfo:any=reactive({
      login_logo:''
    })
    const fileList = ref<any>()
    function logUploadBefore(file:any){
      return new Promise((resolve, reject) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          // message.warn('支持格式为jpg、png!');
          return false
        }
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload= ()=>{
          const image=new Image()
          image.src= reader.result as string
          image.onload=()=>{
            let w=image.width
            let h=image.height
            if (w > 60 || h > 60) {
            //  message.warn('图片尺寸不能超过60*60px')
              return false
            } else {
              resolve(true);
            }
          }
        }
      })
    }
    function handleChange (info:any) {
      let fileArr = info.fileList
      if (info.file.status === 'done') {
        const { response } = info.file;
        if (response.code === 1) {
        }
        fileList.value = fileArr
      }
    }
    function handleSave () {
      document.getElementsByTagName('body')[0].style.setProperty('--theme-color', '#659bfe')
    }
</script>
<style lang="less" scoped>
.personalization{
  width:100%;
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
    .login_logo_bg{
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
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
      background: var(--black-65);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white-100);
    }
  }
</style>