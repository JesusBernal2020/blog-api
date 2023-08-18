const catchAsync = require('../utils/catchAsync');
const User = require('./../models/user.model');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');
const storage = require('../utils/firebase')

const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.singUp = catchAsync(async (req, res) => {
  const { name, email, password, description } = req.body;

  if (!req.file) { 
    return next(new AppError('Please upload a file', 400));
  }

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUpload = await uploadBytes(imgRef, req.file.buffer)

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    description,
    profileImgUrl: imgUpload.metadata.fullPath,
  });

  const tokenPromise = generateJWT(user.id);

  const imgRefToDownload = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRefToDownload);

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  user.profileImgUrl = url;
  
  res.status(200).json({
    status: 'success',
    message: 'the user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.singIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',
    },
  });
    
  if (!user) {
    return next(new AppError('User with email: ${email} not found!', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password ', 401));
  }

  const tokenPromise = generateJWT(user.id);

  const imgRef = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRef);

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  user.profileImgUrl = url;

  res.status(200).json({
    status: 'success',
    message: 'the user has been logged in',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});


exports.updatePassword = catchAsync(async (req, res, next) => { 
  const { user } = req;
  const { currentPassword, newPassword } = req.body;
  
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be equals', 400));
  }

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  });

  return res.status(200).json({
    status: 'success',
    message: 'The user Password was updated seccesfully',

  });
});