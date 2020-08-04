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
                  :label="item.label"
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
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content">
      <div class="tableBox" style="height: calc(100vh - 360px);">
        <el-table
          ref="tableBox"
          v-loading="tableLoading"
          :data="tableData.slice((page.PageIndex-1)*page.PageSize, page.PageIndex*page.PageSize)"
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
          <el-table-column fixed="right" align="center" label="操作" width="100px">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="deleteData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        :current-page="page.PageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <accountDetail :dialogFormVisible.sync="dialogFormVisible" @getDataList="getDataList"></accountDetail>
    <reportDetail :userId="userId" :dialogReportVisible.sync="dialogReportVisible"></reportDetail>
  </div>
</template>
<script>
import { GetSpecialAccountList, ModifyAccount } from "@/api/account";
import accountDetail from "./detail";
import reportDetail from "@/components/reportDetail";
export default {
  name: "Account",
  components: {
    accountDetail,
    reportDetail
  },
  data() {
    return {
      searchForm: {
        UserName: "",
        Mobile: "",
        Store: "",
        Status: "",
        AccountType: "",
        IsReferrer: true
      },
      page: {
        total: 0,
        PageIndex: 1,
        PageSize: 10
      },
      groupList: {
        StatusList: [
          { label: "全部", value: null },
          { label: "启用", value: 1 },
          { label: "停用", value: 2 },
          { label: "异常", value: 3 }
        ],
        AccountTypeList: [
          {
            label: "公司账户",
            value: 1
          },
          {
            label: "项目驻场",
            value: 2
          },
          {
            label: "中介",
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
      dialogReportVisible: false,
      tableName: [
        { prop: "UserName", label: "用户姓名" },
        { prop: "Mobile", label: "用户手机号" },
        { prop: "StoreName", label: "门店" },
        { prop: "IdCard", label: "身份证号码" },
        { prop: "Company", label: "体系" },
        { prop: "TypeName", label: "账号类型" },
        { prop: "StatusName", label: "账号状态", width: "100px" }
      ],
      userId: 0
    };
  },
  activated() {
    this.$refs.tableBox.doLayout();
  },
  mounted() {
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
      GetSpecialAccountList(this.searchForm).then(res => {
        this.tableData = res.Result;
        this.page.total = res.Result.length;
        this.tableLoading = false;
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
        .then(async() => {
          let delSelect = data ? [data.Id] : this.selectTable;
          let results = await Promise.all(
            delSelect.map(async item => {
              this.tableData.map(async data => {
                if (item == data.Id) {
                  let setData = Object.assign({}, data, {
                    isReferrer: false,
                    TypeEnum: data.Type,
                    StatusEnum: data.Status
                  });
                  return await ModifyAccount(setData);
                }
              });
            })
          );
          await this.changeAccount();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    changeAccount() {
      this.$message.success("推荐人删除成功");
      this.getDataList();
    },
    openReport(data) {
      this.userId = data.Id;
      this.$nextTick(() => {
        this.dialogReportVisible = true;
      });
    },
    handleSizeChange(val) {
      this.page.PageSize = val;
    },
    handleCurrentChange(val) {
      this.page.PageIndex = val;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
