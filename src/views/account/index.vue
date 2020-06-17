<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
        <el-button type="primary" size="small" @click="addData">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="deleteData">删除</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm" label-width="110px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.UserName" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input v-model="searchForm.Mobile" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店">
              <el-input v-model="searchForm.Store" placeholder="请输入门店" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账号状态">
              <el-select v-model="searchForm.Status" placeholder="请选择账号状态" clearable>
                <el-option
                  v-for="item in groupList.StatusList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账号类型">
              <el-select v-model="searchForm.AccountType" placeholder="请选择账号类型" clearable>
                <el-option
                  v-for="item in groupList.AccountTypeList"
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
          <el-table-column fixed="right" align="center" label="操作" width="400px">
            <template v-if="scope.row.Type !== 308" slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">数据</el-button>
              <el-button size="mini" type="warning" @click="deleteData(scope.row)">重置密码</el-button>
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
    <accountDetail
      :title="title"
      :changData="changData"
      :tableData="tableData"
      :projectList="projectList"
      :dialogFormVisible.sync="dialogFormVisible"
      @getDataList="getDataList"
    ></accountDetail>
  </div>
</template>
<script>
import { getProjectList } from "@/api/project";
import {
  GetAccountList,
  ResetPassword,
  DeleteAccount
} from "@/api/account";
import accountDetail from "./detail";
export default {
  name: "Account",
  components: {
    accountDetail
  },
  data() {
    return {
      searchForm: {
        UserName: "",
        Mobile: "",
        Store: "",
        Status: "",
        AccountType: ""
      },
      page: {
        total: 0,
        PageIndex: 1,
        PageSize: 50
      },
      groupList: {
        StatusList: [
          {
            text: "停用",
            value: 0
          },
          {
            text: "启用",
            value: 1
          },
          {
            text: "异常",
            value: 2
          }
        ],
        AccountTypeList: [
          {
            text: "公司账户",
            value: 1
          },
          {
            text: "项目驻场",
            value: 2
          },
          {
            text: "中介",
            value: 3
          }
        ]
      },
      changData: {},
      title: "",
      tableData: [],
      selectTable: [],
      tableLoading: false,
      dialogFormVisible: false,
      tableName: [
        { prop: "UserName", label: "用户姓名" },
        { prop: "Mobile", label: "用户手机号" },
        { prop: "StoreName", label: "门店" },
        { prop: "IdCard", label: "身份证号码" },
        { prop: "Company", label: "体系" },
        { prop: "TypeName", label: "账号类型" },
        { prop: "StatusName", label: "账号状态", width: "100px" }
      ],
      projectList: []
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
        this.tableLoading = false;
      });
    },
    getProject() {
      getProjectList({
        ProjectName: "",
        Area: "",
        orderType: 1,
        PageIndex: 1,
        PageSize: 1000
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
            // this.getDataList();
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
    handleSizeChange() {},
    handleCurrentChange() {}
  }
};
</script>
<style lang="scss" scoped>
</style>
