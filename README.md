# seamless-slider

seamless-slider is a carousel plugin for Zepto & jQuery

## Installation

Prerequisites:  
 - zepto 1.2.0 event fx / jQuery

## NPM

```
$ npm install seamless-slider -save 
```

## Usage

```html
<div id="slider-box">
    <div class="slider-item">1</div>
    <div class="slider-item">2</div>
    <div class="slider-item">3</div>
    <div class="slider-item">4</div>
</div>
```
```javascript
import Slider from 'seamless-slider'

const slider = new Slider('#slider-box', '.slider-item', {
    activeColor: 'rgb(45,45,45)'
})
```

## Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
|activeColor|String|'#00BCD4'|Color of the current active indicator|
|autoPlay|Boolean|true|Whether to play automatically|
|autoPlayInterval|Number|2000|The number of milliseconds played automatically|
|autoautoPlayDir|String|'left'|Automatic play direction. Enumeration value: 'left', 'right'|
|controllers|Array|['indicator']|Controllers to be rendered. Controllers: 'indicator'|
|switchingInterval|Number|500|Interval for switching sliders|

# License
[MIT](LICENSE)