<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="noticeSetting"
             ref="noticeSettingForm"
             :rules="rules"
             label-width="150px">
      <el-form-item label="月度阈值：" prop="monthThreshold">
        <el-input v-model="noticeSetting.monthThreshold" class="input-width">
          <template slot="append">%</template>
        </el-input>
        <span class="note-margin">月度支出超出此阈值发送提醒</span>
      </el-form-item>
      <el-form-item label="是否启用月度阈值：">
        <el-radio-group v-model="noticeSetting.monthFlag">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年度阈值：" prop="yearThreshold">
        <el-input v-model="noticeSetting.yearThreshold" class="input-width">
          <template slot="append">%</template>
        </el-input>
        <span class="note-margin">年度支出超出此阈值发送提醒</span>
      </el-form-item>
      <el-form-item label="是否启用年度阈值：">
        <el-radio-group v-model="noticeSetting.yearFlag">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否发送邮件提醒：">
        <el-radio-group v-model="noticeSetting.noticeFlag">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮件地址：" prop="email">
        <el-input v-model="noticeSetting.email" class="input-width">
          <template slot="append"><i class="el-icon-message"></i></template>
        </el-input>
        <span class="note-margin">请确保邮件地址正确</span>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="confirm('noticeSettingForm')"
          type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {noticeSetting,noticeUpdateSetting} from '@/api/pfms';
  const defaultNoticeSetting = {
    id: null,
    monthThreshold: 0,
    yearThreshold: 0,
    monthFlag: false,
    yearFlag: false,
    noticeFlag: false,
    email: '',
  };
  const checkThreshold = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('阈值不能为空'));
    }
    let intValue = parseFloat(value);
    console.log("checkThreshold",value);
    if (intValue % 1 !== 0) {
      return callback(new Error('请输入整数百分比'));
    }
    if (!Number.isInteger(intValue)) {
      return callback(new Error('请输入整数百分比'));
    }
    if (intValue<=0||intValue>=100) {
      return callback(new Error('请输入1~99的百分比'));
    }
    callback();
  };
  const checkEmail = (rule, value, callback) => {
    console.log("checkEmail",value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return callback(new Error('请输入有效的邮件地址'));
    }
    callback();
  };
  export default {
    name: 'noticeSetting',
    data() {
      return {
        noticeSetting: Object.assign({}, defaultNoticeSetting),
        rules: {
          monthThreshold:{validator: checkThreshold, trigger: 'blur' },
          yearThreshold:{validator: checkThreshold, trigger: 'blur' },
          email:{validator: checkEmail, trigger: 'blur' },
        }
      }
    },
    created(){
      this.getDetail();
    },
    methods:{
      confirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否要提交修改?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              noticeUpdateSetting(this.noticeSetting).then(response=>{
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                  duration:1000
                });
              })
            });
          } else {
            this.$message({
              message: '提交参数不合法',
              type: 'warning'
            });
            return false;
          }
        });
      },
      getDetail(){
        noticeSetting().then(response=>{
          this.noticeSetting=response.data;
        })
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 50%;
  }

  .note-margin {
    margin-left: 15px;
  }
</style>


