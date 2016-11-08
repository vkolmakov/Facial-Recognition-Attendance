<template>
  <div @click="resetIdentityMessage" id="app" class="flex-container">

    <vue-webcam ref='webcam'></vue-webcam>

    <div class="training flex-container">
      <input v-model="newPersonName" type="text" />
      <button class="add-person-button" @click="addPerson">Add Person</button>

      <select v-model="selectedPersonName">
        <option v-for="p in persons" :value="p.name">{{ p.name }}</option>
      </select>
      <button class="start-training-button" @click="startTraining">Start Training</button>      
    </div>

    <div class="message flex-container">
      <div v-if="identityMessage" class="identity">
        {{ identityMessage }}
      </div>

      <div v-if="training.status">
        <progress class="progress" max="1" :value="training.progress"></progress>
      </div>
    </div>

    <div class="signin flex-container">
      <button class="signin-button" @click="signIn">Sign In</button>    
    </div>

  </div>
</template>

<script>
import VueWebcam from 'vue-webcam'
import { identity$, image$, train, recognize, addPerson, sendInitialState } from './faceRecognition'

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
      },
      images: [],
    }
  },

  subscriptions () {
    return {
      identityMessage: identity$
        .map(id => this.persons.find(p => p.id === id))
        .map(person => person ? `Welcome, ${person.name}!` : `Please try again`),

      image: image$
        .map(image => {
          const prevImages = this.images
          this.images = prevImages.concat([image])
        }),
    }
  },

  methods: {
    resetIdentityMessage () {
      this.identityMessage = ''
    },

    sendState () {
      sendInitialState(this.images.map(i => JSON.parse(JSON.stringify(i))),
                       this.persons.map(p => JSON.parse(JSON.stringify(p.id.toString()))))
    },

    getPhoto () {
      const photo = this.$refs.webcam.getPhoto()
      return photo
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

      const getPhoto = this.getPhoto
      const onStart = () => this.training.status = true
      const onProgress = (next) => this.training.progress = next
      const onComplete = () => {
        this.training.progress = 0
        this.training.status = false
      }

      train({ id: person.id, getPhoto, onStart, onProgress, onComplete })
    },

    signIn () {
      const photo = this.getPhoto()

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

    flex-direction: column;

    max-width: 800px;
    min-height: 600px;
  }

  .flex-container {
    display: flex;
  }

  .training {
    flex: 1;
    align-items: center;
  }

  .message {
    flex: 0 0 425px;
    align-items: center;
    justify-content: center;
  }

  .message > * {
    margin-top: 40%;
  }

  .message > .identity {
    color: white;
    font-size: 1.8em;
    font-weight: 500;
  }

  .message > * > .progress {
    -webkit-appearance: none;
  }

  .message > * > .progress::-webkit-progress-value {
    transition: width 1s ease-out;
  }

  .message > * > .progress::-webkit-progress-bar {
    background: #fafafa;
  }

  .signin {
    flex: 1;
    align-items: center;
    justify-content: center;
  }
</style>
