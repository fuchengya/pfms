<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="budgetSetting"
             ref="budgetSettingForm"
             :rules="rules"
             label-width="150px">
      <el-form-item label="月度预算：" prop="monthAmount">
        <el-input v-model="budgetSetting.monthAmount" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否启用月度预算：">
        <el-radio-group v-model="budgetSetting.monthFlag">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年度预算：" prop="yearAmount">
        <el-input v-model="budgetSetting.yearAmount" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否启用年度预算：">
        <el-radio-group v-model="budgetSetting.yearFlag">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="confirm('budgetSettingForm')"
          type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {budgetSetting,budgetUpdateSetting} from '@/api/pfms';
  const defaultbudgetrSetting = {
    id: null,
    monthAmount: 0,
    yearAmount: 0,
    monthFlag: false,
    yearFlag: false,
  };
  const checkAmount = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('金额不能为空'));
    }
    let intValue = value;
    console.log("checkAmount",intValue);
    if (Number(intValue) === intValue && intValue % 1 !== 0) {
      intValue = parseFloat(value);
    } else {
      intValue = parseInt(value);
      if (!Number.isInteger(intValue)) {
        return callback(new Error('请输入数字金额'));
      }
    }
    if (intValue<=0) {
      return callback(new Error('请输入大于0的金额'));
    }
    callback();
  };
  export default {
    name: 'budgetSetting',
    data() {
      return {
        budgetSetting: Object.assign({}, defaultbudgetrSetting),
        rules: {
          monthAmount:{validator: checkAmount, trigger: 'blur' },
          yearAmount:{validator: checkAmount, trigger: 'blur' },
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
              budgetUpdateSetting(this.budgetSetting).then(response=>{
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
        budgetSetting().then(response=>{
          this.budgetSetting=response.data;
        })
      },
      isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
      }
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


