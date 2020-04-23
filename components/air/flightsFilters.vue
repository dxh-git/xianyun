<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            v-for="(item,index) in airSizeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
    <div>{{filter}}</div>
  </div>
</template>

<script>
export default {
  //   props: ["data"], //简写
  // 标准写法
  props: {
    data: {
      // 类型
      type: Object,
      // 默认值
      default: {}
    }
  },
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", //机型大小
      // 自己声明一个飞机的大小类型的数组
      airSizeList: [
        { label: "大", value: "L" },
        { label: "中", value: "M" },
        { label: "小", value: "S" }
      ]
    };
  },
  computed: {
    //筛选多个条件
    filter() {
      const arr = this.data.flights.filter(v => {
        // 假如都满足都满足条件
        let valid = true;
        // 当条件（this.airport）有值的时候我们才需要判断，表示用户选择了条件
        // 由于valid变量已经假设所有的数据都是符合条件的
        // 所以是不符合条件的条件的航班，就把valid设置为false，最后就return出false
        // 自然这条数据就不会加入到arr中
        // 选择机场
        if (this.airport && v.org_airport_name !== this.airport) {
          valid = false;
        }

        // 选择航空公司
        if (this.company && v.airline_name !== this.company) {
          valid = false;
        }

        // 起飞时间
        if (this.flightTimes) {
          // 假设 this.flightTimes等于 6,12
          const time = this.flightTimes.split(","); // [6, 12]
          // 每个航班的出发时间的小时
          const current = v.dep_time.split(":")[0];
          if (+time[0] > +current || +current >= +time[1]) {
            valid = false;
          }
        }
        // 选择机型
        if (this.airSize && v.plane_size !== this.airSize) {
          valid = false;
        }
        // valid是true会把当前这条数据加入到新数组，如果是false就不加
        return valid;
      });
      this.$emit("setDataList", arr);
      return this.company;
    }
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
      //   // filter过滤满足条件的航班数据arr
      //   const arr = this.data.flights.filter(v => {
      //     return v.org_airport_name === value;
      //   });
      //   // 在子组件中使用this.@emit()触发事件时，可以通过参数传入数据   把数据arr传给父组件
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
      //   console.log(value);
      //   // filter过滤满足条件的航班数据arr
      //   const arr = this.data.flights.filter(v => {
      //     return (
      //       +v.dep_time.split(":")[0] >= +value.split(",")[0] &&
      //       +v.dep_time.split(":")[0] <= +value.split(",")[1]
      //     );
      //   });
      //   // 在子组件中使用this.@emit()触发事件时，可以通过参数传入数据   把数据arr传给父组件
      //   this.$emit("setDataList", arr);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      // console.log(value);
      // // filter过滤满足条件的航班数据arr
      // const arr = this.data.flights.filter(v => {
      //   return v.airline_name === value;
      // });
      // // 在子组件中使用this.@emit()触发事件时，可以通过参数传入数据   把数据arr传给父组件
      // this.$emit("setDataList", arr);
    },

    // 选择机型时候触发
    handleAirSize(value) {
      //   // filter过滤满足条件的航班数据arr
      //   const arr = this.data.flights.filter(v => {
      //     return v.plane_size === value;
      //   });
      //   // 在子组件中使用this.@emit()触发事件时，可以通过参数传入数据   把数据arr传给父组件
      //   this.$emit("setDataList", arr);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
      (this.airport = ""),
        (this.flightTimes = ""),
        (this.company = ""),
        (this.airSize = ""),
        this.$emit("setDataList", this.data.flights);
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>