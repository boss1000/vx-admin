<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="searchData">查询</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button plain size="small" @click="approvalAll">审批</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名或者学号"></el-input>
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
              :key="item.userId"
              :prop="item.prop"
              :label="item.label"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </template>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="approvalOne(scope.row)">审批</el-button>
              <el-button size="mini" @click="openMessage(scope.row)">留言</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        :current-page="page.currentPage"
        :page-sizes="[20, 40, 60, 100]"
        :page-size="page.sizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="留言" :visible.sync="dialogFormVisible">
      <studentDetail :dialogData="dialogData"></studentDetail>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import studentDetail from "./detail";
export default {
  name: "Approvaler",
  components: {
    studentDetail
  },
  data() {
    return {
      tableName: [
        {
          label: "姓名",
          prop: "userName"
        },
        {
          label: "身份",
          prop: "userType"
        },
        {
          label: "密码",
          prop: "password"
        },
        {
          label: "管理部门",
          prop: "userDept"
        },
        {
          label: "用户权限",
          prop: "userDuty"
        },
        {
          label: "邮箱",
          prop: "email"
        },
        {
          label: "头像url",
          prop: "userImage"
        }
      ],
      searchForm: {
        name: "",
        jurisdiction: "",
        department: ""
      },
      tableData: [],
      page: {
        sizes: 20,
        total: 0,
        currentPage: 1
      },
      dialogFormVisible: false,
      dialogData: {},
      selectTable: []
    };
  },
  computed: {
    approverList() {
      return this.$store.getters.approverList;
    }
  },
  methods: {
    searchData() {},
    openMessage(data) {
      this.dialogData = data;
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    approvalAll() {
      if (this.selectTable.length > 0) {
        // this.dialogFormVisible = true;
        // this.dialogData = data ? data : {};
        this.$confirm("是否进行审批?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "审批成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审批"
            });
          });
      } else {
        this.$message.warning("请选择审批项");
      }
    },
    approvalOne(data) {
      this.$confirm("是否进行审批?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "审批成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消审批"
          });
        });
    },
    handleDelete() {
      this.$confirm("是否删除该账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    handleSizeChange() {
      this.searchData();
    },
    handleCurrentChange() {
      this.searchData();
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
    deleteData() {}
  }
};
</script>
