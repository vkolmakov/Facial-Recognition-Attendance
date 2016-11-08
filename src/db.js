import PouchDB from 'pouchdb'

import { getOnly } from './util'

let images = new PouchDB('FaceRecognition:images')
let persons = new PouchDB('FaceRecognition:persons')

export const Image = {
  getAll () {
    return images.allDocs({ include_docs: true })
      .then(result => result.rows.map(
        row => getOnly(row.doc, 'image', 'hash', 'identity', 'representation')
      ))
  },

  save ({ image, hash, identity, representation }) {
    images.post({ image, hash, identity, representation })
  },
}

export const Person = {
  getAll () {
    return persons.allDocs({ include_docs: true })
      .then(result => result.rows.map(
        row => getOnly(row.doc, 'id', 'name')
      ))
  },

  save ({ id, name }) {
    persons.post({ id, name })
  }
}

export const dropAll = () => {
  return Promise.all([images.destroy(), persons.destroy()])
    .then(_ => {
      images = new PouchDB('FaceRecognition:images')
      persons = new PouchDB('FaceRecognition:persons')
    })
}

