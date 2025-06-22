// Return Only Necessary Fields
exports.sanitizeUser = (user) =>{
    return {
        id : user.id,
        name : user.name,
        email: user.email,
    };
};