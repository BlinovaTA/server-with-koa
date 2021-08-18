const fs = require('fs/promises')
const { constants } = require('fs')
const { join, normalize } = require('path')

class DB {
  constructor(path) {
    this.filePath = path
    this.data = this.getData(path)
  }

  async getData(path) {
    try {
      await fs.access(path, constants.R_OK)
      const readedFile = await fs.readFile(path)
      const parseData = JSON.parse(readedFile)

      return parseData
    } catch (error) {
      throw new Error(error)
    }
  }

  async get(selector) {
    const data = await this.data

    return data[selector]
  }

  async find(selector, obj) {
    const data = await this.get(selector)
    const keys = Object.keys(obj)
    let result = true

    keys.forEach((key) => {
      const finded = data.find((item) => item[key] === obj[key])

      result = result && finded
    })

    if (result) {
      return true
    } else {
      return false
    }
  }

  async rewrite(selector, id, value) {
    const data = await this.get(selector)
    const idKey = Object.keys(id)[0]
    const valueKey = Object.keys(value)[0]

    const finded = data.find((item) => item[idKey] === id[idKey])
    finded[valueKey] = value[valueKey]

    this.write()
  }

  async push(selector, newItem) {
    const data = await this.get(selector)
    data.push(newItem)

    this.write()
  }

  async write() {
    try {
      const writedData = JSON.stringify(await this.data)

      await fs.access(this.filePath, constants.W_OK)
      await fs.writeFile(this.filePath, writedData)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new DB(normalize(join(process.cwd(), './db.json')))
