const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = innerWidth;
let height = innerHeight;

// canvas.width = width;
// canvas.height = height;


let inputSlider = document.getElementById('slider');
let inputLoadfile = document.getElementById('loadfile');
let inputIsLight = document.getElementById('inputIsLight');
let isLight = false;

class Cell {
    constructor(x, y, symbol, color, g) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        if (isLight) {
            this.color = `rgb(${g},${g},${g})`;
            // this.color = 'white';
        }

    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

class assciEffect {
    #density = 'Ñ@#W$9876543210?!abc;:+=-,._ '
    #imageCellArray = [];
    #symbols = [];
    #pixels = [];
    #ctx;
    #width;
    #height;

    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
        this.#scanImage;
        this.draw(10);
    }
    #convertToSymobl(g) {
        if (g > 250) return '@';
        let index = parseInt(g / 255 * this.#density.length);
        return this.#density[index];
    }

    #scanImage(cellSize) {
        ctx.strokeStyle = 'red';
        // ctx.lineWidth = 50;

        this.#imageCellArray = [];
        for (let x = 0; x < this.#pixels.width; x += cellSize) {
            for (let y = 0; y < this.#pixels.height; y += cellSize) {
                let posX = x * 4;
                let posY = y * 4;
                const pos = (posY * this.#pixels.width) + posX;

                if (this.#pixels.data[pos + 3] > 128) {
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];
                    const total = red + green + blue;
                    const averageColorValue = total / 3;
                    const color = `rgb(${red},${green},${blue})`;
                    const symbol = this.#convertToSymobl(averageColorValue);

                    // if (total > 200) this.#imageCellArray.push(new Cell(x, y, symbol, color));
                    this.#imageCellArray.push(new Cell(x, y, symbol, color, averageColorValue));
                }
            }
        }
        // console.log(this.#imageCellArray)
    }
    #drawAscii() {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);

        for (let i = 0; i < this.#imageCellArray.length; i++) {
            this.#imageCellArray[i].draw(ctx)
        }
    }
    draw(cellSize) {
        this.#scanImage(cellSize);
        this.#drawAscii()
    }
}

let effect;
let image1;
const loadImage = (url) => {
    image1 = new Image();
    image1.src = url;
    image1.crossOrigin = 'anonymous';

    image1.onload = () => {
        canvas.width = image1.width;
        canvas.height = image1.height;
        effect = new assciEffect(ctx, image1.width, image1.height);
    }
}

let loadURL;
function init() {
    loadURL = 'https://nationaltoday.com/wp-content/uploads/2022/10/456841112-min-1200x834.jpg';
    loadImage(loadURL);
}
// laod default image
init()


const sliderHandler = () => {
    let cellSize = parseInt(inputSlider.value);
    ctx.font = cellSize * 1.1 + 'px verdana';
    resultion.innerText = cellSize + 'px';
    effect.draw(cellSize);
}
inputSlider.addEventListener('change', sliderHandler);

inputIsLight.addEventListener("change", (e) => {
    if (inputIsLight.checked) {
        isLight = this
    }
    else {
        isLight = false
    }
    loadImage(loadURL)
})


const loadFileHandler = (e) => {
    let file = (inputLoadfile.files[0])
    if (file) {
        let readFile = new FileReader();
        readFile.onload = (e) => {
            let dataURL = (e.currentTarget.result)
            loadURL = dataURL;
            loadImage(dataURL);
        }
        readFile.readAsDataURL(file)
    }
}
inputLoadfile.addEventListener('change', loadFileHandler)

downloadBtn.addEventListener('click', () => {
    let data = canvas.toDataURL();
    let a = document.createElement('a');
    a.href = data;
    a.download = 'canvas-image.png';
    a.click();
});
