<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
        <el-button type="primary" size="small" @click="addData">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="deleteData()">删除</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="searchForm.ProjectName" placeholder="请输入搜索关键词" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地区">
              <el-select v-model="searchForm.Area" placeholder="请选择地区" clearable>
                <el-option
                  v-for="item in groupList.areaList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序类型">
              <el-select v-model="searchForm.orderType" placeholder="请选择排序类型" clearable>
                <el-option
                  v-for="item in groupList.typeList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content">
      <div class="tableBox">
        <el-table
          :data="tableData"
          height="100%"
          size="mini"
          stripe
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
          <template v-for="item in tableName">
            <el-table-column
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </template>
          <el-table-column fixed="right" align="center" label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        :current-page="searchForm.PageIndex"
        :page-sizes="[20, 40, 60, 100]"
        :page-size="searchForm.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <ProjectDetail
      ref="detailFrom"
      :dialogFormVisible.sync="dialogFormVisible"
      :title="dialogTitle"
      :dialogData="dialogData"
    ></ProjectDetail>
    <MapDialog :showMap.sync="showMap"></MapDialog>
  </div>
</template>
<script>
import {
  getProjectList,
  AddProject,
  EditProject,
  DelProject,
  ChangeSort,
  GetAreaList
} from "@/api/project";
import ProjectDetail from "./detail";
import MapDialog from "@/components/MapDialog/Map";
export default {
  name: "Project",
  components: { ProjectDetail, MapDialog },
  data() {
    return {
      searchForm: {
        ProjectName: "",
        Area: "",
        orderType: 1,
        PageIndex: 1,
        PageSize: 50
      },
      page: {
        total: 0
      },
      groupList: {
        areaList: [],
        typeList: [
          {
            text: "默认",
            value: 1
          },
          {
            text: "日期排序",
            value: 2
          },
          {
            text: "热度",
            value: 3
          }
        ]
      },
      tableData: [],
      tableName: [
        { prop: "ProjectName", label: "项目名称" },
        { prop: "ReportCount", label: "报备数" },
        { prop: "ResidenterName", label: "项目驻场人" },
        { prop: "residenterMobile", label: "项目驻场人手机号", width: "150px" },
        { prop: "PrincipalerName", label: "项目负责人" },
        {
          prop: "PrincipalerMobile",
          label: "项目负责人手机号",
          width: "150px"
        },
        { prop: "Area", label: "项目所在地区", width: "150px" },
        { prop: "Discount", label: "项目优惠" },
        { prop: "Developer", label: "项目开发商" },
        { prop: "OpeningTime", label: "开盘时间", width: "150px" },
        { prop: "Commission", label: "项目佣金" },
        { prop: "Remark", label: "特别说明" },
        { prop: "LinkAgeRules", label: "联动规则" }
      ],
      selectTable: [],
      dialogFormVisible: false,
      dialogTitle: "",
      dialogData: {},
      showMap: false
    };
  },
  mounted() {
    this.getAreaList();
    // this.getDataList()
  },
  methods: {
    getAreaList() {
      GetAreaList().then(data => {
        this.groupList.areaList = data.Result;
      });
    },
    getDataList() {
      getProjectList(this.searchForm)
        .then(data => {
          this.page.total = data.total;
          this.tableData = data.Result;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addData() {
      this.showMap = true;
      // this.dialogTitle = "新增项目";
      // this.dialogData = Object.assign(
      //   {},
      //   this.$data.dialogData,
      //   this.$options.data().dialogData
      // );
      // this.$nextTick(() => {
      //   this.dialogFormVisible = true;
      // });
    },
    handleEdit(index, data) {
      this.dialogTitle = "修改项目";
      this.dialogData = data;
      this.dialogFormVisible = true;
    },
    handleDelete(data) {
      this.$confirm("是否删除该账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteData(data.userId);
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    handleSizeChange() {
      this.getDataList();
    },
    handleCurrentChange() {
      this.getDataList();
    },
    handleSelectionChange(data) {
      this.selectTable = data.map(item => item.userId);
    },
    restData() {
      this.searchForm = Object.assign(
        {},
        this.$data.searchForm,
        this.$options.data().searchForm
      );
    },
    deleteData(data) {
      let delSelect = data ? [data] : this.selectTable;
      delUsers({ ids: delSelect }).then(res => {
        this.getDataList();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    changeData() {
      let getData = this.$refs.detailFrom.submitForm();
      if (getData) {
        console.log(getData);
      }
    }
  }
};
</script>
