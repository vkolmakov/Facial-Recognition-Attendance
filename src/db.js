import PouchDB from 'pouchdb'

import { getOnly } from './util'

class ImageModel {
  constructor () {
    this.DB_NAME = 'FaceRecognition:images'
    this.images = new PouchDB(this.DB_NAME)
  }

  getAll () {
    return this.images.allDocs({ include_docs: true })
      .then(result => result.rows.map(
        row => getOnly(row.doc, 'image', 'hash', 'identity', 'representation')
      ))
  }

  save ({ image, hash, identity, representation }) {
    images.post({ image, hash, identity, representation })
  }

  drop () {
    return this.images.destroy().then(
      _ => this.images = new PouchDB(this.DB_NAME)
    )
  }
}

class PersonModel {
  constructor () {
    this.DB_NAME = 'FaceRecognition:persons'
    this.persons = new PouchDB(this.DB_NAME)
  }

  getAll () {
    return this.persons.allDocs({ include_docs: true })
      .then(result => result.rows.map(
        row => getOnly(row.doc, 'id', 'name')
      ))
  }

  save ({ id, name }) {
    return this.persons.post({ id, name })
  }

  drop () {
    return this.persons.destroy().then(
      _ => this.persons = new PouchDB(this.DB_NAME)
    )
  }
}

export const Person = new PersonModel()
export const Image = new ImageModel()

export const dropAll = () => Promise.all([Image.drop(), Person.drop()])
