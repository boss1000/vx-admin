import echarts from 'echarts';
<template>
  <div class="commonTemp">
    <div class="content">
      <div class="chartsBox">
        <div ref="statistics"></div>
        <!-- <div></div> -->
      </div>
      <!-- <div class="chartsBox">
        <div></div>
        <div></div>
      </div> -->
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import "../../utils/shine.js";
import { getSumStudent } from "@/api/student";
export default {
  name: "StateXhibition",
  data() {
    return {
      chartStatistics: null,
      echartData: []
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    if (!this.chartStatistics) {
      return;
    }
    this.chartStatistics.dispose();
    this.chartStatistics = null;
  },
  methods: {
    getData() {
      getSumStudent().then(res => {
        res.data.forEach(item => {
          item.name = (item.name == '0') ? '代审批' : item.name == '1' ? '处理拒绝' : '审批通过'
        })
        this.echartData = res.data
        this.initchart();
      });
    },
    initchart() {
      this.chartStatistics = echarts.init(this.$refs.statistics, "shine");
      this.chartStatistics.setOption({
        title: [
          {
            text: (this.echartData.length > 0) ? `统计信息` : '暂无数据',
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
