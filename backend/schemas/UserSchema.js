const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// adds username, hash and salt fields + register/authenticate helpers
UserSchema.plugin(passportLocalMongoose);

module.exports = { UserSchema };
