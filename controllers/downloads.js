let fileReader = require('./utils/fileReader').read;
let encoders = require('./utils/encoders');
let readers = require('./utils/readers');
let path = require('path');
let Readable = require('stream').Readable;


const files = [
    {
        date: '20180103',
        human_ppi: path.join(__dirname, '..', 'public', 'files', '20180103', 'human_proteome_prediction.tsv'),
        human_loc: path.join(__dirname, '..', 'public', 'files', '20180103', 'human_merged_locations.tsv'),
    }
];


let latest = files[0];


module.exports = {
    download: (request, response) => {
        let identifiers = request.body.identifiers || false;
        let options = {
            format: 'json',
            file: 'loc',
            conservative: true,
            ...request.body.options
        };

        let result;

        // TODO: get this from request
        let currentFiles = latest;

        response.set({
            'Content-Type': 'application/force-download',
            'Content-disposition':"attachment; filename=" + currentFiles.date + "_" + options.file + "." + options.format});

        switch (options.file){
            case 'ppi':
                fileReader(currentFiles.human_ppi)
                    .then((utfTSVText) => {
                        let ppis = readers.ppiFileReader(utfTSVText, identifiers, options.conservative);

                        switch(options.format){
                            case 'tsv':
                                result = encoders.PPIJSONToTSV(ppis);
                                break;
                            case 'json':
                            default:
                                result = JSON.stringify(ppis);
                                break;
                        }

                        response.end(result);
                    })
                    .catch(err => {
                        response.status(500).send(err);
                        console.log(err);
                        process.exit(1);
                    });
                break;
            case 'loc':
            default:
                fileReader(currentFiles.human_loc)
                    .then((utfTSVText) => {
                        let locs = readers.locFileReader(utfTSVText, identifiers);

                        switch(options.format){
                            case 'tsv':
                                result = encoders.locJSONToTSV(locs);
                                break;
                            case 'json':
                            default:
                                result = JSON.stringify(locs);
                                break;
                        }

                        response.end(result);
                    })
                    .catch(err => {
                        response.status(500).send(err);
                        console.log(err);
                        process.exit(1);
                    });
                break;
        }
    }
};