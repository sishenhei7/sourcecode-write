import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      states: {
        // 测试用
        test: 1,

        // 渲染的数据来源，是对 table 中的 data 过滤排序后的结果
        data: []
      }
    }
  },
  methods: {
    add() {
      this.states.test += 1
    }
  }
})
