import PouchDB from 'pouchdb'

import { getOnly } from './util'

class ImageModel {
  constructor () {
    this.DB_NAME = 'FaceRecognition:images'
    this.connection = new PouchDB(this.DB_NAME)
  }

  getAll () {
    return this.connection.allDocs({ include_docs: true })
      .then(result => result.rows.map(
        row => getOnly(row.doc, 'image', 'hash', 'identity', 'representation')
      ))
  }

  save ({ image, hash, identity, representation }) {
    this.connection.post({ image, hash, identity, representation })
  }

  drop () {
    return this.connection.destroy().then(
      _ => this.connection = new PouchDB(this.DB_NAME)
    )
  }
}

class PersonModel {
  constructor () {
    this.DB_NAME = 'FaceRecognition:persons'
    this.connection = new PouchDB(this.DB_NAME)
  }

  getAll () {
    return this.connection.allDocs({ include_docs: true })
      .then(result => result.rows.map(
        row => getOnly(row.doc, 'id', 'name')
      ))
  }

  save ({ id, name }) {
    return this.connection.post({ id, name })
  }

  drop () {
    return this.connection.destroy().then(
      _ => this.connection = new PouchDB(this.DB_NAME)
    )
  }
}

export const Person = new PersonModel()
export const Image = new ImageModel()

export const dropAll = () => Promise.all([Image.drop(), Person.drop()])
