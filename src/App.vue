<template>
  <div id="app">
    <div class="loader-background" v-show="isDownloadPending">
      <div class="loader-icone">
        <font-awesome-icon icon="spinner" size="4x" spin style="color: white;" />
      </div>
    </div>
    <div class="container is-fluid">
      <section class="hero is-fullheight" v-if="!storageId">
        <div class="hero-head">
          <h1 class="title is-1 has-text-centered">KISS THE WORLD</h1>
        </div>
        <div class="hero-body">
          <div class="container">
            <p class="title is-3 has-text-centered">Choose your Franckiss</p>
            <div class="columns">
              <div class="column">
                <figure class="image has-image-centered">
                  <img class="image-franckiss" src="@/assets/images/franckiss_bleu.jpg" />
                </figure>
              </div>
              <div class="column">
                <figure class="image has-image-centered">
                  <img class="image-franckiss" src="@/assets/images/franckiss_gris.jpg" />
                </figure>
              </div>
              <div class="column">
                <figure class="image has-image-centered">
                  <img class="image-franckiss" src="@/assets/images/franckiss_noir.jpg" />
                </figure>
              </div>
              <div class="column">
                <figure class="image has-image-centered">
                  <img class="image-franckiss" src="@/assets/images/franckiss_orange.jpg" />
                </figure>
              </div>
              <div class="column">
                <figure class="image has-image-centered">
                  <img class="image-franckiss" src="@/assets/images/franckiss_vert.jpg" />
                </figure>
              </div>
            </div>
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <input class="input is-rounded" type="text" placeholder="Pseudo" v-model="label" />
              </div>
              <div class="control">
                <button
                  v-on:click="downloadFranckiss"
                  class="button is-primary is-rounded"
                >Télécharger</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="hero is-fullheight">
        <div class="hero-head">
          <h1 class="title is-1 has-text-centered">AND JOIN THE WORLD MAP</h1>
        </div>
        <div class="hero-body">
          <div class="container" style="height: 800px">
            <l-map style="height: 80%; width: 100%" :zoom="zoom" :center="center" ref="leafletmap">
              <l-tile-layer :url="url"></l-tile-layer>
              <v-marker-cluster v-if="listFranckiss.length > 0">
                <l-marker
                  v-for="markFranckiss in listFranckiss"
                  :key="markFranckiss.id"
                  :lat-lng="markFranckiss.location"
                  :icon="franckissIcon"
                >
                  <l-popup :content="markFranckiss.label"></l-popup>
                </l-marker>
              </v-marker-cluster>
            </l-map>
          </div>
        </div>
      </section>
      <footer class="footer">
        <div class="container has-text-centered">
          <p>
            <strong>FRANCKISS</strong> by
            <a href="https://github.com/llanas">Llanas</a>.
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { db } from "./firebase";
import { LMap, LTileLayer } from "vue2-leaflet";
import { Icon, icon } from "leaflet";
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
      storageId: null,
      label: "",
      listFranckiss: [],
      isDownloadPending: false,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 3,
      center: [47.41322, -1.219482],
      franckissIcon: customicon
    };
  },
  created() {
    // this unbinds any previously bound reference
    this.$bind("listFranckiss", db.collection("downloads")).then(
      listFranckiss => {
        this.listFranckiss === listFranckiss;
      }
    );
  },
  mounted() {
    const storageId = localStorage.getItem("franckissId");
    if (storageId) {
      alert("T'as déjà ton Franckiss!");
    }
  },
  methods: {
    downloadFranckiss: async function() {
      const coord = await this.$getLocation();
      db.collection("downloads")
        .add({
          date: new Date().getTime(),
          ipAddress: null,
          label: this.label,
          location: {
            lat: coord.lat,
            lng: coord.lng
          }
        })
        .then(docRef => {
          localStorage.setItem("franckissId", docRef.id);
        });
    }
  }
};
</script>

<style>
html {
  /* scrollbar */
  overflow-y: hidden;
}

.image-franckiss {
  border-radius: 60px;
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

.franckissImage {
  background-image: src("@/assets/images/franckiss_bleu.jpg");
}

.has-image-centered {
  margin-left: auto;
  margin-right: auto;
}

footer {
  padding: 1rem 1rem !important;
}
</style>
