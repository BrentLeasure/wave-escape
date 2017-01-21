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
   var color;

   var player_vars = {
      'direction': '',
      'width': 50,
      'height': 50,
      'wavetype': ''

   }
   var blackhole_vars = {
      'width': 50,
      'height': 50
   }
   var display = gamejs.display.getSurface();
   var blackHole = gamejs.image.load('./spear.png');
   var player = gamejs.image.load('./player.png');

   // create image masks from surface
   var mBlackHole = new pixelcollision.Mask(blackHole);
   var mPlayer = new pixelcollision.Mask(player);

   var newBlackHolePosition = [100, 100]; 
   var blackHolePosition = [20, 20];
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

      }
      var delta = direction[event.key];
      if (delta) {
         /* playerPositioin is an array of x and y coordination  for the players position, such as Array[x,y] */
         if (playerPosition[0] > 0 && playerPosition[0] + player_vars.width < window.innerWidth - player_vars.width && playerPosition[1] > 0 && playerPosition[1] + player_vars.height < window.innerHeight - player_vars.height){
            playerPosition = $v.add(playerPosition, delta);
         }else{
            if (playerPosition[0] < 0){
               playerPosition[0] = playerPosition[0] + 5;
            }else if (playerPosition[1] < 0){
               playerPosition[1] = playerPosition[1] + 10;
            }else if (playerPosition[0] + player_vars.width > window.innerWidth - player_vars.width){
               playerPosition[0] = playerPosition[0] - 10;
            }else if (playerPosition[1] + player_vars.height > window.innerHeight - player_vars.height){
               playerPosition[1] = playerPosition[1] - 10;
            }else{
               //playerPosition = [5,5];
            }
         }
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
      if (Math.abs(newBlackHolePosition[0] - blackHolePosition[0]) < 10 && Math.abs(newBlackHolePosition[1] - blackHolePosition[1]) < 10){
         newBlackHolePosition = Array(Math.random() * ((window.innerWidth - blackhole_vars.width) - 1) + 1, Math.random() * ((window.innerHeight - blackhole_vars.height) - 1) + 1);
      }else{
         var x_displace = (blackHolePosition[0] - newBlackHolePosition[0] > 0) ? true: false; 
         var y_displace = (blackHolePosition[1] - newBlackHolePosition[1] > 0) ? true: false;
         //blackHolePosition = $v.add(blackHolePosition, delta);
         if (x_displace == true){
            blackHolePosition[0] = blackHolePosition[0] - 2;
         }else{
            blackHolePosition[0] = blackHolePosition[0] + 2;
         }
         if (y_displace == true){
            blackHolePosition[1] = blackHolePosition[1] - 2;
         }else{
            blackHolePosition[1] = blackHolePosition[1] + 2;
         }
      }
      display.clear();
      map.draw(display);
      display.blit(blackHole, blackHolePosition);
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
      var relativeOffset = $v.subtract(playerPosition, blackHolePosition);
      var hasMaskOverlap = mBlackHole.overlap(mBlackHole, relativeOffset);
      if (hasMaskOverlap) {
         display.blit(font.render('COLLISION', '#ff0000'), [250, 50]);
      }
   });
};

gamejs.preload([
   './spear.png',
   './data/bg2.jpg',
   './player.png',
]);
gamejs.ready(main);
