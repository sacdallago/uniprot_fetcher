module.exports = {
    PPIJSONToTSV: (inputJSON) => {
        let result = "source\ttarget\tscore\n";

        inputJSON.forEach(e => {
            let uniprotId = e.uniprotId;

            e.partners.forEach(p => {
                result += uniprotId + "\t" + p.uniprotId + "\t" + p.score + "\n";
            })
        });

        return result;
    },

    locJSONToTSV: (inputJSON) => {
        let result = "uniprot_id\tloc\n";

        inputJSON.forEach(e => {
            let uniprotId = e.uniprotId;

            e.locations.forEach(l => {
                result += uniprotId + "\t" + l + "\n";
            })
        });

        return result;
    }
};