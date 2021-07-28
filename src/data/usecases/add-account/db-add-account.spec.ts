import { AddAccountRepository, Encrypter, AccountModel, AddAccountModel } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

import * as DbAddAccountProtocols from './db-add-account-protocols'

describe('DbAddAccountProtocols', () => {
  it('should have exports', () => {
    expect(typeof DbAddAccountProtocols).toBe('object')
  })

  it('should not have undefined exports', () => {
    Object.keys(DbAddAccountProtocols).forEach((exportKey) =>
      expect(Boolean(DbAddAccountProtocols[exportKey])).toBe(true)
    )
  })
})

const makeEncrypter = (): Encrypter => {
  class EncryterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncryterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbAddAccount
  encryterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encryterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encryterStub, addAccountRepositoryStub)

  return {
    sut,
    addAccountRepositoryStub,
    encryterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Enrypter with correct password', async () => {
    const { sut, encryterStub } = makeSut()
    const encryptSpy = jest.spyOn(encryterStub, 'encrypt')
    const accountData = makeFakeAccountData()

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encryterStub } = makeSut()
    jest.spyOn(encryterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAccountData()

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAccountData()

    const account = await sut.add(accountData)
    expect(account).toEqual(makeFakeAccount())
  })
})
