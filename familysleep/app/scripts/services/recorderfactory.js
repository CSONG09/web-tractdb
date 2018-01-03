'use strict';

var module = angular.module(
    'FamilySleep'
)
    
module.factory(
    'recorderFactory', 
    [
        '$rootScope', '$http', '$timeout', 'BASEURL_PYRAMID',
        function ($rootScope, $http, $timeout, BASEURL_PYRAMID) {
            var factory = {};

            
            factory.audio = {}; // audio: {'data': audio, 'timeStamp': new Date(), 'users': users};
            factory.users = [];
            factory.prompt = {};
            factory.promptID = {};

            /*
              setting the recorder data.
            */

            factory.putData = function() {

                
                var date_format = moment(factory.audio.timeStamp).format('YYYY_MM_DD_kk_mm');      
                
                var doc_id = 'audio_logs' + '_' + date_format;
                var doc_rev;
                var new_doc = {
                    "users": factory.audio.users,
                    "promptID": factory.promptId,
                    "prompt": factory.prompt,
                    "timeStamp": factory.audio.timeStamp
                }
                $http(  
                {
                    method: 'POST',
                    url: BASEURL_PYRAMID + '/document/' + doc_id,
                    data: new_doc
                }).then(function success(response){
                    doc_rev = response.data._rev;
                    //could null users
                    //factory.audio.users = null;
                    $http(  
                    {
                        method: 'POST',
                        url: BASEURL_PYRAMID +'/document/' + doc_id + '/attachment/' + date_format,
                        headers: {'Content-Type': factory.audio.data.type},
                        params: {'rev': doc_rev},
                        data: factory.audio.data
                    }).then(function success(response){
                        console.log('success at attaching audio log');
                    }).catch(function errorCallback(response){
                        console.log("error in the PUT");
                        console.log(response);
                        console.log(response.status);
                    });
                }).catch (function errorCallback(response){
                    console.log("error in the PUT");
                    console.log(response.status);
                });
            }

            return factory;
        }
    ]
);
