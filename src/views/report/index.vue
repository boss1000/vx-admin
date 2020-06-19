<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
        <el-button type="primary" size="small" @click="addData">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm" label-width="110px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="关键词">
              <el-input v-model="searchForm.Q" placeholder="请输入关键词" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <datepicker
              titleName="日期范围"
              labelWidth="110px"
              dateType="date"
              format="yyyy-MM-dd"
              :fristValue.sync="searchForm.DateBegin"
              :lastValue.sync="searchForm.DateEnd"
            ></datepicker>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态枚举">
              <el-select v-model="searchForm.Status" placeholder="请选择地区" clearable>
                <el-option
                  v-for="item in groupList.sateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地区">
              <el-select v-model="searchForm.AreaId" placeholder="请选择地区" clearable>
                <el-option
                  v-for="item in groupList.areaList"
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
          :data="tableData.slice((searchForm.PageIndex-1)*searchForm.PageSize, searchForm.PageIndex*searchForm.PageSize)"
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
          <el-table-column fixed="right" align="center" label="操作" width="400px">
            <template v-if="scope.row.Type !== 308" slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="primary" @click="openReport(scope.row)">报备</el-button>
              <el-button size="mini" type="warning" @click="resetPass(scope.row)">重置密码</el-button>
              <el-button size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        :current-searchForm="searchForm.PageIndex"
        :searchForm-sizes="[10, 20, 50, 100]"
        :searchForm-size="searchForm.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchForm.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <accountDetail
      :title="title"
      :changData="changData"
      :tableData="tableData"
      :projectList="projectList"
      :dialogFormVisible.sync="dialogFormVisible"
      @getDataList="getDataList"
    ></accountDetail>
    <reportDetail :userId="userId" :dialogReportVisible.sync="dialogReportVisible"></reportDetail>
  </div>
</template>
<script>
import { getProjectList } from "@/api/project";
import { GetAccountList, ResetPassword, DeleteAccount } from "@/api/account";
import accountDetail from "./detail";
import datepicker from "@/components/datepicker";
import reportDetail from "@/components/reportDetail";
export default {
  name: "Account",
  components: {
    accountDetail,
    reportDetail,
    datepicker
  },
  data() {
    return {
      searchForm: {
        Q: "",
        Status: "",
        DateBegin: "",
        DateEnd: "",
        AreaId: "",
        PageIndex: 1,
        PageSize: 10,
        total: 0
      },
      groupList: {
        areaList: [],
        sateList: [
          {
            value: 1,
            label: "界定中"
          },
          {
            value: 2,
            label: "有效推荐"
          },
          {
            value: 3,
            label: "无效推荐"
          },
          {
            value: 4,
            label: "有效带看"
          },
          {
            value: 5,
            label: "有效到访"
          },
          {
            value: 6,
            label: "认筹"
          },
          {
            value: 7,
            label: "认购"
          },
          {
            value: 8,
            label: "成交"
          }
        ]
      },
      changData: {},
      title: "",
      tableData: [],
      selectTable: [],
      tableLoading: false,
      dialogFormVisible: false,
      dialogReportVisible: false,
      tableName: [
        { prop: "ProjectName", label: "项目名称", width: "150px" },
        { prop: "PrincipalerName", label: "项目负责人姓名", width: "150px" },
        {
          prop: "PrincipalerMobile",
          label: "项目负责人手机号",
          width: "150px"
        },
        { prop: "CustomerName", label: "客户姓名", width: "150px" },
        { prop: "CustomerMobile", label: "客户手机号", width: "150px" },
        { prop: "ArriveDateTime", label: "预约来访时间", width: "150px" },
        {
          prop: "CompanyName",
          label: "体系",
          width: "150px"
        },
        { prop: "ReporterName", label: "报备人", width: "150px" },
        { prop: "ReporterMobile", label: "报备人手机号", width: "150px" },
        { prop: "StoreName", label: "门店", width: "150px" },
        { prop: "Remark", label: "备注", width: "150px" },
        { prop: "StatusName", label: "报备状态", width: "150px" }
      ],
      projectList: [],
      userId: 0
    };
  },
  mounted() {
    this.getProject();
    this.getDataList();
  },
  methods: {
    handleEdit(item) {
      this.title = "账号修改";
      this.changData = item;
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    getDataList() {
      this.tableLoading = true;
      GetAccountList(this.searchForm).then(res => {
        this.tableData = res.Result;
        this.searchForm.total = res.Result.length;
        this.tableLoading = false;
      });
    },
    getProject() {
      getProjectList({
        ProjectName: "",
        Area: "",
        orderType: 1,
        PageIndex: 1,
        PageSize: 10
      })
        .then(data => {
          this.projectList = data.Result.map(item => {
            return {
              value: item.Id,
              text: item.ProjectName
            };
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    addData() {
      this.title = "账号新增";
      this.changData = {};
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    restData() {
      this.searchForm = Object.assign(
        {},
        this.$data.searchForm,
        this.$options.data().searchForm
      );
    },
    handleSelectionChange(data) {
      this.selectTable = data.map(item => item.Id);
    },
    deleteData(data) {
      this.$confirm("是否删除该账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let delSelect = data ? [data.Id] : this.selectTable;
          DeleteAccount(delSelect).then(res => {
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
    resetPass(data) {
      this.$confirm("是否重置密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ResetPassword({ Id: data.Id }).then(res => {
            this.$message({
              type: "success",
              message: "重置成功!"
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
    openReport(data) {
      this.userId = data.Id;
      this.$nextTick(() => {
        this.dialogReportVisible = true;
      });
    },
    handleSizeChange() {
      this.searchForm.PageSize = val;
    },
    handleCurrentChange(val) {
      this.searchForm.PageIndex = val;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
