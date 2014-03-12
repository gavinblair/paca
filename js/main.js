jQuery(document).ready(function($){

	scene('menu');

	$('#game').on('click',function(e){
		if($('#sprite').length) {
			say('');
			if(!glowaction) {
				var target = e.offsetX;
				//walk to position
				walkto(target, 40);
				
			}
			glowaction = false;
		}
	});
	
	$('#inventory div').on('click',function(){
		if($(this).hasClass('has')) {
			$('#inventory .active').removeClass('active');
			$(this).addClass('active');
		}
		return false;
	});
	$('#sprite').on('click', function(e){
		e.preventDefault();
	});
	$('#game').on('mousedown touchstart', function(){
		if($('#sprite').length) {
			pressing = true;
			setTimeout(function(){
				if(pressing) {
					$('#game a').addClass('glowing');
					pressing = false;
					glowaction = true;
				}
			}, 1000);
		}
	});
	$('#game').on('mouseup touchend', function(){
		if($('#sprite').length) {
			pressing = false;
			$('#game a').removeClass('glowing');
		}
	});
	$('#text').on('click', function(){
		return false;
	});
});
var pressing = false;
var glowaction = false;
var walking;
function walkto(target, targetwidth, id){
	if(walking) clearInterval(walking);
	var sprite = $('#sprite');
	sprite.addClass('walking');
	var pos = sprite.position();
	pos = pos.left;
	var diff = target - pos;
	var step = 8;
	if(diff < 0) {
		//face left
		sprite.removeClass('right');
		step *= -1;
	} else {
		//face right
		sprite.addClass('right');
	}
	if(pos < (target +targetwidth + 20) && (pos+52) > (target - 20)) {
		sprite.removeClass('walking');
		if(id !== undefined) {
			arrivedat(id);
			//save the game
			save();
		}
	} else {
		walking = setInterval(function(){
			var pos = sprite.position();
			pos = pos.left;
			sprite.css('left', pos+step);
			if(pos < (target +targetwidth + 20) && (pos+52) > (target - 20)) {
				sprite.removeClass('walking');
				if(id !== undefined) {
					arrivedat(id);
					//save the game
					save();
				}
				clearInterval(walking);
			}
		}, 100);
	}
}
var states = {};
function save(){
	var pos = $('#sprite').position();
	var inventory = [];
	$('#inventory .has').each(function(){
		if($(this).attr('data-tool') !== 'eye' && $(this).attr('data-tool') !== 'hand') {
			inventory.push($(this).attr('data-tool'));
		}
	});
	localStorage.game = JSON.stringify({
		scene: $('#game').attr('data-scene'),
		left: pos.left,
		inventory: inventory,
		states: states
	});
}
function load(){
	if(localStorage.game.length > 0) {
		var game = JSON.parse(localStorage.game);
		states = game.states;
		for(var i in game.inventory){
			$('#inventory .has:last').next().addClass('has').attr('data-tool', game.inventory[i]).text(game.inventory[i]);
		}
		scene(game.scene);
		$('#sprite').css('left', game.left);
	} else {
		$('#newgame').click();
	}
}
function hastool(tool){
	return $('#inventory [data-tool='+tool+']').length;
}

function say(text, color){
	if(typeof color === 'undefined') {
		color = '#fff';
	} else {
		text = '"'+text+'"';
	}
	var t = $('#text');
	t.text(text);
	t.css('color', color);
}
function ask(options) {
	var t = $('#text');
	h = "";
	for(var i in options){
		h += "<span data-say='"+i+"'>\""+options[i]+"\"</span>";
	}
	t.html(h);
	t.css('color', '#fff');
}
function scene(thescene){
	$('#sprite').attr('style', '');
	$('#scene').html(ich[thescene]());
	$('#game').attr('data-scene', thescene);
	$('a').on('click touchup',function(){
		say('');
		//walk to the object
		var pos = $(this).position();
		walkto(pos.left, $(this).width(), $(this).attr('id'));
		return false;
	});
}
function current_tool(){
	return $('#inventory .active').attr('data-tool');
}
function add_tool(tool){
	$('#inventory .has:last').next().addClass('has').attr('data-tool', tool).text(tool);
}
function lose_tool(tool){
	$('#inventory [data-tool='+tool+']').removeClass('has').attr('data-tool', '').text('');
	$('#inventory [data-tool=eye]').click();
}