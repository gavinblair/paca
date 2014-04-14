jQuery(document).ready(function($){
    
    scene('menu');

    $('#preload div').each(function(){
    	var p = $(this);
    	p.css('background-image', p.data('preload'));
    	/**/
    });

	$('#game').on('click',function(e){

		if($('#sprite').length) {
			if(!glowaction) {
				var target = e.offsetX;
				//walk to position
				walkto(target, 10);
				
			}
			glowaction = false;
		}
	});
	
	$('#inventory div').on('click',function(){
		if($('#text').text() === "") {
			if($(this).hasClass('has')) {
				$('#inventory .active').removeClass('active');
				$(this).addClass('active');
				$('a').css('cursor', $(this).css('background-image')+', auto');
			}
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
		if($(this).children('span').length === 0) {
			$('#text').text('').hide();
			return false;
		}
	});

	$('.target').on('click', function(e){
        var targeted = $(this).parent().attr('data-tool');
        var tool = current_tool();
        switch(targeted){
            case 'eye':

            break;
            case 'hand':
                switch(tool){
                    case 'eye':
                        say("My hands are shaking from hunger.");
                    break;
                }
            break;
            case 'rock':
                switch(tool){
                    case 'eye':
                        say("It's a rock.");
                    break;
                }
            break;
            case 'stick':
                switch(tool){
                    case 'eye':
                        say("It's a sturdy stick.");
                    break;
                }
            break;
            case 'jerrycan':
                switch(tool){
                    case 'eye':
                        say("It's a jerry can with a little gas in it.");
                    break;
                }
            break;
        }
        e.preventdefault();
        return false;
    });

});
var pressing = false;
var glowaction = false;
var walking = {};
function walkto(target, targetwidth, id){
	//only do something if there is no dialogue happening
	if($("#text").text() == "") {
		if(walking.animation){
			cancelAnimationFrame(walking.animation);
		}

		walking.sprite = $('#sprite');
		walking.sprite.addClass('walking');
		walking.pos = walking.sprite.position();
		walking.pos = walking.pos.left;
		walking.target = target;
		walking.targetwidth = targetwidth;
		walking.id = id;
		walking.diff = walking.target - walking.pos;
		if(typeof states.speed == 'undefined') {
			states.speed = 8;
		}
		walking.step = states.speed;
		if(walking.diff < 0) {
			//face left
			walking.sprite.removeClass('right');
			walking.step *= -1;
		} else {
			//face right
			walking.sprite.addClass('right');
		}
		if(walking.pos < (walking.target +walking.targetwidth + 10) && (walking.pos+26) > (walking.target - 10)) {
			walking.sprite.removeClass('walking');
			cancelAnimationFrame(walking.animation);
			if(id !== undefined) {
				arrivedat(walking.id);
				//save the game
				save();
			}
		} else {
			walking.animation = requestAnimationFrame(walk);
			walking.lastFrame = +new Date;
		}
	}
}
function walk(){
	var now = +new Date;
	if(now > (walking.lastFrame + 110)) {
		walking.lastFrame = now;
		walking.pos = walking.sprite.position();
		walking.pos = walking.pos.left;
		walking.sprite.css('left', walking.pos+walking.step);
	}
	if(walking.pos < (walking.target +walking.targetwidth + 10) && (walking.pos+26) > (walking.target - 10)) {
		cancelAnimationFrame(walking.animation);
		walking.sprite.removeClass('walking');
		if(walking.id !== undefined) {
			arrivedat(walking.id);
			//save the game
			save();
		}
	} else {
		walking.animation = requestAnimationFrame(walk);
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
			$('#inventory .has:last').next().addClass('has').attr('data-tool', game.inventory[i]);
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
	t.text(text).show();
	if(text === '') {
		t.hide();
	}
	t.css('color', color);
}
function ask(options) {
	var t = $('#text');
	h = "";
	for(var i in options){
		h += "<span data-say='"+i+"'>\""+options[i]+"\"</span>";
	}
	t.html(h).show();
	t.css('color', '#fff');
}
function scene(thescene){
	console.log('loading '+thescene);
	$('#sprite').attr('style', '');
	$('#scene').html(ich[thescene]());
	$('#game').attr('data-scene', thescene);
	$('a').on('click touchup',function(){
		//walk to the object
		if(!$(this).hasClass('target')){
			var pos = $(this).position();
			walkto(pos.left, $(this).width(), $(this).attr('id'));
		}
		return false;
	});
}
function current_tool(){
	return $('#inventory .active').attr('data-tool');
}
function add_tool(tool){
	$('#inventory div:not(.has):first').addClass('has').attr('data-tool', tool);
}
function lose_tool(tool){
	$('#inventory [data-tool='+tool+']').removeClass('has').attr('data-tool', '');
	$('#inventory [data-tool=eye]').click();
}

var isPlaying = false;
var readyStateInterval = null;
var titleMusic = new Audio('audio/title.mp3');
