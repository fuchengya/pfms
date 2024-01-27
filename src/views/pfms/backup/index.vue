<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small"
          icon="el-icon-search">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
          icon="el-icon-refresh">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="类型：">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="分类：">
            <el-select v-model="listQuery.category" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in categoryOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>备份明细</span>
      <el-button icon="el-icon-refresh" size="small" type="primary" class="btn-add" @click="handleBackup()" style="margin-left: 20px">全量备份</el-button>
      <el-button icon="el-icon-download" size="small" type="primary" class="btn-add" @click="handleExport()" style="margin-left: 20px">导出文件</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="元编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.originId}}</template>
        </el-table-column>
        <el-table-column label="日期" align="center">
          <template slot-scope="scope">{{scope.row.date}}</template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">{{scope.row.type === 'expend' ? '支出' : '收入'}}</template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="scope">{{scope.row.categoryLabel}}</template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">￥{{scope.row.amount}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column label="最后同步时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updateTime | formatDateTime}}</template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column> -->
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
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchBackupList,listCategories,exportFinance,exportFinanceNew,backup} from '@/api/pfms';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    keyword: null
  };
  const defaultAdmin = {
    id: null,
    date: null,
    type: null,
    category: null,
    amount: null,
    remark: null,
  };

  export default {
    name: 'backupList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        admin: Object.assign({}, defaultAdmin),
        isEdit: false,
        typeOptions: [{
          label: '支出',
          value: 'expend',
        },{
          label: '收入',
          value: 'income',
        }],
        dateRange: '',
        categoryOptions:[],
      }
    },
    created() {
      this.getList();
      this.getCateList();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      getCateList(param){
        this.categoryOptions = [];
        listCategories(param).then(response=>{
          let cateList = response.data;
          for(let i=0;i<cateList.length;i++){
            let cate = cateList[i];
            this.categoryOptions.push({label:cate.name,value:cate.id});
          }
        })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        if (this.dateRange != null && this.dateRange != '') {
          this.listQuery.startDate = formatDate(this.dateRange[0], 'yyyy-MM-dd');
          this.listQuery.endDate = formatDate(this.dateRange[1], 'yyyy-MM-dd');
        } else {
          this.listQuery.startDate = '';
          this.listQuery.endDate = '';
        }
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
      getList() {
        fetchBackupList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.list.map(item=> {
            const replaceItem = this.categoryOptions.find(reItem => 
              reItem.value === item.category
            )
            item.categoryLabel = replaceItem.label;
            return item;
          });
          this.total = response.data.total;
        });
      },
      // handleExport() {
      //   exportFinance().then(response => {
      //     const now = Date.now();
      //     const url = window.URL.createObjectURL(new Blob([response.data]));
      //     const link = document.createElement('a');
      //     link.href = url;
      //     link.setAttribute('download', `交易记录导出${now}.csv`);
      //     document.body.appendChild(link);
      //     link.click();
      //     this.$message({
      //       message: '导出成功！',
      //       type: 'success'
      //     });
      //   })
      //   .catch((err) => {
      //     console.error('导出失败！', err);
      //     this.$message.error('导出失败！');
      //   });
      // },
      handleExport() {
        exportFinanceNew(this.listQuery).then(response => {
          const now = Date.now();
          // 将 JSON 数组转换为 CSV 格式的字符串
          const csvContent = this.convertArrayToCSV(response.data);
          // 创建 Blob 对象
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          // 创建下载链接
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `交易记录导出${now}.csv`;
          // 触发点击下载链接
          document.body.appendChild(downloadLink);
          downloadLink.click();
          // 清理创建的元素
          document.body.removeChild(downloadLink);
          this.$message({
            message: '导出成功！',
            type: 'success'
          });
        }).catch((err) => {
          console.error('导出失败！', err);
          this.$message.error('导出失败！');
        });;
      },
      handleBackup() {
        backup().then(response => {
          this.$message({
            message: '执行全量备份成功',
            type: 'success'
          });
          setTimeout(() => {
            this.getList();
          }, 3000);
        }).catch((err) => {
          console.error('备份失败！', err);
          this.$message.error('备份失败！');
        });;
      },
      convertArrayToCSV(array) {
        const header = Object.keys(array[0]).join(',') + '\n';
        const rows = array.map(obj => {
          return Object.values(obj).join(',') + '\n';
        });
        return header + rows.join('');
      },
    }
  }
</script>
<style></style>


