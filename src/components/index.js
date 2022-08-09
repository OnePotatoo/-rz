import PageTools from '@/components/PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from '@/components/imageUpload'
export default {
  install (Vue) {
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel) // 注册导入excel组件
    Vue.component(ImageUpload.name, ImageUpload) // 注册导入excel组件
  }
}

