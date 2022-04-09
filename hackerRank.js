const puppeteer = require("puppeteer");

let {email, password} = require("./secrets");

let {answer} = require("./codes");

let curTab;

let browserOpenPromise = puppeteer.launch({
    headless: false,
    debuggingPort: null,
    defaultViewport:null,
    args: ["--start-maximized"]
});

browserOpenPromise.then(function (browser){   // fullfill
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
    let allQuesPromise = curTab.waitForSelector('a[data-analytics="ChallengeListChallengeName" ]');
    return allQuesPromise;
})
.then(function(){
    function getAllQuesLinks(){
        let allElemArr = document.querySelectorAll('a[data-analytics="ChallengeListChallengeName" ]');
        let linksArr =[];
        for(let i = 0; i<allElemArr.length; i++){
            linksArr.push(allElemArr[i].getAttribute("href"));
        }
        return linksArr;
    }
                                // evaluate -> help to run function 
    let linksArrPromise = curTab.evaluate(getAllQuesLinks);
    return linksArrPromise;
})
.then(function(linksArr){
    //question solve karna hai 
    console.log("links to all question received");
    console.log(linksArr);
    let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
    for(let i = 1; i<linksArr.length; i++){
        questionWillBeSolvedPromise  = questionWillBeSolvedPromise.then(function(){
            return questionSolver(linksArr[i], i);
        })
    }
    return questionWillBeSolvedPromise;
})
.then(function(){
    console.log("question is solved");
})
.catch(function(err){
    console.log(err);
});

function waitAndClick(algoBtn){
    let waitClickPromise = new Promise(function( resolve, reject){
        let waitForSelectorPromise = curTab.waitForSelector(algoBtn);
        waitForSelectorPromise.then(function (){
            console.log("algo btn is found");
            let clickPromise = curTab.click(algoBtn);
            return clickPromise;
        })
        .then(function (){
            console.log("algo btn is clicked");
            resolve();
            
        })
        .catch(function (err){
            reject(err);
        })
    });
    return waitClickPromise;
}

function questionSolver(url, idx){
    return new Promise(function(resolve, reject){
        let fullLink = `https://www.hackerrank.com${url}`;
        let goToQuesPagePromise = curTab.goto(fullLink);
        goToQuesPagePromise.then(function(){
            console.log("question opened");
            //tick the custom input box mark
            let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
            return waitForCheckBoxAndClickPromise;
        })
        .then(function(){
            //select the box where code will be typed
            let waitForTextBoxPromise = curTab.waitForSelector(".custominput");
            return waitForTextBoxPromise;
        })
        .then(function(){
            let codeWillBeTypedPromise = curTab.type(".custominput", answer[idx]);
            return codeWillBeTypedPromise;
        })
        .then(function(){
            //control key is pressed promise
            let ctrlPressedPromise = curTab.keyboard.down("Control");
            return ctrlPressedPromise;
        })
        .then(function(){
            // a key is pressed promise
            let aKeyPressedPromise = curTab.keyboard.press("a");
            return aKeyPressedPromise;
        })
        .then(function(){
            // x key is pressed promise
            let xKeyPressedPromise = curTab.keyboard.press("x");
            return xKeyPressedPromise;
        })
        .then(function(){
            // select the editor promise
            let cusorOnEditorPromise  = curTab.click(".monaco-editor.no-user-select.vs");
            return cusorOnEditorPromise;
        })
        .then(function(){
            // a key is pressed promise
            let aKeyPressedPromise = curTab.keyboard.press("a");
            return aKeyPressedPromise;
        })
        .then(function(){
            // v key is pressed promise
            let vKeyPressedPromise = curTab.keyboard.press("v");
            return vKeyPressedPromise;
        })
        .then(function(){
            // submit Btn is pressed promise
            let submitBtnClickedPromise = curTab.click(".hr-monaco-submit");
            return submitBtnClickedPromise;
        })
        .then(function(){
            let ctrlDownPromise = curTab.keyboard.up("Control");
            return ctrlDownPromise;
        })
        .then(function(){
            console.log("code submitted successfully");
            resolve();
        })
        .catch(function(err){
            reject(err);
        });
    });

}