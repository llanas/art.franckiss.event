<template>
  <div id="app">
    <section id="content" class="hero is-fullheight is-bold">
      <div v-if="!storageId">
        <div class="hero-body">
          <div class="container">
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
      <div v-else>
        <div class="hero-head">
          <h1 class="title has-text-centered">Thank's for joining the event</h1>
          <h2 class="subtitle has-text-centered">You are the {{franckissNumber}} participant</h2>
        </div>
        <div class="hero-body">
          <div class="container" style="height: 800px">
            <l-map style="height: 80%; width: 100%" :zoom="zoom" :center="center" ref="leafletmap">
              <l-tile-layer :url="url"></l-tile-layer>
              <v-marker-cluster v-if="listFranckiss.length > 0" :options="franckissClusterOptions">
                <l-marker
                  v-for="markFranckiss in listFranckiss"
                  :key="markFranckiss.id"
                  :lat-lng="markFranckiss.location"
                  :icon="franckissIcon"
                ></l-marker>
              </v-marker-cluster>
            </l-map>
            <h1
              v-if="listFranckiss.length > 0"
              class="title is-3 has-text-centered"
            >{{listFranckiss.length}} franckiss partagés!</h1>
            <progress
              class="progress"
              :value="listFranckiss.length"
              max="100"
            >{{listFranckiss.length}}</progress>
          </div>
        </div>
        <div class="hero-foot">
          <div class="container has-text-centered">
            <p>
              <strong>FRANCKISS</strong> by
              <a href="https://github.com/llanas">Llanas</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { database } from "./firebase";
import { LMap, LTileLayer } from "vue2-leaflet";
import { Icon, icon, DivIcon, Point } from "leaflet";
import { animated, getGeolocation } from "./utils";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

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
    database
      .ref("downloads")
      .on("child_added", this.addNewFranckiss.bind(this));
  },
  methods: {
    addNewFranckiss: function(newFranckiss) {
      const franckissData = newFranckiss.val();
      if (newFranckiss.key == this.storageId) {
        this.franckissNumber = this.listFranckiss.length;
      }
      this.listFranckiss.push(franckissData);
    },
    selectFranckiss: function(event) {
      animated(event.srcElement, "tada", this.downloadFranckiss);
    },
    downloadFranckiss: async function() {
      const coord = await getGeolocation();
      let newDownload = database.ref("downloads").push();
      newDownload
        .set({
          date: new Date().getTime(),
          location: {
            lat: coord.lat,
            lng: coord.lng
          }
        })
        .then(() => {
          localStorage.setItem("franckissId", newDownload.key);
          this.storageId = newDownload.key;
          this.franckissLabel = this.label;
        });
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

html,
body {
  padding: 0;
  margin: 0;
}

body {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}

body::-webkit-scrollbar {
  /* scrollbar */
  width: 0.25rem;
}

body::-webkit-scrollbar-track {
  background: white;
}

body::-webkit-scrollbar-thumb {
  background: #6649b8;
}

.hero-body {
  min-height: 96vh;
}

.title-wrapper {
  font-family: "ITC_Kabel";
  margin: 2rem;
}

.infos-wrapper {
  margin: 2rem 0;
}

#content {
  background-color: #d36d22;
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
  transform: translateY(-3px) scale(1.02);
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

footer {
  padding: 1rem 1rem !important;
}
</style>
