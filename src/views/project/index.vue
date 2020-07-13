<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
        <el-button type="primary" size="small" @click="addData">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="judgeDel">删除</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="downloadLoading"
          @click="downloadProjectList"
        >导出列表</el-button>
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
              <el-select v-model="searchForm.orderType" placeholder="请选择排序类型">
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
          ref="tableBox"
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
          <el-table-column fixed="right" align="center" label="操作" width="320px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="primary" @click="openReport(scope.row)">报备</el-button>
              <el-button size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
              <el-button type="primary" size="small" @click="downloaProjectEdit(scope.row)">修改记录</el-button>
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
      :areaList="groupList.setAreaList"
      :accountList="groupList.AccountList"
      :dialogFormVisible.sync="dialogFormVisible"
      :title="dialogTitle"
      :dialogId="dialogId"
      @getDataList="getDataList"
    ></ProjectDetail>

    <reportDetail :projectId="reportId" :dialogReportVisible.sync="dialogReportVisible"></reportDetail>
  </div>
</template>
<script>
import {
  getProjectList,
  DelProject,
  ChangeSort,
  GetAreaList,
  ExportProjectList,
  ExportProjectEditRecordList
} from "@/api/project";
import { GetAccountList } from "@/api/account";
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
        PageSize: 20
      },
      page: {
        total: 0
      },
      groupList: {
        AccountList: [],
        areaList: [],
        setAreaList: [],
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
      downloadLoading: false,
      tableLoading: false,
      dialogFormVisible: false,
      dialogReportVisible: false,
      dialogTitle: "",
      dialogId: 0,
      reportId: 0
    };
  },
  mounted() {
    this.init();
  },
  activated() {
    this.$refs.tableBox.doLayout();
  },
  methods: {
    async init() {
      await this.getAreaList();
      this.$nextTick(() => {
        this.getDataList();
        this.getAccountList();
      });
    },
    getAreaList() {
      GetAreaList().then(data => {
        this.groupList.setAreaList = data.Result;
        this.groupList.areaList = [
          {
            value: null,
            text: "全部"
          }
        ].concat(data.Result);
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
          this.selectTable = [];
          // this.tableData = data.Result;
          this.tableLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAccountList() {
      GetAccountList({
        UserName: "",
        Mobile: "",
        Store: "",
        Status: "",
        AccountType: ""
      }).then(res => {
        this.groupList.AccountList = res.Result;
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
      this.$confirm("是否删除该项目?", "提示", {
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
      this.reportId = data.Id;
      this.$nextTick(() => {
        this.dialogReportVisible = true;
      });
    },
    downloadProjectList() {
      let { PageIndex, PageSize, ...searchData } = this.searchForm;
      this.downloadLoading = true;
      ExportProjectList(searchData).then(data => {
        // 处理返回的文件流
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const fileName = `项目列表.xls`;
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);

        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.downloadLoading = false;
        this.$message({
          type: "success",
          message: "开始下载"
        });
      });
    },
    downloaProjectEdit(row) {
      ExportProjectEditRecordList({ ProjectID: row.Id }).then(data => {
        // 处理返回的文件流
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const fileName = `项目修改记录.xls`;
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);

        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.$message({
          type: "success",
          message: "开始下载"
        });
      });
    }
  }
};
</script>
<style lang="scss">
body {
  .el-table th.gutter {
    display: table-cell !important;
  }

  .el-table colgroup.gutter {
    display: table-cell !important;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
}
</style>
