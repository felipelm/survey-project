import { Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
  class EncryterStud implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncryterStud()
}

interface SutTypes {
  sut: DbAddAccount
  encryterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encryterStub = makeEncrypter()
  const sut = new DbAddAccount(encryterStub)

  return {
    sut,
    encryterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Enrypter with correct password', async () => {
    const { sut, encryterStub } = makeSut()
    const encryptSpy = jest.spyOn(encryterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encryterStub } = makeSut()
    jest.spyOn(encryterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
