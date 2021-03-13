const  { promisify } = require("util");

const
    config = require('config'),
    redis = require("redis"),
    client = redis.createClient(config.redis.port),
    getAsync = promisify(client.get).bind(client),
    delAsync = promisify(client.del).bind(client),
    keysAsync = promisify(client.keys).bind(client),
    mgetAsync = promisify(client.mget).bind(client),
    setAsync = promisify(client.set).bind(client)
;


module.exports = {
    /**
     * Get all records from memory DB
     * @return {Promise}
     */
    getAll: async function getAllFromDb() {
        let keys = [];
        let result = [];
        await keysAsync('*').then(function(key) {
            keys = key;            
        })
        if(keys.length != 0){
            await mgetAsync(keys).then(function(answ) {
                for(item of answ){
                    result.push(JSON.parse(item));
                }
                result.sort(function (a, b) {
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
        return result
    },


    /**
     * Get record by id from memory DB
     * @param id
     * @return {Promise}
     */
    getById: async function getIdFromDb(id) {
        return await getAsync('user'+id)
    },
    /**
     * Add new record to memory DB
     * @param name
     * @return {Promise}
     */
    setNewId: async function setNewIdToDb(name) {
        let id = 0;
        await keysAsync('*').then(function(keys) {
            id = keys.length
            if (keys.includes('user'+id)){
                id = id + 1
            }
        })
        let result = {"id": id, "name": name}
       await setAsync('user'+id,JSON.stringify(result))
    },
    /**
     * Update record into memory DB
     * @param id
     * @param name
     * @return {Promise}
     */
    updateId: async function updateIdToDb(id,name) {
        return await getAsync('user'+id,JSON.stringify({"id": parseInt(id), "name":name}))
    },

    /**
     * Remove record from memory DB
     * @param id
     * @return {Promise}
     */
    removeId: async function removeIdInDb(id) {
        return await delAsync('user'+id)
    }
}
