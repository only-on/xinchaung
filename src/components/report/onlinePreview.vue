<template>
  <div class="online-preview-report-wrap">
    <table style="width: 100%" v-if="content&&content.length>0">
      <template v-for="(item, index) in content" :key="index">
        <tr v-if="item.type == 'w1'" :class="item.type">
          <template v-for="(it,ind) in item.fields" :key="item.type + ind">
            <td :colspan="it.colspan" :name="it.name" :align="it.align">
              {{ it.value }}
            </td>
          </template>
        </tr>
        <tr v-if="['w2','w3'].includes(item.type)"  :class="item.type">
            <template v-for="(it,ind) in item.fields" :key="item.type + ind">
            <td :colspan="it.colspan" :name="it.name" :align="it.align">
              {{ it.value }}
            </td>
          </template>
        </tr>
        <template v-if="['w4'].includes(item.type)">
            <tr v-for="(it,ind) in item.fields"  :class="item.type" :key="item.type+ind">
                <td :colspan="4" :name="it.name" :align="it.align">
                  {{ it.value }}
                </td>
            </tr>
        </template>
        <tr v-if="['w5'].includes(item.type)"  :class="item.type">
            <template v-for="(it,ind) in item.fields" :key="item.type + ind">
            <td :colspan="ind==0?1:3" :name="it.name" :align="it.align">
              {{ it.value }}
            </td>
          </template>
        </tr>
        <template v-if="['w6'].includes(item.type)">
            <tr v-for="(it,ind) in item.fields"  :class="item.type" :key="item.type+ind">
                <td :colspan="4" :name="it.name" :align="it.align">
                  {{ it.value }}
                </td>
            </tr>
        </template>
        <tr v-if="['w7'].includes(item.type)"  :class="item.type">
            <template v-for="(it,ind) in item.fields" :key="item.type + ind">
            <td :colspan="ind==0?1:3" :name="it.name" :align="it.align">
              <template v-if="ind==0">
                {{ it.value }}
              </template>
              <template v-else>
                <markedEditor v-model="it.value" :preview="true"></markedEditor>
              </template>
            </td>
          </template>
        </tr>
        <template v-if="['w8'].includes(item.type)">
            <tr v-for="(it,ind) in item.fields"  :class="item.type+'-'+ind" :key="item.type+ind">
                <td :colspan="4" :name="it.name" :align="it.align">
                  <template v-if="ind==0">{{ it.value }}</template>
                  <template v-else>
                    <markedEditor v-model="it.value" :preview="true"></markedEditor>
                  </template>
                </td>
            </tr>
        </template>
      </template>
    </table>
    <Empty v-else></Empty>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref,defineProps } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue"
import Empty from "../Empty.vue";

const props=defineProps({
    content:{
        type:Array as any,
        defaule:[],
        require:true    
    }
})
</script>
<style lang="less" scoped>
.online-preview-report-wrap {
  table {
    border: 1px solid #a3a3a3;
    border-collapse: collapse;
    border-spacing: 0;
    tr{
        border: 1px solid #a3a3a3;
    }
    td{
    border: 1px solid #a3a3a3;
    padding: 15px;
    }
    .w1,.w2,.w3{
        height: 50px;
    }
    .w7{
        >td:nth-child(2){
            padding: 0;
            
            :deep(.mark__body .mark__preview){
                overflow: hidden;
            }
        }
    }
    .w8-1{
        td{
            padding: 0;
            :deep(.mark__body .mark__preview){
                overflow: hidden;
            }
        }
    }
  }
}
</style>
