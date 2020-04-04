<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="searchData">查询</el-button>
        <el-button type="primary" size="small" @click="openMessage()">新增</el-button>
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button type="danger" size="small" @click="deleteData">删除</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="公告名称">
              <el-input v-model="searchForm.messageTitle" placeholder="请输入公告名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select v-model="searchForm.messageToUserDept" placeholder="请选择权限部门">
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
          <el-table-column prop="messageState" label="是否启用" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.messageState == '1' ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="changeNotice(scope.row)"
              >{{ scope.row.messageState == '1' ? '停止' : '公告' }}</el-button>
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
    <el-dialog :title="titlename" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <noticeDetail
        ref="noticeFrom"
        :dialogFormVisible="dialogFormVisible"
        :approverList="approverList"
      ></noticeDetail>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="sureMessage()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addMessage,
  delMessage,
  getMessage,
  setMessage
  // getNewMessage
} from "@/api/message";
import noticeDetail from "./detail";
export default {
  name: "NoticeManage",
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
          label: "接受部门",
          prop: "messageToUserDeptText"
        },
        {
          label: "发送时间",
          prop: "messageSendTime"
        }
      ],
      searchForm: {
        messageTitle: "",
        messageToUserId: "",
        messageBody: ""
      },
      tableData: [],
      page: {
        pageSize: 20,
        total: 100,
        pageNum: 1
      },
      titlename: "",
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
  mounted() {
    this.searchData();
  },
  methods: {
    searchData() {
      let postData = Object.assign({}, this.searchForm, this.page);
      getMessage(postData).then(res => {
        // this.tableData = res.data.list;
        let setData = [];
        setData = res.data.list.map(item => {
          let setUserDept = "";
          // userDept 部门
          if (item.messageToUserDept) {
            setUserDept = this.approverList.filter(approver => {
              if (approver.value == item.messageToUserDept) {
                return approver;
              }
            });
          }
          item["messageToUserDeptText"] =
            setUserDept.length > 0 ? setUserDept[0].label : "无";
          return item;
        });
        this.page.total = res.data.total
        this.tableData = setData;
      });
    },
    handleDelete(data) {
      this.$confirm("是否删除该账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteData(data.messageId);
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
      delMessage({ messages: delSelect }).then(res => {
        this.searchData();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    changeNotice(data) {
      // 0 未启用 1 为启用
      setMessage({
        messageId: data.messageId,
        state: data.messageState == "0" ? "1" : "0"
      }).then(res => {
        this.searchData();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    openMessage() {
      // this.searchForm = Object.assign(
      //   {},
      //   this.$data.searchForm,
      //   this.$options.data().searchForm
      // );
      // console.log(this.searchForm)
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    sureMessage() {
      if (this.$refs.noticeFrom.submitForm()) {
        addMessage(this.$refs.noticeFrom.dialogForm).then(res => {
          this.searchData();
          this.searchForm = Object.assign(
            {},
            this.$data.searchForm,
            this.$options.data().searchForm
          );
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "添加成功!"
          });
        });
      }
    }
  }
};
</script>
