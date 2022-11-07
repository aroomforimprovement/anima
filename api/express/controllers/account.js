//const mongoUtil = require('@u/mongo-util');
//const routeUtil = require('@u/routes-util');


module.exports = {
    getAccountInfo: async (req, res) => {
        console.log("getAccountInfo");
        console.log(req.params[0]);
        console.log(res);
    }
}