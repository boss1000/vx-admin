<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="getAreaList">查询</el-button>
        <el-button type="primary" size="small" @click="addData">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="judgeDel">删除</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm" label-width="110px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="地区名称">
              <el-input v-model="searchForm.AreaName" placeholder="请输入地区名称" clearable></el-input>
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
          <el-table-column fixed="right" align="center" label="操作" width="400px">
            <template v-if="scope.row.Type !== 308" slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
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
    <accountDetail
      :title="title"
      :changData="changData"
      :dialogFormVisible.sync="dialogFormVisible"
      @getDataList="getAreaList"
    ></accountDetail>
  </div>
</template>
<script>
import { getProjectList } from "@/api/project";
import { GetAreaList, AddArea, EditArea, DeleteArea } from "@/api/project";
import accountDetail from "./detail";
export default {
  name: "Account",
  components: {
    accountDetail
  },
  data() {
    return {
      searchForm: {
        AreaName: ""
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
      tableName: [
        { prop: "value", label: "地区ID" },
        { prop: "text", label: "地区名称" }
      ],
      projectList: [],
      userId: 0
    };
  },
  activated() {
    this.$refs.tableBox.doLayout();
  },
  mounted() {
    this.getAreaList();
  },
  methods: {
    handleEdit(item) {
      this.title = "地区修改";
      this.changData = item;
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    getAreaList() {
      this.tableLoading = true;
      GetAreaList(this.searchForm).then(res => {
        this.tableData = res.Result;
        this.page.total = res.Result.length;
        this.tableLoading = false;
      });
    },
    addData() {
      this.title = "地区新增";
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
      this.selectTable = data.map(item => item.value);
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
          let delSelect = data ? [data.value] : this.selectTable;
          DeleteArea(delSelect).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.page.PageIndex = 1;
            this.getAreaList();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
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
