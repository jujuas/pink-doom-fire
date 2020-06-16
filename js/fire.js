const firePixelsArray = [];
const fireWidth = 10;
const fireHeight = 10;

function start(){
 createFireDataStructure();
 createFireSource();
 renderFire();
}

function createFireDataStructure() {

 const numberOfPixels = fireWidth * fireHeight;
 for(var i = 0; i<numberOfPixels ; i++){
    firePixelsArray[i] = 0;
 }
 }


function calculateFirePropagation(){

}

function renderFire(){
   let html = '<table cellpadding=0 cellspacing=0>';
   for (let row=0;row <fireHeight ; row ++){
   
      html += '<tr>';

   for (let column= 0 ; column <fireWidth ; column ++){
      const pixelIndex = column + (fireWidth*row);
      const fireIntesity = firePixelsArray[pixelIndex];
      html += '<td>';
      html += '<div class ="pixel-index">'+pixelIndex+'</div>';
      html += fireIntesity;
      html += '</td>'
   }
   html += '</tr>';
   }
   html += '</table>';
   document.querySelector('#fireCanvas').innerHTML = html;
}

function createFireSource(){
   for (let column = 0; column <=fireWidth ; column++){
      const overflowPixel = fireWidth * fireHeight;
      const pixelIndex = column + (overflowPixel - fireWidth);
      firePixelsArray[pixelIndex] = 36;
   }
}

start();