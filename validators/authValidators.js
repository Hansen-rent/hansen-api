const { body } = require('express-validator');

// const { CORPORATE_DOMAIN } = process.env;

const registerValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email є обовʼязковим полем')
    .isEmail()
    .withMessage('Невірний формат email'),
  // .custom(value => {
  //   if (!value.endsWith(`@${CORPORATE_DOMAIN}`)) {
  //     throw new Error(`Email повинен закінчуватися на @${CORPORATE_DOMAIN}`);
  //   }
  //   return true;
  // }),

  body('password')
    .notEmpty()
    .withMessage('Пароль є обовʼязковим полем')
    .isLength({ min: 6 })
    .withMessage('Пароль має містити щонайменше 6 символів'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Підтвердження паролю є обовʼязковим')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Паролі не співпадають');
      }
      return true;
    }),
];

const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email є обовʼязковим полем')
    .isEmail()
    .withMessage('Невірний формат email'),

  body('password').notEmpty().withMessage('Пароль є обовʼязковим полем'),
];

module.exports = {
  registerValidator,
  loginValidator,
};
