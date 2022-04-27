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
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader login-logo"
                :show-upload-list="false"
                :beforeUpload="logUploadBefore"
                accept='.jpg,.png'
              >
                <div 
                class="login_logo_bg" 
                :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`"></div>
                <div>
                  <span class="icon-huigun iconfont"></span>
                </div>
              </a-upload>
          </div>
          <div class="logo-size">60x60px</div>
          <div class="logo-hint">支持小于10k的png文件</div>
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
        <a-button type='primary'>保存</a-button>
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
    function logUploadBefore(){

    }
    function iconUploadBefore(){

    }
</script>
<style lang="less" scoped>
.personalization{
  width:100%;
}
  .upload-logo-box {
          .logo-size{
            color: rgba(0, 0, 0, 0.25);
          }
          .logo-hint {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.25);
            width: 140px;
            border-top: 1px dashed rgba(0, 0, 0, 0.25);
            margin-top: 10px;
            padding-top: 10px;
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
       }
</style>