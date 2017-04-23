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
    }, 1000);
  
}

$(document).ready(function () { // Load the function after DOM ready.

  //if ((window.location.pathname == "/" || window.location.pathname == "/search")) {

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");

      if (request.message) {
        toastr.success(request.message);
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

        chrome.runtime.sendMessage({
          url: "https://ouijabored.com/block.php?blockee=" + blockee
        }, function (response) {
          //console.log(response);
        });

        (this).remove();
      } else {
        console.log("found promoted, but skipping")
      }
    });
  });

  //}
  var user = window.location.pathname.substr(1);
  if (getParameterByName('block') == 1) {
    startScrolling();
    document.title = "Looking for Promos...";
    
    setTimeout(function () {

      if ($('.ProfileNav-item .user-actions.following').length == 0) {

        $('.ProfileNav-item .user-dropdown').click();
        $('.ProfileNav-item .block-text.not-blocked .username.u-dir b:contains("' + user + '")').parent().parent().click();
        $('#block-dialog .block-button').click();

        chrome.runtime.sendMessage({
          message: "Blocked @" + user + " for Tweet Promotion"
        }, function (response) {
          window.close();
        });
      }
    }, 10000);
  }
  
  var autoBlock = window.location.pathname.substr(1);
  if (getParameterByName('autoblock') == 1) {
    startScrolling();
  
  }
    

});
