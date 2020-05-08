<template>
  <div id="app">
    <section class="hero is-bold is-fullheight">
      <div>
        <div v-if="storageId" class="hero-head">
          <h1 class="title has-text-centered">Thank's for joining the event</h1>
          <h2 class="subtitle has-text-centered">You are the {{franckissNumber}} participant</h2>
        </div>
        <div class="hero-body" v-bind:style="[storageId ? {'height': '90vh'} : {'height': '96vh'}]">
          <div v-if="!storageId" class="container">
            <div class="columns is-8 is-vcentered">
              <div class="column">
                <div class="title-wrapper">
                  <h1 class="title">FRANCKISS The World</h1>
                  <h2 class="subtitle">
                    A Wolrd wilde
                    <i>art</i> event
                  </h2>
                </div>
                <div class="infos-wrapper">
                  <p>Résistons ensemble à l'isolement en partageant un baiser créé par un artiste et regardons sa progression grâce à un compteur sur une carte mondiale</p>
                </div>
                <div class="progress-wrapper">
                  <p class="has-text-centered">{{listFranckiss.length}} franckiss partagés!</p>
                  <progress
                    class="progress"
                    :value="listFranckiss.length"
                    max="100"
                  >{{listFranckiss.length}}</progress>
                </div>
              </div>
              <div class="column">
                <figure class="image has-image-centered">
                  <img
                    class="image-franckiss"
                    src="@/assets/images/franckiss_orange.jpg"
                    v-on:click="selectFranckiss"
                  />
                </figure>
              </div>
            </div>
          </div>
          <div v-else class="container">
            <div class="box" style="height: 60vh">
              <l-map :zoom="zoom" :center="center" ref="leafletmap">
                <l-tile-layer :url="url"></l-tile-layer>
                <v-marker-cluster
                  v-if="listFranckiss.length > 0"
                  :options="franckissClusterOptions"
                >
                  <l-marker
                    v-for="markFranckiss in listFranckiss"
                    :key="markFranckiss.id"
                    :lat-lng="markFranckiss.location"
                    :icon="franckissIcon"
                  ></l-marker>
                </v-marker-cluster>
              </l-map>
            </div>
            <div v-if="listFranckiss.length > 0" class="title is-3 has-text-centered">
              <div
                v-for="counterItem in totalNumberAsArray"
                v-bind:key="counterItem.realIndex"
                class="list-numbers"
              >
                <transition name="counter" mode="out-in">
                  <span
                    :key="'counterItemA-' + counterItem.realIndex"
                    v-if="counterItem.numberA != null"
                    style="display: block"
                  >{{counterItem.numberA}}</span>
                  <span
                    :key="'counterItemB-' + counterItem.realIndex"
                    v-else
                    style="display: block"
                  >{{counterItem.numberB}}</span>
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-foot">
          <div class="container has-text-centered">
            More informations on
            <a href="http://franckiss.art" target="_blank">
              <strong>FRANCKISS.art</strong>
            </a> - Website created by
            <a href="https://github.com/llanas">Llanas</a>.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import { Icon, icon, DivIcon, Point } from "leaflet";
import { animated, getGeolocation } from "./utils";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import FirebaseService from "./firebase.service";

class counterItem {
  constructor(realIndex) {
    this.realIndex = realIndex;
    this.actualNumber = 0;
    this.numberA = 0;
    this.numberB = null;
  }

  setNewNumber(newNumber) {
    if (this.numberB === null) {
      this.numberB = newNumber;
      this.numberA = null;
    } else {
      this.numberA = newNumber;
      this.numberB = null;
    }
    this.actualNumber = newNumber;
  }
}

export default {
  components: {
    LMap,
    LTileLayer
    // LMarker
  },
  data() {
    let customicon = icon(
      Object.assign({}, Icon.Default.prototype.options, { iconUrl, shadowUrl })
    );
    return {
      totalNumberAsArray: [
        new counterItem(7),
        new counterItem(6),
        new counterItem(5),
        new counterItem(4),
        new counterItem(3),
        new counterItem(2),
        new counterItem(1)
      ],
      franckissNumber: null,
      storageId: this.storageId,
      listFranckiss: [],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 3,
      center: [47.41322, -1.219482],
      franckissIcon: customicon,
      franckissClusterOptions: {
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        spiderfyOnMaxZoom: false,
        removeOutsideVisibleBounds: true,
        iconCreateFunction: function() {
          return new DivIcon({
            className: "franckissClusterGroupIcon",
            iconSize: new Point(20, 20)
          });
        }
      }
    };
  },
  beforeCreate() {
    this.storageId = localStorage.getItem("franckissId");
    if (this.storageId) {
      console.log("T'as déjà ton Franckiss!");
    }
  },
  created() {
    FirebaseService.getAllFranckiss(this.addNewFranckiss.bind(this));
  },
  methods: {
    addNewFranckiss: function(newFranckiss) {
      const franckissData = newFranckiss.val();
      if (newFranckiss.key == this.storageId) {
        this.franckissNumber = this.listFranckiss.length;
      }
      this.listFranckiss.push(franckissData);
      let arrayNumbers = (this.listFranckiss.length + "")
        .padStart(7, "0")
        .split("");
      let startChangingIndex = this.totalNumberAsArray.length - 1;
      for (let i = 0; i < this.totalNumberAsArray.length; i++) {
        if (arrayNumbers[i] != this.totalNumberAsArray[i].actualNumber) {
          if (i < startChangingIndex) {
            startChangingIndex = i;
          }
          if (i >= startChangingIndex) {
            this.totalNumberAsArray[i].setNewNumber(arrayNumbers[i]);
          }
        }
      }
    },
    selectFranckiss: function(event) {
      animated(event.srcElement, ["tada", "slow"], this.downloadFranckiss);
    },
    downloadFranckiss: async function() {
      const coord = await getGeolocation();
      let newDownload = await FirebaseService.createNewFranckiss(coord);
      localStorage.setItem("franckissId", newDownload.key);
      this.storageId = newDownload.key;
    }
  }
};
</script>

<style>
@font-face {
  font-family: "ITC_Kabel";
  src: url("assets/fonts/ITC_Kabel/ITCKabelStd-Demi.otf");
}

@font-face {
  font-family: "Roboto";
  src: url("assets/fonts/Roboto/Roboto-Regular.ttf");
}

@media screen and (min-height: 900) {
  html,
  body {
    overflow: hidden;
  }
}

html,
body {
  padding: 0;
  margin: 0;
}

body {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}

a {
  color: #ffdd57;
}

.title-wrapper {
  font-family: "ITC_Kabel";
  margin: 2rem;
}

.infos-wrapper {
  margin: 2rem 0;
}

#app {
  background-color: #d33f22;
}

.loader-background {
  z-index: 1;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(50, 60, 70, 0.5);
}

.loader-icone {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -2em;
  margin-top: -2em;
}

.image-franckiss {
  border-radius: 50%;
  transition: all 500ms;
  box-shadow: rgba(2, 8, 20, 0.1) 0px 0.35em 1.175em,
    rgba(2, 8, 20, 0.08) 0px 0.175em 0.5em;
}

.image-franckiss:hover {
  box-shadow: rgba(2, 8, 20, 0.1) 0px 0.35em 1.175em,
    rgba(2, 8, 20, 0.08) 0px 0.175em 0.5em;
  transform: translateY(-5px) scale(1.05);
  cursor: pointer;
}

.has-image-centered {
  margin-left: auto;
  margin-right: auto;
}

.franckissClusterGroupIcon {
  background-color: rgb(177, 226, 86);
  border: 1px solid rgb(63, 146, 194);
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
}

.list-numbers {
  display: inline-block;
  margin-right: 10px;
}

.counter-enter-active,
.counter-leave-active {
  transition: all 1s;
}
.counter-enter {
  opacity: 0;
  transform: translateY(-30px);
}

.counter-leave-to /* .counter-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

footer {
  padding: 1rem 1rem !important;
}
</style>
