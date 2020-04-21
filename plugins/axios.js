// 单独引用 message消息提示。局部导入element里的message方法
import {Message} from 'element-ui'
// pluginsde 的所有文件都会导入到项目中 并且是全局
// 1.拦截axios的错误, 插件必须要要暴露出一个函数
export default (nuxt)=>{
    // 2.onError在axions请求错误的时候会触发，err是错误的对象
    nuxt.$axios.onError(err=>{
        // ree.response是错误对象的详细
        const {statusCode,message} = err.response.data
        if(statusCode === 400){
            // 弹框
            Message.error(message)
        }
    })
}