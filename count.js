function countBlocks(){
$('h4').html(localStorage.getItem("blocks"));
}


window.addEventListener('DOMContentLoaded', function () {
countBlocks()
});
