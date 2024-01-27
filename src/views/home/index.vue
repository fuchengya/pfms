<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">消息提醒</div>
            <div class="color-danger address-content">
              <i class="el-icon-message"></i>
              <router-link to="/notice/message"
                >{{ dashboard.messageCount }} 条未读消息，前往查看</router-link
              >
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">财务总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-success overview-item-value"
                  >￥{{ dashboard.totalData.totalExpendAmount }}</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >￥{{ dashboard.totalData.totalIncomeAmount }}</el-col
                >
                <el-col :span="6" class="color-warning overview-item-value"
                  >￥{{ dashboard.totalData.totalBalance }}</el-col
                >
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">总支出</el-col>
                <el-col :span="6" class="overview-item-title">总收入</el-col>
                <el-col :span="6" class="overview-item-title">总结余</el-col>
              </el-row>
            </div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-success overview-item-value">{{
                  dashboard.totalData.totalExpend
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  dashboard.totalData.totalIncome
                }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">支出笔数</el-col>
                <el-col :span="6" class="overview-item-title">收入笔数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">财务近况</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-success overview-item-value"
                  >￥{{ dashboard.monthData.totalExpendAmount }}</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >￥{{ dashboard.monthData.totalIncomeAmount }}</el-col
                >
                <el-col :span="6" class="color-success overview-item-value"
                  >￥{{ dashboard.yearData.totalExpendAmount }}</el-col
                >
                <el-col :span="6" class="color-danger overview-item-value"
                  >￥{{ dashboard.yearData.totalIncomeAmount }}</el-col
                >
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">本月支出</el-col>
                <el-col :span="6" class="overview-item-title">本月收入</el-col>
                <el-col :span="6" class="overview-item-title">年度支出</el-col>
                <el-col :span="6" class="overview-item-title">年度收入</el-col>
              </el-row>
            </div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-success overview-item-value">{{
                  dashboard.monthData.totalExpend
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  dashboard.monthData.totalIncome
                }}</el-col>
                <el-col :span="6" class="color-success overview-item-value">{{
                  dashboard.yearData.totalExpend
                }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{
                  dashboard.yearData.totalIncome
                }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title"
                  >本月支出笔数</el-col
                >
                <el-col :span="6" class="overview-item-title"
                  >本月收入笔数</el-col
                >
                <el-col :span="6" class="overview-item-title"
                  >年度支出笔数</el-col
                >
                <el-col :span="6" class="overview-item-title"
                  >年度收入笔数</el-col
                >
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">财务趋势</div>
      <el-row>
        <el-col :span="20">
          <div style="padding: 10px; border-left: 1px solid #dcdfe6">
            <el-date-picker
              style="float: right; z-index: 1"
              size="small"
              v-model="countDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"
              ></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import img_home_order from "@/assets/images/home_order.png";
import img_home_today_amount from "@/assets/images/home_today_amount.png";
import img_home_yesterday_amount from "@/assets/images/home_yesterday_amount.png";
import { dashboard, trend } from "../../api/pfms";
import { formatDate } from "@/utils/date";

export default {
  name: "home",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30 * 12);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      countDate: "",
      chartSettings: {
        xAxisType: "time",
        area: true,
        axisSite: { right: ["orderAmount"] },
        labelMap: { expendAmount: "支出", incomeAmount: "收入" },
      },
      chartData: {
        columns: ["date", "expendAmount", "incomeAmount"],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount,
      dashboard: {},
      list: {},
    };
  },
  created() {
    this.initCountDate();
    this.getData();
  },
  methods: {
    handleDateChange() {
      this.getData();
    },
    initCountDate() {
      const end = new Date();
      let start = new Date();
      start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7);
      this.countDate = [start, end];
    },
    getData() {
      setTimeout(() => {
        dashboard().then((response) => {
          this.dashboard = response.data;
        });
        const startDate = formatDate(this.countDate[0], "yyyy-MM-dd");
        const endDate = formatDate(this.countDate[1], "yyyy-MM-dd");
        trend({ startDate, endDate }).then((response) => {
          this.chartData.rows = response.data;
        });
        this.dataEmpty = false;
        this.loading = false;
      }, 1000);
    },
  },
};
</script>

<style scoped>
.app-container {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.address-layout {
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #dcdfe6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409eff;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #dcdfe6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}
.address-content {
  padding: 20px;
  font-size: 18px;
}
</style>
