<template>
  <div @click="resetIdentityMessage" id="app">

    <vue-webcam ref='webcam'></vue-webcam>

    <div class="training-container">
      <input v-model="newPersonName" type="text" />
      <button class="add-person-button" @click="addPerson">Add Person</button>

      <select v-model="selectedPersonName">
        <option v-for="p in persons" :value="p.name">{{ p.name }}</option>
      </select>
      <button class="start-training-button" @click="startTraining">Start Training</button>      
    </div>

    <div class="message-container">
      <div v-if="identityMessage" class="identity">
        {{ identityMessage }}
      </div>

      <div v-if="training.status" class="progress">
        {{ training }}
      </div>
    </div>

    <div class="signin-container">
      <button class="signin-button" @click="signIn">Sign In</button>    
    </div>

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
      training: {
        status: false,
        progress: 0,
      }
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

      const getPhoto = this.$refs.webcam.getPhoto
      const onStart = () => this.training.status = true
      const onProgress = (next) => this.training.progress = next
      const onComplete = () => {
        this.training.progress = 0
        this.training.status = false
      }

      train({ id: person.id, getPhoto, onStart, onProgress, onComplete })
    },

    signIn () {
      const photo = this.$refs.webcam.getPhoto()
      recognize({ photo })
    }
  }
}
</script>

<style>
  body {
    margin: 0;
    background-color: black;
  }

  video {
    position: absolute;
    z-index: -1;
    width: 800px;
    height: 600px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;

    max-width: 800px;
    min-height: 600px;
  }

  .training-container {
    flex: 1;
  }

  .message-container {
    color: white;
    flex: 5;

    display: flex;

    align-items: center;
    justify-content: center;
  }

  .signin-container {
    flex: 1;
  }

  .progress {
    background-color: black;
  }
</style>
