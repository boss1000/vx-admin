import echarts from 'echarts';
<template>
  <div class="commonTemp">
    <div class="content">
      <div class="chartsBox">
        <div ref="statistics"></div>
        <div></div>
      </div>
      <div class="chartsBox">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import "../../utils/shine.js";
export default {
  name: "StateXhibition",
  data() {
    return {
      chartStatistics: null,
      echartData: [
        {
          name: "通过",
          value: "272"
        },
        {
          name: "待办",
          value: "292"
        },
        {
          name: "未通过",
          value: "120"
        }
      ]
    };
  },
  mounted() {
    this.initchart();
  },
  beforeDestroy() {
    if (!this.chartStatistics) {
      return;
    }
    this.chartStatistics.dispose();
    this.chartStatistics = null;
  },
  methods: {
    initchart() {
      this.chartStatistics = echarts.init(this.$refs.statistics, "shine");
      this.chartStatistics.setOption({
        title: [
          {
            text: `统计信息`,
            left: "center",
            top: "50%",
            padding: [5, 0],
            textStyle: {
              color: "#00CFFF",
              align: "center",
              fontWeight: "bolder",
              fontSize: 25
            }
          }
        ],
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return `<span style='display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${params.color};'></span>${params.data.name}:${params.data.value}(${params.percent}%)`;
          }
        },
        series: [
          {
            name: "统计信息",
            type: "pie",
            radius: ["45%", "60%"],
            center: ["50%", "55%"],
            hoverAnimation: false,
            color: ["#FBFE27", "#FE5050", "#1DB7E5"],
            roseType: "radius",
            label: {
              normal: {
                formatter: ["{c|{c}次}", "{b|{b}}"].join("\n"),
                rich: {
                  c: {
                    fontSize: 20,
                    fontWeight: "bold",
                    lineHeight: 5
                  },
                  b: {
                    fontSize: 15,
                    height: 40
                  }
                }
              }
            },
            labelLine: {
              length: 30,
              length2: 60,
              show: true
            },
            data: this.echartData
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.commonTemp {
  /deep/.content {
    background: #eee;
    box-shadow: none;
    .chartsBox {
      display: flex;
      flex-direction: column;
      flex: 1;
      > div {
        flex: 1;
        background-color: #304156;
        box-shadow: 5px 5px 5px #bfbdbd;
        margin: 10px;
      }
    }
  }
}
</style>
