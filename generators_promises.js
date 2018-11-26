function sleep(where) {
    console.log("sleeeep " + where );
    for (let i = 0; i < 10*1000*1000*1000/2; i++) {
        ;
    }    
}


function getJSON(url) {
    const promise = new Promise((resolve, reject) => {
        console.log("hello from promise ", url);

        sleep(url);
        resolve(url);// async call
        sleep(url);
    });

    return promise;
}

sleep();

getJSON("einz")
    .then((processed) => getJSON(processed + 1)) // async call
    .then((processed) => getJSON(processed + 2));

console.log("main thread");
sleep();