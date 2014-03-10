jQuery(document).ready(function($){

	$('#game').addClass('room');

	$('#game').click(function(e){
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
function arrivedat(id){
	var tool = $('#inventory .active').attr('data-tool');
	switch(id){
		case 'door':
			if(tool === 'eye'){
				if($('#door').hasClass('locked')){
					say("It's a door.");
				} else {
					say("It's an open door. I wonder what's on the other side?");
				}
			} else if(tool === 'hand'){
				if(hastool('key')) {
					say("It's still locked. I wonder if this key will work?");
				} else {
					if($('#door').hasClass('locked')) {
						say("It's locked. I wonder where the key is?");
					} else {
						say("you win!");
					}
				}
			} else if(tool === 'key'){
				$('#door').removeClass('locked');
				$('#inventory [data-tool=key]').removeClass('has').attr('data-tool', '').text('');
				$('#inventory [data-tool=eye]').click();
				say("That was easy");
			}
		break;
		case 'key':
			if(tool === 'eye'){
				say("It's a key. How convenient.");
			} else if(tool === 'hand'){
				$('#key').remove();
				haskey = true;
				$('#inventory .has:last').next().addClass('has').attr('data-tool', 'key').text('key');
			}
		break;
	}
}
function say(text){
	var t = $('#text');
	var pos = t.position();
	pos = pos.left;
	if(pos.left > ($('#game').width - t.width())){
		t.css('left', 'auto').css('right', '0').css('text-align', 'right');
	} else {
		t.css('right', 'auto').css('left', '0').css('text-align', 'left');
	}
	$('#text').text(text);
}