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
          style="width: 300px; height: 300px"
          ref="uploadRef"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          limit="1">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">选择图片进行上传</div>
          <template #tip>
            <div class="el-upload__tip">jpg/png 图片最多1MB</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章类型" prop="type" align="left" style="width: 400px">
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

const uploadRef = ref(null)

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
  console.log(uploadRef.value)
  // form.value.text = getValue()
  //   console.log(form.value);
  // proxy.$refs['formData'].validate(async (valid) => {
  //   if (!valid) return
  //   addBlog(form.value).then(
  //   proxy.$modal.msgSuccess("新增博客成功！")
  //   )
  // })
}
</script>

<style lang="scss" scoped>
.body {
  margin-top: 10px;
  padding: 20px;
  width: 100%;
}
</style>
