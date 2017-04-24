chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.url)  
        chrome.tabs.create({"url": request.url, "active": false});
      
    if (request.message){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: request.message}, function(response) {
            console.log(response.message);
          });
        });
    }
    
    if (request.report){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.getSelected(null, function(tab){
          //chrome.tabs.executeScript(tab.id, {code: "ga('tweettracker.send', 'event', 'category', 'action', '"+request.report+"', '"+request.report+"')"}, function(response) {

          //});
        });
      });
    }
        
  });