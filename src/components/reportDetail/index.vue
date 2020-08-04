<template>
  <el-dialog
    width="800px"
    title="报备数据"
    :visible="dialogReportVisible"
    :close-on-click-modal="false"
    class="diaTable"
    @close="$emit('update:dialogReportVisible',false)"
  >
    <div class="commonTemp">
      <div class="content">
        <div class="tableBox">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            height="400px"
            size="mini"
            stripe
            border
            style="width: 100%"
          >
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
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
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
          :total="searchForm.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      width="400px"
      title="报备状态修改"
      :visible="dialogFormVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="commonTemp">
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="dialogForm"
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
          <el-form-item v-if="dialogForm.Status == 8" label="房号">
            <el-input v-model="dialogForm.HourseCode" placeholder="请输入房号" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import {
  GetReportListByUserId,
  GetReportListByProjectId,
  ChangeStatus,
} from "@/api/report";
export default {
  name: "Project",
  props: {
    dialogReportVisible: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Number,
      default: 0,
    },
    projectId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      searchForm: {
        UserId: 0,
        PageIndex: 1,
        PageSize: 20,
        total: 0,
      },
      tableData: [],
      tableName: [
        { prop: "ProjectName", label: "项目名称", width: "150px" },
        { prop: "PrincipalerName", label: "项目负责人姓名", width: "150px" },
        {
          prop: "PrincipalerMobile",
          label: "项目负责人手机号",
          width: "150px",
        },
        { prop: "CustomerName", label: "客户姓名", width: "150px" },
        { prop: "CustomerMobile", label: "客户手机号", width: "150px" },
        { prop: "ArriveDateTime", label: "预约来访时间", width: "150px" },
        {
          prop: "CompanyName",
          label: "体系",
          width: "150px",
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
          fixed: "right",
        },
      ],
      groupList: {
        sateList: [
          {
            value: 1,
            label: "界定中",
          },
          {
            value: 2,
            label: "有效推荐",
          },
          {
            value: 3,
            label: "无效推荐",
          },
          {
            value: 4,
            label: "有效带看",
          },
          {
            value: 5,
            label: "有效到访",
          },
          {
            value: 6,
            label: "认筹",
          },
          {
            value: 7,
            label: "认购",
          },
          {
            value: 8,
            label: "成交",
          },
        ],
      },
      dialogForm: {
        ReportId: 0,
        Status: 0,
        HourseCode: "",
      },
      orginHourseCode: "",
      tableLoading: false,
      dialogFormVisible: false,
    };
  },
  watch: {
    dialogReportVisible: {
      handler() {
        if (this.userId !== 0) {
          this.searchForm.UserId = this.userId;
          this.$nextTick(() => {
            this.getDataList();
          });
        }
        if (this.projectId !== 0) {
          this.searchForm.UserId = null;
          this.searchForm.ProjectId = this.projectId;
          this.$nextTick(() => {
            this.getDataList();
          });
        }
      },
    },
  },
  methods: {
    getDataList() {
      this.tableLoading = true;
      if (this.userId) {
        this.getTableByUserId();
      } else {
        this.getTableByProjectId();
      }
    },
    getTableByUserId() {
      GetReportListByUserId(this.searchForm)
        .then((data) => {
          this.searchForm.total = data.total;
          this.tableData = data.Result;
          this.tableLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTableByProjectId() {
      GetReportListByProjectId(this.searchForm)
        .then((data) => {
          this.searchForm.total = data.total;
          this.tableData = data.Result;
          this.tableLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleEdit(item) {
      this.dialogForm.ReportId = item.Id;
      this.orginHourseCode = item.HourseCode;
      this.dialogForm.Status = this.groupList.sateList
        .map((data) => {
          if (data.label == item.StatusName) {
            return data.value;
          }
        })
        .filter((item) => item)[0];
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    submitForm() {
      let data = Object.assign({}, this.dialogForm, {
        HourseCode:
          this.dialogForm.Status == 8
            ? this.dialogForm.HourseCode
            : this.orginHourseCode,
      });
      ChangeStatus(data).then((res) => {
        this.$message.success("报备状态修改成功");
        this.dialogFormVisible = false;
        this.getDataList();
      });
    },
    handleSizeChange(val) {
      this.searchForm.PageIndex = 1;
      this.searchForm.PageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.searchForm.PageIndex = val;
      this.getDataList();
    },
  },
};
</script>
