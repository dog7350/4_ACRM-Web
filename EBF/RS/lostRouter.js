module.exports = function(req, res, next){
    res.status(404).send(
        {
            result: '404 NOT FOUND',
            code: 404
        }
    );
}