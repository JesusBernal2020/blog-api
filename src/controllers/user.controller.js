const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { ref, getDownloadURL } = require('firebase/storage');
const storage = require('../utils/firebase');

exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  });

  const usersPromises = users.map(async (user) => { 
    const imgRef = ref(storage, user.profileImgUrl);
    const url = await getDownloadURL(imgRef);

    user.profileImgUrl = url;

    return user;
  });

  const userResolve = await Promise.all(usersPromises);

  res.status(200).json({
    status: 'success!',
    users: userResolve,
  });
});

exports.findOneUser = catchAsync(async (req, res, next) => {
  //aquí
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  res.status(200).json({
    status: 'success!',
    user: {
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // aqui
  const { user } = req;
  const { name, description } = req.body;

  const userUpdate = await user.update({ name, description });
  return res.status(200).json({
    status: 'success!',
    message: 'user updated successfully!',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // aqui

  const { user } = req;
  const userDelete = await user.update({ status: 'inactive' });
  return res.status(200).json({
    status: 'success!',
    message: 'user deleted successfully!',
  });
});
