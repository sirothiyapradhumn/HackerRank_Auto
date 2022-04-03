const puppeteer = require("puppeteer");

let {email, password} = require("./secrets");

let curTab;

let browserOpenPromise = puppeteer.launch({
    headless: false,
    debuggingPort: null,
    defaultViewport:null,
    args: ["--start-maximized"]
});

browserOpenPromise //fullfill
    .then(function (browser){
    console.log("browser is open");
    let allTabsPromise = browser.pages(); // sare page k info. leke ayege from browser
    return allTabsPromise; // ↓ return karega
})
.then(function(allTabsArr){
    curTab = allTabsArr[0];
    console.log("new Tab");;
    let visitingLoginPagePromise = curTab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromise;
})
.then(function(){
    console.log("hackerrank login page opened");
                                                // selector
    let emailwillBeTypedPromise  = curTab.type('input[id="input-1"]', email);
    return emailwillBeTypedPromise;
})
.then(function(){
    console.log("email has been typed");
    let willBeLoggedInPromisse = curTab.type('input[name="password"]', password);
    return willBeLoggedInPromisse;
})
.then(function(){
    console.log("password has been typed");
    let willBeLoggedInPromise = curTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    return willBeLoggedInPromise;
})
.then(function (){
    console.log("logged into hackerrank successfully");
    //waitAndClick will wait for the selector to load, and then click on the node
    let algorithmTabWillBeOpenedPromise = waitAndClick("div[data-automation='algorithms']");
    return algorithmTabWillBeOpenedPromise;
})
.then(function(){
    console.log("algorithm page opened");
})
.catch(function(err){
    console.log(err);
});

function waitAndClick(algoBtn){
    let waitClickPromise = new Promise(function(resolve, reject){
        let waitForSelectorPromise = curTab.waitForSelector(algoBtn);
        waitForSelectorPromise.then(function (){
            console.log("algo btn is found");
            let clickPromise = curTab.click(algoBtn);
            return clickPromise;
        })
        .then(function (){
            console.log("algo btn is clicked");
            //resolve();
        })
        .catch(function (err){
            console.log(err);
        })
    });
    return waitClickPromise;
}