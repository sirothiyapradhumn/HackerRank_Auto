const puppeteer = require("puppeteer");

let {email, password} = require("./secrets");

let curTab;

let browserOpenPromise = puppeteer.launch({
    headless: false,
    debuggingPort: null,
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
})
.catch(function(err){
    console.log(err);
});