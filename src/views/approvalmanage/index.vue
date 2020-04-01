<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="searchData">查询</el-button>
        <el-button type="primary" size="small" @click="changeNotice()">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="deleteData">删除</el-button>
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
              <el-button
                size="mini"
                @click="changeNotice(scope.row)"
              >{{ scope.row.sate == 0 ? '公告' : '停止' }}</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog :title="titlename" :visible.sync="dialogFormVisible">
      <noticeDetail ref="noticeDetail" :dialogData="dialogData"></noticeDetail>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import noticeDetail from "./detail";
export default {
  name: "ApprovalManage",
  components: {
    noticeDetail
  },
  data() {
    return {
      tableName: [
        {
          label: "消息标题",
          prop: "messageTitle"
        },
        {
          label: "消息内容",
          prop: "messageBody"
        },
        {
          label: "接受者学号",
          prop: "messageToUserId"
        },
        {
          label: "发送时间",
          prop: "messageSendTime"
        },
        {
          label: "是否已经阅读",
          prop: "messageState"
        }
      ],
      searchForm: {
        name: "",
        jurisdiction: "",
        department: ""
      },
      tableData: [
        {
          userId: "2016-05-03",
          messageToUserId: "1234121",
          messageBody: "上海",
          messageTitle: "vvvcczx",
          messageSendTime: "1",
          messageState: "2",
          email: "32112",
          userImage: "322111",
          sate: 0
        },
        {
          userId: "1232",
          messageToUserId: "1234121",
          messageBody: "上海",
          messageTitle: "ssss",
          messageSendTime: "2",
          messageState: "1",
          email: "32112",
          userImage: "322111",
          sate: 1
        }
      ],
      page: {
        sizes: 20,
        total: 100,
        currentPage: 1
      },
      titlename: "",
      dialogFormVisible: false,
      dialogData: {},
      selectTable: []
    };
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
    deleteData() {},
    changeNotice(data) {
      if (!data || data.sate == "0") {
        this.titlename = data ? "修改" : "新增";
        this.$nextTick(() => {
          this.dialogFormVisible = true;
        });
      } else {
        alert("删除");
      }
    }
  }
};
</script>
