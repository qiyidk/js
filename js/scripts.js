
$(function (global) { // Same as document.addEventListener("DOMContentLoaded"...

  //global settings
  var skin = "maroon";

  var snippet_dir = "./snippet";
  var skin_dir = "./skin";
  var skin_css = "/skin.css";
  var ajaxLoader = "/ajax-loader.gif";

  //utils
  var utils = {};
  global.utils = utils;

  utils.insertHTML = function(selector, html){
    var elem = document.querySelector(selector);
    elem.innerHTML = html;
  };

  utils.addCSS = function(path){
    if(!path || path.length === 0) return null;
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    link.href = path;
    link.rel = "stylesheet";
    head.append(link);
  };

  utils.changeSkin = function(newSkin){
    skin = newSkin;
    var path = skin_dir + "/" + skin + skin_css;
    utils.addCSS(path);
  };


  function showLoading(selector){
    var html = "<div class = 'text-center'>";
    var ajaxLoader_dir = skin_dir + "/" + skin + ajaxLoader;
    html += "<img src = '" + ajaxLoader_dir + "'></div>";
    utils.insertHTML(selector, html);
  };

  function loadHomePage(){
    var homepage = snippet_dir + "/homepage.html";
    var selector = "#main-content";
    var registerEventListener = function(){
      $("#btn-tigers").click(function (event) {
        loadSubPage("tigers");
      });
      $("#btn-cats").click(function (event) {
        loadSubPage("cats");
      });
    }
    function responseHandler(response){
      utils.insertHTML(selector, response);
      registerEventListener();
      setActive("homepage");
    }


    showLoading(selector);

    ajaxUtils.send(
      homepage, 
      responseHandler);
  };
  
  function loadSubPage(category){
    var imgDirs = "./dirs/" + category + ".json";
    var selector = "#main-content";
    showLoading(selector);
    ajaxUtils.send(
      imgDirs, 
      BuildAndShowPage, true);
  }
  function BuildAndShowPage(imgs){
    var model_page = snippet_dir + "/subpage.html";
    var model_img = snippet_dir + "/imgModel.html";
    var html = "";
    var selector = "#main-content";
    ajaxUtils.send(
      model_page, 
      function(pageModel){
        html += insertProperty(pageModel, "subtitle", imgs.category);
        ajaxUtils.send(model_img, function(imgModel){
          var imgHTML = insertProperty(imgModel, "category", imgs.category);
          for(var i in imgs.items){
            var item = imgs.items[i];
            html += insertProperty(imgHTML, "filename", item);
            if (i % 2 == 1){
              html += '<div class="clearfix visible-lg-block visible-md-block visible-sm-block"></div>\n\r';
            }
          }
          html += "</div></div>";
          console.log(html);
          utils.insertHTML(selector, html);
          setActive(imgs.category);
        });
      });
  }

  function insertProperty(html, name, value){
    var key = "{{"+ name +"}}";
    return html.replace(new RegExp(key, "g"), value);
  }

  function setActive(category){
    var src = document.querySelector("#nav-list .active");
    src.className = src.className.replace(new RegExp("active", "g"), "");

    var selector = "#menu-" + category;
    var target = document.querySelector(selector).parentNode;
    target.className += " active";
  }

  /***initiation***/
  //set default content
  document.addEventListener("DOMContentLoaded", function(event){
    loadHomePage();
  });

  //set default skin
  utils.changeSkin("maroon");

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...


  $("#menu-homepage").mousedown(function (event) {
    loadHomePage();
  });

  $("#menu-tigers").mousedown(function (event) {
    var url = "./snippet/tigers.html";
    loadSubPage("tigers");
  });

  $("#menu-cats").mousedown(function (event) {
    var url = "./snippet/cats.html";
    loadSubPage("cats");
  });

  $("#menu-others").mousedown(function (event) {
    var url = "./snippet/others.html";
    loadSubPage("others");
  });
  
  $("#navbar-button").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
    
  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  
  $("#navbar-button").click(function (event) {
    $(event.target).focus();
  });

}(window));