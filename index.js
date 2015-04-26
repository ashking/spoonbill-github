/**
 * Created by Ashwin on 4/26/2015.
 */


var express = require('express'),
    http = require('http'),
    githubTokens = require('./keys.json'),
    config = require('./config.json'),
    GitHubApi = require("ashking-node-github"),
    async = require("async");


var github = new GitHubApi({
    // required
    version: "3.0.0",
    headers: {
        "user-agent": "github-api-ratelimit-dashboard" // GitHub is happy with a unique user agent
    }
});

var app = express();

app.use("/", express.static(__dirname + '/www'));

app.get('/', function(req, res){
    res.sendFile('www/index.html', {root: __dirname })
});

app.get('/getData', function(req, res) {
    var limits = {};

    async.forEachLimit(githubTokens.tokens, 5, function(auth, callback){
        var name = auth.name;

        github.authenticate({
            type: "oauth",
            token: auth.token
        });
        github.misc.rateLimit({},
            function (err, res) {
                if (err) {
                    return callback(err);
                }
                limits[name] = res;
                delete limits[name].meta;
                delete limits[name].rate;
                callback();
            })
    }, function(err){
        if(err)
            res.json({'data': []})
        res.json({'data': limits});
    })
});

app.listen(config.app.port, function(){
    console.log("app listening on port: " + config.app.port)
});