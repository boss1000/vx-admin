<template>
  <el-form-item
    label-position="left"
    :label="`${titleName}:`"
    :label-width="labelWidth"
    class="setMaxwidth"
  >
    <span class="datepickers">
      <el-date-picker
        ref="fristTime"
        v-model="fristTime"
        :type="dateType"
        :value-format="format"
        :format="format"
        placeholder="选择日期"
        clearable
        :picker-options="pickerOptionsStart"
      ></el-date-picker>
      <span style="margin-left:-1px">至</span>
      <el-date-picker
        ref="lastTime"
        v-model="lastTime"
        :type="dateType"
        :value-format="format"
        :format="format"
        placeholder="选择日期"
        clearable
        :picker-options="pickerOptionsEnd"
      ></el-date-picker>
    </span>
  </el-form-item>
</template>
<script>
export default {
  name: "Datepicker",
  props: {
    titleName: {
      type: String,
      default: "入库时间"
    },
    fristValue: {
      type: String,
      default: ""
    },
    lastValue: {
      type: String,
      default: ""
    },
    format: {
      type: String,
      default: "yyyy-MM"
    },
    dateType: {
      type: String,
      default: "month"
    },
    labelWidth: {
      type: String,
      default: "120px"
    }
  },
  data() {
    return {
      fristTime: "",
      lastTime: "",
      pickerOptionsStart: this.beginDate(),
      pickerOptionsEnd: this.processDate()
    };
  },
  watch: {
    fristTime() {
      this.$emit("update:fristValue", this.fristTime);
    },
    lastTime() {
      this.$emit("update:lastValue", this.lastTime);
    },
    fristValue: {
      handler() {
        this.fristTime = this.fristValue;
      },
      immediate: true
    },
    lastValue: {
      handler() {
        this.lastTime = this.lastValue;
      },
      immediate: true
    }
  },
  methods: {
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.lastTime) {
            // 如果结束时间不为空，则小于结束时间
            return new Date(self.lastTime).getTime() < time.getTime();
          } else {
            return time.getTime() > Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.fristValue) {
            // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.fristValue).getTime() > time.getTime() || time.getTime() > Date.now();
          } else {
            return time.getTime() > Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.setMaxwidth .datepickers {
  /deep/ .el-date-editor {
    width: 140px;
    .el-input__inner {
      width: 100%;
    }
  }
}
.MaxWidth {
  .datepickers {
    /deep/ .el-date-editor {
      width: 190px;
    }
  }
}
</style>
