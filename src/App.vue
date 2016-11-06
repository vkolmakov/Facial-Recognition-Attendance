<template>
  <div @click="resetIdentityMessage" id="app">
    <div class="camera-wrap">
      <vue-webcam ref='webcam'></vue-webcam>
      <button class="sign-in-button" @click="signIn">Sign In</button>
    </div>

    <div class="identity">
      {{ identityMessage }}
    </div>

    <div class="add-person">
      <input v-model="newPersonName" type="text" />
      <button class="add-person-button" @click="addPerson">Add Person</button>
    </div>

    <div class="training">
      <select v-model="selectedPersonName">
        <option v-for="p in persons" :value="p.name">{{ p.name }}</option>
      </select>
      <button class="start-training-button" @click="startTraining">Start Training</button>
    </div>

    <ul class="persons">
      <li v-for="p in persons">{{ p.name }}</li>
    </ul>

  </div>
  </template>

<script>
import VueWebcam from 'vue-webcam'
import { identity$, train, recognize, addPerson } from './faceRecognition'

export default {
  name: 'app',

  components: {
    VueWebcam,
  },

  data () {
    return {
      persons: [],
      newPersonName: '',
      selectedPersonName: '',
    }
  },

  subscriptions () {
    return {
      identityMessage: identity$
        .map(id => this.persons.find(p => p.id === id))
        .map(person => person ? `Welcome, ${person.name}!` : `Please try again`)
    }
  },

  methods: {
    resetIdentityMessage () {
      this.identityMessage = ''
    },

    addPerson () {
      const persons = this.persons
      const person = { name: this.newPersonName, id: persons.length }

      this.newPersonName = ''
      this.persons = persons.concat([person])
      this.selectedPersonName = person.name

      addPerson({ name: person.name })
    },

    startTraining () {
      const person = this.persons.find(p => p.name === this.selectedPersonName)
      train({ getPhoto: this.$refs.webcam.getPhoto, id: person.id })
    },

    signIn () {
      const photo = this.$refs.webcam.getPhoto()
      recognize({ photo })
    }
  }
}
  </script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  </style>
