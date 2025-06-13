// exports.restrictUserUpdate = (req, res, next) => {
//    const userIdToUpdate = String(req.params.id);
//   const loggedInUserId = String(req.user.id);
//   const role = req.user.role;
//   const keysBeingUpdated = Object.keys(req.body);

//   if (role === 'admin') {
//     if (userIdToUpdate !== loggedInUserId) {
//       // Admin updating another user
//       if (keysBeingUpdated.length === 1 && keysBeingUpdated[0] === 'role') {
//         return next(); // Admin allowed to update only 'role'
//       } else {
//         return res.status(403).send({
//           message: 'Admins can only update the role of other users',
//         });
//       }
//     } else {
//       return next(); // Admin updating their own info
//     }
// };

// };




// exports.restrictUserUpdate = (req, res, next) => {
//   const userIdToUpdate = req.params.id;
//   const loggedInUserId = req.user.id;
//   const loggedInUserRole = req.user.role;

//   console.log('yyyyyyyyyy',{
//   userIdToUpdate,
//   loggedInUserId,
//   loggedInUserRole
// });

//   // Admins can only update the `role` field of others
//   if (loggedInUserRole === 'admin' && userIdToUpdate !== loggedInUserId) {
//     const keysBeingUpdated = Object.keys(req.body);
//     // Only allow 'role' update
//     if (keysBeingUpdated.length === 1 && keysBeingUpdated[0] === 'role') {
//        next(); // OK
//     } else {
//       return res.status(403).send({
//         message: 'Admins can only update the role of other users'
//       });
//     }
//   } else if (String(userIdToUpdate) !== String(loggedInUserId) && loggedInUserRole === 'user'){
//   res.status(403).send({
//       message: 'You are not allowed to update other users\' data'
//     });
//   } else {
//      res.status(403).send({
//       message: 'Forbidden'
//     });
//   }

// //   // Users can only update their own info
// //   if (userIdToUpdate !== loggedInUserId && loggedInUserRole === 'user') {
// //     return res.status(403).send({
// //       message: 'You are not allowed to update other users\' data'
// //     });
// //   }

//   // All other valid cases
//   next();
// };



// exports.restrictUserUpdate = (req, res, next) => {
//   const userIdToUpdate = String(req.params.id);
//   const loggedInUserId = String(req.user.id);
//   const role = req.user.role;
//   const keysBeingUpdated = Object.keys(req.body);

//   if (role === 'user') {
//     if (userIdToUpdate !== loggedInUserId) {
//       return res.status(403).send({
//         message: 'You are not allowed to update other users\' data',
//       });
//     } else {
//       return next(); // User updating their own info
//     }

//   } else if (role === 'admin') {
//     if (userIdToUpdate !== loggedInUserId) {
//       // Admin updating another user
//       if (keysBeingUpdated.length === 1 && keysBeingUpdated[0] === 'role') {
//         return next(); // Admin allowed to update only 'role'
//       } else {
//         return res.status(403).send({
//           message: 'Admins can only update the role of other users',
//         });
//       }
//     } else {
//       return next(); // Admin updating their own info
//     }

//   } else {
//     // Optional: Handle unexpected roles
//     return res.status(403).send({
//       message: 'Forbidden',
//     });
//   }
// };

exports.onlyAdminRoleEdit = (req, res, next) => {
  const isAdmin = req.user.role === 'admin';
  const isSelfUpdate = String(req.params.id) === String(req.user.id);

  console.log(req.params.id)
  console.log(req.user.id)

  if (isAdmin && !isSelfUpdate) {
    const keys = Object.keys(req.body);
    const isOnlyRoleUpdate = keys.length === 1 && keys[0] === 'role';

    if (!isOnlyRoleUpdate) {
      return res.status(403).json({
        message: 'Admins can only update the role of other users',
      });
    }
  }else {
     return res.status(403).send({
      message: 'Forbidden',
    });
  }

  next();
};
