
////////////////////////////settings toggle
function togfun(button) {
  	var img = button.children[0];
  	var form = button.parentElement.children[3];
  	if (button.style.backgroundColor==="" || button.style.backgroundColor==="white"){
  		button.style.backgroundColor="lightgray";
  		form.style.display="none";
  	}else{
  		button.style.backgroundColor="white";
  		form.style.display="block";
  	}
  	UTILS.classToggle(img,'rotate-img');
}

// add event listener to settings buttons
var button1 = document.getElementById("folders-settings");
button1.addEventListener("click", function(){togfun(button1)}, false);
var button2 = document.getElementById("reports-settings");
button2.addEventListener("click",function(){togfun(button2)}, false);

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
		UTILS.classToggle(pastTabTitle[0],'activeTab');
		UTILS.classToggle(currentTabTitle,'activeTab');

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

//////////////////////// form keyboard 
var inputs = document.querySelectorAll('.settings-form input[type="text"],input[type="url"]');
for (var i = 0; i < 6; i++) {
	inputs[i].addEventListener('keydown',function(){keyPress(event,"reports-save","reports-cancel");});
}
for (var j = 6; j < inputs.length; j++) {
	inputs[j].addEventListener('keydown',function(){keyPress(event,"folders-save","folders-cancel");});
}
function keyPress(e,saveId,cancelId){
	var save = UTILS.qs("#"+saveId);
	var cancel =UTILS.qs("#"+cancelId);
    if (e.keyCode == 13){
    	e.preventDefault();
    	save.click();
    	return false;
    }
    if(e.keyCode == 27){
    	e.preventDefault();
    	cancel.click();
    	return false;
    }
  }

/////////////////////////// form cancel
var cancelForm = document.getElementsByClassName("cancel-btn");
cancelForm[0].addEventListener("click",function(){togfun(cancelForm[0].parentElement.parentElement.parentElement.children[1]);},false);
cancelForm[1].addEventListener("click",function(){togfun(cancelForm[1].parentElement.parentElement.parentElement.children[1]);},false);

/////////////////////////// form save
var saveForm = document.querySelectorAll('button[type="button"]');
saveForm[0].addEventListener("click",function(){formValid(saveForm[0].parentElement.parentElement);},false);
saveForm[1].addEventListener("click",function(){formValid(saveForm[1].parentElement.parentElement);},false);

function formValid(form) {
	var valid = true;
	var iframeUrl = "";
	var tabId = "#" + form.parentElement.parentElement.id; 
	var sitesNames = UTILS.qsa(tabId + " input[name='name']");
    var sitesUrls = UTILS.qsa(tabId + " input[name='url']");
	for (var i = 0; i < 3; i++) {
		sitesUrls[i].required=false;
		sitesNames[i].required=false;
		    if(sitesNames[i].value === "" && sitesUrls[i].value != ""){
		    	sitesNames[i].required=true;
		    	valid =false;

		    }else if(sitesNames[i].value != "" && sitesUrls[i].value === ""){
		    	sitesUrls[i].required=true;
		    	valid =false;
		    }
		    if(sitesNames[i].value !="" && sitesUrls[i].required=== false){
		   		iframeUrl = sitesUrls[i].value;
		    }
	}
	var urlList=UTILS.qs(tabId + " .urlList");
	urlList.innerHTML = ""; 
	if(valid === true){
		togfun(UTILS.qs(tabId + " .settings"));
		if(iframeUrl != "" && valid === true){
			if(UTILS.qs(tabId + " .iframe-container").childElementCount == 0){
				var iframe = document.createElement("iframe");
				iframe.src = iframeUrl;
			   	UTILS.qs(tabId + " .iframe-container").appendChild(iframe);
			   	UTILS.qs(tabId + " .expand").style.display = "block";
			}else{
				UTILS.qs(tabId + " iframe").src = iframeUrl;
			}
		}
		for (var i = 2; i >= 0; i--) {
			if(sitesUrls[i].value != ""){
				var opt = document.createElement('option');
	            opt.value = sitesUrls[i].value;
	            opt.innerHTML = sitesNames[i].value;
	            urlList.appendChild(opt);
			}
		}
	}
	if(urlList.childElementCount == 0){
		urlList.style.display="none";
		UTILS.qs(tabId + " .iframe-container").innerHTML="";
		UTILS.qs(tabId + " .expand").style.display = "none";
	}else if(urlList.childElementCount == 1){
		urlList.style.display="none";
	}else{
		urlList.style.display="block";
	}
	return;
}
//////////////////////// urlList iframe change
var urlList = document.querySelectorAll(".urlList");
urlList[0].addEventListener("change",function(){iframeChange(urlList[0]);},false);
urlList[1].addEventListener("change",function(){iframeChange(urlList[1]);},false);
function iframeChange(element) {
	var tabId = "#" + element.parentElement.parentElement.id; 
	UTILS.qs(tabId +" iframe").src = UTILS.qs(tabId +" .urlList").value;
}
///////////////////////// expand button
var expand = document.querySelectorAll(".expand");
expand[0].addEventListener("click",function(){OpenInNewTab(expand[0].parentElement.parentElement);},false);
expand[1].addEventListener("click",function(){OpenInNewTab(expand[1].parentElement.parentElement);},false);
expand[2].addEventListener("click",function(){OpenInNewTab(expand[2].parentElement.parentElement);},false);
expand[3].addEventListener("click",function(){OpenInNewTab(expand[3].parentElement.parentElement);},false);
function OpenInNewTab(element) {
	var iframe = UTILS.qs("#"+element.id +" iframe");
	if(iframe){
		var win = window.open(iframe.src, '_blank');
		win.focus();
	}
	
}
