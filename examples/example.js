import Slider from './../src/seamlessSlider.js'

const slider = new Slider()
slider.init('#slider-box', '.slider-item', {
    activeColor: '#ccc',
    autoPlay: false
})