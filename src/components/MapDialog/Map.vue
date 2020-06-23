<template>
  <el-dialog
    width="1000px"
    title="项目位置"
    append-to-body
    :visible="showMap"
    :close-on-click-modal="false"
    @close="$emit('update:showMap',false)"
  >
    <div class="commonTemp">
      <el-form :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item label="详细地址">
              <el-input
                v-model="keywordName"
                placeholder="请输入详细地址"
                clearable
                @keydown.enter.native="getArea"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-button type="primary" size="small" @click="getArea">查询</el-button>
          <el-button type="primary" size="small" @click="saveArea">保存</el-button>
        </el-row>
      </el-form>

      <baidu-map
        id="mapID"
        class="map"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        @click="getPoint"
      >
        <!--地图类型，两种：一种是路线一种是绿的那种-->
        <bm-map-type
          :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
          anchor="BMAP_ANCHOR_TOP_LEFT"
        ></bm-map-type>
        <!--地图搜索功能，绑定上面的input，-->
        <!--display: none样式很关键，因为下面默认会有地址提示信息很长，很烦，这样搜索会很舒服，-->
        <!--zoom是搜索结果的视图比例，个人觉得12.8很舒服显示-->
        <bm-local-search
          :keyword="keyword"
          :auto-viewport="true"
          :location="location"
          zoom="12.8"
          style="display: none"
        ></bm-local-search>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <!--信息窗口，show属性是控制显示隐藏，infoWindowClose和infoWindowOpen是控制信息窗口关闭隐藏的方法-->
        <bm-marker :position="postionMap">
          <bm-info-window
            :show="show"
            style="font-size: 14px"
            @close="infoWindowClose"
            @open="infoWindowOpen"
          >
            <p>详细地址：{{ add.site }}</p>
          </bm-info-window>
        </bm-marker>
      </baidu-map>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "BaiMap",
  props: {
    showMap: {
      type: Boolean,
      default: false
    },
    gpsForm: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    gpsForm: {
      handler() {
        let postionMap = this.gpsForm.gps.split(",");
        this.postionMap = {
          lng: postionMap[0],
          lat: postionMap[1]
        };
        this.add.site = this.gpsForm.address;
        this.show = true;
      },
      deep: true
    }
  },
  data() {
    return {
      baidumapSwitch: false,
      jgNameDialog: false,
      show: false,
      center: {
        lng: 120.639855,
        lat: 27.773523
      },
      postionMap: {
        // 地图坐标
        lng: null,
        lat: null
      },
      location: "",
      keywordName: "", // 关键字
      keyword: "", // 搜索框关键词
      zoom: 12.8, // 放大比例
      address: "", // 位置详细信息
      add: {
        point: {},
        site: "",
        jd: "",
        wd: "",
        desce: "",
        type: "",
        jgName: "",
        jgNum: ""
      },
      organizationData: [],
      jgName: "",
      jgNum: ""
    };
  },
  mounted() {},
  methods: {
    getPoint(e) {
      // 点击地图获取一些信息，
      this.postionMap.lng = e.point.lng; // 通过  e.point.lng获取经度
      this.postionMap.lat = e.point.lat; // 通过  e.point.lat获取纬度
      this.add.jd = e.point.lng;
      this.add.wd = e.point.lat;
      this.zoom = e.target.getZoom();

      let geocoder = new BMap.Geocoder(); // 创建地址解析器的实例
      geocoder.getLocation(e.point, rs => {
        this.add.site = rs.address;
        this.add.point = e.point;
        this.show = true;
        // 地址描述(string)=
        // console.log(rs.address); // 这里打印可以看到里面的详细地址信息，可以根据需求选择想要的
        // console.log(rs.addressComponents); // 结构化的地址描述(object)
        // console.log(rs.addressComponents.province); //省
        // console.log(rs.addressComponents.city); //城市
        // console.log(rs.addressComponents.district); //区县
        // console.log(rs.addressComponents.street); //街道
        // console.log(rs.addressComponents.streetNumber); //门牌号
        // console.log(rs.surroundingPois); //附近的POI点(array)
        // console.log(rs.business); //商圈字段，代表此点所属的商圈(string)
      });
    },
    infoWindowClose() {
      this.show = false;
    },
    infoWindowOpen(event) {
      this.show = true;
    },
    getArea() {
      this.keyword = JSON.stringify(this.keywordName);
    },
    saveArea() {
      if (this.add.site.length) {
        this.$emit("getMap", this.add);
        this.$emit("update:showMap", false);
      } else {
        this.$message({
          message: "请选择具体地点",
          type: "warning",
          duration: 3000,
          showClose: true
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding-top: 0;
}
.map {
  width: 100%;
  height: 500px;
}
</style>
