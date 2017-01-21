var gamejs = require('gamejs');
var draw = require('gamejs/graphics');
var pixelcollision = require('gamejs/pixelcollision');
var tiledmap = require('gamejs/tiledmap');
var $v = require('gamejs/math/vectors');
var start = Date.now();
var current = 0;
var timer = 10;
var clock;
//pull the map JSON
var map_json = {};
$.ajax({
  async: false,
  url: "data/map.json",
  success: function(data) {
      map_json = data;
  }
});

var start = Date.now();
var current = 0;
var timer = 10;
var clock;

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
function check_wall(playerPosition, wall, wavelength, properties_ary){
  if (wall.y == 0){
    var tile_id = wall.x;
  }else{
    var tile_id = (wall.y * 30) + wall.x;
  }
  for (var k = 0; k < map_json.layers[0].data.length; k++){
    if (properties_ary.block[map_json.layers[0].data[tile_id]]){
      return true;
    }else if (properties_ary.color[map_json.layers[0].data[tile_id]]){
      if (properties_ary.color[map_json.layers[0].data[tile_id]] !== wavelength){
        return true;
      }
    }
  }
  return false;
}
function Timer () {
    if ( timer == 'undefined' ) {
    if( Math.floor( (Date.now() - start) / 1000) == current + 1 ) {
      var timer = Date.now() * 1000;
      current = Math.floor( ( Date.now() - start) / 1000);
    } else {
      clock = Math.floor( timer/60 )  + " : " + ( timer % 60 == 0 ? "00" : timer % 60 );
      timer = timer - Date.now() * 1000;
      // document.getElementById( 'timer' ).innerHTML = clock;
    }
      timer --;
    }
      return timer;
}
function main() {
  var map = new Map('./data/map.tmx');
  var color;
  var GameState = 'menu';
  var walls = {};
  var wall = {};
  var total_tiles = map_json.layers[0].data.length;
  var collision_tiles = map_json.tilesets[0].tileproperties;
  var properties_ary = {'block': {}, 'color': {}};
  for(var tile = 0; tile < total_tiles; tile++){
    if (collision_tiles[tile]){
      if(collision_tiles[tile].block){
        if(collision_tiles[tile].block == 'true'){
          properties_ary.block[tile] = true;
        }
      }else if(collision_tiles[tile].color){
        properties_ary.color[tile] = collision_tiles[tile].color;
      }
   }
  }
   var map = new Map('./data/map.tmx');
   var color;

   var GameState = 'menu';

   var player_vars = {
      'direction': '',
      'width': 50,
      'height': 50,
      'wavetype': 'red'
   }
   var blackhole_vars = {
      'speed': 2,
      'width': 50,
      'height': 50
   }
   var display = gamejs.display.getSurface();
   var blackHole = gamejs.image.load('./blackhole.png');
   var player = gamejs.image.load('./player.png');

   // create image masks from surface
   var mBlackHole = new pixelcollision.Mask(blackHole);
   var mPlayer = new pixelcollision.Mask(player);

   var newBlackHolePosition = [100, 100];
   var blackHolePosition = [20, 20];
   var playerPosition = [1, 1];

   var font = new gamejs.font.Font('20px monospace');

   var direction = {};
   direction[gamejs.event.K_UP] = [0, -15];
   direction[gamejs.event.K_DOWN] = [0, 15];
   direction[gamejs.event.K_LEFT] = [-15, 0];
   direction[gamejs.event.K_RIGHT] = [15, 0];
   gamejs.event.onKeyUp(function(event) {
   });

   gamejs.event.onKeyDown(function(event) {
    if (GameState == 'menu') {
      if (event = gamejs.event.K_SPACE){
          GameState = 'play';
      }else { return; }
    }
    if (GameState.pause) { return; }
    if ( Timer() < 0 ) { return; }
      if (GameState == 'menu') {
        if (event = gamejs.event.K_SPACE)
        {
          GameState = 'play';
        }
        else { return; }
      }

      if (GameState.pause) { return; }

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
            wall.x = Math.round(playerPosition[0]/50);
            wall.y = Math.round(playerPosition[1]/50);
            var blocked = check_wall(playerPosition, wall, player_vars.wavetype, properties_ary);
            if (blocked == false){
              playerPosition = $v.add(playerPosition, delta);
            }else{
              switch (event.key) {
                case gamejs.event.K_UP:
                  console.log(playerPosition[1]);
                  playerPosition[1] = playerPosition[1] + 25;
                break;
                case gamejs.event.K_DOWN:
                  console.log(playerPosition[1]);
                  playerPosition[1] = playerPosition[1] - 25;
                break;
                case gamejs.event.K_RIGHT:
                  playerPosition[0] = playerPosition[0] - 25;
                break;
                case gamejs.event.K_LEFT:
                  playerPosition[0] = playerPosition[0] + 25;
                break;
              }
            }
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
   })

   /*gamejs.event.onMouseMotion(function(event) {
      if (display.rect.collidePoint(event.pos)) {
         spearPosition = $v.subtract(event.pos, spear.getSize());
      }
   });*/

   gamejs.onTick(function() {
     console.log(GameState);
      if (GameState == 'menu') {
        var titleFont = new gamejs.font.Font("30px sans-serif");
        var textFont = new gamejs.font.Font("26px sans-serif");
        // render() returns a white transparent Surface containing the text (default color: black)
        var textSurfaceTitle = titleFont.render("Wave Escape", "#000000");
        var textSurfaceInstructions = titleFont.render("Instructions Here", "#000000");
        var textSurfacePrompt = titleFont.render("Press SPACE to begin", "#000000");
        display.blit(textSurfaceTitle, [350, 50]);
        display.blit(textSurfaceInstructions, [350, 100]);
        display.blit(textSurfacePrompt, [350, 150]);
        return;
      }

      if (GameState == 'pause') { return; }

      //timer();
      if ( Timer() < 0 ) {
        return;
      }
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

      switch (player_vars.wavetype){
        case "red":
         player = gamejs.image.load('./player.png');
         break;
        case "blue":
        player = gamejs.image.load('./player2.png');
          break;
        case "yellow":
        player = gamejs.image.load('./player3.png');
          break;
      }
      //draw.circle(display, color, playerPosition, 10, 0);
      // collision
      // the relative offset is automatically calculated by
      // the higher-level gamejs.sprite.collideMask(spriteA, spriteB)
      var relativeOffset = $v.subtract(playerPosition, blackHolePosition);
      var hasMaskOverlap = mBlackHole.overlap(mBlackHole, relativeOffset);
      if (hasMaskOverlap) {
         display.blit(font.render('COLLISION', '#ff0000'), [250, 50]);
      }
   });

  function Timer () {
    if( Math.floor( (Date.now() - start) / 1000) == current + 1 ) {
      current = Math.floor( ( Date.now() - start) / 1000);
      clock = Math.floor( timer/60 )  + " : " + ( timer % 60 == 0 ? "00" : timer % 60 );
      // document.getElementById( 'timer' ).innerHTML = clock;
      timer --;
    }
      return timer;

  }

};

gamejs.preload([
   './blackhole.png',
   './data/map.png',
   './player.png',
   './player2.png',
   './player3.png',
]);
gamejs.ready(main);
