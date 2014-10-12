module.exports = {
"model" :   {   
                "need": true,
                "folder_name": "model",
                "global_driver": "mongoose"
            },
"view" :   {  
                "need": true,
                "folder_name": "views",
                "engine": "ejs"
            },
"controller" : {
                "need": true, //Probably you will always need this
                "folder_name": "controller",
            },
"policy" :  {   
                "need": true,
                "folder_name": "policy",
            },
"database": {
                "need" : true,
                "username": "",
                "password": "",
                "url":"localhost",
                "port": 27017


}

        
};