var gamejs = require('gamejs');
var draw = require('gamejs/graphics');
var pixelcollision = require('gamejs/pixelcollision');
var tiledmap = require('gamejs/tiledmap');
var $v = require('gamejs/math/vectors');

var Map = exports.Map = function(url) {

   // you can optionall pass a rectangle specification
   // to control where on the display the mapView
   // is drawn
   this.draw = function(display) {
      mapView.draw(display, [0,0]);
   };

   /**
    * constructor
    */
   var map = new tiledmap.Map(url);
   var mapView = new tiledmap.MapView(map);
   return this;
};

function main() {
   var map = new Map('./data/map.tmx');

   var player_vars = {
      'direction': '',
      'width': 50,
      'height': 50,
      'wavetype': ''
   }
   var display = gamejs.display.getSurface();
   //var unit = gamejs.image.load('./unit.png');
   var player = gamejs.image.load('./player.png');

   // create image masks from surface
   //var mUnit = new pixelcollision.Mask(unit);
   var mPlayer = new pixelcollision.Mask(player);

   var unitPosition = [20, 20];
   var playerPosition = [6, 5];

   var font = new gamejs.font.Font('20px monospace');

   var direction = {};
   direction[gamejs.event.K_UP] = [0, -10];
   direction[gamejs.event.K_DOWN] = [0, 10];
   direction[gamejs.event.K_LEFT] = [-10, 0];
   direction[gamejs.event.K_RIGHT] = [10, 0];
   gamejs.event.onKeyUp(function(event) {

   });
   gamejs.event.onKeyDown(function(event) {
     if (event.key  == 49 || event.key == 50 || event.key == 51) {
       switch (event.key) {
         case 49:
           player_vars.wavetype = "red";
           break;
         case 50:
           player_vars.wavetype = "blue";
           break;
         case 51:
           player_vars.wavetype = "yellow";
           break;
         default:
       }
       console.log("Changed wave to " + player_vars.wavetype);
     }
     else {
       var delta = direction[event.key];
       if (delta) {
          /* playerPositioin is an array of x and y coordination  for the players position, such as Array[x,y] */
          if (playerPosition[0] > 0 && playerPosition[0] + player_vars.width < window.innerWidth && playerPosition[1] > 0 && playerPosition[1] + player_vars.height < window.innerHeight){
             playerPosition = $v.add(playerPosition, delta);
          }else{
             if (playerPosition[0] < 0){
                playerPosition[0] = playerPosition[0] + 5;
             }else if (playerPosition[0] + player_vars.width > window.innerWidth){
                playerPosition[0] = player_vars.width - 10;
             }else if (playerPosition[1] < 0){
                playerPosition[1] = playerPosition[1] + 10;
             }else if (playerPosition[1] + player_vars.height > window.innerHeight){
                playerPosition[1] = window.innerHeight - player_vars.height - 5;
             }else{
                console.log(playerPosition);
                //playerPosition = [5,5];
             }
          }
       }
     }

   })

   /*gamejs.event.onMouseMotion(function(event) {
      if (display.rect.collidePoint(event.pos)) {
         spearPosition = $v.subtract(event.pos, spear.getSize());
      }
   });*/

   gamejs.onTick(function() {
      // draw
      display.clear();
     // display.blit(unit, unitPosition);
      map.draw(display);
      display.blit(player, playerPosition);

      var color;
      switch (player_vars.wavetype){
        case "red":
         color = "rgb(255, 0, 0)";
         break;
        case "blue":
        color = "rgb(0, 132, 255)";
          break;
        case "yellow":
        color = "rgb(242, 255, 0)";
          break;
      }
        draw.circle(display, color, playerPosition, 10, 0);

      // collision
      // the relative offset is automatically calculated by
      // the higher-level gamejs.sprite.collideMask(spriteA, spriteB)
      var relativeOffset = $v.subtract(playerPosition, unitPosition);
      //var hasMaskOverlap = mUnit.overlap(mSpear, relativeOffset);
      /*if (hasMaskOverlap) {
         display.blit(font.render('COLLISION', '#ff0000'), [250, 50]);
      }*/
   });
};

gamejs.preload([
   //'./unit.png',
   './data/bg2.jpg',
   './player.png',
]);
gamejs.ready(main);
