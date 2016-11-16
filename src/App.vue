<template>
  <div @click="clearMessages" id="app" class="flex-container">

    <vue-webcam ref='webcam' />

    <div class="top flex-container">
      <toggle-menu :onClick="toggleMenu" :isShown="showMenu" />

      <transition enter-active-class="animated fadeInRight"
                  leave-active-class="animated fadeOutRight">
        <div class="flex-container" v-if="showMenu">
          <input v-model="newPersonName" placeholder="Enter a name" type="text" class="input text" />

          <PrimaryButton :onClick="addPerson" text="Add Person" />

          <select v-model="selectedPersonName" class="input select">
            <option v-for="p in persons" :value="p.name">{{ p.name }}</option>
          </select>

          <PrimaryButton :onClick="startTraining" text="Start Training" />
          <PrimaryButton :onClick="dropState" text="Drop State" destructive="true" />
        </div>
      </transition>

    </div>

    <div class="center flex-container">
      <identity-message v-if="recognition.identityMessage" :message="recognition.identityMessage" />
      <error-message v-if="errorMessage" :message="errorMessage" />
    </div>

    <div class="bottom flex-container">
      <progress-bar v-if="training.status" :progress="training.progress" />
      <sign-in-button v-else :onClick="signIn" :isLoading="recognition.status" />
    </div>

  </div>
</template>

<script>
import VueWebcam from 'vue-webcam'
import Rx from 'rxjs/Rx'

import IdentityMessage from './components/IdentityMessage.vue'
import ProgressBar from './components/ProgressBar.vue'
import SignInButton from './components/SignInButton.vue'
import ToggleMenu from './components/ToggleMenu.vue'
import PrimaryButton from './components/PrimaryButton.vue'
import ErrorMessage from './components/ErrorMessage.vue'

import { identity$, image$, state$, error$ as faceRecognitionError$,
         train, recognize, savePerson, dropState } from './faceRecognition'
import { sendAttendance, error$ as attendanceLoggerError$ } from './attendance'

export default {
  name: 'app',

  components: {
    VueWebcam,
    IdentityMessage,
    ProgressBar,
    SignInButton,
    ToggleMenu,
    PrimaryButton,
    ErrorMessage,
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
      recognition: {
        status: false,
        identityMessage: '',
      },
      showMenu: false,
      errorMessage: '',
    }
  },

  subscriptions () {
    return {
      identity: identity$
        .map(id => this.persons.find(p => p.id === id))
        .do(person => person ? sendAttendance(person) : _ => _)
        .map(person => {
          this.recognition.status = false
          this.recognition.identityMessage = person ? `Welcome, ${person.name}!` : `Please try again`
        }),

      initialState: state$.map(s => {
        this.persons = s.persons

        this.selectedPersonName = s.persons.length > 0
          ? s.persons[0].name
          : ''
      }),

      error: Rx.Observable.merge(
        faceRecognitionError$,
        attendanceLoggerError$,
      ).do(err => this.setErrorMessage(err))
    }
  },

  methods: {
    clearMessages () {
      this.recognition.identityMessage = ''
      this.errorMessage = ''
    },

    setErrorMessage (err) {
      console.error(err)
      this.errorMessage = err
    },

    toggleMenu () {
      const prev = this.showMenu
      this.showMenu = !prev
    },

    getPhoto () {
      const photo = this.$refs.webcam.getPhoto()
      return photo
    },

    dropState () {
      dropState().then(_ => location.reload()) // reload the page after state was dropped
    },

    addPerson () {
      const persons = this.persons
      const person = { name: this.newPersonName, id: persons.length }

      this.newPersonName = ''
      this.persons = persons.concat([person])
      this.selectedPersonName = person.name

      savePerson(person)
    },

    startTraining () {
      const person = this.persons.find(p => p.name === this.selectedPersonName)

      const getPhoto = this.getPhoto

      const onStart = () => this.training.status = true
      const onProgress = (next) => this.training.progress = next
      const onError = (err) => this.setErrorMessage(err)
      const onComplete = () => {
        this.training.progress = 0
        this.training.status = false
      }

      train({ id: person.id, getPhoto, onStart, onProgress, onError, onComplete })
    },

    signIn () {
      const photo = this.getPhoto()
      this.recognition.status = true

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

  .flex-container {
    display: flex;
  }

  .flex-container.top {
    flex: 0 0 50px;
    align-items: center;
  }

  .flex-container.top > .flex-container {
    /* Training menu container */
    width: 100%;
  }

  .flex-container.top > .flex-container > .input {
    margin-left: 15px;
  }

  .flex-container.top > .flex-container > button:last-child {
    /* This selector targets Drop State button */
    margin: 0 10px 0 auto;
  }

  .flex-container.center {
    flex: 0 0 425px;
    align-items: center;
    justify-content: center;
  }

  .center > * {
    margin-top: 40%;
  }

  .flex-container.bottom {
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .input {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 0.8em;

    height: 35px;
    width: 150px;

    padding: 0 5px;
    border: none;

    background-color: #fff;
  }

  .input.select {
    -webkit-appearance: none;
    border-radius: 0;
    background: url('assets/br_down.png') no-repeat;
    background-color: #fff;
    background-position: 122px 10px; /* ah, the magic numbers! */
  }
</style>
