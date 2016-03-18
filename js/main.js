
////////////////////////////settings toggle
function togfun(button) {
  	var img = button.children[0];
  	var form = button.parentElement.children[3];
  	if (button.style.backgroundColor){
  		button.style.backgroundColor="";
  		form.style.display="none";
  	}else{
  		button.style.backgroundColor="white";
  		form.style.display="block";
  	}
	if(img.classList.contains("rotate-img")){
		img.classList.remove('rotate-img');
	}else{
		img.classList.add('rotate-img');
	}
}

// add event listener to settings buttons
var button1 = document.getElementById("folders-settings");
button1.addEventListener("click", function(){togfun(button1)}, false);
var button2 = document.getElementById("reports-settings");
button2.addEventListener("click",function(){togfun(button2)}, false);
////////////////////////////end settings toggle



/////////////////////////// tabs toggle

window.addEventListener("hashchange", funcRef, false);
function funcRef(){
	var currentTab = document.getElementById(location.hash.slice(1));
	if(location.hash.slice(1) === ""){
		return;
	}
	var pastTabTitle = document.getElementsByClassName("activeTab");
	var alltabs = document.getElementsByClassName("tab-container");
	var currentTabTitle=document.getElementById(location.hash.slice(1)+"-tab")
		  for (var i = 0; i < alltabs.length; i++) {
		    alltabs[i].style.display = "none";
		  }

		currentTab.style.display = "block";
		pastTabTitle[0].classList.remove('activeTab');
		currentTabTitle.classList.add('activeTab');

}
/////////////////////////////end tabs toggle




window.addEventListener('load', init, false);

var options = {
    done: function (json) {
        console.log(json);
        var notifications = document.querySelector(".notifications");
        if (json.notification) {
            var content = document.createTextNode(json.notification);
            notifications.appendChild(content);
        };

    },
    fail: function (err) {
        console.log(err)
    }
}

function init() {
    UTILS.ajax('data/config.json', options);
}