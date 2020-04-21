<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" :rules="rules" ref="form" label-width="80px" :model="form">
      <el-form-item label="出发城市" prop="departCity">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          v-model="form.departCity"
          @select="handleDepartSelect"
          class="el-autocomplete"
          @blur="handlDepartBlur"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市" prop="destCity">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          v-model="form.destCity"
          @select="handleDestSelect"
          class="el-autocomplete"
          @blur="handlDestBlur"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间" prop="departDate">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          v-model="form.departDate"
          style="width: 100%;"
          value-format="yyyy-MM-dd"
          @change="handleDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        departCity: "", // 出发城市
        departCode: "", // 出发城市代码
        destCity: "", // 到达城市
        destCode: "", // 到大城市代码
        departDate: "" // 出发时间
      },
      //   表单验证
      rules: {
        departCity: [
          { required: true, message: "请输入出发城市", trigger: "abc" }
        ],
        destCity: [
          { required: true, message: "请输入出到达城市", trigger: "abc" }
        ],
        departDate: [
          { required: true, message: "请输入出发时间", trigger: "abc" }
        ]
      },
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      //  出发城市的下拉框
      departCities: [],
      // 到达城市下拉框
      destcities: [],
      // 时间
      pickerOptions: {
        // 禁用今天之间的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        },
        //   今天
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {},

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch(value, cb) {
      //   cb([{ value: 1 }, { value: 2 }, { value: 3 }]);
      // 如果是空值就不请求
      if (!value) {
        return;
      }
       // 监听输入框有值的时候重新验证表单，可以消除掉红的报错信息
            this.$refs.form.validateField("departCity");
      // 请求value相关的城市
      this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        const { data } = res.data;
        // data里面没有value属性 并且去掉后面的市子
        const newData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        // 保存到data中，给blur事件使用, 失去焦点时候选中第一个
        this.departCities = newData;
        // cd是请求成功之后才调用的 因为在这里才可以拿到城市的数据
        cb(newData);
      });
    },
    // 失取焦点默认选中列表的第一个
    handlDepartBlur() {
      if (this.departCities.length > 0) {
        this.form.departCity = this.departCities[0].value;
        this.form.departCode = this.departCities[0].sort; //城市的简称代码
      }
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      //   cb([{ value: 1 }, { value: 2 }, { value: 3 }]);
      if (!value) {
        return;
      }
      // 请求value相关的城市
      this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        const { data } = res.data;
        // data里面没有value属性 并且去掉后面的市子
        const newData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        // 保存到data中，给blur事件使用, 失去焦点时候选中第一个
        this.destcities = newData;
        // cd是请求成功之后才调用的 因为在这里才可以拿到城市的数据
        cb(newData);
      });
    },
    // 失取焦点默认选中列表的第一个
    handlDestBlur() {
      if (this.destcities.length > 0) {
        this.form.destCity = this.destcities[0].value;
        this.form.destCode = this.destcities[0].sort; //城市的简称代码
      }
    },
    // 出发城市下拉选择时触发
    handleDepartSelect(item) {},

    // 目标城市下拉选择时触发
    handleDestSelect(item) {},

    // 确认选择日期时触发
    handleDate(value) {},

    // 触发和目标城市切换时触发
    handleReverse() {},

    // 提交表单是触发
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form);
        } else {
          this.$message.error("请输入内容");
        }
      });
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
