const axios = require('axios');
exports.transformData = (data) => {
    for (var key of Object.keys(data).sort().reverse()) { /// iterate over keys in reversed
        for (var i = 0; i < data[key].length; i++) { /// iterate over items by this object key
            var search_level = (Number(data[key][i].level)) - 1; /// get searching level
            if (search_level < 0) break; /// make sure that it will not over iterate 
            for (var j = 0; j < data[search_level].length; j++) { /// items in lower level
                if (data[key][i].parent_id === data[search_level][j].id) { /// a bit of condition
                    data[search_level][j].children.push(data[key][i]) /// get in the bag son!
                }
            }
        }
    }
    return data[Object.keys(data)[0]];
}

exports.searchInRepos = () => {
    const search_keyword = 'nodejs';
    return new Promise(function (resolve, reject) {
        axios.get(`https://api.github.com/search/repositories?q=${search_keyword}+in:name&per_page=100`)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            })
    });
}