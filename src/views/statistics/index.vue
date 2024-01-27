<template>
  <div class="app-container">
    <div class="statistics-layout">
      <div class="layout-title">趋势统计</div>
      <el-row>
        <el-date-picker
              style="float: center;z-index: 1"
              size="small"
              v-model="countTrendDate"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleTrendDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <div>
              <ve-histogram
                :data="trendData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="trendSettings"></ve-histogram>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">支出统计</div>
      <el-row>
        <el-date-picker
              style="float: center;z-index: 1"
              size="small"
              v-model="countExpendDate"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleExpendDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <div>
              <ve-pie
                :data="expendData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="trendPieSettings"></ve-pie>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">收入统计</div>
      <el-row>
        <el-date-picker
              style="float: center;z-index: 1"
              size="small"
              v-model="countIncomeDate"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleIncomeDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <div>
              <ve-pie
                :data="incomeData"
                :legend-visible="true"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="trendPieSettings"></ve-pie>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import { dashboard,trend,trendPie } from '../../api/pfms';
  import {formatDate} from '@/utils/date';

  export default {
    name: 'home',
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7)
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30 * 12);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        countTrendDate: '',
        countExpendDate: '',
        countIncomeDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:true,
          axisSite: { right: ['orderAmount']},
          labelMap: {'expendAmount': '支出', 'incomeAmount': '收入'}
        },
        trendData: {
          columns: ['date', 'expendAmount','incomeAmount'],
          rows: []
        },
        expendData: {
          columns: ['name', 'amount'],
          rows: []
        },
        incomeData: {
          columns: ['name', 'amount'],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount,
        dashboard: {},
        list: {},
        trendSettings: {
          axisSite: { right: ['incomeAmount']},
          labelMap: {'expendAmount': '支出', 'incomeAmount': '收入'},
          label: {show:true},
          yAxisName: ['支出金额','收入金额'],
          // showLine: ['incomeAmount']
        },
        trendPieSettings: {
          dataType: 'normal',
          selectedMode: 'multiple',
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            alignTo: 'edge',
            formatter: '{name|{b}}\n￥{amount|{c}}',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999'
              }
            }
          },
          labelLine: {
            length: 40,
            length2: 150,
            maxSurfaceAngle: 80
          },
          limitShowNum: 10,
          dimension: 'name',
          metrics: 'amount',
        },
      }
    },
    created(){
      this.initCountTrendDate();
      this.initCountExpendDate();
      this.initCountIncomeDate();
      this.getTrend();
      this.getIncome();
      this.getExpend();
    },
    methods:{
      handleTrendDateChange(){
        this.getTrend();
      },
      handleExpendDateChange() {
        this.getExpend();
      },
      handleIncomeDateChange() {
        this.getIncome();
      },
      initCountTrendDate(){
        const end = new Date();
        let start = new Date();
        start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7)
        this.countTrendDate=[start,end];
      },
      initCountExpendDate(){
        const end = new Date();
        let start = new Date();
        start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7)
        this.countExpendDate=[start,end];
      },
      initCountIncomeDate(){
        const end = new Date();
        let start = new Date();
        start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7)
        this.countIncomeDate=[start,end];
      },
      getTrend(){
        setTimeout(() => {
          dashboard().then(response => {
            this.dashboard = response.data;
          });
          const startDate = formatDate(this.countTrendDate[0], 'yyyy-MM-dd');
          const endDate = formatDate(this.countTrendDate[1], 'yyyy-MM-dd');
          trend({startDate, endDate}).then(response => {
              this.trendData.rows = response.data;
          });
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      },
      getExpend(){
        setTimeout(() => {
          dashboard().then(response => {
            this.dashboard = response.data;
          });
          const startDate = formatDate(this.countExpendDate[0], 'yyyy-MM-dd');
          const endDate = formatDate(this.countExpendDate[1], 'yyyy-MM-dd');
          trendPie({startDate, endDate, type: 'expend'}).then(response => {
              this.expendData.rows = response.data;
          });
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      },
      getIncome(){
        setTimeout(() => {
          dashboard().then(response => {
            this.dashboard = response.data;
          });
          const startDate = formatDate(this.countIncomeDate[0], 'yyyy-MM-dd');
          const endDate = formatDate(this.countIncomeDate[1], 'yyyy-MM-dd');
          trendPie({startDate, endDate, type: 'income'}).then(response => {
              this.incomeData.rows = response.data;
          });
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 20px;
    margin-left: 60px;
    margin-right: 60px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
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
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
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
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
