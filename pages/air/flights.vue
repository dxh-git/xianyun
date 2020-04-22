<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <Flightsitem v-for="(item,index) in dataList" :key="index" :data="item" />
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="flightsData.total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue";
import Flightsitem from "@/components/air/flightsItem.vue";

export default {
  components: {
    FlightsListHead,
    Flightsitem
  },
  data() {
    return {
      //航班总数据
      flightsData: {
        flights:[]    //给默认值防止报错
      }, 
      // dataList: [], //航班列表数据  用来循环flightsData组件 单独出来是为了分页
      pageSize: 5, //每页的条数
      pageIndex: 1 //当前页数
    };
  },
  mounted() {
    this.$axios({
      url: "airs",
      params: this.$route.query //来自URL的五个参数
    }).then(res => {
      console.log(res);
      this.flightsData = res.data;
      //   截取前五项数据
      // this.dataList = this.flightsData.flights.slice(0, this.pageSize);
    });
  },
  computed: {
    // 计算属性会监听函数内部所有实例(this)属性的变化
    // 页面要渲染的机票列表
    //航班列表数据  用来循环flightsData组件 单独出来是为了分页
    dataList() {
      const arr = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // 点击切换条数后回到第一页
      this.pageIndex = 1;
      // 请求当前页数的数据
      // this.dataList = this.flightsData.flights.slice(
      //   (this.pageIndex - 1) * this.pageSize,
      //   this.pageIndex * this.pageSize
      // );
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageIndex = val;
      // this.dataList = this.flightsData.flights.slice(
      //   (this.pageIndex - 1) * this.pageSize,
      //   this.pageIndex * this.pageSize
      // );
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>