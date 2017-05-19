//
//script to inject blocking code into Twitter page.
//
function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function startScrolling() {
  window.scrollTo(0,document.body.scrollHeight);
  setTimeout(function () {
      startScrolling()
    }, 5000);
}

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
}

function initBlocks(){
  var blocks = 0;
  
  if (localStorage.getItem("blocks"))
  blocks = parseInt(localStorage.getItem("blocks"));
  
  
  if (!localStorage.getItem("userHash")){
    var hash = hashCode(navigator.userAgent + new Date());
    localStorage.setItem("userHash", hash);
    chrome.storage.sync.set({
      hash: hash
    });
  } else {
    chrome.storage.sync.set({
      hash: localStorage.getItem("userHash")
    });
  }

  
}
function countBlocks(){
  blocks = parseInt(localStorage.getItem("blocks"));
  blocks=blocks+1;
  localStorage.setItem("blocks", blocks);
  
}


$(document).ready(function () { // Load the function after DOM ready.
  initBlocks();
  
  //if ((window.location.pathname == "/" || window.location.pathname == "/search")) {

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

      if (request.message) {
        toastr.success(request.message);
        countBlocks();
      }
    }
  );
  

  var actualCode = '(' + function () {
    $(document).ajaxComplete(function () {
      $("#domwatcher").append("<div style='display:none;'>watch</div>");
    });
  } + ')();';
  
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
  
  
  function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
}
  
  
  $("body").append('<div id="domwatcher"></div>');
  $("#domwatcher").bind("DOMSubtreeModified", function () {

    $('[data-promoted=true]').each(function (i, v) {
      var blockee = "";
      if (!$(this).attr('data-is-reply-to') && $(this).attr('data-disclosure-type') !== "earned") {

        if (!$(this).attr('data-retweeter')) {
          blockee = $(this).attr('data-screen-name');
        } else {
          blockee = $(this).attr('data-retweeter');
        }
        permalink = $(this).attr('data-permalink-path');
        

        chrome.runtime.sendMessage({
          url: "https://twitter.com/" + blockee + "?block="+localStorage.getItem("userHash")
        }, function (response) {
          //console.log(response);
        });

        $(this).remove();
      } else {
        console.log("found promoted, but skipping")
      }
    });
    /*if (getParameterByName('autoblock') == 1) {
      setTimeout(
      $('[data-permalink-path]').each(function (i, v) {
        
        $(this).remove();
      }), 5000);
    }*/
  });

  //}
  
  if (getParameterByName('block') == localStorage.getItem("userHash")) {
    var user = window.location.pathname.substr(1);
  user = $('b.u-linkComplex-target')[1].innerHTML;
  console.log(user);
      if ($('.ProfileNav-item .user-actions.following').length == 0) {
        //startScrolling();

        $('.ProfileNav-item .user-dropdown').click();
        $('.ProfileNav-item .block-text.not-blocked .username.u-dir b:contains("' + user + '")').parent().parent().click();
        $('#block-dialog .block-button').click();

        chrome.runtime.sendMessage({
          message: "Blocked @" + user + " for Tweet Promotion",
          close: true
        }, function (response) {
          window.close();
        });
      } else {
        setTimeout(function () {
         window.close();
        }, 1000);
      }
  }
  
  var autoBlock = window.location.pathname.substr(1);
  if (getParameterByName('autoblock') == 1) {
    startScrolling();
    
  
  }
    

});
