const MIN_DISTANCE = 10

function getTouchDirection (offsetX, offsetY, deltaX, deltaY) {
  if (offsetX > offsetY && offsetX > MIN_DISTANCE) {
    if (deltaX > MIN_DISTANCE) {
      return 'right'
    } else if (deltaX < -MIN_DISTANCE) {
      return 'left'
    }
  }
  if (offsetY > offsetX && offsetY > MIN_DISTANCE) {
    if (deltaY > MIN_DISTANCE) {
      return 'down'
    } else if (deltaY < -MIN_DISTANCE) {
      return 'up'
    }
  }
  return ''
}

export default {
  data () {
    return {
      touchDirection: ''
    }
  },

  methods: {
    touchStart (event) {
      this.resetTouchStatus()
      this.startX = event.touches[0].clientX
      this.startY = event.touches[0].clientY
    },

    touchMove (event) {
      const touch = event.touches[0]
      this.deltaX = touch.clientX - this.startX
      this.deltaY = touch.clientY - this.startY
      this.offsetX = Math.abs(this.deltaX)
      this.offsetY = Math.abs(this.deltaY)
      this.touchDirection = this.touchDirection || getTouchDirection(this.offsetX, this.offsetY, this.deltaX, this.deltaY)
    },

    resetTouchStatus () {
      this.touchDirection = ''
      this.deltaX = 0
      this.deltaY = 0
      this.offsetX = 0
      this.offsetY = 0
    }
  }
}
