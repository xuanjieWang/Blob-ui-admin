<!-- 添加或修改设备数据对话框 -->
<template>
  <div class="body">
    <el-form ref="formData" :model="form" label-width="100px" :rules="rule">
      <el-form-item label="文章主题" prop="title" style="width: 400px">
        <el-input v-model="form.title" placeholder="文章主题" />
      </el-form-item>
      <el-form-item label="文章封面" prop="image" align="left">
        <el-upload
          class="upload-demo"
          style="width: 300px; height: 30px"
          action="#"
          :http-request="requestUpload"
          :show-file-list="false"
          :before-upload="beforeUpload"
          limit="1">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">点击文字选择图片进行上传</div>
        </el-upload>
      </el-form-item>
      <el-col :xs="24" :md="12" style="height: 100px; width: 300px; margin-left: 50px">
        <img :src="form.image" />
      </el-col>
      <el-form-item label="文章类型" prop="type" align="left" style="width: 400px; margin-top: 100px">
        <el-select v-model="form.type" placeholder="请选择" clearable style="width: 180px; margin-bottom: 0">
          <el-option v-for="dict in the_blog_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <div id="vditor" name="description"></div>
      <el-form-item>
        <el-button type="primary" @click="submit">发布文章</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { reactive, watch, ref, computed, onMounted } from 'vue'
const { proxy } = getCurrentInstance()
const { the_blog_type } = proxy.useDict('the_blog_type')
import { addBlog } from '../../../api/blog'
const rule = {
  title: [{ required: true, message: '文章标题不能为空' }],
  image: [{ required: true, message: '文章图片不能为空' }],
  type: [{ required: true, message: '文章类型不能为空' }]
}

const data = reactive({
  form: {}
})
const { form } = toRefs(data)

const vditor = ref('')
const value = ref('')
const unwatch = ref(null)
onMounted(() => {
  vditor.value = new Vditor('vditor', {
    height: 350,
    toolbarConfig: {
      pin: true
    },
    cache: {
      enable: false
    },
    after: () => {
      vditor.value.setValue(value.value)
    }
  })
  unwatch.value = proxy.$watch('value', (val) => {
    if (vditor.value && getValue() !== val) {
      vditor.value.setValue(val)
    }
  })
})
const getValue = () => {
  return vditor.value.getValue()
}

const submit = async () => {
  console.log(form.value)
  form.value.text = getValue()
  proxy.$refs['formData'].validate(async (valid) => {
    if (!valid) return
    addBlog(form.value).then(proxy.$modal.msgSuccess('新增博客成功！'))
  })
}

/** 覆盖默认上传行为 */
function requestUpload() {}

/** 上传预处理 */
function beforeUpload(file) {
  if (file.type.indexOf('image/') == -1) {
    proxy.$modal.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      form.value.image = reader.result
      form.value.imageUrl = file.name
    }
  }
}
</script>

<style lang="scss" scoped>
.body {
  margin-top: 10px;
  padding: 20px;
  width: 100%;
}
</style>
