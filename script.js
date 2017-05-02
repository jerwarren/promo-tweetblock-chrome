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
  if (!localStorage.getItem("userHash"))
    localStorage.setItem("userHash",hashCode(navigator.userAgent + new Date()));
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
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");

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
  
  
    var actualTrackerCode = '(' + function () {
      $("head").append("<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-97930301-1', 'auto', 'tweettracker'); ga('require', 'linker'); ga('linker:autoLink', ['ouijabored.com'] ); ga('tweettracker.send', 'pageview');</script>");

    } + ')();';

    var script = document.createElement('script');
    script.textContent = actualTrackerCode;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  
    /*var actualHashCode = '(' + function () {
      $("head").append("<script>function hashCode(str) { return str.split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);} if (!localStorage.getItem(\"userHash\")) localStorage.setItem(\"userHash\",hashCode(navigator.userAgent + new Date()))</script>");             
    } + ')();';

    var script = document.createElement('script');
    script.textContent = actualHashCode;
    (document.head || document.documentElement).appendChild(script);
    */

  
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
        
        //location.replace("javascript:ga('tweettracker.send', 'event', 'category', 'action', '"+permalink+"', '"+permalink+"'); void 0");
        
        var actualReportCode = '(' + function (permalink) {
          ga('create', 'UA-97930301-1', 'auto', 'tweettracker'); ga('require', 'linker'); ga('linker:autoLink', ['ouijabored.com'] );
          ga('tweettracker.send', 'event', 'tweet', 'block', 'mylabel', permalink);
          console.log(permalink);
        } + ')('+JSON.stringify(permalink)+');';

        var script = document.createElement('script');
        script.textContent = actualReportCode;
        (document.head || document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
        
        /*chrome.runtime.sendMessage({
          report: permalink
        }, function (response) {
          //console.log(response);
        });*/

        chrome.runtime.sendMessage({
          url: "https://twitter.com/" + blockee + "?block="+localStorage.getItem("userHash")+"&permalink="+permalink
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
  var user = window.location.pathname.substr(1);
  if (getParameterByName('block') == localStorage.getItem("userHash")) {
    
      if ($('.ProfileNav-item .user-actions.following').length == 0) {
        //startScrolling();

        $('.ProfileNav-item .user-dropdown').click();
        $('.ProfileNav-item .block-text.not-blocked .username.u-dir b:contains("' + user + '")').parent().parent().click();
        $('#block-dialog .block-button').click();

        chrome.runtime.sendMessage({
          message: "Blocked @" + user + " for Tweet Promotion"
        }, function (response) {
          window.close();
        });
      } else {
        setTimeout(function () {
         window.close()
        }, 1000);
      }
  }
  
  var autoBlock = window.location.pathname.substr(1);
  if (getParameterByName('autoblock') == 1) {
    startScrolling();
    
  
  }
    

});
