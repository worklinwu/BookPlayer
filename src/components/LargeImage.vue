<template>
  <div class="m-large-image">
    <img :src="thumbnailSrc" v-bind="$attrs" v-if="mode === 'thumbnail'" />
    <img :src="src" v-bind="$attrs" :preview="preview" v-else />
    <div class="btn-download-origi" @click="change" v-if="mode === 'thumbnail'">
      <span v-if="!loading">查看高清图</span>
      <van-loading type="spinner" size="18px" v-if="loading"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LargeImage',
    inheritAttrs: false,
    props: {
      thumbnail:{
        type: String,
      },
      src: {
        type: String
      },
      preview: {
        type: String,
        default: 'default'
      }
    },
    data(){
      return{
        thumbnailSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=',
        loading: false,
        mode: 'thumbnail' // origin
      }
    },
    methods: {
      change(){
        if(this.loading){
          return
        }

        let newImg = new Image();
        this.loading = true
        newImg.onload = () => {
          newImg.onload = null
          this.mode = 'origin'
          this.$previewRefresh && this.$previewRefresh()
          this.loading = false
        }
        newImg.src = this.src;
      }
    },
    mounted(){
      if(this.thumbnail){
        let newImg = new Image();
        this.loading = true
        newImg.onload = () => {
          newImg.onload = null
          this.loading = false
          this.thumbnailSrc = this.thumbnail
        }
        newImg.src = this.thumbnail;
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .m-large-image{
    position: relative;
    max-width: 100%;
    min-height: 54px;
    background-color: #fff;
    img{
      display: block;
      width: 100%;
    }
    .btn-download-origi{
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0,0,0,.8);
      color: #fff;
      line-height: 34px;
      padding: 0 16px;
      border-radius: 4px;
      .van-loading{
        margin: 8px auto;
      }
    }
  }
</style>
