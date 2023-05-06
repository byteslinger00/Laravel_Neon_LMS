"use strict";

// jquery-toasts 1.1.0
// (c) 2020 İsa Eken
// jquery-toasts may be freely distributed under the MIT license.
// For all details and documentation:
// https://github.com/isaeken/jquery-toasts

/**
 * throw an error if jquery is not initialized
 */
if (!window.jQuery) {
  throw 'jquery-toasts is requires jquery!';
}
/**
 * throw an error if anime.js is not initialized
 */


if (typeof anime !== 'function') {
  throw 'jquery-toasts is requires anime.js!';
}

(function ($) {
  'use strict';
  /**
   * toast container
   * @type {jQuery.fn.init|jQuery|HTMLElement}
   */

  var container = $('<div id="isaeken-jquery-toast-container" class="toast-container"></div>');
  /**
   * initialize the toasts container
   * @returns {initializeToasts}
   */

  function initializeToasts() {
    // get the document body
    var body = $('body'); // do not any think if container is exists

    if (body.find('#isaeken-jquery-toast-container').length > 0) return; // add container to document body

    body.prepend(container); // return self for chained functions

    return this;
  }
  /**
   * create toast function
   * @param content
   * @param {int} timeout
   * @param {function} click
   * @param {function} closed
   * @param {function} mouseEnter
   * @param {function} mouseLeave
   * @returns {jQuery}
   */


  $.toast = function (content) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
    var click = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var closed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
    var mouseEnter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
    var mouseLeave = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : function () {};
    // initialize toasts
    initializeToasts();
    /**
     * create toast element
     * @type {jQuery.fn.init|jQuery|HTMLElement}
     */

    var $toast = $('<div class="toast"></div>');
    /**
     * options
     * @type {{panning: boolean, currentPosition: number, closeTolerance: number, closed: boolean, position: null, opacity: number, transition: jQuery, mouseDownPosition: number}}
     */

    var options = {
      panning: false,
      closed: false,
      closeTolerance: 35,
      transition: $toast.css('transition'),
      position: null,
      mouseDownPosition: 0,
      currentPosition: 0,
      opacity: 1
    }; // set toast defaults

    $toast.attr('isaeken-jquery-toast', 'true').html(content); // add toast to container

    container.append($toast); // set close button click event if exists

    $toast.children('.close').click(function () {
      $toast.toastClose(function () {
        return closed();
      });
    }); // create close timeout

    var closeTimeoutHandle = window.setTimeout(function () {
      $toast.toastClose(function () {
        return closed();
      });
    }, timeout); // add events to toast

    $toast.on('click', function (event) {
      return _click(event);
    }).on('mouseenter', function (event) {
      return _mouseEnter(event);
    }).on('mouseleave', function (event) {
      return _mouseLeave(event);
    }).on('touchstart', function (event) {
      return _mouseDown(event);
    }).on('touchmove', function (event) {
      return _mouseMove(event);
    }).on('touchend', function (event) {
      return _mouseUp(event);
    }).on('mousedown', function (event) {
      return _mouseDown(event);
    }).on('mouseup', function (event) {
      return _mouseUp(event);
    }).on('mousemove', function (event) {
      return _mouseMove(event);
    }); // reset panning function

    function _resetPan() {
      options.panning = false;
      options.closed = false; // reset css

      $toast.css({
        transition: options.transition,
        transform: "translateX(0)",
        opacity: 1
      }).removeClass('panning');
    } // click function


    function _click(event) {
      // execute custom click event if its not panning
      if (!options.panning) {
        click(event);
      }
    } // mouse enter function


    function _mouseEnter(event) {
      // close if not closed
      if (options.closed) $toast.toastClose(function () {
        return closed();
      }); // reset timeout

      window.clearTimeout(closeTimeoutHandle); // execute custom mouse enter function

      mouseEnter();
    } // mouse leave function


    function _mouseLeave(event) {
      // start time to close
      closeTimeoutHandle = window.setTimeout(function () {
        $toast.toastClose(function () {
          return closed();
        });
      }, timeout); // execute custom mouse leave function

      mouseLeave(); // reset pan

      _resetPan();
    } // mouse down function


    function _mouseDown(event) {
      // set panning
      options.panning = true; // set default options

      options.transition = $toast.css('transition');
      options.position = $toast.position();
      options.mouseDownPosition = event.pageX; // set css

      $toast.addClass('panning').css('transition', 'none');
    } // mouse up function


    function _mouseUp(event) {
      if (options.closed) $toast.toastClose(function () {
        return closed();
      });else _resetPan();
    } // mouse move function


    function _mouseMove(event) {
      // check pan status
      if (options.panning) {
        // set current mouse position
        options.currentPosition = options.mouseDownPosition - event.pageX; // cancel other events

        event.preventDefault(); // set css

        $toast.css({
          transform: "translateX(".concat(0 - options.currentPosition, "px)"),
          opacity: 1 - Math.abs(options.currentPosition / options.mouseDownPosition) * 8
        }); // set closed status

        options.closed = (options.currentPosition > options.closeTolerance || 0 - options.currentPosition > options.closeTolerance) === true;
      }
    } // show toast with animation


    anime({
      targets: $toast[0],
      top: 0,
      opacity: 1,
      duration: 300,
      easing: 'easeOutCubic'
    });
    return $toast;
  }; // toast close function


  $.fn.toastClose = function () {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    // do not any think if its not a toast
    if (!$(this)[0].hasAttribute('isaeken-jquery-toast')) {
      return;
    } // set toast to $toast


    var $toast = $(this);
    var marginTop = parseInt($toast.css('marginTop').replace('px', ''));
    var marginBottom = parseInt($toast.css('marginTop').replace('px', ''));
    var height = $toast.outerHeight(); // close toast

    anime({
      targets: $toast[0],
      opacity: 0,
      marginTop: '-' + height + 'px',
      duration: 375,
      easing: 'easeOutExpo',
      complete: function complete() {
        // check if callback is a function
        if (typeof callback === 'function') {
          // execute callback function
          callback();
        } // remove toast from document


        $toast.remove();
      }
    });
    return $;
  }; // add toasts plugin to jquery


  $.fn.toast = function () {
    return this;
  };

  window.jQuery = $;
})(jQuery); // on document is ready


$(document).ready(function () {
  // get all elements has data-toast attribute
  $('[data-toast]').each(function () {
    // on element click
    $(this).click(function () {
      // get content of toast
      var content = $(this).data('toast');
      var timeout = 3000; // get toast timeout

      if ($(this).data('timeout') !== undefined) {
        timeout = $(this).data('timeout');
      } // create toast


      $.toast(content, timeout);
    });
  });
});