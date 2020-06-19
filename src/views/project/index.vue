<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
        <el-button type="primary" size="small" @click="addData">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="judgeDel">删除</el-button>
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
          v-loading="tableLoading"
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
          <el-table-column fixed="right" align="center" label="操作" width="250px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="primary" @click="openReport(scope.row)">报备</el-button>
              <el-button size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
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
      :areaList="groupList.areaList"
      :dialogFormVisible.sync="dialogFormVisible"
      :title="dialogTitle"
      :dialogId="dialogId"
      @getDataList="getDataList"
    ></ProjectDetail>

    <reportDetail :dialogId="dialogId" :dialogReportVisible.sync="dialogReportVisible"></reportDetail>
  </div>
</template>
<script>
import {
  getProjectList,
  DelProject,
  ChangeSort,
  GetAreaList
} from "@/api/project";
import ProjectDetail from "./detail";
import reportDetail from "@/components/reportDetail";
export default {
  name: "Project",
  components: { ProjectDetail, reportDetail },
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
        { prop: "ProjectName", label: "项目名称", width: "150px" },
        { prop: "ReportCount", label: "报备数", width: "150px" },
        { prop: "ResidenterName", label: "项目驻场人", width: "150px" },
        { prop: "ResidenterMobile", label: "项目驻场人手机号", width: "150px" },
        { prop: "PrincipalerName", label: "项目负责人", width: "150px" },
        {
          prop: "PrincipalerMobile",
          label: "项目负责人手机号",
          width: "150px"
        },
        { prop: "AreaName", label: "项目所在地区", width: "150px" },
        { prop: "Discount", label: "项目优惠" },
        { prop: "Developer", label: "项目开发商", width: "150px" },
        { prop: "OpeningTime", label: "开盘时间", width: "150px" },
        { prop: "Commission", label: "项目佣金", width: "150px" }
        // { prop: "Remark", label: "特别说明" },
        // { prop: "LinkAgeRules", label: "联动规则" }
      ],
      selectTable: [],
      tableLoading: false,
      dialogFormVisible: false,
      dialogReportVisible: false,
      dialogTitle: "",
      dialogId: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getAreaList();
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    getAreaList() {
      GetAreaList().then(data => {
        this.groupList.areaList = data.Result;
      });
    },
    getDataList() {
      this.tableLoading = true;
      getProjectList(this.searchForm)
        .then(data => {
          this.page.total = data.total;

          this.tableData = data.Result.map(item => {
            this.groupList.areaList.find(data => {
              if (data.value == item.Area) {
                item["AreaName"] = data.text;
                return true;
              } else {
                item["AreaName"] = "全部";
                return;
              }
            });
            return item;
          });
          // this.tableData = data.Result;
          this.tableLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addData() {
      // this.showMap = true;
      this.dialogTitle = "新增项目";
      this.dialogId = 0;
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    handleEdit(data) {
      this.dialogTitle = "修改项目";
      this.dialogId = data.Id;
      this.dialogFormVisible = true;
    },
    handleSizeChange() {
      this.getDataList();
    },
    handleCurrentChange() {
      this.getDataList();
    },
    handleSelectionChange(data) {
      this.selectTable = data.map(item => item.Id);
    },
    restData() {
      this.searchForm = Object.assign(
        {},
        this.$data.searchForm,
        this.$options.data().searchForm
      );
    },
    judgeDel() {
      if (this.selectTable.length > 0) {
        this.deleteData();
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的项目!"
        });
      }
    },
    deleteData(data) {
      this.$confirm("是否删除该账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let delSelect = data ? [data.Id] : this.selectTable;
          DelProject(delSelect).then(res => {
            this.getDataList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    changeData() {
      let getData = this.$refs.detailFrom.submitForm();
      if (getData) {
        console.log(getData);
      }
    },
    openReport(data) {
      this.dialogId = data.Id;
      this.$nextTick(() => {
        this.dialogReportVisible = true;
      });
    }
  }
};
</script>
