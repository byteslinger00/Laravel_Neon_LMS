$.fn.amigoSorter = function(options) {

	var settings = $.extend({
		li_helper: "li_helper",
		li_empty: "empty",
		onTouchStart : function() {},
		onTouchMove : function() {},
		onTouchEnd : function() {}
	}, options );

	var action = false;
	var li_index = null;
	var $ul = null;
	var shift_left = 0;
	var shift_top = 0;
	var mouse_up_events = 'mouseup touchend';
	var mouse_move_events = 'mousemove touchmove';
	var mouse_down_events = 'mousedown touchstart';

	$(document.body).append( $.fn.amigoSorter.li_helper( settings.li_helper ) ); 

	$(document).on(mouse_up_events, function(e) {
		e.stopPropagation();
		e.preventDefault();
		action = false;
		$ul.attr('data-action', false);
		$ul.find('li').removeClass(settings.li_empty);
		$('.' + settings.li_helper).css('display','none').html('');
		settings.onTouchEnd.call();
	});

	return this.each(function(e) {
		$ul = $(this);

		$(document).on(mouse_move_events, function(e) {
			settings.onTouchMove.call();
			if (action == true) {
				if (e.type == "touchmove") {
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
					$.fn.amigoSorter.set_drag_pos( settings.li_helper, touch.clientX - shift_left, touch.clientY - shift_top);	
				} else {
					$.fn.amigoSorter.set_drag_pos( settings.li_helper, e.pageX - shift_left, e.pageY - shift_top);	
				}


				$ul.find('> li').each( function() {
					var $li = $(this);
					var $span = $li.find('> span');

					if (!$li.hasClass(settings.li_empty)) {
						var $li_offset = $li.offset();
						var $span_offset = $span.offset();
						var start_left = $span_offset.left;
						var start_top = $span_offset.top;
						var end_left = $span_offset.left + $span.outerWidth();
						var end_top = $span_offset.top + $span.outerHeight();

						var e_page_X = 0, e_page_Y = 0;

						if (e.type == "touchmove") {
							var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
							e_page_X = touch.clientX;
							e_page_Y = touch.clientY;
						} else {
							e_page_X = e.pageX;
							e_page_Y = e.pageY;
						}


						if ( e_page_X > start_left && e_page_X < end_left && e_page_Y > start_top && e_page_Y < end_top ) {
							var hover_index = $li.index();
							var shift_count = Math.abs(hover_index - li_index);
							for (i = 1; i<=shift_count; i++) {
								if (hover_index >= li_index) { 
									$ul.find('> li').eq(li_index).insertAfter($ul.find('> li').eq(li_index + 1));
									li_index++;
								}
								else { 
									$ul.find('> li').eq(li_index - 1).insertAfter($ul.find('> li').eq(li_index)); 
									li_index--;
								}
							}

						}
					}
				});

			}

		});

		$ul.find('> li').on(mouse_down_events, function(e) {
			var $li = $(this);
			$ul = $li.closest('ul');
			e.stopPropagation();
			e.preventDefault();
			settings.onTouchStart.call();
			action = true;
			$ul.attr('data-action', true);

			var li_offset = $li.offset();
			if (e.type == "touchstart") {
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				shift_left = touch.clientX - li_offset.left;
				shift_top = touch.clientY - li_offset.top;
			} else {
				shift_left = e.pageX - li_offset.left;
				shift_top = e.pageY - li_offset.top;
			}

			var li_html = $li.html();
			li_index = $li.index();
			$li.addClass(settings.li_empty);

			$.fn.amigoSorter.set_li_helper_size( $li, settings.li_helper);	

			if (e.type == "touchstart") {
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				$.fn.amigoSorter.set_drag_pos( settings.li_helper, touch.clientX - shift_left, touch.clientY - shift_top);	
			} else $.fn.amigoSorter.set_drag_pos( settings.li_helper, e.pageX - shift_left, e.pageY - shift_top);	

			$('.' + settings.li_helper).html(li_html).css('display','inline-block');

		});

		
	});

};

$.fn.amigoSorter.li_helper = function( helper_class ) {
	return '<span class="' + helper_class + '"></span>';
};

$.fn.amigoSorter.set_drag_pos = function( helper_class, x, y ) {
	$('.' + helper_class).css('left', x ).css('top', y );	
	return true;
};

$.fn.amigoSorter.set_li_helper_size = function( $li, helper_class ) {
	var width = $li.outerWidth();
	var height = $li.outerHeight();
	$('.' + helper_class).css('width', width + 'px').css('height', height + 'px');
	return true;
};


