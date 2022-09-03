import { defineStore } from 'pinia'
import { Names } from './store-name'
export const useTestStore = defineStore(Names.Test, {
    // State箭头函数返回一个对象,在对象里面定义值
     state:()=>{
         return {
             current:'你好世界'
         }
     },
     //类似于computed 可以帮我们去修饰我们的值
     getters:{
 
     },
     //可以操作异步 和 同步提交state
     actions:{
 
     }
})