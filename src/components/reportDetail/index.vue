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
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </template>
            <el-table-column fixed="right" align="center" label="操作" width="100px">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改状态</el-button>
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
  </el-dialog>
</template>
<script>
import { GetReportListByUserId, GetReportListByProjectId } from "@/api/report";
export default {
  name: "Project",
  props: {
    dialogReportVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: 0
    },
    projectId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchForm: {
        UserId: 0,
        PageIndex: 1,
        PageSize: 20,
        total: 0
      },
      groupList: {
        areaList: [],
        typeList: [
          {
            text: "默认",
            value: 1
          },
          {
            text: "日期排序",
            value: 2
          },
          {
            text: "热度",
            value: 3
          }
        ]
      },
      tableData: [],
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
        { prop: "ReporterMobile", label: "报备人手机号" },
        { prop: "StoreName", label: "门店", width: "150px" },
        { prop: "Remark", label: "备注", width: "150px" },
        { prop: "StatusName", label: "报备状态", width: "150px" }
      ],
      tableLoading: false,
      dialogTitle: ""
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
          this.searchForm.UserId = this.projectId;
          this.$nextTick(() => {
            // this.getDataList();
          });
        }
      }
    }
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
        .then(data => {
          this.searchForm.total = data.total;

          // this.tableData = data.Result.map(item => {
          //   this.groupList.areaList.find(data => {
          //     if (data.value == item.Area) {
          //       item["AreaName"] = data.text;
          //       return true;
          //     } else {
          //       item["AreaName"] = "全部";
          //       return;
          //     }
          //   });
          //   return item;
          // });
          // this.tableData = data.Result;
          this.tableLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTableByProjectId() {
      GetReportListByProjectId(this.searchForm)
        .then(data => {
          this.searchForm.total = data.total;

          // this.tableData = data.Result.map(item => {
          //   this.groupList.areaList.find(data => {
          //     if (data.value == item.Area) {
          //       item["AreaName"] = data.text;
          //       return true;
          //     } else {
          //       item["AreaName"] = "全部";
          //       return;
          //     }
          //   });
          //   return item;
          // });
          // this.tableData = data.Result;
          this.tableLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleEdit(data) {
      this.dialogTitle = "修改项目";
      // this.projectId = data.Id;
      // this.dialogReportVisible = true;
    },
    handleSizeChange() {
      this.getDataList();
    },
    handleCurrentChange() {
      this.getDataList();
    }
  }
};
</script>
