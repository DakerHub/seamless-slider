class Slider {
    constructor () {
      this.setting = {
        activeColor: '#00BCD4',
        autoPlay: true,
        playInterval: 2000,
        playDir: 'left',
        controllers: ['footer']
      }
      this.$container = null
      this.$innerBox = null
      this.boxWidth = 0
      this.liLength = 0
      this.$footers = []
      this.timer = 0
    }
    init (containerSelector, listSelector, setting) {
      Object.assign(this.setting, setting)
      this.$container = $(containerSelector)
      this.$innerBox = $('<div></div>')
      const $lis = $(listSelector)
      this.liLength = $lis.length
      this.boxWidth = this.$container.width()
      this.initCss($lis)
      $lis.wrapAll(this.$innerBox)
      this.$innerBox.append($lis.first().clone())
      // $lis.last().after($lis.first().clone())
      this.bindEvent()
      if (this.setting.controllers.includes('footer')) {
        this.creatFooter()
      }
      if (this.setting.autoPlay) {
        this.autoPlay()
      }
    }
    initCss ($lis) {
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
      $lis.each(function () {
        $(this).css({
          float: 'left',
          width: self.boxWidth + 'px',
          height: '100%'
        })
      })
    }
    autoPlay () {
      this.timer = setInterval(() => {
        this.setting.playDir === 'left' ?
          this.slideLeft() :
          this.slideRight()
      }, this.setting.playInterval)
    }
    slideLeft () {
      const self = this
      const oriLeft = Number.parseInt(this.$innerBox.css('left'))
      const minLeft = - this.boxWidth * (this.liLength - 1)
      this.$innerBox.animate({
        left: oriLeft - this.boxWidth + 'px'
      }, 500, 'ease-out', function () {
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
      }, 500, 'ease-out', function () {
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
      }, 500, 'ease-out')
      this.changeActiveFooter(idx)
    }
    creatFooter () {
      if (this.$container.find('.slider-footer').length) {
        return
      }
      const self = this
      const html = '<div class="slider-footer"></div>'
      const $footer = $(html)
      for (let i = 0; i < this.liLength; i++) {
        const $li = $('<span class="slider-footer-order"></span>')
        $li.css({
          width: '40px',
          height: '4px',
          display: 'inline-block',
          background: '#fff',
          margin: '0 2px',
          cursor: 'pointer'
        });
        (function (i) {
          $li.click(function () {
            self.turnTo(i)
          })
        })(i)
        this.$footers.push($li)
        $footer.append($li)
      }
      $footer.css({
        position: 'absolute',
        bottom: '4px',
        width: '100%',
        textAlign: 'center'
      })
      this.$container.append($footer)
      this.changeActiveFooter(0)
    }
    changeActiveFooter (idx) {
      this.$footers.forEach(($ele, i) => {
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
    bindEvent () {
      const self = this
      this.$container.on('mouseover', function () {
        clearInterval(self.timer)
      })
      this.$container.on('mouseleave', function () {
        if (self.setting.autoPlay) {
          self.autoPlay()
        }
      })
    }
  }
  
  export default Slider
  