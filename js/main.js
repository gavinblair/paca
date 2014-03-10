jQuery(document).ready(function($){

	$('#game').addClass('room');

	$('#game').click(function(e){
		if(!glowaction) {
			var target = e.offsetX;
			//walk to position
			walkto(target);
		}
		glowaction = false;
	});
	$('a').on('click touchup',function(){
		//walk to the object
		var pos = $(this).position();
		walkto(pos.left, $(this).attr('id'));
		return false;
	});
	$('#inventory div').click(function(){
		if($(this).hasClass('has')) {
			$('#inventory .active').removeClass('active');
			$(this).addClass('active');
		}
		return false;
	});
	$('#sprite').click(function(e){
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
var haskey = false;
function walkto(target, id){
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
		if(pos < (target + 20) && pos > (target - 20)) {
			sprite.removeClass('walking');
			if(id !== undefined) {
				arrivedat(id);
			}
			clearInterval(walking);
		}
	}, 100);
}
function arrivedat(id){
	switch(id){
		case 'door':
			if(!haskey){
				say("It's locked. I wonder where the key is?");
			} else {

			}
		break;
		case 'key':
			say("It's a key. How convenient.");
		break;
	}
}
function say(text){
	$('#sprite span').text(text);
}