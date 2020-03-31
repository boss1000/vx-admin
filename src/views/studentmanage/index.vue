<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="searchData">查询</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button plain size="small" @click="deleteData">分配</el-button>
        <el-button plain size="small" @click="postExcal">上传</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权限">
              <el-select v-model="searchForm.jurisdiction" placeholder="请选择权限">
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
              <el-select v-model="searchForm.department" placeholder="请选择权限部门">
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
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <JurisDictionDetail
        :jurisdictionList="groupList.jurisdictionList"
        :approverList="approverList"
        :dialogData="dialogData"
      ></JurisDictionDetail>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import JurisDictionDetail from "./detail";
export default {
  name: "StudentManage",
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
      groupList: {
        jurisdictionList: [
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
      tableData: [
        {
          userId: "2016-05-03",
          password: "1234121",
          userType: "上海",
          userName: "vvvcczx",
          userDept: "1",
          userDuty: "2",
          email: "32112",
          userImage: "322111"
        },
        {
          userId: "1232",
          password: "1234121",
          userType: "上海",
          userName: "ssss",
          userDept: "2",
          userDuty: "1",
          email: "32112",
          userImage: "322111"
        },
        {
          userId: "544",
          password: "1234121",
          userType: "上海",
          userName: "ggg",
          userDept: "上海市普陀区金沙江路 1518 弄",
          userDuty: 200333,
          email: "32112",
          userImage: "322111"
        },
        {
          userId: "2016-023",
          password: "1234121",
          userType: "上海",
          userName: "普陀区",
          userDept: "上海市普陀区金沙江路 1518 弄",
          userDuty: 200333,
          email: "32112",
          userImage: "322111"
        },
        {
          userId: "20143",
          password: "1234121",
          userType: "上海",
          userName: "普陀区",
          userDept: "上海市普陀区金沙江路 1518 弄",
          userDuty: 200333,
          email: "32112",
          userImage: "322111"
        },
        {
          userId: "2015-03",
          password: "1234121",
          userType: "上海",
          userName: "普陀区",
          userDept: "上海市普陀区金沙江路 1518 弄",
          userDuty: 200333,
          email: "32112",
          userImage: "322111"
        },
        {
          userId: "2016-05-03",
          password: "1234121",
          userType: "上海",
          userName: "普陀区",
          userDept: "上海市普陀区金沙江路 1518 弄",
          userDuty: 200333,
          email: "32112",
          userImage: "322111"
        }
      ],
      page: {
        sizes: 20,
        total: 100,
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
    handleEdit(index, data) {
      this.dialogFormVisible = true;
      this.dialogData = data;
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
