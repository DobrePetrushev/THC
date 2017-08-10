/*********************************
Simple Demo for loading files into
DynamoDB.
**********************************/
 
//package to read json files
var jsonfile = require('jsonfile');
//AWS node sdk
var AWS = require('aws-sdk');
 
//need to update region in config
AWS.config.update({
    region: "us-east-1"
});
 
//create a doc client to allow using JSON directly
var docClient = new AWS.DynamoDB.DocumentClient();
 
//prepared JSON file
//[{ ... }, { ... }]
var factFile = "data/cf.json";
var factArray = jsonfile.readFileSync(factFile);
 
//utility function to create a single put request
function getFact(index){
    return {
        TableName: 'cannabis_facts',
        Item: factArray[index]
    };
}

function saveFacts(index){
    if(index == factArray.length){
        console.log("saved all.");
        return;
    }
 
    var params = getFact(index);
    //spit out what we are saving for sanity
    console.log(JSON.stringify(params));
    //use the client to execute put request.
    docClient.put(params, function(err, data) {
        if (err) {
            console.log(err);
        }else{
            console.log("saved Place item "+index);
            index += 1;
            //save the next place on the list
            //with half a second delay
            setTimeout(function(){
                saveFacts(index);
            }, 500);
        }
    });
}
 
//start saving from index - 0
saveFacts(0);