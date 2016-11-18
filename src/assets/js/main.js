/*
  Forty by HTML5 UP
  html5up.net | @ajlkn
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

  skel.breakpoints({
    xlarge: '(max-width: 1680px)',
    large: '(max-width: 1280px)',
    medium: '(max-width: 980px)',
    small: '(max-width: 736px)',
    xsmall: '(max-width: 480px)',
    xxsmall: '(max-width: 360px)'
  });

  /**
   * Applies parallax scrolling to an element's background image.
   * @return {jQuery} jQuery object.
   */
  $.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

    var $window = $(window),
      $this = $(this);

    if (this.length == 0 || intensity === 0)
      return $this;

    if (this.length > 1) {

      for (var i=0; i < this.length; i++)
        $(this[i])._parallax(intensity);

      return $this;

    }

    if (!intensity)
      intensity = 0.25;

    $this.each(function() {

      var $t = $(this),
        on, off;

      on = function() {

        $t.css('background-position', 'center 100%, center 100%, center 0px');

        $window
          .on('scroll._parallax', function() {

            var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

            $t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

          });

      };

      off = function() {

        $t
          .css('background-position', '');

        $window
          .off('scroll._parallax');

      };

      skel.on('change', function() {

        if (skel.breakpoint('medium').active)
          (off)();
        else
          (on)();

      });

    });

    $window
      .off('load._parallax resize._parallax')
      .on('load._parallax resize._parallax', function() {
        $window.trigger('scroll');
      });

    return $(this);

  };

  $(function() {

    var $window = $(window),
      $body = $('body'),
      $wrapper = $('#wrapper'),
      $header = $('#header'),
      $banner = $('#banner');

    // Disable animations/transitions until the page has loaded.
      $body.addClass('is-loading');

      $window.on('load pageshow', function() {
        window.setTimeout(function() {
          $body.removeClass('is-loading');
        }, 100);
      });

    // Clear transitioning state on unload/hide.
      $window.on('unload pagehide', function() {
        window.setTimeout(function() {
          $('.is-transitioning').removeClass('is-transitioning');
        }, 250);
      });

    // Fix: Enable IE-only tweaks.
      if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
        $body.addClass('is-ie');

    // Fix: Placeholder polyfill.
      $('form').placeholder();

    // Prioritize "important" elements on medium.
      skel.on('+medium -medium', function() {
        $.prioritize(
          '.important\\28 medium\\29',
          skel.breakpoint('medium').active
        );
      });

    // Scrolly.
      $('.scrolly').scrolly({
        offset: function() {
          return $header.height() - 2;
        }
      });

    // Tiles.
    $window.on('load', function() {
      
      function checkVisible( elm, evalType ) {
        evalType = evalType || "visible";

        var vpH = $(window).height(), // Viewport Height
          st = $(window).scrollTop(), // Scroll Top
          y = $(elm).offset().top,
          elementHeight = $(elm).height();

        if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
        if (evalType === "above") return ((y < (vpH + st)));
      }
      
      var $tiles = $('.tiles > article');

      $tiles.each(function() {

        var $this = $(this),
          $image = $this.find('.image'), $img = $image.find('img'),
          $link = $this.find('.link'),
          x;
          
        function setTileImage() { console.log($this);
          // Set image.
          // $this.css('background-image', 'url(' + $img.attr('src') + ')');
          $this.css('background-image', 'url(' + $image.attr('data-image') + ')');

          // Set position.
          if (x = $img.data('position'))
          $image.css('background-position', x);

          // Hide original.
          $image.hide();
        }
          
        if ( checkVisible($this) ) {
          
          setTileImage();
              
        } else {
          
          function function_name(e) {
            if ( checkVisible($this) ) {
              setTileImage();
              $(window).off('scroll', function_name );
            }
          }
          
          $(window).on('scroll', function_name );
          
        }
        

        // Link.
          if ($link.length > 0) {

            $x = $link.clone()
              .text('')
              .addClass('primary')
              .appendTo($this);

            $link = $link.add($x);

            // $link.on('click', function(event) {

            //  var href = $link.attr('href');

            //  // Prevent default.
            //    event.stopPropagation();
            //    event.preventDefault();

            //  // Start transitioning.
            //    $this.addClass('is-transitioning');
            //    $wrapper.addClass('is-transitioning');

            //  // Redirect.
            //    window.setTimeout(function() {

            //      if ($link.attr('target') == '_blank')
            //        window.open(href);
            //      else
            //        location.href = href;

            //    }, 500);

            // });

          }

      });
    });

    // Header.
      if (skel.vars.IEVersion < 9)
        $header.removeClass('alt');

      if ($banner.length > 0
      &&  $header.hasClass('alt')) {

        $window.on('resize', function() {
          $window.trigger('scroll');
        });

        $window.on('load', function() {

          $banner.scrollex({
            bottom:   $header.height() + 10,
            terminate:  function() { $header.removeClass('alt'); },
            enter:    function() { $header.addClass('alt'); },
            leave:    function() { $header.removeClass('alt'); $header.addClass('reveal'); }
          });

          window.setTimeout(function() {
            $window.triggerHandler('scroll');
          }, 100);

        });

      }

    // Banner.
      $banner.each(function() {

        var $this = $(this),
          $image = $this.find('.image'), $img = $image.find('img');

        // Parallax.
          $this._parallax(0.275);

        // Image.
          if ($image.length > 0) {

            // Set image.
              $this.css('background-image', 'url(' + $img.attr('src') + ')');

            // Hide original.
              $image.hide();

          }

      });

    // Menu.
      var $menu = $('#menu'),
        $menuInner;

      $menu.wrapInner('<div class="inner"></div>');
      $menuInner = $menu.children('.inner');
      $menu._locked = false;

      $menu._lock = function() {

        if ($menu._locked)
          return false;

        $menu._locked = true;

        window.setTimeout(function() {
          $menu._locked = false;
        }, 350);

        return true;

      };

      $menu._show = function() {

        if ($menu._lock())
          $body.addClass('is-menu-visible');

      };

      $menu._hide = function() {

        if ($menu._lock())
          $body.removeClass('is-menu-visible');

      };

      $menu._toggle = function() {

        if ($menu._lock())
          $body.toggleClass('is-menu-visible');

      };

      $menuInner
        .on('click', function(event) {
          event.stopPropagation();
        })
        .on('click', 'a', function(event) {

          var href = $(this).attr('href');

          event.preventDefault();
          event.stopPropagation();

          // Hide.
            $menu._hide();

          // Redirect.
            window.setTimeout(function() {
              window.location.href = href;
            }, 250);

        });

      $menu
        .appendTo($body)
        .on('click', function(event) {

          event.stopPropagation();
          event.preventDefault();

          $body.removeClass('is-menu-visible');

        })
        .append('<a class="close" href="#menu">Close</a>');

      $body
        .on('click', 'a[href="#menu"]', function(event) {

          event.stopPropagation();
          event.preventDefault();

          // Toggle.
            $menu._toggle();

        })
        .on('click', function(event) {

          // Hide.
            $menu._hide();

        })
        .on('keydown', function(event) {

          // Hide on escape.
            if (event.keyCode == 27)
              $menu._hide();

        });

  });

  lightbox.option({
    'albumLabel': 'Imagem %1 of %2'
  })
  
  $.fn.randomize = function(selector){
    var $elems = selector ? $(this).find(selector) : $(this).children(),
      $parents = $elems.parent();

    $parents.each(function(){
      $(this).children(selector).sort(function(){
        return Math.round(Math.random()) - 0.5;
      // }). remove().appendTo(this); // 2014-05-24: Removed `random` but leaving for reference. See notes under 'ANOTHER EDIT'
      }).detach().appendTo(this);
    });

    return this;
  };
  
  $('.tiles').randomize('article');
  
  var jcarousel = $('.jcarousel').jcarousel({
    wrap: 'circular'
  })
   .jcarouselAutoscroll();

  $('.jcarousel-control-prev')
    .on('jcarouselcontrol:active', function() {
      $(this).removeClass('inactive');
    })
    .on('jcarouselcontrol:inactive', function() {
      $(this).addClass('inactive');
    })
    .jcarouselControl({
      target: '-=1'
    });

  $('.jcarousel-control-next')
    .on('jcarouselcontrol:active', function() {
      $(this).removeClass('inactive');
    })
    .on('jcarouselcontrol:inactive', function() {
      $(this).addClass('inactive');
    })
    .jcarouselControl({
      target: '+=1'
    });
    
  $('#contact form').submit(function(event) {
    
    // debugger;

    // get the form data
    // there are many ways to get this data using jQuery (you can use the class or id also)
    // var formData = {
    //     'name'              : $('input[name=name]').val(),
    //     'email'             : $('input[name=email]').val(),
    //     'superheroAlias'    : $('input[name=superheroAlias]').val()
    // };
    
    var values = {};
    $.each($(this).serializeArray(), function(i, field) {
      values[field.name] = field.value;
    });

    // process the form
    $.ajax({
      type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url         : this.action, // the url where we want to POST
      data        : values, // our data object
      dataType    : 'json', // what type of data do we expect back from the server
      encode      : true
    })
      // using the done promise callback
      .done(function(data) {

        // log data to the console so we can see
        console.log(data);
        alert('Email enviado com sucesso.');
        window.location.reload()

        // here we will handle errors and validation messages
      });

    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
  });
  
  $(document.links).filter(function() {
    return this.hostname != window.location.hostname;
  }).attr('target', '_blank');
  
  $('.linked-table table tr').click( function(event) {
    event.preventDefault();
    // window.location = $(this).find('a[target]').attr('href');
    var win = window.open($(this).find('a[target]').attr('href'), '_blank');
    win.focus();
  }).hover( function() {
    $(this).toggleClass('hover');
  });

})(jQuery);

var map;
function initMap() {
  var uluru = {lat: -19.8965993, lng: -44.0132806};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  });
  window.queryAddress && codeAddress(window.queryAddress);
}

function codeAddress(query) {
  
  var request = {
    query: query
  };

  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      map.setZoom(19);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
