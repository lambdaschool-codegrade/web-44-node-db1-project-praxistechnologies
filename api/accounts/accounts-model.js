const db = require('../../data/db-config')

const getAll = async () => {
  const accounts = await db('accounts')
  return accounts
}

const getById = async id => {
  const account = await db('accounts').where('id', id).first()
  return account
}

const create = async account => {
  const [id] = await db('accounts').insert(account)
  const newlyCreatedAccount = await getById(id)
  return newlyCreatedAccount
}

const updateById = async (id, account) => {
  await db('accounts')
    .where('id', id)
    .update(account)
  const updatedPost = await getById(id)
  return updatedPost
}

const deleteById = async id => {
  const toBeDeleted = await getById(id)
  await db('accounts')
    .where('id', id)
    .del()
  return toBeDeleted
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
