var responseJSON = (res, message, code) => {
    if (code == '0') {
        res.json({
            status: code,
            msg: '',
            result: message
        })
    } else {
        res.json({
            status: code,
            msg: message
        })
    }
} 

module.exports =  responseJSON;