<template>
   <div class="creat"  v-layout-bg>
      <div class="main">
        <div class="left">
          <a-form ref="formRef" :model="formState" :label-col="{span:6}" :wrapper-col="{span:24}" labelAlign="left" :rules="rules">
            <a-form-item label="实训名称"  name="name">
              <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item label="课时"  name="train_time">
              <a-input v-model:value="formState.train_time" />
            </a-form-item>
            <a-form-item label="开始时间-结束时间" required name="start_time" class="selectDate">
              <!-- <a-range-picker v-model:value="formState.start_time" /> -->
              <a-date-picker placeholder="开始日期" v-model:value="formState.start_time" :format="dateFormat" />
              <a-date-picker placeholder="结束日期" v-model:value="formState.start_time" :format="dateFormat" />
            </a-form-item>
            <a-form-item label="实训课件"  name="courseware">
              <div class="accept">(允许上传ppt,pptx,pdf文件类型)</div>
              <a-upload
                  v-model:file-list="formState.courseware"
                  name="file"
                  :before-upload="BeforeUpload"
                  accept=".ppt,.pptx,.pdf"
                >
                <a-button class="courseware">
                  <upload-outlined></upload-outlined>
                  选择文件
                </a-button>
              </a-upload>
            </a-form-item>
            <a-form-item label="实训指导书"  name="guide" class="guide">
                <a-textarea v-model:value="formState.guide" />
            </a-form-item>
          </a-form>
        </div>
        <div class="right">
          <div class="title">实训封面</div>
          <div class="fileList">
            <div class="defaitem" v-if="defaultImg.length===7">
              <a-upload-dragger
                name="file"
                :multiple="true"
              >
                <p class="ant-upload-drag-icon">
                  <!-- <plus-outlined /> -->
                  <i class="iconfont icon-upload"></i>
                </p>
                <!-- <p class="ant-upload-text">点击上传</p> -->
                <p class="ant-upload-hint">
                支持格式jpg、png
                </p>
              </a-upload-dragger>
            </div>
            <div class="item" :class="activeCover===v?'active':''" v-for="(v,k) in defaultImg" :key="v" :style="`background-image:${v}`" @click="selectCover(v)">
              <img :src="v" />
              <div class="remove" v-if="defaultImg.length===7 && k===0">
                <i class="iconfont icon-shanchu-copy"></i>
              </div>
              <div class="iradio_square-yellow">
                <i class="icon-duihao iconfont"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="train_id">
          <div class="header">
            <div class="title">实训环境</div>
            <div class="count">已选总内存：<span>{{memory}}</span>G</div>
          </div>
          <div class="selectedEnvironment">
            <div class="item" v-for="v in selectImgList" :key="v">
              <div class="title">{{v.image.name}}</div>
              <div class="info">
                <span class="evn">内存：{{v.config.ram/1024}}GB</span>
                <span class="evn">CPU：{{v.config.cpu}}核</span>
                <span class="evn disk">
                  <span>硬盘：{{v.config.disk}}GB</span>
                  <i class="icon-shanchu iconfont" @click="delateSelectImgList(v)"></i>
                </span>
              </div>
            </div>
            <div class="add" @click="showVisible">
              <i class="icon-tianjia iconfont"></i>
              <span class="">选择环境</span>
            </div>
          </div>
        </div>
      <div class="foot">
        <a-button type="primary" @click.prevent="onSubmit"> 取 消 </a-button>
        <a-button type="primary" @click.prevent="onSubmit"> 下一步 </a-button>
      </div>
  </div>
  <a-modal v-model:visible="visible" title="设置环境" @ok="handleReply" :width="800">
      <div class="mainModel">
        <div class="tags">
          <span>类型：</span>
          <span :class="ForumSearch.types===''?'active':''" @click="selectType('')">全部</span>
          <span :class="ForumSearch.types==='1'?'active':''"  @click="selectType('1')">Windows</span>
          <span :class="ForumSearch.types==='2'?'active':''"  @click="selectType('2')">Linux</span>
        </div>
        <div class="item custom_input">
          <a-input-search v-model:value="ForumSearch.name" placeholder="请输入关键字查询" @search="search" />
        </div>
        <div class="imglist">
          <div class="img-item" v-for="v in image_list" :key="v">
            <span>{{v.image.name}}</span>
            <span>标签：
              <span>{{v.image.tag.join('/')}}</span>
            </span>
            <span class="iconfont" :class="selectImgId.includes(v.id)?'icon-shanchu':''" @click="selectImg(v)">{{selectImgId.includes(v.id)?'':'选择'}}</span>
          </div>
          <Empty v-if="!image_list.length" />
        </div>
        <a-pagination v-if="image_list.length"
          show-size-changer
          v-model:current="ForumSearch.page"
          v-model:pageSize="ForumSearch.limit"
          :total="totalCount"
          @change="pageChange"
          @showSizeChange="onShowSizeChange"
        />
      </div>
      <!-- <template #footer>
        <a-button @click="handleReply" type="primary">提交</a-button>
      </template> -->
    </a-modal>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
// import {PlusOutlined  } from '@ant-design/icons-vue';
import cover1 from 'src/assets/images/teacher-default/cover1.png'
import cover2 from 'src/assets/images/teacher-default/cover2.png'
import cover3 from 'src/assets/images/teacher-default/cover3.png'
import cover4 from 'src/assets/images/teacher-default/cover4.png'
import cover5 from 'src/assets/images/teacher-default/cover5.png'
import cover6 from 'src/assets/images/teacher-default/cover6.png'
import cover7 from 'src/assets/images/teacher-default/cover7.png'
const http=(request as any).teacherTrain
interface form{
  name:string;
  train_time:string;
  start_time:string;
  end_time:string;
  url:string;
  guide:string;
  courseware:string;
  train_id:number | ''
}
interface IforumSearch{
  withs:string;
  name:string,
  types:string | '' ,
  limit:number,
  page:number
}
interface Istate{
  totalCount:number;
  ForumSearch:IforumSearch;
  visible:boolean;
  image_list:any[];
  selected:any[];
  selectImgList:any[];
  selectImgId:any[];
  activeCover:string;
  defaultImg:any[],
  formRef:any,
  formState:form,
  rules:any,
  onSubmit: () => void;
  BeforeUpload: () => void;
  options:any;
  selectCover:(val:any) => void;
  handleReply: () => void;
  showVisible: () => void;
  search: () => void;
  selectType:(val?:any) => void;
  selectImg:(val:any) => void;
  delateSelectImgList:(val:any) => void;
  onShowSizeChange:(cur?:any,page?:any) => void;
  pageChange:(cur?:any,page?:any) => void;
}
export default defineComponent({
  name: 'CreatePosts',
  components: {
  //  PlusOutlined
  },
  setup: (props,{emit}) => {
    const dateFormat = 'YYYY/MM/DD';
    const router = useRouter();
    const route = useRoute();
    const {editId}= route.query
    const options = {
      placeholder: "输入内容...",
      theme: "snow",
    };
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})

    const memory =computed(()=>{
      let sum=0
      state.selectImgList.forEach((v:any)=>{
        sum+=Number(v.config.ram/1024)
      })
      return sum
    })
    const state:Istate=reactive({
      ForumSearch:{
        withs:'image.config,image.classify',
        name:'',
        limit:10,
        page:1,
        types:''
      },
      totalCount:0,
      visible:false,
      image_list:[],
      selected:[],
      selectImgList:[],
      selectImgId:[],
      activeCover:'',
      defaultImg:[cover1,cover2,cover3,cover4,cover5,cover6,cover7],
      formRef:'formRef',
      formState:{
        name:'',
        train_time:'2',
        start_time:'',
        end_time:'',
        url:'',
        guide:'',
        courseware:'',
        train_id:''
      },
      rules:{
        name: [{ required: true, message: '请输入实训名称', trigger: 'blur'},],
        train_time: [{ required: true, message: '请输入课时', trigger: 'blur' },{ min: 1, max: 16, message: '课时1-16', trigger: 'blur'},],
        content: [{ required: true, message: '请输入帖子内容', trigger: 'blur' }],
      },
      options:{
        placeholder: "输入内容...",
        theme: "snow",
      },
      BeforeUpload:()=>{
        http.trainUpload({param:{id:editId}}).then((res:IBusinessResp)=>{
            
        })
      },
      onSubmit:()=>{
        state.formRef.validate().then(() => {
            console.log('验证过');
            let obj={
              ...state.formState,
              // content:JSON.stringify(state.formState.content)
            }
            http.createForum({param:{forum:{...obj}}}).then((res:IBusinessResp)=>{
              message.success(editId?'修改成功':'发布成功')
                router.go(-1)
            })
        })
      },
      selectCover:(val:any)=>{
        state.activeCover=val===state.activeCover?'':val
        // state.activeCover=val
      },
      selectImg:(val:any)=>{
        let num=state.selectImgId.indexOf(val.id)
        if(num!==-1){
          state.selectImgId.splice(num,1)
          state.selected.splice(num,1)
        }else{
          state.selectImgId.push(val.id)
          state.selected.push(val)
        }
      },
      delateSelectImgList:(val:any)=>{
        let num=state.selectImgId.indexOf(val.id)
        state.selectImgId.splice(num,1)
        state.selected.splice(num,1)
        state.selectImgList.splice(num,1)
      },
      handleReply:()=>{
        if(state.selectImgId.length){
          state.selectImgList.length=0
          state.selectImgList.push(...state.selected)
          state.visible=false
        }else{
          message.warn('请选择环境')
        }
        
      },
      showVisible:()=>{
        http.ImageList({param:{...state.ForumSearch}}).then((res:IBusinessResp)=>{
          state.visible=true
          state.image_list=res.data.list
          state.totalCount=res.data.page.totalCount
        })
      },
      search:()=>{
        if(state.ForumSearch.name===''){
          return
        }
        getList()
      },
      selectType:(val:any)=>{
        state.ForumSearch.types=val
       getList()
      },
      onShowSizeChange:(current:any,pageSize:any)=>{
        // console.log(current, pageSize);
        state.ForumSearch.limit=pageSize
        getList()
      },
      pageChange:(current:any,pageSize:any)=>{
        // console.log(current, pageSize);
        state.ForumSearch.page=current
        getList()
      }
    })
    function getList(){
      http.ImageList({param:{...state.ForumSearch}}).then((res:IBusinessResp)=>{
          state.image_list=res.data.list
          state.totalCount=res.data.page.totalCount
        })
    }
    onMounted(()=>{
     
    })
    return { ...toRefs(state),dateFormat,memory};
  },
})
</script>

<style scoped lang="less">
.creat{
  .main{
    display: flex;
    justify-content: space-between;
    .left,.right{
      width: 48%;
    }
  }
}
.accept{
  color: #F44336;
  font-size: 14px;
}
.selectDate{
  :deep(.ant-form-item-control-input-content){
    display: flex;
    justify-content: space-between;
  }
}
.guide{
  textarea{
    min-height: 200px;
  }
}
.courseware{
  color: #fff;
    background: #8955b5;
}
:deep(.ant-form-item-control){
    flex: 0 0 100%;
  }
.train_id{
  .selectedEnvironment{
    display: flex;
    .item{
      width: 15%;
      // height: 128px;
      display: flex;
      flex-direction: column;
      margin-right: 13px;
      .title{
         border-top-left-radius: 5px;
      border-top-right-radius: 5px;
        color: #fff;
        padding: 3px 10px;
        height: 25px;
        background: @theme-color;
      }
      .info{
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding:7px;
        border: 1px solid #D5D5D5;
        display: flex;
        flex-direction: column;
        .evn{
          padding: 3px 0;
          color: #333;
        }
        .disk{
          display: flex;
          justify-content: space-between;
          i{
            cursor: pointer;
          }
        }
      }
    }
    .add{
      border-radius: 5px;
      width: 15%;
      height: 128px;
      display: flex;
      flex-direction: column;
      border: 1px dashed @theme-color;
      color: @theme-color;
      text-align: center;
      cursor: pointer;
      justify-content: center;
      span{
        padding: 6px 0;
      }
    }
  }
  .header{
    display: flex;
    align-items: center;
    .title::before{
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 16px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
    .count{
      margin-left: 20px;
      color: #FDA600;
      span{
        font-size: 20px;
      }
    }
  }
}
.right{
  padding: 0 15px;
  .title{
    padding-bottom: 15px;
  }
  .fileList{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item,.defaitem{
      width: 48%;
      height: 164px;
      cursor: pointer;
    }
    .defaitem{
      :deep(.ant-upload-drag){
        border: 1px dashed @theme-color;
      }
      :deep(.ant-upload-drag:hover){
        border: 1px dashed @theme-color;
      }
      .icon-upload{
        color:@theme-color ;
      }
    }
    .item{
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;
      position: relative;
      border-radius: 5px;
      &::before{
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        background-color: rgba(0,0,0,.5);
        transition: background-color .3s;
      }
      &:hover{
        &::before{
          background-color: transparent;
        }
      }
      .iradio_square-yellow{
        position: absolute;
        right: 5px;
        top: 5px;
        z-index: 1;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid #fff;
        text-align: center;
        line-height: 21px;
        opacity: .6;
        i{
          color: #fff;
          font-size: 20px;
          margin-left: -1px;
          opacity: 0;
        }
      }
      .remove{
        position: absolute;
        right: 6px;
        bottom: 2px;
        z-index: 1;
        i{
          color: #ffcc33;
          font-size: 20px;
        }
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
    .active{
      &::before{
        background-color: transparent;
      }
      .iradio_square-yellow{
        border: 0;
        background-color: #ffcc33;
        opacity: 1;
        i{
           opacity: 1;
          color: #fff;
        }
      }
    }
  }
}
  .foot{
    margin: 50px 0;
    width: 100%;
    text-align: center;
    .ant-btn{
      margin: 0 30px;
    }
  }
.mainModel{
  height: 600px;
  overflow: hidden;
  .tags{
    display: flex;
    flex-wrap: wrap;
    min-height: 30px;
    line-height: 30px;
    // flex-shrink: 0;
    span{
      padding: 0 20px;
      color: #000;
      font-size: 14px;
      cursor: pointer;
    }
    span:first-child{
      padding: 2px 0;
      cursor: auto;
    }
    .active{
      background: @theme-color;
      color: #fff;
      border-radius: 4px;
    }
  }
  :deep(.ant-input){
      padding-left: 20px;
  }
  .custom_input{
    margin: 27px 0;
    width: 50%;
    position: relative;
    &::before{
        content: '';
        position: absolute;
        left:8px;
        top:10px;
        background: url(src/assets/images/screenicon/Group6.png) no-repeat;
        width: 16px;
        height: 16px;
        z-index: 10;
    }
  }
  .ant-pagination{
    text-align: center;
  }
  .imglist{
    height: calc(100% - 157px);
    overflow: auto;
    padding-right: 15px;
    .img-item{
      padding: 10px 16px;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 6px;
      display: flex;
      margin-bottom: 16px;
      font-size: 14px;
      >span:nth-child(1){
        width: 60%;
        color: #050101;
      }
      >span:nth-child(2){
        width: 40%;
        color: rgba(5,1,1,.45);
        font-size: 12px;
      }
      >span:nth-child(3){
        width: 50px;
        flex-shrink: 0;
        text-align: center;
        color: @theme-color;
      }
    }
    .img-item:hover{
      background: #fdfaff;
      border: 1px solid @theme-color;
      border-radius: 6px;
      box-shadow: 0 3px 6px 0 rgb(187 156 214 / 40%);
      cursor: pointer;
    }
  }
}  
</style>
