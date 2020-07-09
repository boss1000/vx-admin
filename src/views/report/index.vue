<template>
  <div class="commonTemp">
    <div class="searchBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
        <!-- <el-button type="primary" size="small" @click="addData">新增</el-button> -->
        <el-button plain size="small" @click="restData">重置</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="downloadLoading"
          @click="downloadReportList"
        >导出列表</el-button>
      </div>
    </div>
    <div class="searchForm">
      <el-form :inline="true" :model="searchForm" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="关键词">
              <el-input v-model="searchForm.Q" placeholder="请输入关键词" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <datepicker
              titleName="日期范围"
              labelWidth="110px"
              dateType="date"
              format="yyyy-MM-dd"
              :fristValue.sync="searchForm.DateBegin"
              :lastValue.sync="searchForm.DateEnd"
            ></datepicker>
          </el-col>
          <el-col :span="5">
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
          <el-col :span="5">
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
          ref="tableBox"
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
              :fixed="item.fixed"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
          </template>
          <el-table-column fixed="right" align="center" label="操作" width="100px">
            <template v-if="scope.row.Type !== 308" slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
              <!-- <el-button type="primary" size="small" @click="downloaReportEdit(scope.row)">修改记录</el-button> -->
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
    <el-dialog
      width="400px"
      title="报备状态修改"
      :visible="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <div class="commonTemp">
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="dialogForm"
          :rules="rules"
          class="detailForm"
          label-width="100px"
        >
          <el-form-item label="状态枚举">
            <el-select v-model="dialogForm.Status" placeholder="请选择地区" clearable>
              <el-option
                v-for="item in groupList.sateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="sureloading" @click="submitForm('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GetReportList,
  ChangeStatus,
  ExportReportList,
  ExportProjectEditRecordList
} from "@/api/report";
import { GetAreaList } from "@/api/project";
import datepicker from "@/components/datepicker";
export default {
  name: "Account",
  components: {
    datepicker
  },
  data() {
    return {
      sureloading: false,
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
      dialogForm: {
        ReportId: 0,
        Status: 0
      },
      groupList: {
        areaList: [],
        sateList: [
          {
            value: null,
            label: "全部"
          },
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
        { prop: "ReporterMobile", label: "报备人手机号", width: "180px" },
        { prop: "CreateTime", label: "报备时间", width: "150px" },
        { prop: "StoreName", label: "门店", width: "150px" },
        { prop: "Remark", label: "备注", width: "150px" },
        {
          prop: "StatusName",
          label: "报备状态",
          width: "150px",
          fixed: "right"
        }
      ],
      rules: {
        Status: [
          { required: true, message: "请选择账号类型", trigger: "change" }
        ]
      },
      projectList: [],
      userId: 0
    };
  },
  activated() {
    this.$refs.tableBox.doLayout();
  },
  mounted() {
    this.getAreaList();
    this.getDataList();
  },
  methods: {
    handleEdit(item) {
      this.dialogForm.ReportId = item.Id;
      this.dialogForm.Status = this.groupList.sateList
        .map(data => {
          if (data.label == item.StatusName) {
            return data.value;
          }
        })
        .filter(item => item)[0];
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    submitForm() {
      this.sureloading = true;
      ChangeStatus(this.dialogForm)
        .then(res => {
          this.$message.success("报备状态修改成功");
          this.dialogFormVisible = false;
          this.sureloading = false;
          this.getDataList();
        })
        .catch(() => {
          this.sureloading = false;
        });
    },
    getAreaList() {
      GetAreaList().then(data => {
        this.groupList.areaList = [
          {
            value: null,
            text: "全部"
          }
        ].concat(data.Result);
      });
    },
    getDataList() {
      this.tableLoading = true;
      GetReportList(this.searchForm).then(res => {
        this.tableData = res.Result;
        this.searchForm.total = res.total;
        this.tableLoading = false;
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
    handleSizeChange() {
      this.searchForm.PageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.searchForm.PageIndex = val;
      this.getDataList();
    },
    downloadReportList() {
      let { PageIndex, PageSize, ...searchData } = this.searchForm;
      this.downloadLoading = true;
      ExportReportList(searchData).then(data => {
        // 处理返回的文件流
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const fileName = `报备列表.xls`;
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);

        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.downloadLoading = false;
        this.$message({
          type: "success",
          message: "开始下载"
        });
      });
    },
    downloaReportEdit() {
      ExportProjectEditRecordList({ RReportId: row.Id }).then(data => {
        // 处理返回的文件流
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const fileName = `报备修改记录.xls`;
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);

        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.$message({
          type: "success",
          message: "开始下载"
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
