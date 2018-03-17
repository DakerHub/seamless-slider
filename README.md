# seamless-slider

seamless-slider is a carousel plugin for Zepto & jQuery

# Installation

Prerequisites:  
 - zepto 1.2.0 event fx / jQuery

## NPM

```
$ npm install seamless-slider -s 
```

# Usage

```html
<div id="slider-box">
    <div class="slider-item">1</div>
    <div class="slider-item">2</div>
    <div class="slider-item">3</div>
    <div class="slider-item">4</div>
</div>
```
```javascript
import Slider from './../src/seamlessSlider.js'

const slider = new Slider()
slider.init('#slider-box', '.slider-item')
```

# License
[MIT](LICENSE)