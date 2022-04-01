<template>
  <div>
    <a-drawer
    :title="props.docOrMp4Type === 1 ? '选择文档' : '选择视频'"
    class="select-docOrMp4-drawer"
    :destroyOnClose="true"
    :closable="true"
    placement="right"
    :visible="docOrMp4Drawer.visible"
    width="640"
    @close="closeDrawerDoc"
  >
  <SourceMaterial
    :activeFile="docOrMp4Drawer.activeFile"
    :tags="props.docOrMp4Type === 1?'实验文档':'视频'"
    @selectSourceMaterialFile="selectSourceMaterialFile"
  />
  </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import {
  Ref,
  ref,
  onMounted,
  reactive,
  defineProps,
  withDefaults,
  watch
} from "vue";

import iconList from "src/utils/iconList";
import { bytesToSize } from "src/utils/common"
import { SelectTypes } from "ant-design-vue/es/select";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import SourceMaterial from './SourceMaterial.vue'
const http = (request as any).teacherMaterialResource;
// 采用ts专有声明，有默认值
interface Props {
  docOrMp4Type: number;
  visible: boolean;
  activeFile:any
}
const props = withDefaults(defineProps<Props>(), {
  docOrMp4Type:1,
  visible:false,
  activeFile: () => {},
});
const emit = defineEmits<{
  (e: "selectDocOrMp4File", val: any): void;
  (e: "closeDrawerDoc"): void;
}>();
const docOrMp4Drawer: any = reactive({
  visible: false,
  activeFile: {}, //  选择或上传的文档、视频
});

watch(()=>{return props.visible},(val:boolean)=>{
  docOrMp4Drawer.visible=props.visible
  // console.log(val)
},{immediate:true})

docOrMp4Drawer.activeFile={ ...props.activeFile}

const closeDrawerDoc = () => {
  emit("closeDrawerDoc");
};
const selectSourceMaterialFile=(val:any)=>{
  console.log(val)
  emit("selectDocOrMp4File", val);
}
</script>
<style scoped lang="less">
.select-docOrMp4-drawer {
  .search {
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
    .item {
      width: 260px;
    }
  }
  .dataList {
    height: calc(100% - 175px);
    overflow: auto;
    .list {
      // padding: 0 20px;
      min-height: 500px;
      .item {
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 10px;
        margin-bottom: 20px;
        padding: 6px;
        .itemInfo{
          // height: 64px;
          justify-content: space-between;
          .left {
            // width: 55%;
            .docBg{
              width: 94px;
              height: 50px;
              // background: rgba(0,0,0,0.00);
              background-image: url('src/assets/images/teacherExperimentResourcePool/base_info_bg.png');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              border-radius: 6px;
              // margin-left: 6px;
            }
            .info{
              padding-left: 1rem;
              
            }
          }
          .right {
            width: 60px;
            justify-content: center;
          }
          .quName {
            // word-break: break-all;
            max-width: 400px;
            color: var(--black-85);
            margin-bottom: 6px;
          }
          .information{
            // height: 30px;
            .text{
              color: var(--black-45);
              font-size: var(--font-size-sm);
            }
            .portrait{
              line-height: 22px;
              .imgBox{
                width: 100px;
              }
              .img{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                // src/assets/images/admin/home/env3.png
                background-image: url('src/assets/images/admin/home/env3.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                margin-right: 6px;
              }
              .tags{
                span{
                  color: var(--primary-color);
                  font-size: var(--font-size-sm);
                }
              }
            }
            .numSize{
              display: none;
              // opacity: 0;
              .text{
                display: inline-block;
                margin-right: 2rem;
                span{
                  margin-right: 4px;
                }
              }
            }
          }
        }
        .openInformation{
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px dashed rgba(112,112,112,0.15);
        }
        .fileList{
          .fileItem{
            height: 40px;
            background: rgba(0,0,0,0.04);
            margin-bottom: 20px;
            color:#808080 ;
            .fileLeft{
              // width: 50%;
              .single_ellipsis{
                width: 240px;
              }
            }
            .fileRight{
              justify-content: space-between;
              flex: 1;
            }
            .select{
              width: 60px;
              text-align: center;
              cursor: pointer;
              color: var(--primary-color);
              // justify-content: center;
            }
          }
          .fileItem:hover{
            background: rgb(255, 238, 217,.24);
          }
          .activeFileItem{
            background: #fffbf6;
            border: 1px solid #ffcaa1;
          }
        }
        .openFile{
          // margin: 1rem 0;
        }
        .fileIcon {
          width: 20px;
          height: 24px;
          background-size: 100%;
          margin: 0  1rem;
        }
        .iconfont {
          color: var(--primary-color);
          display: none;
          // font-size: 20px;
          // cursor: pointer;
          // padding: 0 12px;
        }
        .iconFontDis{
          color: var(--black-45);
          cursor: no-drop;
        }
      }
      .item:hover {
        // background: #fffbf6;
        cursor: pointer;
        box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16); 
        .tags{
          display: none;
        }
        .itemInfo .information .numSize{
          display: block;
          // display: flex;
          // opacity: 1;
        }
        .iconfont{
          display: block;
        }
      }
      .active {
        background: #fffbf6;
        border: 1px solid #ffcaa1;
      }
    }
  }
}
.ant-pagination {
  text-align: center;
}
</style>
