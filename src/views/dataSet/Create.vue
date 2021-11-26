<template>
  <div v-layout-bg>
    <h2>新建</h2>
    <div class="create fixCenter">
      <a-form :model="ForumSearch" :label-col="{span:3 }" labelAlign="left" :wrapper-col="{span: 19}" :rules="rules" ref="formRef">
        <a-form-item label="试卷名称" name="name">
          <a-input v-model:value="ForumSearch.name" />
        </a-form-item>
        <a-form-item label="试卷描述" name="description">
          <a-textarea v-model:value="ForumSearch.description" />
        </a-form-item>
      </a-form>
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>
<script  lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref,computed} from 'vue'
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch.d';
import { useRouter ,useRoute } from 'vue-router';
import { Modal,message } from 'ant-design-vue';
import extStorage from "src/utils/extStorage";
import chinaToPy from 'src/utils/py'
const http=(request as any).dataSet
interface IForumSearch{
  name:string,
  description:string,
}
export default defineComponent({
  name: '',
  components: {
   
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    const uid=lStorage.get('user_id')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,showNav:true,backOff:false,showPageEdit:false})

    let formRef = ref()
    const ForumSearch:IForumSearch=reactive({
      name:'',
      description:'',
    })
    const rules={
        name: [
          { required: true, message: '请输入试卷名称', trigger: 'blur'},
        ],
        description: [{ required: true, message: '请输入试卷描述类型', trigger: 'blur' }],
    }
    onMounted(()=>{
     
      // init()
    })
    return {formRef,ForumSearch,rules}
  },
})
</script>
<style scoped lang="less">
.fix{
  display: flex;
  align-items: center;
}
.fixCenter{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.create{
  .left,.right{
    width: 48%;
  }
}
</style>
