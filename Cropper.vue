<!--
 * @Author: wyb
 * @Description:
 * @FilePath: /winning-webui-admin-mdm/src/views/system/Cropper.vue
-->
<template>
  <el-dialog
    width="60%"
    title="图片剪裁"
    append-to-body
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  >
    <div class="cropper-content">
      <div class="cropper" style="text-align: center" v-loading="dialogLoading">
        <vueCropper
          :autoCrop="option.autoCrop"
          :autoCropHeight="option.autoCropHeight"
          :autoCropWidth="option.autoCropWidth"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :centerBox="option.centerBox"
          :fixed="option.fixed"
          :fixedBox="option.fixedBox"
          :fixedNumber="option.fixedNumber"
          :full="option.full"
          :img="option.img"
          :info="false"
          :infoTrue="option.infoTrue"
          :original="option.original"
          :outputSize="option.size"
          :outputType="option.outputType"
          :maxImgSize="option.maxImgSize"
          ref="cropper"
          style="width: 100%; height: 400px"
        ></vueCropper>
      </div>
    </div>
    <div class="dialog-footer" slot="footer">
      <el-button @click="dialogVisible = false" class="main-but-min"
        >取 消</el-button
      >

      <el-button
        :loading="loading"
        @click="finish"
        class="main-but-min"
        type="primary"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  name: 'Cropper',
  props: ['img', 'fixedNumber', 'autoCropWidth', 'autoCropHeight'],
  data () {
    return {
      dialogVisible: true,
      dialogLoading: false,
      loading: false,
      oriUrl: '', // 处理透明化数据
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 256, // 默认生成截图框宽度
        autoCropHeight: 108, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        fixedNumber: [2560, 1080],
        maxImgSize: 2560
      }
    }
  },
  created () {
    this.img && (this.option.img = this.img)
    this.fixedNumber && (this.option.fixedNumber = this.fixedNumber)
    this.autoCropWidth && (this.option.autoCropWidth = this.autoCropWidth)
    this.autoCropHeight && (this.option.autoCropHeight = this.autoCropHeight)
  },
  components: { VueCropper },
  methods: {
    finish () {
      this.$refs.cropper.getCropData((data) => {
        let img = document.createElement('img')
        img.src = data
        img.onload = function () {
          console.log(`width: ${img.width}, height: ${img.height}`)
        }
        this.$emit('cropFinish', data)
      })
    }
  }
}
</script>

<style lang="scss">
.cropper {
  position: relative;
}

.transparent {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
