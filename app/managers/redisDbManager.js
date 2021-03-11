const { Promise } = require('bluebird');
const Bluebird = require('bluebird');

const db = require('../../data/users.json'),
redis = require('redis'),
config = require('config'),
client = redis.createClient(config.redis.port);
Bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = {

/**
 * Get all records from memory DB
 * @return {Promise}
 */
    getAll: function getAllFromDb() {
    let result = client.keysAsync('*',).then(function(keys) {
        if(keys. length != 0){
        return client.mgetAsync(keys).then(function(res) {
            let temp = [];
            for (let i = 0, len = res.length; i < len; i++){
                temp.push(JSON.parse(res[i]))
            }
            return temp.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
                return 0;
                })
        })
    }
    else{
        return [];
    }
})
    return Promise.all(result)
},


    /**
 * Get record by id from memory DB
 * @param key
 * @return {Promise}
 */
    getById: function getIdFromDb(id) {
    let temp = client.getAsync('user'+id).then(function(reply) {
        return JSON.parse(reply);
    });
    return Promise.all([temp]);
},

/**
 * Add new record to memory DB
 * @param name
 */
    setNewId: function setNewIdToDb(name) {
    client.keys('*', function(err,keys) {
    let id = 0;
        for (let key in keys){
            id++
        }
    client.set('user'+ id, JSON.stringify({"id": id, "name": name}))  
    })
},

/**
 * Update record into memory DB
 * @param id
 * @param name
 */
    updateId: function updateIdToDb(id,name) {
    client.set('user'+ id, JSON.stringify({"id": parseInt(id), "name": name}))
},

/**
 * Remove record from memory DB
 * @param id
 */
 removeId: function removeIdInDb(id) {
    client.del('user'+id)
}

}