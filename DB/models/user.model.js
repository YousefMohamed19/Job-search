//schema
// impport modules
import { Schema, model } from "mongoose";
import { status ,role} from "../../src/utils/const.js";

//create schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      username: {
        type: String,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      recoveryEmail: {
        type: String,
        required: true
      },
      DOB: {
        type: Date,
        required: true
      },
      mobileNumber: {
        type: String,
        required: true,
        unique: true
      },
      role: {
        type: String,
        enum: role,
        required: true
      },
      status: {
        type: String,
        enum: status,
        default: 'offline'
      },
        verifyEmail:{
          type:Boolean,
          default:false
        },
        otp:{
            type:String
        },
        otpExpires:{
            type:Date
        }
},{timestamps:true})

//model
export const User = model('User', userSchema)