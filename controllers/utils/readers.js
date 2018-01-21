function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

module.exports = {
    locFileReader: function(fileContent, filter=false) {
        let lines = fileContent.split('\n');

        let headers = lines[0].split('\t');
        let data = lines.slice(1, lines.length);

        if(filter !== false) data = data.filter(function(e){ return filter.indexOf(e.split(/\t/)[0])>-1});

        let result = data.map(function(line){
            let cols = line.split('\t');

            let result = {
                uniprotId: cols[0]
            };

            let locIndexes = getAllIndexes(cols, "1");
            let locations = locIndexes.map(i => headers[i]);

            result.locations = locations;

            return result;
        });

        return result;
    },
    ppiFileReader: function(fileContent, filter=false, conservative=false){
        let lines = fileContent.split('\n');

        let hashMatrix = {};

        // Complete and symmetric
        if(filter === false){
            lines.forEach(function(line) {
                let cols = line.split('\t');

                hashMatrix[cols[0]] = {...hashMatrix[cols[0]]};
                hashMatrix[cols[0]][cols[1]] = cols[2];

                // Ensure symmetry of hash matrix
                hashMatrix[cols[1]] = {...hashMatrix[cols[1]]};
                hashMatrix[cols[1]][cols[0]] = cols[2];
            });

            // Partial asymmetric (left join)
        } else if(filter !== false && conservative === false) {
            lines.forEach(function(line) {
                let cols = line.split('\t');

                if(filter.indexOf(cols[0]) > -1){
                    hashMatrix[cols[0]] = {...hashMatrix[cols[0]]};
                    hashMatrix[cols[0]][cols[1]] = cols[2];
                }

                if(filter.indexOf(cols[1]) > -1){
                    hashMatrix[cols[1]] = {...hashMatrix[cols[1]]};
                    hashMatrix[cols[1]][cols[0]] = cols[2];
                }

            });

            // Partial symmetric (inner join)
        } else if(filter !== false && conservative === true) {
            lines.forEach(function(line) {
                let cols = line.split('\t');

                if(filter.indexOf(cols[0]) > -1 && filter.indexOf(cols[1]) > -1 ){
                    hashMatrix[cols[0]] = {...hashMatrix[cols[0]]};
                    hashMatrix[cols[0]][cols[1]] = cols[2];

                    // Symmetry condition
                    hashMatrix[cols[1]] = {...hashMatrix[cols[1]]};
                    hashMatrix[cols[1]][cols[0]] = cols[2];
                }
            });
        } else {
            throw new Error("Don't know what to do!");
        }


        let result = Object.entries(hashMatrix).map((row) => {
            let result = {
                uniprotId: row[0],
                partners: []
            };

            Object.entries(row[1]).forEach(function(column) {
                result.partners.push({
                    uniprotId: column[0],
                    score: column[1]
                })
            });

            return result;
        });

        return result;
    }
};