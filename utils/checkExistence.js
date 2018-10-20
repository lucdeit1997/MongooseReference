const emailExistence = require('email-existence');

exports.checkExistence = email => {
    return new Promise(async resolve => {
        emailExistence.check(email, (err, emaiResult)=>{
            return resolve({
                email: emaiResult
            })
        });
    })
}