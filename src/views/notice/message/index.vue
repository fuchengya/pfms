<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="消息类型：">
            <el-select
              @change="handleSearchList"
              v-model="listQuery.type"
              placeholder="全部"
              clearable
              class="input-width"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-message"></i>
      <span>消息列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="adminTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="类型" width="160" align="center">
          <template slot-scope="scope"
            ><el-tag
              size="medium"
              :type="scope.row.type === 'overBudget' ? 'danger' : ''"
              >{{ scope.row.typeName }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column label="详情" align="center">
          <template slot-scope="scope">{{ scope.row.info }}</template>
        </el-table-column>
        <el-table-column label="发送时间" width="160" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="已读" width="80" align="center">
          <template slot-scope="scope"
            ><el-tag
              size="medium"
              :type="scope.row.isRead ? 'success' : 'danger'"
              >{{ scope.row.isRead ? "是" : "否" }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.isRead"
              size="small"
              type="text"
              @click="handleRead(scope.row.id)"
            >
              点击已读
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10, 15, 20]"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchMessageList, readMessage } from "@/api/pfms";
import { formatDate } from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  type: "",
};
const defaultAdmin = {
  id: null,
  info: null,
  type: null,
  typeName: null,
};
export default {
  name: "messageList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      admin: Object.assign({}, defaultAdmin),
      typeOptions: [
        {
          label: "超阈值",
          value: "threshold",
        },
        {
          label: "超预算",
          value: "overBudget",
        },
      ],
      type: {
        threshold: "超阈值",
        overBudget: "超预算",
      },
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    // handleResetSearch() {
    //   this.listQuery = Object.assign({}, defaultListQuery);
    // },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleRead(id) {
      this.$confirm("是否已读?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        readMessage({ id }).then((response) => {
          this.$message({
            message: "读取成功！",
            type: "success",
          });
          this.getList();
        });
      });
    },
    getList() {
      const that = this;
      fetchMessageList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.list.map((item) => {
          item.typeName = that.type[item.type];
          return item;
        });
        this.total = response.data.total;
      });
    },
  },
};
</script>
<style></style>