import Slider from './../src/seamlessSlider.js'

const slider = new Slider('#slider-box', '.slider-item', {
    activeColor: '#ccc',
    autoPlay: true,
    switchingInterval: 200
})
const slider2 = new Slider('#slider-box-2', '.slider-item-2', {
    activeColor: '#ccc',
    autoPlay: false,
    switchingInterval: 200
})
