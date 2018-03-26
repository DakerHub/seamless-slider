const throttle = require('lodash.throttle')

class Slider {
    constructor (containerSelector, listSelector, setting) {
      this.setting = {
        activeColor: '#00BCD4',
        autoPlay: true,
        autoPlayInterval: 2000,
        autoautoPlayDir: 'left',
        controllers: ['indicator'],
        switchingInterval: 500,
        scale: 1
      }
      this.$container = null
      this.$innerBox = null
      this.$lis = null
      this.$indicators = []
      this.boxWidth = 0
      this.liLength = 0
      this.timer = 0
      Object.assign(this.setting, setting)
      this.init(containerSelector, listSelector)
    }
    init (containerSelector, listSelector) {
      this.$container = $(containerSelector)
      this.boxWidth = this.$container.width()
      this.$innerBox = $('<div></div>')
      this.$lis = $(listSelector)
      this.liLength = this.$lis.length
      this._initCss()
      this.$lis.wrapAll(this.$innerBox)
      this.$innerBox.append(this.$lis.first().clone())
      this._bindEvent()
      if (this.setting.controllers.includes('indicator')) {
        this._creatIndicator()
      }
      if (this.setting.autoPlay) {
        this.autoPlay()
      }
      this._resizeBox()
    }
    /**
     * 开始自动滑动
     */
    autoPlay () {
      this.timer = setInterval(() => {
        this.setting.autoPlayDir === 'left' ?
          this.slideLeft() :
          this.slideRight()
      }, this.setting.autoPlayInterval)
    }
    /**
     * 像左滑动一个滑块
     */
    slideLeft () {
      const self = this
      const oriLeft = Number.parseInt(this.$innerBox.css('left'))
      const minLeft = - this.boxWidth * (this.liLength - 1)
      this.$innerBox.animate({
        left: oriLeft - this.boxWidth + 'px'
      }, this.setting.switchingInterval, 'ease-out', function () {
        const $this = $(this)
        const afterLeft = Number.parseInt($this.css('left'))
        if (afterLeft < minLeft) {
          $this.css({
            left: '0px'
          })
        }
      })
      let idx = Number.parseInt(Math.abs(oriLeft / this.boxWidth))
      if (idx === this.liLength - 1) {
        // 由于无缝轮播在最后clone了第一张，所以这里的判断需要特殊处理一下
        idx = -1
      }
      this.changeActiveFooter(idx + 1)
    }
    /**
     * 向右滑动一个滑块
     */
    slideRight () {
      const self = this
      let oriLeft = Number.parseInt(this.$innerBox.css('left'))
      const maxLeft = - this.boxWidth
      if (oriLeft === 0) {
        this.$innerBox.css({
          left: - this.boxWidth * this.liLength
        })
        oriLeft = - this.boxWidth * this.liLength
      }
      this.$innerBox.animate({
        left: oriLeft + this.boxWidth + 'px'
      }, this.setting.switchingInterval, 'ease-out', function () {
        const $this = $(this)
        const afterLeft = Number.parseInt($this.css('left'))
        if (afterLeft > maxLeft) {
          $this.css({
            left: - this.boxWidth * this.liLength + 'px'
          })
        }
      })
      const idx = Number.parseInt(Math.abs(oriLeft / this.boxWidth))
      this.changeActiveFooter(idx - 1)
    }
    /**
     * 滑动到指定序号的滑块
     * @param {number} idx 滑块的序号
     */
    turnTo (idx) {
      this.$innerBox.animate({
        left: - idx * this.boxWidth + 'px'
      }, this.setting.switchingInterval, 'ease-out')
      this.changeActiveFooter(idx)
    }
    /**
     * 改变当前的指示器
     * @param {number} idx 当前指示器的序号
     */
    changeActiveFooter (idx) {
      this.$indicators.forEach(($ele, i) => {
        if (i === idx) {
          $ele
            .addClass('is-active')
            .css({
              background: this.setting.activeColor
            })
        } else {
          $ele
            .removeClass('is-active')
            .css({
              background: '#fff'
            })
        }
      })
    }
    /**
     * js初始化基础css样式
     */
    _initCss () {
      const self = this
      this.$innerBox.css({
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        display: 'flex'
      })
      this.$container.css({
        position: 'relative',
        overflow: 'hidden'
      })
      this.$lis.each(function () {
        $(this).css({
          float: 'left',
          width: self.boxWidth + 'px',
          height: '100%'
        })
      })
    }
    /**
     * 添加底部指示器
     */
    _creatIndicator () {
      if (this.$container.find('.slider-indicator').length) {
        return
      }
      const self = this
      const html = '<div class="slider-indicator"></div>'
      const $indicator = $(html)
      for (let i = 0; i < this.liLength; i++) {
        const $li = $('<span class="slider-indicator-order"></span>')
        $li.css({
          width: '40px',
          height: '4px',
          display: 'inline-block',
          background: '#fff',
          margin: '0 2px',
          cursor: 'pointer'
        });
        this.$indicators.push($li)
        $indicator.append($li)
      }
      $indicator.css({
        position: 'absolute',
        bottom: '4px',
        width: '100%',
        textAlign: 'center'
      })
      this.$container.append($indicator)
      this.changeActiveFooter(0)
    }
    /**
     * 绑定各种事件
     */
    _bindEvent () {
      const self = this
      this.$container.on('mouseover', function () {
        clearInterval(self.timer)
      })
      this.$container.on('mouseleave', function () {
        if (self.setting.autoPlay) {
          self.autoPlay()
        }
      })
      this.$container.on('click', '.slider-indicator-order', function () {
        self.turnTo($(this).index())
      })
    }
    /**
     * 窗口改变时,重置滑块的大小
     */
    _resizeBox () {
      const self = this
      const resize = function () {
        self.boxWidth = self.$container.width()
        self._initCss()
      }
      $(window).on('resize', throttle(resize, 100))
    }
  }
  
  export default Slider
  