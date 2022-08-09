export const imgError = {
  // inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）
  inserted (el, options) {
    // console.log(el)
    el.onerror = function () {
      el.src = options.value
    }
  }
}
