let fs = require('fs');

module.exports = {
    read: (filename) => {
        return new Promise((resolve,reject) => {
            fs.readFile(filename, 'utf8', function(err, contents) {
                if(err !== undefined && err !== null){
                    reject(err);
                } else {
                    resolve(contents);
                }
            });
        });
    }
};