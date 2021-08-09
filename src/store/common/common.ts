 import {GetterTree,MutationTree,ActionTree } from "vuex"
 import {TestStateType} from "./common.type"
const state:TestStateType={
    name:"lsp",
    age:0
}

const getters:GetterTree<TestStateType,any>={
    name:(state:TestStateType)=>state.name,
    age:(state:TestStateType)=>state.age
}

const mutations:MutationTree<TestStateType>={
    setName(state:TestStateType,val:string){
        state.name=val
    },
    setAge(state:TestStateType,val:number){
        state.age=val
    }
}

const actions:ActionTree<TestStateType,any>={
    setName(state,val:string){
        state.commit('setName',val)
    },
    setAge(state,val:number){
        state.commit('setAge',val)
    }
}
export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}