<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="searchData">查询</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button plain size="small" @click="distribution">分配</el-button>
        <input-excel title="上传学生" @getMyExcelData="getMyExcelData" @getResult="postExcal"></input-excel>
        <el-button plain size="small" @click="approvalOne()">审批</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.stuName" placeholder="请输入姓名或者学号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content">
      <div class="tableBox">
        <el-table
          v-if="showTable"
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
            >
              <template slot-scope="scope">
                <div v-if="item.prop == 'image'">
                  <a @click="openImage(scope.row.image)">{{ scope.row.image }}</a>
                </div>
                <div v-else>{{ scope.row[item.prop] }}</div>
              </template>
            </el-table-column>
          </template>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="approvalOne(scope.row)">审批</el-button>
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
    <el-dialog title="审批" :visible.sync="dialogFormVisible">
      <studentDetail ref="studentMessage" :dialogFormVisible="dialogFormVisible"></studentDetail>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="approvalState(2)">审批通过</el-button>
        <el-button type="danger" @click="approvalState(1)">审批拒绝</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配" :visible.sync="dialogDistribution" width="30%">
      <div class="commonTemp">
        <el-form :inline="true">
          <el-row>
            <el-col :span="24">
              <el-form-item label="审批人员">
                <el-select v-model="userDistribution" placeholder="请选择权限部门">
                  <el-option
                    v-for="item in deptList"
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
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="distributionYes">确定</el-button>
        <el-button type="danger" @click="dialogDistribution = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import studentDetail from "./detail";
import inputExcel from "../../components/UploadExcel";
import {
  getStudent,
  examineAndApproveStudent,
  uploadStudent,
  distributionStudent,
  getUsersByUserDept
} from "@/api/student";
export default {
  name: "StudentManage",
  components: {
    studentDetail,
    inputExcel
  },
  data() {
    return {
      showTable: false,
      tableName: [],
      searchForm: {
        stuName: ""
      },
      deptList: [],
      tableData: [],
      page: {
        pageSize: 20,
        total: 0,
        pageNum: 1
      },
      userDistribution: "",
      dialogFormVisible: false,
      dialogDistribution: false,
      dialogData: {},
      selectTable: []
    };
  },
  mounted() {
    this.initSelect();
    this.searchData();
  },
  methods: {
    initSelect() {
      getUsersByUserDept().then(res => {
        let setUserDept = [];
        res.data.forEach(item => {
          setUserDept.push({
            label: item.userName,
            value: item.userId
          });
        });
        this.deptList = setUserDept;
      });
    },
    searchData() {
      let postData = Object.assign({}, this.searchForm, this.page);
      this.showTable = false;
      getStudent(postData).then(res => {
        this.judgmentRoles(res.data.list);
        this.page.total = res.data.total
      });
    },
    judgmentRoles(data) {
      // 1 图书管 2 财务处 3 党委 4 团委 5 二级学院 6 舍管处 7 教务处
      switch (this.$store.getters.introduction) {
        case "1":
          this.tableName = [
            {
              label: "学号",
              prop: "stuId"
            },
            {
              label: "余额",
              prop: "owe"
            },
            {
              label: "书籍",
              prop: "book"
            },
            {
              label: "状态",
              prop: "name"
            },
            {
              label: "预约时间/处理时间",
              prop: "time"
            },
            {
              label: "留言",
              prop: "message"
            }
          ];
          break;
        case "2":
          this.tableName = [
            {
              label: "学号",
              prop: "stuId"
            },
            {
              label: "宿舍费",
              prop: "dormiFe"
            },
            {
              label: "学费",
              prop: "tuiFe"
            },
            {
              label: "医疗费",
              prop: "mediFe"
            },
            {
              label: "状态",
              prop: "name"
            },
            {
              label: "预约时间/处理时间",
              prop: "time"
            },
            {
              label: "留言",
              prop: "message"
            }
          ];
          break;
        case "3":
          this.tableName = [
            {
              label: "学号",
              prop: "stuId"
            },
            {
              label: "图片",
              prop: "image"
            },
            {
              label: "状态",
              prop: "name"
            },
            {
              label: "预约时间/处理时间",
              prop: "time"
            },
            {
              label: "留言",
              prop: "message"
            }
          ];
          break;
        case "4":
          this.tableName = [
            {
              label: "学号",
              prop: "stuId"
            },
            {
              label: "图片",
              prop: "image"
            },
            {
              label: "状态",
              prop: "name"
            },
            {
              label: "预约时间/处理时间",
              prop: "time"
            },
            {
              label: "留言",
              prop: "message"
            }
          ];
          break;
        case "5":
          this.tableName = [];
          break;
        default:
          this.tableName = [
            {
              label: "学号",
              prop: "stuId"
            },
            {
              label: "状态",
              prop: "name"
            },
            {
              label: "预约时间/处理时间",
              prop: "time"
            },
            {
              label: "留言",
              prop: "message"
            }
          ];
          break;
      }
      this.tableData = data;
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
    approvalOne(data) {
      this.dialogData = data ? Object.assign({}, this.dialogData, data) : {};
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    handleSizeChange() {
      this.searchData();
    },
    handleCurrentChange() {
      this.searchData();
    },
    handleSelectionChange(data) {
      this.selectTable = data.map(item => item.stuId);
    },
    restData() {
      this.searchForm = Object.assign(
        {},
        this.$data.searchForm,
        this.$options.data().searchForm
      );
    },
    approvalState(state) {
      // 1 审批拒绝 2 审批通过
      this.dialogFormVisible = false;
      let stuList =
        Object.keys(this.dialogData).length == 0
          ? this.selectTable
          : [this.dialogData.stuId];
      let postData = {
        stuList: stuList,
        state: state,
        message: this.$refs.studentMessage.dialogForm.message
      };
      // this.$refs.studentMessage.dialogForm
      // console.log(this.dialogData);
      examineAndApproveStudent(postData).then(res => {
        this.$message({
          type: "success",
          message: "审批成功"
        });
        this.searchData();
      });
    },
    getMyExcelData(file) {
      uploadStudent(file).then(res => {
        console.log(res);
      });
    },
    distribution() {
      // 分配
      if (this.selectTable.length > 0) {
        this.userDistribution = "";
        this.dialogDistribution = true;
      } else {
        this.$message({
          type: "warning",
          message: "请勾选要分配项目"
        });
      }
    },
    distributionYes() {
      distributionStudent({
        stuList: this.selectTable,
        teacherId: this.userDistribution
      }).then(res => {
        this.$message({
          type: "success",
          message: "分配成功"
        });
        this.searchData();
        this.dialogDistribution = false;
      });
    },
    postExcal(data) {},
    openImage(data) {}
  }
};
</script>
