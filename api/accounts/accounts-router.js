const router = require('express').Router()
const Accounts = require('./accounts-model')
const { checkAccountId, checkAccountPayload, checkAccountNameUnique } = require('./accounts-middleware')

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

router.get('/', async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll()
    res.status(200).json(accounts)
  } catch(err) {
    next(err)
  }
})

router.get('/:id', checkAccountId, async (req, res, next) => {
  try {
    const { id } = req.params
    const account = await Accounts.getById(id)
    res.status(200).json(account)
  } catch(err) {
    next(err)
  }
})

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const fullName = req.body.name
    const name = fullName.trim()
    const budget = req.body.budget
    const newlyCreatedAccount = await Accounts.create({ name, budget })
    res.status(201).json(newlyCreatedAccount)
  } catch(err) {
    next(err)
  }
})

router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try {
  const { id } = req.params
  const account = req.body
  const updatedPost = await Accounts.updateById(id, account)
  res.status(200).json(updatedPost)
  } catch(err) {
    next(err)
  }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedAccount = await Accounts.deleteById(id)
    res.status(200).json(deletedAccount)
  } catch(err) {
    next(err)
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  const status = err.status || 500
  res.status(status).json({
      message: err.message
  })
})

module.exports = router;
