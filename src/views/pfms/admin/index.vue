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
          <!-- <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/姓名" clearable></el-input>
          </el-form-item> -->
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
      <span>数据明细</span>
      <el-button icon="el-icon-upload2" size="small" type="primary" class="btn-add" @click="handleImport()" style="margin-left: 20px">上传文件</el-button>
      <el-button icon="el-icon-plus" size="small" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <!-- <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column> -->
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
        <el-table-column label="记录时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updateTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
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
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑':'添加'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="admin"
               ref="adminForm"
               label-width="150px" size="small">
        <el-form-item label="日期：">
          <el-date-picker
            v-model="admin.date"
            type="date"
            clearable="false"
            style="width: 250px"
            @change="handleDateChange"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select style="width: 250px" v-model="admin.type"  @change="handleTypeChange"  placeholder="全部" class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额：">
          <el-input v-model="admin.amount" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="分类：">
          <el-select style="width: 250px" v-model="admin.category" placeholder="全部" class="input-width">
              <el-option v-for="item in categories"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="admin.remark"
                    type="textarea"
                    :rows="5"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="发票：">
          <el-upload
            class="avatar-uploader"
            accept="image/png, image/jpeg"
            action="http://localhost:8080/pfms/upload"
            :show-file-list="false"
            :on-success="handleSuccess">
            <img v-if="admin.invoice" :src="admin.invoice" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
    :title="csvTitle"
    :visible.sync="csvVisible"
    width="50%">
    <div style="padding: 20px;">
      <el-button aria-disabled size="small" type="warning" icon="el-icon-info">请确保您的表格中包含模版中罗列的必填字段，否则可能会导致导入失败</el-button>
      <el-button type="primary" @click="handleDownload">下载模板</el-button>
    </div>
    <div>
        <el-form ref="file" label-width="120px">
        <el-form-item label="CSV文件导入：">
            <el-upload
                class="upload-demo"
                ref="upload"
                drag
                accept=".csv"
                action=""
                :multiple="false"
                :limit="1"
                :auto-upload="false"
                :on-change="handleChange">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">文件格式仅支持csv，单个文件需小于10M</div>
            </el-upload>
        </el-form-item>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="csvVisible = false">取消</el-button>
    <el-button type="primary" @click="importCsv">导入</el-button>
    </span>
</el-dialog>
  </div>
</template>
<script>
  import {fetchList,listCategories,createFinance,updateFinance,deleteFinance,importFinance} from '@/api/pfms';
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
    invoice: null,
  };
  export default {
    name: 'adminList',
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
        categories: [],
        csvTitle: '上传交易记录',
        file: {},
        upload: {},
        csvVisible: false,
        templateData: [
          {
            "date": "2023-11-12",
            "type": "income",
            "amount": 1314.52,
            "category": 16,
            "remark": "备注"
          },
          {
            "date": "2023-11-13",
            "type": "expend",
            "amount": 520.13,
            "category": 18,
            "remark": "花费备注"
          }
        ]
      }
    },
    created() {
      this.getList();
      this.getCateList({type: ''});
      // this.initDateRange();
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
      handleImport() {
        this.file = {};
        this.csvVisible = true;
        this.csvTitle = '';
        this.$refs.upload.clearFiles(); 
      },
      handleTypeChange() {
        this.getCategories({type: this.admin.type});
      },
      initDateRange(){
        let start = new Date();
        const end = new Date();
        start.setTime(end.getTime() - 1000 * 60 * 60 * 24 * 7)
        this.dateRange=[start,end];
      },
      getCateList(param){
        this.categoryOptions = [];
        listCategories(param).then(response=>{
          let cateList = response.data;
          for(let i=0;i<cateList.length;i++){
            let cate = cateList[i];
            this.categoryOptions.push({label:cate.name,value:cate.id});
            this.categories.push({label:cate.name,value:cate.id});
          }
        })
      },
      getCategories(param){
        this.categories = [];
        listCategories(param).then(response=>{
          let cateList = response.data;
          for(let i=0;i<cateList.length;i++){
            let cate = cateList[i];
            this.categories.push({label:cate.name,value:cate.id});
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
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.admin = Object.assign({},defaultAdmin);
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFinance(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.admin = Object.assign({},row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateFinance(this.admin.id,this.admin).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            createFinance(this.admin).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      formattedDate() {
        let date = this.admin.date;
        // 格式化日期为 'YYYY-MM-DD'
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.admin.date = `${year}-${month}-${day}`;
      },
      getList() {
        fetchList(this.listQuery).then(response => {
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
      handleDownload(){
        // 将 JSON 数组转换为 CSV 格式的字符串
        const csvContent = this.convertArrayToCSV(this.templateData);
        // 创建 Blob 对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        // 创建下载链接
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = '导入交易记录模板.csv';
        // 触发点击下载链接
        document.body.appendChild(downloadLink);
        downloadLink.click();
        // 清理创建的元素
        document.body.removeChild(downloadLink);
      },
      convertArrayToCSV(array) {
        const header = Object.keys(array[0]).join(',') + '\n';
        const rows = array.map(obj => {
          return Object.values(obj).join(',') + '\n';
        });
        return header + rows.join('');
      },
      async importCsv() {
        if (Object.keys(this.file).length != 0) {
          importFinance(this.file.file).then(response => {
            this.$message({
              message: '上传成功！',
              type: 'success'
            });
            this.csvVisible =false;
            this.getList();
          });
        }else{
          this.$message.error('上传文件不能为空');
        }
      },
      handleDateChange() {
        this.formattedDate();
      },
      handleChange(file) {
        // this.$refs.upload.clearFiles();
        //每次上传前都清空
        this.file = {};
        //赋值
        this.file.file = file.raw;
      },
      handleSuccess(response, file) {
        // 处理上传成功后的逻辑，获取后端返回的文件路径
        const filePath = response.data;
        this.admin.invoice = `http://localhost:8080/${filePath}`;
        console.error(filePath);
    },
    }
  }
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

