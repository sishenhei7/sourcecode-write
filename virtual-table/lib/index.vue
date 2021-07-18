<template>
  <div class="virtual-table" v-mousewheel="handleHeaderFooterMousewheel">
    <div class="header-wrapper" ref="headerWrapper">
      <table-header
        ref="tableHeader"
        :store="store"
        :border="border"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
        }"
      />
    </div>

    <div
      class="body-wrapper"
      ref="bodyWrapper"
      :class="[
        layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none'
      ]"
      :style="[bodyHeight]"
    >
      <!-- 虚拟滚动撑开滚动条 -->
      <div ref="bodyWrapperVirtualX" class="body-wrapper-virtual-x" />
      <div ref="bodyWrapperVirtualY" class="body-wrapper-virtual-y" />
      <table-body
        :context="context"
        :store="store"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{ width: bodyWidth }"
      />
    </div>
  </div>
</template>

<script>
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import Mousewheel from './utils/mousewheel'
import Store from './store'
import { mapStates } from './store'

export default {
  name: 'VirtualTable',
  directives: {
    Mousewheel
  },
  components: {
    TableHeader,
    TableBody
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const store = new Store()

    return {
      store
    }
  },
  computed: {
    ...mapStates({
      tableData: 'data'
    }),
    bodyWrapper() {
      return this.$refs.bodyWrapper
    }
  },
  methods: {
    handleHeaderFooterMousewheel(event, data) {
      const { pixelX, pixelY } = data
      if (Math.abs(pixelX) >= Math.abs(pixelY)) {
        this.bodyWrapper.scrollLeft += data.pixelX / 5
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
