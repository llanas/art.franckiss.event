<template>
  <div id="app">
    <section class="hero is-bold is-fullheight">
      <div>
        <div v-if="storageId" class="hero-head">
          <h1 class="title has-text-white has-text-centered">Thanks for joining the Franckiss event</h1>
        </div>
        <div class="hero-body" v-bind:style="[storageId ? {'height': '90vh'} : {'height': '96vh'}]">
          <div v-if="!storageId" class="container">
            <div class="columns is-8">
              <div class="column is-three-fifths">
                <div class="title-wrapper">
                  <h1 class="title has-text-white">FRANCKISS The World</h1>
                  <h2 class="subtitle has-text-white">
                    A Wolrd wilde
                    <i class="yellow">art</i> event
                  </h2>
                </div>
                <div class="has-text-white" style="text-align: center">
                  <transition
                    name="infosTransition"
                    mode="out-in"
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut"
                  >
                    <span class="is-size-5-mobile is-size-4" v-bind:key="langageIndex">
                      {{infos.a}}
                      <br />
                      {{infos.b}}
                    </span>
                  </transition>
                </div>

                <div class="progress-wrapper">
                  <div
                    class="is-hidden-mobile animated fadeIn"
                    style="height: 30vh; margin: 2em 0;"
                  >
                    <l-map
                      id="mapSmall"
                      :zoom="zoomSmall"
                      :center="centerSmall"
                      :options="{ zoomControl: false, dragging: false, minZoom:2, maxZoom: 2 }"
                      ref="leafletmap"
                    >
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
                  <div>
                    <div class="has-text-centered">
                      <span
                        class="is-size-5-mobile is-size-4 has-text-white"
                      >Realtime Franckiss Counter</span>
                    </div>
                    <div v-if="listFranckiss.length > 0" class="has-text-centered">
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
                            class="has-text-white is-size-4-mobile is-size-4"
                          >{{counterItem.numberA}}</span>
                          <span
                            :key="'counterItemB-' + counterItem.realIndex"
                            v-else
                            style="display: block"
                            class="has-text-white is-size-4-mobile is-size-4"
                          >{{counterItem.numberB}}</span>
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="is-size-5-mobile is-size-4 has-text-centered has-text-white">
                  <i class="yellow clickHover">Click</i> on the Franckiss to join the event!
                </div>
                <figure class="image has-image-centered">
                  <img
                    id="franckissImage"
                    class="image-franckiss"
                    src="@/assets/images/franckiss_orange_small.jpg"
                    v-on:click="selectFranckiss"
                    @mouseenter="hoverFranckiss = true"
                    @mouseleave="hoverFranckiss = false"
                  />
                </figure>
              </div>
            </div>
          </div>
          <div v-else class="container">
            <div v-show="franckissLabel != null">
              <transition
                name="franckissLabelInput"
                mode="out-in"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div v-if="isNamed">
                  <p class="is-size-5-mobile is-size-4 has-text-centered">
                    Your Franckiss :
                    <i class="yellow">{{franckissLabel}}</i> is the n°
                    <i class="yellow">{{franckissNumber}}</i>
                  </p>
                </div>
                <div v-else class="columns is-centered" style="margin-bottom: 2em">
                  <div class="column is-half">
                    <div class="field is-horizontal is-size-5-mobile is-size-4">
                      <div class="field-label is-medium">
                        <label class="label has-text-white">Rename your Franckiss :</label>
                      </div>
                      <div class="field is-grouped">
                        <p class="control is-expand">
                          <input class="input" type="text" v-model="franckissLabel" />
                        </p>
                        <p class="control">
                          <button class="button is-primary" @click="updateFranckissLabel">Nommer</button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            <div class="box animated fadeIn" style="height: 60vh">
              <l-map :zoom="zoomLarge" :center="centerLarge" ref="leafletmap">
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
                  >
                    <l-tooltip>{{markFranckiss.franckissLabel || 'Franckiss_' + markFranckiss.number}}</l-tooltip>
                  </l-marker>
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
                    class="has-text-white"
                  >{{counterItem.numberA}}</span>
                  <span
                    :key="'counterItemB-' + counterItem.realIndex"
                    v-else
                    style="display: block"
                    class="has-text-white"
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
            </a> - A mon ami
            <i>Miguel PIN</i>.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import { icon, DivIcon, Point } from "leaflet";
import { animated, getGeolocation } from "./utils";
import FirebaseService from "./firebase.service";
import firebaseService from "./firebase.service";

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

const listFranckissSounds = [
  1,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24
];
export default {
  components: {
    LMap,
    LTileLayer
    // LMarker
  },
  data() {
    let customicon = icon({
      iconUrl: require("@/assets/images/franckiss_orange_icon.png"),
      className: "franckissClusterGroupIcon",
      iconSize: [20, 20]
    });
    return {
      isNamed: true,
      franckissLabel: null,
      langageIndex: 0,
      hoverFranckiss: false,
      totalNumberAsArray: [
        new counterItem(6),
        new counterItem(5),
        new counterItem(4),
        new counterItem(3),
        new counterItem(1)
      ],
      franckissNumber: null,
      storageId: this.storageId,
      listFranckiss: [],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoomLarge: 2,
      zoomSmall: 2,
      centerLarge: [47.41322, -1.219482],
      centerSmall: [34.991022, -33.871539],
      franckissIcon: customicon,
      franckissClusterOptions: {
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        spiderfyOnMaxZoom: false,
        removeOutsideVisibleBounds: true,
        iconCreateFunction: function(clusters) {
          let markerSize = null;
          let percent =
            clusters.getAllChildMarkers().length / this.listFranckiss.length;
          if (percent <= 0.01) {
            markerSize = 10;
          } else if (percent < 0.02) {
            markerSize = 15;
          } else if (percent < 0.05) {
            markerSize = 20;
          } else if (percent < 0.1) {
            markerSize = 30;
          } else if (percent < 0.15) {
            markerSize = 40;
          } else if (percent < 0.2) {
            markerSize = 50;
          } else if (percent < 0.3) {
            markerSize = 60;
          } else {
            markerSize = 70;
          }
          return new DivIcon({
            iconUrl: require("@/assets/images/franckiss_orange_icon.png"),
            className: "franckissClusterGroupIcon",
            iconSize: new Point(markerSize, markerSize)
          });
        }.bind(this),
        disableClusteringAtZoom: 17,
        maxClusterRadius: 50
      }
    };
  },
  beforeCreate() {
    this.storageId = localStorage.getItem("franckissId");
    if (this.storageId) {
      firebaseService
        .getFranckiss(this.storageId)
        .then(response => {
          const generatedLabel = `Franckiss_${response.number}`;
          if (response.franckissLabel != null) {
            this.franckissLabel = response.franckissLabel;
            if (this.franckissLabel == generatedLabel) {
              this.isNamed = false;
            }
          } else {
            this.isNamed = false;
            firebaseService
              .setFranckissLabel(this.storageId, `Franckiss_${response.number}`)
              .then(() => {
                this.franckissLabel = `Franckiss_${response.number}`;
              });
          }
        })
        .catch(() => {
          console.log("T'as pas de franckiss!");
          localStorage.removeItem("franckissId");
          this.storageId = null;
        });
    }
    setInterval(
      function() {
        this.langageIndex = (this.langageIndex + 1) % 3;
      }.bind(this),
      5000
    );
  },
  created() {
    FirebaseService.getAllFranckiss(this.addNewFranckiss.bind(this));
  },
  computed: {
    infos: function() {
      switch (this.langageIndex) {
        case 0:
          return {
            a: "LOVE CAN'T WAIT",
            b: "LET'S COVER THE WORLD WITH KISSES"
          };
        case 1:
          return {
            a: "L'AMOUR NE PEUT PAS ATTENDRE",
            b: "RECOUVRONS LE MONDE DE BAISERS"
          };
        case 2:
          return {
            a: "EL AMOR NO PUEDE ESPERAR MÁS",
            b: "LLENEMOS EL MUNDO DE BESOS"
          };
        default:
          return {
            a: "LOVE CAN'T WAIT",
            b: "LET'S COVER THE WORLD WITH KISSES"
          };
      }
    }
  },
  methods: {
    updateFranckissLabel: function() {
      firebaseService
        .setFranckissLabel(this.storageId, this.franckissLabel)
        .then(() => {
          this.isNamed = true;
        });
    },
    addNewFranckiss: function(newFranckiss) {
      const franckissData = newFranckiss.val();
      if (newFranckiss.key == this.storageId) {
        this.franckissNumber = franckissData.number;
      }
      this.listFranckiss.push(franckissData);
      let arrayNumbers = (this.listFranckiss.length + "")
        .padStart(5, "0")
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
      const franckissSoundIndex = Math.floor(
        Math.random() * listFranckissSounds.length
      );
      const audio = new Audio(
        require(`@/assets/sounds/franckiss_${listFranckissSounds[franckissSoundIndex]}.mp4`)
      );
      let audioPromose = audio.play();
      audioPromose.then(() => {
        animated(event.srcElement, ["tada", "slow"], this.downloadFranckiss);
      });
    },
    downloadFranckiss: async function() {
      let coord = null;
      try {
        coord = await this.$getLocation();
      } catch (error) {
        coord = await getGeolocation();
      }

      const index = this.listFranckiss.length + 1;
      const newDownload = await FirebaseService.createNewFranckiss(
        coord,
        index
      );
      localStorage.setItem("franckissId", newDownload.key);
      setTimeout(() => {
        this.storageId = newDownload.key;
        this.franckissNumber = index;
        this.franckissLabel = "Franckiss_label";
        this.isNamed = false;
        const link = document.createElement("a");
        link.href = document.getElementById("franckissImage").src;
        link.setAttribute("download", `franckiss_${this.franckissNumber}.jpg`); //or any other extension
        document.body.appendChild(link);
        link.click();
      }, 1000);
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

@media screen and (min-height: 900px) {
  html,
  body {
    overflow: hidden;
  }
}

@media screen and (max-width: 800px) {
  .image {
    width: 80%;
  }
}

html,
body {
  color: white;
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

.yellow {
  color: #ffdd57;
}

.title-wrapper {
  font-family: "ITC_Kabel";
  margin: 2rem;
}

#app {
  background-color: #d45c16;
}

#mapSmall {
  border-radius: 20px;
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
  background-color: rgb(228, 18, 70);
  border: 1px solid rgb(210, 90, 20);
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
