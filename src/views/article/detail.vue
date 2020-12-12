<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <el-form-item style="margin-bottom: 40px;" prop="标题">
        <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
          Title
        </MDinput>
      </el-form-item>
      <el-form-item label-width="100px" label="作者:">
        <el-select v-model="postForm.author.id" filterable default-first-option>
          <el-option v-for="(item) in authorListOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label-width="100px" label="内容:">
        <el-input v-model="postForm.content" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
        <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}字</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { fetchArticle, saveArticle } from '@/api/article'
import { fetchAuthors } from '@/api/author'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  id: undefined,
  author: {}
}

export default {
  name: 'ArticleDetail',
  components: { MDinput },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editId: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      authorListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content ? this.postForm.content.length : 0
    }
  },
  watch: {
    'visible': {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.postForm = Object.assign({}, defaultForm)
          if (this.isEdit) {
            this.fetchData(this.editId)
          }
        }
      }
    }
  },
  created() {
    this.fetchAuthors()
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          saveArticle(this.postForm).then(response => {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.$emit('success')
          }).catch(err => {
            console.log(err)
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    fetchAuthors() {
      fetchAuthors().then(response => {
        console.log(response)
        this.authorListOptions = response
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
