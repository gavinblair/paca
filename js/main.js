jQuery(document).ready(function($){

	scene('room1');

	$('#game').on('click',function(e){
		if(!glowaction) {
			var target = e.offsetX;
			//walk to position
			walkto(target, 40);
		}
		glowaction = false;
	});
	$('a').on('click touchup',function(){
		//walk to the object
		var el = $(this);
		var pos = el.position();
		walkto(pos.left, el.width(), el.attr('id'));
		return false;
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
		say('');
		pressing = true;
		setTimeout(function(){
			if(pressing) {
				$('#game a').addClass('glowing');
				pressing = false;
				glowaction = true;
			}
		}, 1000);
	});
	$('#game').on('mouseup touchend', function(){
		pressing = false;
		$('#game a').removeClass('glowing');
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
	walking = setInterval(function(){
		var pos = sprite.position();
		pos = pos.left;
		sprite.css('left', pos+step);
		if((pos < (target +targetwidth + 20) && pos > (target + targetwidth - 20)) || ((pos+52) < (target + 20) && (pos+52) > (target - 20))) {
			sprite.removeClass('walking');
			if(id !== undefined) {
				arrivedat(id);
			}
			clearInterval(walking);
		}
	}, 100);
}
function hastool(tool){
	return $('#inventory [data-tool='+tool+']').length;
}

function say(text){
	var t = $('#text');
	t.text(text);
}
function scene(thescene){
	$('#sprite').attr('style', '');
	$('#scene').html(ich[thescene]());
}