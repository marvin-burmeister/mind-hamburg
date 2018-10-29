$(window).on("load", function() {

  var albumOverlayVisible = false;
  var isMobile = false;
  var isMobileMenuOpen = false;

  $(window).resize(function() { 
    $("#close").css("width", $("#close").next().width());
    $("#prev-next").css("width", $("#gallery img").width());
    $("#nav-wrapper").css("height", $("nav").height());

    if ($(window).width() < 769) {
      isMobile = true;
      if (albumOverlayVisible) {
        $navbar.addClass("fixed-nav");
      }
    } else {
      isMobile = false;
    }
  });

  $(window).trigger("resize");


  // navigation
  var $html = $("html");
  var $window = $(window);
  var $navbar = $("nav");
  var $navmenu = $("nav ul");

 
  // mobile nav menu
  $("#toggle-icon").on("click", function() { // toggle class on click, change icons and show nav menu
    $navmenu.toggleClass("show");
    if ($navmenu.hasClass("show")) { // if nav menu is opened
      isMobileMenuOpen = true;
      $html.addClass("no-scroll"); //disable scroll
      $("#toggle-icon").html("&#10006;"); // X icon
      $(".album img").each(function() { // change album hover cursor to default
        $(this).css("cursor", "default");
      });
    } else { // mobile menu is closed
      $("#toggle-icon").html("&#9776;"); // hamburger icon
       console.log(albumOverlayVisible);
      if (!albumOverlayVisible) {
        $html.removeClass("no-scroll"); // enable scroll
        $(".album img").each(function() { 
          $(this).css("cursor", "pointer");
        });
      } 
      isMobileMenuOpen = false;
    }
  });


  // nav link on click behaviour
  $("nav ul a").on("click", function() {
    if (isMobileMenuOpen) { // if mobile nav menu is open
      $("nav ul").removeClass("show"); // close it
      $("#toggle-icon").html("&#9776;");
      isMobileMenuOpen = false;
    }

    if (albumOverlayVisible) { // if album overlay is visible close it in both cases on link click (mobile and expanded nav menu)
      $(".album-overlay").each(function() {
        $(this).css("display", "none");
      });
      $("#close").remove();
      $(".album img").each(function() {
        $(this).css("cursor", "pointer");
      });
      albumOverlayVisible = false;
    }
    $("html").removeClass("no-scroll"); // activate scroll
  });


  // scrolling and nav menu handling  
  var $homePos = $("#home").offset().top - 50;
  var isOver = false;
  var scrolled = false;
  var lastScrollTop = 0;

  $window.scroll(function() {
    scrolled = true;
    var scrollTop = $window.scrollTop();
    if (scrollTop >= $homePos && $navbar.width() > 1280) { // if scroll pos is around the height of the home section, make nav stick at top with fade in effect 
      if (isOver == false) {
        $navbar.hide();
        $navbar.addClass("fixed-nav").fadeIn(500);
        isOver = true;
      }
    } else {
      if (isOver == true) {
        $navbar.fadeOut(500, function() {
          $navbar.removeClass("fixed-nav"); // callback function is completed after fade out
          $navbar.show(); // after fade out, unstick nav and then display it
        });
        isOver = false;
      }
    }
    if (isMobile) { // for mobile screens, show nav when scrolling up
      scrolling(scrollTop);
    }
  });

  function scrolling(scrollTop) {
    if (scrollTop > lastScrollTop) { // down
      $navbar.removeClass("fixed-nav");
    } else { // up
      if (scrollTop + $(window).height() < $(document).height()) {
        $navbar.addClass("fixed-nav");
        if (scrollTop == 0) {
          $navbar.removeClass("fixed-nav");
        }
      }
    }
    lastScrollTop = scrollTop;
  }


  // album cover on click for showing the songlist of an album
  $(".album img").on("click", function(e) {
    $navbar.addClass("fixed-nav");
    if (!isMobileMenuOpen) { // if mobile nav menu is not open
      albumOverlayVisible = true;
      $html.addClass("no-scroll");
      $(this).siblings(".album-overlay").css("display", "block");
      $('<div id="close">&#10006;</div>').prependTo($(this).siblings(".album-overlay").children(".overlay-content"));
      $("#close").css("width", $(this).siblings(".album-overlay").children(".overlay-content").find("img").width());
      $("#close").on("click", function() {
        $(".album-overlay").css("display", "none");
        $(this).remove();
        $html.removeClass("no-scroll");
        albumOverlayVisible = false;
      });
    }
  });


  // image gallery
  var index = 0;
  var images = $("#gallery img"); // get all images
  var dots = $(".dot"); // get all dots
  $("#prev").on("click", function() {
    if (index - 1 < 0) {
      toggleClasses(index);
      index = images.length - 1; // start from the end
      toggleClasses(index);
    } else if (index > 0) {
      toggleClasses(index);
      index -= 1;
      toggleClasses(index);
    }
  });

  $("#next").on("click", function() {
    if (index + 1 >= images.length) {
      toggleClasses(index);
      index = 0; // start from the beginning
      toggleClasses(index);
    } else if (index < images.length) {
      toggleClasses(index);
      index += 1;
      toggleClasses(index);
    }
  });

  function toggleClasses(index) {
    images[index].classList.toggle("current-image");
    dots[index].classList.toggle("active");
  }

  //gallery dot onclick
  $(".dot").on("click", function() {   
    toggleClasses(index);
    var dot_i = $(this).attr("class").split("/\s+/");
    index = dot_i[0].split("dot")[1]-1;
    toggleClasses(index);
  });

});