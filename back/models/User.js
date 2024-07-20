const mongoose = require('mongoose');

// Define the MonthlyDataItem schema for each data entry in a month
const MonthlyDataItemSchema = new mongoose.Schema({
  salary: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  reason: String,
  expense: Number,
  description: String,
  balance: Number,
});

// Define the MonthlyData schema for nesting in the User schema
const MonthlyDataSchema = new mongoose.Schema({
  month: String,
  data: [MonthlyDataItemSchema], // Array of MonthlyDataItemSchema objects for multiple data entries
  totalBalance: Number, // Total balance for the month
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: String, // Field to store image path
  monthlyData: [MonthlyDataSchema], // Nest MonthlyData schema for monthly data
  role: {
    type: String,
    enum: ['admin', 'user'], // Assuming two roles: admin and user
    default: 'user', // Default role is user
  },
  loginTimes: {
    type: [{
      loginTime: Date,
      logoutTime: Date,
    }],
    default: [],
  },
  totalBalance: Number, // Total balance for all months
}, { timestamps: true });



// Calculate and update the total balance for each month
UserSchema.pre('save', function (next) {
  this.monthlyData.forEach((monthData) => {
    monthData.totalBalance = monthData.data.reduce((acc, dataItem) => acc + dataItem.balance, 0);
  });
  this.totalBalance = this.monthlyData.reduce((acc, monthData) => acc + monthData.totalBalance, 0);
  next();
});

// Method to update user image path
UserSchema.methods.updateImage = function (imagePath) {
  this.image = imagePath;
};

module.exports = mongoose.model('User', UserSchema);
