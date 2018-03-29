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
        circulating: true,
        initIdx: 0
      }
      this.$container = null
      this.$innerBox = null
      this.$lis = null
      this.$indicators = []
      this.boxWidth = 0
      this.liLength = 0
      this.timer = 0
      this.currentIndex = 0
      Object.assign(this.setting, setting)
      this.init(containerSelector, listSelector)
    }
    init (containerSelector, listSelector) {
      const { controllers, autoPlay, circulating, initIdx } = this.setting
      this.$container = $(containerSelector)
      this.boxWidth = this.$container.width()
      this.$innerBox = $('<div></div>')
      this.$lis = $(listSelector)
      this.liLength = this.$lis.length
      this._initCss()
      this.$lis.wrapAll(this.$innerBox)
      this._bindEvent()
      if (controllers.indexOf('indicator') !== -1) {
        this._creatIndicator()
      }
      if (circulating) {
        this.$innerBox.append(this.$lis.first().clone())
      }
      this.turnTo(initIdx)
      if (autoPlay) {
        this.autoPlay()
      }
      this._resizeBox()
    }
    /**
     * 开始自动滑动
     */
    autoPlay () {
      const { autoPlayDir, autoPlayInterval } = this.setting
      this.timer = setInterval(() => {
        autoPlayDir === 'left' ?
          this.slideLeft() :
          this.slideRight()
      }, autoPlayInterval)
    }
    /**
     * 像左滑动一个滑块
     */
    slideLeft () {
      const { circulating } = this.setting
      const oriLeft = Number.parseInt(this.$innerBox.css('left'))
      const minLeft = - this.boxWidth * (this.liLength - 1)
      const afterLeft = oriLeft - this.boxWidth
      const isLast = afterLeft < minLeft
      if (!circulating && isLast) {
        // 如果不循环播放，并且是最后一张，则不继续滑动
        return
      }
      this.$innerBox.animate({
        left: afterLeft + 'px'
      }, this.setting.switchingInterval, 'ease-out', function () {
        if (isLast) {
          $(this).css({
            left: '0px'
          })
        }
      })
      let idx = Number.parseInt(Math.abs(oriLeft / this.boxWidth))
      if (idx === this.liLength - 1) {
        // 由于无缝轮播在最后clone了第一张，所以这里的判断需要特殊处理一下
        idx = -1
      }
      this._afterSlide(idx + 1)
    }
    /**
     * 向右滑动一个滑块
     */
    slideRight () {
      const { circulating } = this.setting
      const maxLeft = - this.boxWidth
      let oriLeft = Number.parseInt(this.$innerBox.css('left'))
      const lastOneLeft = -this.boxWidth * this.liLength
      if (!circulating && oriLeft === 0) {
        // 如果不循环并且是第一张，不继续操作
        return
      }
      if (oriLeft === 0) {
        // 如果当前为第一张，则先瞬间移动到最后一张克隆滑块上，再往前滑动
        this.$innerBox.css({
          left: lastOneLeft
        })
        oriLeft = lastOneLeft
      }
      this.$innerBox.animate({
        left: oriLeft + this.boxWidth + 'px'
      }, this.setting.switchingInterval, 'ease-out', function () {
        const $this = $(this)
        const afterLeft = Number.parseInt($this.css('left'))
        if (afterLeft > maxLeft && circulating) {
          $this.css({
            left: lastOneLeft + 'px'
          })
        }
      })
      const idx = Number.parseInt(Math.abs(oriLeft / this.boxWidth))
      this._afterSlide(idx - 1)
    }
    /**
     * 滑动到指定序号的滑块
     * @param {number} idx 滑块的序号
     */
    turnTo (idx) {
      this.$innerBox.animate({
        left: - idx * this.boxWidth + 'px'
      }, this.setting.switchingInterval, 'ease-out')
      this._afterSlide(idx)
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
    _adjustWidth () {
      const boxWidth = this.boxWidth
      this.$innerBox.css({
        left: -this.currentIndex * boxWidth + 'px'
      })
      this.$lis.each(function () {
        $(this).css({
          width: boxWidth + 'px'
        })
      })
    }
    /**
     * 滑动一次后的钩子
     * @param {number} idx 当前滑块的序号
     */
    _afterSlide (idx) {
      this.currentIndex = idx
      for (let i = 0; i < this.$lis.length; i++) {
        const $li = this.$lis.eq(i)
        if ($li.is('.is-active')) {
          $li.removeClass('is-active')
          break
        }
      }
      this.$lis.eq(idx).addClass('is-active')
      this.changeActiveFooter(idx)
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
      this.$container
        .on('mouseover', function () {
          clearInterval(self.timer)
        })
        .on('mouseleave', function () {
          if (self.setting.autoPlay) {
            self.autoPlay()
          }
        })
        .on('swipeRight', () => {
          this.slideRight()
        })
        .on('swipeLeft', () => {
          this.slideLeft()
        })
        .on('click', '.slider-indicator-order', function () {
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
        self._adjustWidth()
      }
      $(window).on('resize', throttle(resize, 100))
    }
  }
  
  export default Slider
  