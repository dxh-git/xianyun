// 存放仓库该分类（user）下的数据, export const state = {}是固定的格式
// export const state ={
//     // 登入成功后接口返回的数据，里面包含token和用户详情
//     userInfo:{}
// }
export const state =function(){
    return {
        userInfo:{}
    }
}
// 同步修改state中的数据export const mutations =={}是固定写法
// store的数据不能直接修改  必须使用mutations来修改
export const mutations ={
    // 声明一个函数，还修改state的数据
     // 该函数有两个参数，第一个参数是上面state(固定的), 第二个参数是传入的参数(不固定)
    setUserInfo(state,data){
        state.userInfo = data
    }
}

// 重点：actions可以用来存放一些公共的方法，多个组件或者项目通用的方法
// 顺带的：并且可以调用mutations来修改state
export const actions  = {
    // 声明一个函数，函数名可以随便起
    // 该函数有两个参数，第一个参数是Store对象, 第二个参数是传入的参数(不固定)
    login(store,data){
        return this.$axios({
            url:'/accounts/login',
            method:'post',
            data
        }).then(res=>{
            const {data} = res
           // 通过store.commit调用mutations的方法
            // 由于是在同一个模块下，可以省略前面的user名字
            store.commit("setUserInfo",data)
            return data
        })
    },
    registerForm(store,data){

    }
}