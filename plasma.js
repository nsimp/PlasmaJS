var plasmaWidth = 196, plasmaHeight = 128;
var len = plasmaWidth*plasmaHeight;
var idata, data = [];
var palette = cachePalette(16,1,0.5);

function load() {
	canvas = document.createElement("canvas");
	canvas.style.position = "absolute";
	canvas.style.top = "0px";
	canvas.style.left = "0px";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
	
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.oImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	
	document.body.appendChild(canvas);
	
	buffer = document.createElement("canvas");
	buffer.width = plasmaWidth;
	buffer.height = plasmaHeight;
	bctx = buffer.getContext("2d");
	
	idata = bctx.getImageData(0,0,plasmaWidth,plasmaHeight);
	data = idata.data;
	
	setInterval(step,1000/60);
}

var t = 0, scale = 0.1;
function step() {
	for (var x=0; x<plasmaWidth; x++) {
		for (var y=0; y<plasmaHeight; y++) {
			var val = Math.sin(((x+y)*0.5+t)*scale);
			val    += Math.sin((x+t*0.5)*scale) * Math.cos((y-t*0.3)*scale);
			val    += Math.cos((y*0.1+t*0.2)*scale);
			val    += Math.sin(Math.sqrt((x*x+y*y)*scale*0.2)+t*0.1);
			val    /= 4;
			
			putcol(x,y,colFromPal(val+t));
		}
	}
	
	idata.data = data;
	bctx.putImageData(idata,0,0);
	draw();
	
	t+=1;
}

function draw() {
	ctx.drawImage(buffer,0,0,window.innerWidth,window.innerHeight);
}

function putcol(x,y,rgb) {
	var ind = ((y*plasmaWidth)+x)*4;
	data[ind+0] = ~~rgb[0];
	data[ind+1] = ~~rgb[1];
	data[ind+2] = ~~rgb[2];
	data[ind+3] = 255;
}

//color functions
function cachePalette(numCols, sat, lum) {
	var pal = [];
	for (var i=0; i<numCols; i++) {
		pal[i] = hsl2rgb(i/numCols,sat,lum);
	}
	return pal;
}

function colFromPal(val) {
	val = Math.abs(val)%1;
	var ind = ~~(val*palette.length);
	return palette[ind];
}

function hsl2rgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}