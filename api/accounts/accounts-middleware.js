const { json } = require('express')
const Accounts = require('./accounts-model')
const db = require('../../data/db-config')

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

exports.checkAccountPayload = (req, res, next) => {
  const fullName = req.body.name
  const budget = req.body.budget
  if(!fullName || !budget && isNaN(budget)){
    next({
      status: 400,
      message: 'name and budget are required'
    })
  } else if (typeof fullName !== 'string') {
    next({
      status: 400,
      message: 'name of account must be a string'
    })
  } else if (fullName.trim().length < 3 || fullName.trim().length > 100) {
    next({
      status: 400,
      message: 'name of account must be between 3 and 100'
    })
  } else if (typeof budget !== 'number') {
    next({
      status: 400,
      message: 'budget of account must be a number'
    })
  } else if (budget < 0 || budget > 1000000) {
    next({
      status: 400,
      message: 'budget of account is too large or too small'
    })
  } else {
    next()
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  const fullName = req.body.name
  const name = fullName.trim()
  const existingAccount = await db('accounts')
    .where('name', name)
  if(existingAccount.length > 0){
    next({
      status: 400,
      message: 'that name is taken'
    })
  } else {
    next()
  }
}

exports.checkAccountId = async (req, res, next) => {
  const { id } = req.params
  const account = await Accounts.getById(id)
  if (!account) {
    res.status(404).json({
      message: "account not found"
    })
  } else {
    next()
  }
}