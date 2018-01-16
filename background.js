(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-107075747-1']);
_gaq.push(['_trackPageview']);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.url){ 
      chrome.tabs.create({"url": request.url, "active": false});
      _gaq.push(['_trackEvent', "blocked", request.blockee]);
    }
    
    if (request.tweetId){
      _gaq.push(['_trackEvent', "tweetId", request.tweetId]);
    }
    if (request.permalink){
      _gaq.push(['_trackEvent', "permalink", request.permalink]);
    }

    if (request.message){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: request.message}, function(response) {
            if (!localStorage.getItem("blocks"))
              localStorage.setItem("blocks",0)
            
            blocks = parseInt(localStorage.getItem("blocks"));
            blocks=blocks+1;
            localStorage.setItem("blocks", blocks);
          });
        });
    }
    
    if (request.report){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.getSelected(null, function(tab){
            chrome.tabs.executeScript(tab.id, {code: "alert('test');"}, function(response) {

            });
          });
      });
    }
    if (request.close){
      myTab = sender.id;
      chrome.tabs.remove(sender.id);
    }
    if (request.new){
      chrome.tabs.create({'url': "/options.html?continue=1", 'active': false} );
    }
        
  });