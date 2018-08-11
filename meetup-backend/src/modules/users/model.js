// import mongoose, { Schema } from 'mongoose';

// const UserSchema = new Schema(
//   {
//     email: {
//       type: String,
//       unique: true,
//     },
//     fullName: String,
//     avatar: String,
//     providerData: {
//       uid: String,
//       provider: String,
//     },
//   },
//   { timestamps: true },
// );

// UserSchema.statics.findOrCreate = async function (args) {
//   try {
//     const user = await this.findOne({
//       email: args.email,
//       fullName: args.fullName,
//     });

//     if (!user) {
//       return await this.create(args);
//     }

//     return user;
//   } catch (e) {
//     return e;
//   }
// };

// export default mongoose.model('User', UserSchema);


const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const { sequelize, Sequelize } = require('../../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Email already exists',
    }
  },

  fullName: {
    type: Sequelize.STRING
  },

  avatar: {
    type: Sequelize.STRING
  },

  providerData: {
    type: Sequelize.STRING,
    // uid: Sequelize.STRING,
    // provider: Sequelize.STRING,
  },

  password: String
}, { timestamps: true });

User.beforeCreate((user) => {
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
});

User.prototype.comparePassword = function (somePassword) {
  return bcrypt.compareSync(somePassword, this.get('password'));
};

module.exports = User;

