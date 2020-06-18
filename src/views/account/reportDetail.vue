<template>
  <el-dialog
    width="800px"
    title="报备数据"
    :visible.sync="dialogReportVisible"
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
                <el-button size="mini" @click="handleEdit(scope.row)">修改状态</el-button>
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
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getProjectList } from "@/api/project";
export default {
  name: "Project",
  props: {
    dialogReportVisible: {
      type: Boolean,
      default: false
    },
    reportId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchForm: {
        ProjectName: "",
        Area: "",
        orderType: 1,
        PageIndex: 1,
        PageSize: 50
      },
      page: {
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
        { prop: "ReportCount", label: "报备数", width: "150px" },
        { prop: "ResidenterName", label: "项目驻场人", width: "150px" },
        { prop: "ResidenterMobile", label: "项目驻场人手机号", width: "150px" },
        { prop: "PrincipalerName", label: "项目负责人", width: "150px" },
        {
          prop: "PrincipalerMobile",
          label: "项目负责人手机号",
          width: "150px"
        },
        { prop: "AreaName", label: "项目所在地区", width: "150px" },
        { prop: "Discount", label: "项目优惠" },
        { prop: "Developer", label: "项目开发商", width: "150px" },
        { prop: "OpeningTime", label: "开盘时间", width: "150px" },
        { prop: "Commission", label: "项目佣金", width: "150px" }
        // { prop: "Remark", label: "特别说明" },
        // { prop: "LinkAgeRules", label: "联动规则" }
      ],
      tableLoading: false,
      dialogTitle: "",
      dialogId: 0
    };
  },
  watch: {
    reportId() {
      console.log(this.dialogReportVisible);
    },
    dialogReportVisible() {
      console.log(this.dialogReportVisible);
    }
  },
  methods: {
    getDataList() {
      this.tableLoading = true;
      getProjectList(this.searchForm)
        .then(data => {
          this.page.total = data.total;

          this.tableData = data.Result.map(item => {
            this.groupList.areaList.find(data => {
              if (data.value == item.Area) {
                item["AreaName"] = data.text;
                return true;
              } else {
                item["AreaName"] = "全部";
                return;
              }
            });
            return item;
          });
          // this.tableData = data.Result;
          this.tableLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleEdit(data) {
      this.dialogTitle = "修改项目";
      this.dialogId = data.Id;
      this.dialogReportVisible = true;
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
