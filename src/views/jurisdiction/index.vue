<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="searchData">查询</el-button>
        <el-button type="primary" size="small" @click="addData">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="deleteData()">删除</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权限">
              <el-select v-model="searchForm.userDuty" placeholder="请选择权限">
                <el-option
                  v-for="item in groupList.jurisdictionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select v-model="searchForm.userDept" placeholder="请选择权限部门">
                <el-option
                  v-for="item in approverList"
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
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-pagination
        :current-page="page.pageNum"
        :page-sizes="[20, 40, 60, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <JurisDictionDetail
        ref="detailFrom"
        :title="dialogTitle"
        :jurisdictionList="groupList.jurisdictionList"
        :approverList="approverList"
        :dialogData="dialogData"
      ></JurisDictionDetail>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="changeData">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import JurisDictionDetail from "./detail";
import { getUsers, addUser, delUsers, updateUser } from "@/api/super";

export default {
  name: "JurisDiction",
  components: {
    JurisDictionDetail
  },
  data() {
    return {
      tableName: [
        {
          label: "姓名",
          prop: "userName"
        },
        {
          label: "管理部门",
          prop: "userDeptText"
        },
        {
          label: "用户权限",
          prop: "userDutyText"
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
        userName: "",
        userDuty: "",
        userDept: ""
      },
      groupList: {
        jurisdictionList: [
          {
            label: "超级管理员",
            value: "0"
          },
          {
            label: "总负责人",
            value: "1"
          },
          {
            label: "审批人员",
            value: "2"
          }
        ]
      },
      tableData: [],
      dialogTitle: "",
      page: {
        pageSize: 20,
        total: 100,
        pageNum: 1
      },
      dialogFormVisible: false,
      dialogData: {
        userImage: "",
        userDept: "",
        userDuty: "",
        userName: "",
        userId: "",
        account: "",
        email: "",
        password: ""
      },
      selectTable: []
    };
  },
  computed: {
    approverList() {
      return this.$store.getters.approverList;
    }
  },
  methods: {
    searchData() {
      let postData = Object.assign({}, this.searchForm, this.page);
      getUsers(postData).then(res => {
        this.page.total = res.data.size;
        let setData = [];
        setData = res.data.list.map(item => {
          let setUserDept = "";
          let setUserDuty = "";
          // userDept 部门
          if (item.userDept) {
            setUserDept = this.approverList.filter(approver => {
              if (approver.value == item.userDept) {
                return approver;
              }
            });
          }
          // userDuty 权限
          if (item.userDuty) {
            setUserDuty = this.groupList.jurisdictionList.filter(approver => {
              if (approver.value == item.userDuty) {
                return approver;
              }
            });
          }
          item["userDeptText"] =
            setUserDept.length > 0 ? setUserDept[0].label : "无";
          item["userDutyText"] =
            setUserDept.length > 0 ? setUserDuty[0].label : "无";
          return item;
        });
        this.tableData = setData;
      });
    },
    addData() {
      this.dialogTitle = "新增";
      this.dialogData = Object.assign(
        {},
        this.$data.dialogData,
        this.$options.data().dialogData
      );
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    handleEdit(index, data) {
      this.dialogTitle = "修改";
      this.dialogData = data;
      this.dialogFormVisible = true;
    },
    changeData() {
      if (this.$refs.detailFrom.submitForm()) {
        let setPasswrod = this.$refs.detailFrom.dialogForm.password ? this.$md5(this.$refs.detailFrom.dialogForm.password) : ''
        this.dialogData = Object.assign(
          {},
          this.dialogData,
          this.$refs.detailFrom.dialogForm,
          { password: setPasswrod }
        );
        if (this.dialogTitle == "新增") {
          addUser(this.dialogData).then(res => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          });
        } else {
          updateUser(this.dialogData).then(res => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
          });
        }
        this.dialogFormVisible = false;
        this.dialogData = Object.assign(
          {},
          this.$data.dialogData,
          this.$options.data().dialogData
        );
        this.searchData();
      }
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
    deleteData(data) {
      let delSelect = data ? [data] : this.selectTable;
      delUsers({ ids: delSelect }).then(res => {
        this.searchData();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    }
  }
};
</script>
