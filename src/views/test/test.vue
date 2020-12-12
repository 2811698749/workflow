<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="id" prop="id">
                  <el-input
                  v-model="queryParams.id"
                  placeholder="请输入id"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
          />
                </el-form-item>
              <el-form-item label="姓名" prop="name">
                  <el-input
                  v-model="queryParams.name"
                  placeholder="请输入姓名"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
          />
                </el-form-item>
              <el-form-item label="编号" prop="code">
                  <el-input
                  v-model="queryParams.code"
                  placeholder="请输入编号"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
          />
                </el-form-item>
              <el-form-item label="年龄" prop="age">
                  <el-input
                  v-model="queryParams.age"
                  placeholder="请输入年龄"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
          />
                </el-form-item>
              <el-form-item label="$column.comments" prop="createAt">
                  <el-date-picker
                  v-model="queryParams.createAt"
                  type="date"
                  placeholder="请输入$column.comments">
          </el-date-picker>
                </el-form-item>
              <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <div class="top-right-btn">
        <el-col :span="1.5">
          <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
                  type="warning"
                  icon="el-icon-download"
                  size="mini"
                  :loading="downloadLoading"
                  @click="handleSelExport"
          >导出当页</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
                  type="danger"
                  icon="el-icon-download"
                  size="mini"
                  :loading="downloadLoading"
                  @click="handleAllExport"
          >导出全部</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openImport"
          >导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
                  type="danger"
                  icon="el-icon-edit"
                  size="mini"
                  :disabled="multiple"
                  @click="delSel"
          >批量删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
                  type="success"
                  icon="el-icon-upload2"
                  size="mini"
                  :disabled="multiple"
                  @click="handleCommit"
          >批量上报</el-button>
        </el-col>
      </div>
    </el-row>

    <el-table v-loading="loading" ref="table" :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
            <el-table-column label="id" align="center" prop="id"/>
            <el-table-column label="姓名" align="center" prop="name"/>
            <el-table-column label="编号" align="center" prop="code"/>
            <el-table-column label="年龄" align="center" prop="age"/>
            <el-table-column label="$column.comments" align="center" prop="createAt"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
                  v-if="editable(scope.row.approveStatus)"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
                  v-if="deletable(scope.row.approveStatus)"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
            v-show="total>0"
            :page-sizes="[20, 30, 50]"
            :page-size="queryParams.pageSize"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item  :disabled="isDetail" label="id" prop="id">
                  <el-input  :disabled="isDetail" v-model="form.id" placeholder="请输入id" />
                </el-form-item>
                <el-form-item  :disabled="isDetail" label="姓名" prop="name">
                  <el-input  :disabled="isDetail" v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item  :disabled="isDetail" label="编号" prop="code">
                  <el-input  :disabled="isDetail" v-model="form.code" placeholder="请输入编号" />
                </el-form-item>
                <el-form-item  :disabled="isDetail" label="年龄" prop="age">
                  <el-input  :disabled="isDetail" v-model="form.age" placeholder="请输入年龄" />
                </el-form-item>
                <el-form-item  :disabled="isDetail" label="$column.comments" prop="createAt">
                  <el-date-picker
                  :disabled="isDetail"
                  v-model="form.createAt"
                  type="date"
                  placeholder="请输入$column.comments">
          </el-date-picker>
                </el-form-item>
              </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    导入excel-->
    <el-dialog title="导入" :visible.sync="importOpen" width="500px" append-to-body>
      <div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-upload
                    ref="upload"
                    class="upload-demo"
                    action=""
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :on-exceed="handleExceed"
                    :limit="1"
                    accept=".xlsx,.xls"
                    :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <el-button
                    type="warning"
                    icon="el-icon-download"
                    size="mini"
                    @click="handleDownTemplate"
            >下载模板</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importOpen = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPage, findById, insert, update, del, listAll, imp } from '@/api/test'
import { getAppoveName, statusList, editable, deletable, checkable } from '@/utils/approve'
import { startDataProcess } from '@/api/workflow'
export default {
  name: 'Test',
  data() {
    return {
      //选中数据
      selectionRows: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      tableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
                  id: undefined,                  name: undefined,                  code: undefined,                  age: undefined,                  createAt: undefined              },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
                  id: [
          { required: true, message: "id不能为空", trigger: 'blur' }
        ],                    name: [
          { required: true, message: "姓名不能为空", trigger: 'blur' }
        ],                    code: [
          { required: true, message: "编号不能为空", trigger: 'blur' }
        ],                    age: [
          { required: true, message: "年龄不能为空", trigger: 'blur' }
        ],                    createAt: [
          { required: true, message: "$column.comments不能为空", trigger: 'blur' }
        ]                },
      detailId: '',
       // 表格选中数据
      multipleData: [],
      // 导出按钮
      downloadLoading: false,
      importOpen: false,
      isDetail: false,
                                                                                        
      tHeader:['id','姓名','编号','年龄','$column.comments'],
      filterVal:['id','name','code','age','createAt']
  }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSizeChange(val){
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val){
      this.queryParams.pageNum = val
      this.getList()
    },
    getList() {
      this.loading = true
      this.queryParams.pageNo = this.queryParams.pageNum
      listPage(this.queryParams).then(res => {
                this.tableList = res.content
                this.total = res.totalElements
                this.loading = false
              }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
                  id: undefined,                  name: undefined,                  code: undefined,                  age: undefined,                  createAt: undefined              }
      // this.resetForm("form")
    },
    resetForm(refName){
        this.$refs[refName].resetFields()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isDetail = false
      this.reset()
      this.open = true
      this.title = '添加$comments'
    },
    /** 查看详情 */
    handleDetail(row) {
      this.detailId = row.id
      this.reset()
      this.title = '查看$comments'
      findById(row.id).then(res => {
        this.form = res
        this.isDetail = true
        this.open = true
      })

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isDetail = false
      this.reset()
      this.title = '修改$comments'
      findById(row.id).then(res => {
        this.form = res
        this.open = true
      })
      // this.form = _.cloneDeep(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleSelection(selection, row){
      if (!checkable(row.approveStatus)) {
        this.msgWarning('禁止选中')
        this.$refs.table.toggleRowSelection(row, false)
      }
      this.selectionRows = selection.filter(item => checkable(item.approveStatus))
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleSelectionAll(selection){
      const toggleRows = selection.filter(item => !checkable(item.approveStatus))
      toggleRows.forEach(item => this.$refs.table.toggleRowSelection(item, false))
      this.selectionRows = selection.filter(item => checkable(item.approveStatus))
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => { 
      if (valid) {
      if (this.form.id != undefined) {
      update(this.form).then(response => {
        this.msgSuccess('修改成功')
        this.open = false
        this.getList()
      })
      } else {
      insert(this.form).then(response => {
        this.msgSuccess('新增成功')
        this.open = false
        this.getList()
      })
      }
      }
      })
    },
    /** 批量删除按钮操作 */
    delSel(){
      let ids = ''
      this.ids.forEach((item, index) => {
        if(index == 0) ids += item
        else ids += ',' + item
      })
      this.del(ids)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.del(row.id)
    },
    /** 删除按钮操作 */
    del(ids) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return del(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出当页 */
    handleSelExport(){
      this.downloadLoading = true
      // this.export(this.multipleData)
      this.export(this.tableList)
      this.downloadLoading = false
    },
    handleDownTemplate(){
      this.export([],'${comments}-模板')
    },
    handleAllExport(){
      this.downloadLoading = true
      listAll().then(res => {
        this.export(res)
        this.downloadLoading = false
      })
    },
    editable(code){
      return editable(code)
    },
    deletable(code) {
      return deletable(code)
    },
    export(jsonData, filename){
      if(!filename) filename = '${comments}'
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tHeader
        const filterVal = this.filterVal
        const data = this.formatJson(jsonData,filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename
        })
        this.downloadLoading = false
      })
    },
    formatJson(jsonData, filterVal){
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    openImport(){
      this.importOpen = true
    },
    //上传文件时处理方法
    handleChange(file, fileList){
      this.fileTemp = file.raw;
      if(this.fileTemp){
        let filenameArr = this.fileTemp.name.split('.')
        if(filenameArr.length > 0 && (filenameArr[filenameArr.length - 1] == 'xls' || filenameArr[filenameArr.length - 1] == 'xlsx')){
          this.importfxx(this.fileTemp);
        } else {
          this.msgWarning('附件格式错误，请删除后重新上传！')
        }
      } else {
        this.msgWarning('请上传附件！')
      }
    },
    //超出最大上传文件数量时的处理方法
    handleExceed(){
      this.msgWarning('超出最大上传文件数量的限制！')
      return
    },
    //移除文件的操作方法
    handleRemove(file,fileList){
      this.fileTemp = null
    },
    handleCommit(){
      if (this.selectionRows.length === 0) return
      const projectCode = this.selectionRows[0].section
      const ids = this.selectionRows.map(item => item.id)
      this.loading = true
      startDataProcess('aa_test', '${comments}', projectCode, ids).then(response => {
        this.msgSuccess('上报成功')
        this.getList()
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.loading = false
      })
    },
    importfxx(obj) {
      let _this = this;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0]
      var rABS = false //是否将文件读取为二进制字符串
      var f = this.file
      var reader = new FileReader()
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = ''
        var rABS = false //是否将文件读取为二进制字符串
        var pt = this
        var wb //读取完成的数据
        var outdata
        var reader = new FileReader()
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var XLSX = require("xlsx")
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              type: "base64"
            })
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          let arr = []
          outdata.map(v => {
            let obj = {}
                          obj.id = v['id']
                          obj.name = v['姓名']
                          obj.code = v['编号']
                          obj.age = v['年龄']
                          obj.createAt = v['$column.comments']
                        arr.push(obj)
          });
          imp(arr).then(res => {
            if(res.code == 200){
              _this.msgSuccess('导入成功')
              _this.$refs.upload.clearFiles()
              _this.handleRemove()
              _this.importOpen = false
            }else{
              _this.msgWarning('导入失败')
              _this.$refs.upload.clearFiles()
              _this.handleRemove()
              _this.importOpen = false

              let info = `错误行数 : {row} <br> 错误字段 : {field} <br> 需要类型 : {needType}`
              _this.$alert(info.format({
                row: res.rowNum,
                field: _this.tHeader[_this.filterVal.findIndex(item => item == res.field)],
                needType: res.needType
              }), res.message + '请重新上传', {
                confirmButtonText: '关闭',
                dangerouslyUseHTMLString: true
              })
            }
          })
          // _this.da=arr;
          // _this.dalen=arr.length;
          return arr
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    }
  }
}
</script>
<style scoped>
</style>
