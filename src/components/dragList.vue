<template>
<!-- *************1**************** -->
  <!-- <draggable
    :list="dragList"
    :disabled="!enabled"
    item-key="name"
    class="list-group"
    ghost-class="ghost"
    :move="checkMove"
    @start="dragging = true"
    @end="dragging = false"
  >
    <template #item="{ element }">
      <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
        {{ element.name }}
      </div>
    </template>
  </draggable> -->

<!-- *************2**************** -->
  <draggable
    class="list-group"
    item-key="order"
    tag="transition-group"
    :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
    v-model="dragList"
    v-bind="dragOptions"
    @start="dragging = true"
    @end="dragging = false"
  >
    <template #item="{ element }">
      <li class="list-group-item">
        <i
          :class="
            element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
          "
          @click="element.fixed = !element.fixed"
          aria-hidden="true"
        ></i>
        {{ element.name }}
      </li>
    </template>
  </draggable>
  
<!-- *************3**************** -->
  <!-- <draggable
    class="list-group"
    tag="transition-group"
    :component-data="{
      tag: 'ul',
      type: 'transition-group',
      name: !dragging ? 'flip-list' : null
    }"
    v-model="dragList"
    v-bind="dragOptions"
    @start="dragging = true"
    @end="dragging = false"
    item-key="order"
  >
    <template #item="{ element }">
      <li class="list-group-item">
        <i
          :class="
            element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
          "
          @click="element.fixed = !element.fixed"
          aria-hidden="true"
        ></i>
        {{ element.name }}
      </li>
    </template>
  </draggable> -->
  <pre>{{dragList}}</pre>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import draggable from "vuedraggable";
const dragList = reactive([
  {
    "name": "draggable",
    "order": 2,
    "fixed": false
  },
  {
    "name": "component",
    "order": 3,
    "fixed": false
  },
  {
    "name": "for",
    "order": 4,
    "fixed": false
  },
  {
    "name": "vue.js 2.0",
    "order": 5,
    "fixed": false
  },
  {
    "name": "based",
    "order": 6,
    "fixed": false
  },
  {
    "name": "on",
    "order": 7,
    "fixed": false
  },
  {
    "name": "Sortablejs",
    "order": 8,
    "fixed": false
  },
  {
    "name": "vue.draggable",
    "order": 1,
    "fixed": false
  }
])
const dragOptions = {
  animation: 0,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}
const enabled = ref(true)
const dragging = ref(false)

function checkMove (e: any) {
  window.console.log("Future index: " + e.draggedContext.futureIndex);
}
</script>
<style scoped>
/* ************1*********** */
/* .buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.not-draggable {
  cursor: no-drop;
} */
</style>
<style>
/* ************2、3*********** */
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
