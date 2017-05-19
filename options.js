function blockAccounts() {
  var accountString = localStorage.getItem('accountsToBlock');
  var accountArray = JSON.parse(accountString);

  var lines = $('#accounts').val().split('\n');
  var accounts = [];
  for (line in lines){
    if (lines[line].charAt(0) == '@'){
      var account = lines[line].substring(1);
      accounts.push(account);
    }
  }
  //console.log(accounts);
  localStorage.setItem('accountsToBlock',JSON.stringify(accounts));
  setTimeout(function(){iterateAccounts()},2000);
}

function iterateAccounts() {
  var accountString = localStorage.getItem('accountsToBlock');
  var accountArray = JSON.parse(accountString);
  console.log(accountArray)
  //var account = accountArray[0];
  
  max = 5;
  console.log(accountArray.length)
  if (accountArray.length < 5)
    max = accountArray.length -1;
  console.log("max "+max)
  if (max > 0){
  
  
    for (i = 0; i <= max; i++) {
      console.log(i)
      console.log(accountArray[i])
      
      if (accountArray[i] == null){
        
        console.log("null")
      } else {
        account = accountArray[i];
        chrome.runtime.sendMessage({
            url: "https://twitter.com/" + account + "?block="+localStorage.getItem("userHash")
          }, function (response) {
            //console.log(response);
        });
      }
      accountArray = accountArray.splice(max);
      console.log(accountArray)
      localStorage.setItem('accountsToBlock',JSON.stringify(accountArray));
    }
    
    if (accountArray.length > 0 ){
      setTimeout(function(){
        chrome.runtime.sendMessage({
            new: true
          }, function (response) {
            window.close();
        });

         window.close

      },10000);
    } else {
      window.close();
    }
  }
}

function getHash() {
  chrome.storage.sync.get({
    hash: 'red'
  }, function(items) {
    console.log(items)
    localStorage.setItem("userHash", items.hash);
  });
}

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

i=0;

if (localStorage.getItem('accountsToBlock') && getParameterByName("continue")){
    iterateAccounts();
}

$( "#block" ).on( "click", function() {
  getHash();
  setTimeout(function(){blockAccounts()},2000);
});
