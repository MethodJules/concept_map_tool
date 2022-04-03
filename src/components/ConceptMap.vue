<template>
  <div class="conceptMapPage">
    <div
      v-if="finishedLoading && conceptMap.nodes.length <= 0"
      class="emptyMap"
    >
      <b-card
        bg-variant="info"
        text-variant="white"
        header=""
        class="text-center"
        @click="showAnyModal('add-first-concept-modal')"
      >
        <b-card-text
          >Noch kein Konzept vorhanden. Klicke hier, um das erste
          hinzuzufügen.</b-card-text
        >
      </b-card>
    </div>
    <!-- <fullscreen v-model="fullscreen"> -->
    <d3-network
      id="map"
      v-if="finishedLoading"
      :net-nodes="conceptMap.nodes"
      :net-links="conceptMap.links"
      :options="options"
      @node-click="showModal"
      @link-click="deleteLink"
      ref="net"
      :link-cb="lcb"
    />
    <!-- </fullscreen> -->

    <div class="markers">
      <svg>
        <defs>
          <marker
            id="m-end"
            markerWidth="10"
            markerHeight="7"
            refX="14"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="red" />
          </marker>
          <marker
            id="m-start"
            markerWidth="10"
            markerHeight="7"
            refX="-5"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="10 0, 10 7, 0 3.5" fill="red" />
          </marker>
        </defs>
      </svg>
    </div>
    <div class="modals">
      <b-modal id="add-parent-modal" hide-footer hide-header hide-title>
        <div class="modal-container">
          <h5 class="modal-title">
            Füge ein übergeordnetes Konzept zu
            <strong> {{ clickedNode.name }}</strong>
            hinzu!
          </h5>
          <div class="modal-body">
            <p>
              Wähle eines der folgenden Konzepte
              <b-button variant="secondary" size="sm" @click="clearOptions()"
                >Auswahl zurücksetzen</b-button
              >
            </p>
            <select v-model="targetConcept">
              <option value="" disabled selected hidden>
                Konzept auswählen...
              </option>
              <option
                v-for="(concept, i) in filteredConcepts"
                :disabled="isLinkExists(clickedNode, concept)"
                :key="i"
                :value="concept"
              >
                {{ concept.name }}
              </option>
            </select>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="relationType"
                id="bidirectional"
                value="bidirectional"
                v-model="relationType"
                checked
              />
              <label class="form-check-label" for="bidirectional">
                Bidirektional: {{ clickedNode.name }} ⇔
                {{ targetConcept.name }}
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="relationType"
                id="unidirectionalPT"
                value="unidirectionalPT"
                v-model="relationType"
              />
              <label class="form-check-label" for="unidirectionalPT">
                Unidirektional
                <strong v-if="targetConcept">
                  {{ clickedNode.name }} -->
                  {{ targetConcept.name }}
                </strong>
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="relationType"
                id="unidirectionalTP"
                value="unidirectionalTP"
                v-model="relationType"
              />
              <label class="form-check-label" for="unidirectionalTP">
                Unidirektional
                <strong v-if="targetConcept">
                  {{ targetConcept.name }}
                  -->
                  {{ clickedNode.name }}
                </strong>
              </label>
            </div>
            <label for="linkNameInput">Bezeichnung Relation: </label>
            <b-input id="linkNameInput" v-model="linkName"> </b-input>
            <div class="modal-buttons">
              <b-button
                variant="primary"
                :disabled="isSelectBoxOrRadioButtonFull"
                size="sm"
                @click="
                  addConceptToConceptMap(
                    clickedNode,
                    targetConcept,
                    linkName,
                    relationType
                  )
                "
              >
                <!-- <b-icon icon="plus-circle" size="sm"></b-icon> -->
                <strong> {{ targetConcept.name }} </strong>
                hinzufügen
              </b-button>

              <b-button
                @click="deleteNode(clickedNode)"
                variant="danger"
                size="sm"
              >
                <!-- <b-icon icon="trash" size="sm"></b-icon> -->
                <strong> {{ clickedNode.name }} </strong>
                löschen
              </b-button>

              <b-button
                @click="hideModal('add-parent-modal')"
                variant="danger"
                size="sm"
                >Schließen
              </b-button>
            </div>
          </div>
        </div>
      </b-modal>

      <b-modal
        centered
        id="add-first-concept-modal"
        title="Füge dein erstes Konzept hinzu"
        hide-footer
        hide-header-close
      >
        <b-card
          v-if="filteredConcepts.length <= 0"
          bg-variant="warning"
          text-variant="white"
          class="text-center"
        >
          <b-card-text>Du musst zuerst ein Konzept erstellen.</b-card-text>
        </b-card>
        <b-form-group v-for="(concept, i) in filteredConcepts" :key="i">
          <b-form-radio
            v-model="selectedNode"
            name="some-radios"
            :value="concept"
          >
            <span>
              {{ concept.name }}
            </span>
          </b-form-radio>
        </b-form-group>

        <div class="modal-buttons">
          <b-button
            variant="primary"
            size="sm"
            :disabled="isSelectedNodeEmpty"
            @click="addSingleConceptToMap(selectedNode)"
          >
            <!-- <b-icon icon="plus-circle" size="sm"></b-icon> -->
            Hinzufügen
          </b-button>
          <b-button
            @click="hideModal('add-first-concept-modal')"
            variant="danger"
            size="sm"
            >Schließen
          </b-button>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
/**
 * For more information: https://www.npmjs.com/package/vue-d3-network
 * Or just google "vue-d3-network"
 * A good example: https://emiliorizzo.github.io/vue-d3-network/
 *
 */
import D3Network from "vue-d3-network";

import { mapGetters, mapState } from "vuex";
// import { gsap } from "gsap";

export default {
  data() {
    return {
      clickedNode: {}, // the node that user clicked on the concept map
      targetConcept: "", // The concept that we are going to add to the map
      linkName: "",
      relationType: "",
      selectedNode: "",
      nodePositionX: 0,
      nodePositionY: 0,
      nodeStops: false,
      touchedNodeStops: false,
    };
  },
  components: {
    D3Network,
  },
  computed: {
    ...mapState("conceptMap", [
      "conceptMapOptions",
      "deleteMode",
      "finishedLoading",
      "conceptMap",
    ]),
    ...mapGetters({
      filteredConcepts: "getFilteredConcepts",
    }),

    /**
     * It controls if option or input is full or not.
     * We need this info in order to prevent sending an unfilled form
     */
    isSelectBoxOrRadioButtonFull() {
      if ((this.targetConcept !== "") & (this.relationType !== "")) {
        return false;
      }
      return true;
    },
    /**
     * options of concept map.
     * For more information: https://www.npmjs.com/package/vue-d3-network
     * Or just google "vue-d3-network"
     */
    options() {
      return {
        nodeLabels: true,
        nodeSize: this.conceptMapOptions.nodeSize,
        linkWidth: this.conceptMapOptions.linkWidth,
        force: this.conceptMapOptions.force,
        fontSize: this.conceptMapOptions.fontSize,
        strLinks: true,
        linkLabels: true,
      };
    },
    /**
     * Controls if there is a node selected in the modal with id "add-first-concept-modal"
     */
    isSelectedNodeEmpty() {
      if (this.selectedNode !== "") return false;
      return true;
    },
  },
  methods: {
    /**
     * It saves the position of the node when user click on it for desktop events
     * This position is being used to detect if the node is moving or not.
     */
    mouseUpOnNode(event) {
      this.nodePositionX = event.pageX;
      this.nodePositionY = event.pageY;
    },
    /**
     * It saves the position of the node when user click on it for mobile events
     * This position is being used to detect if the node is moving or not.
     */
    touchStartOnNode(event) {
      this.nodePositionX = event.touches[0].pageX;
      this.nodePositionY = event.touches[0].pageY;
    },

    /**
     * Arranges the arrows on the links.
     */
    lcb(link) {
      link._svgAttrs = {
        // "marker-end": `url(#m-end)`,
        "marker-start": `url(#${link.marker_start})`,
        "marker-end": `url(#${link.marker_end})`,
      };
      return link;
    },
    /**
     * Shows the modal with the given id.
     * @param {string} modalId the id of the modal that is being shown
     */
    showAnyModal(modalId) {
      this.$root.$emit("bv::show::modal", modalId);
    },

    /**
     * Show Modal.
     * @param node The node that user clicked
     * It shows the modal when user clicked a node.
     * Modal is specialized according to the node clicked,
     * If deleteMode is on, it deletes the node clicked.
     * It controls if the node is moved or not.
     * Because of syncronous programming, this control is done here rather than in another methode.
     * With another methode, there was some timing issues. We needed to make methods work async
     * That would cost more time for webseite to work.
     */
    showModal(event, node) {
      if (this.deleteMode || event.altKey) {
        this.deleteNode(node);
      } else {
        // We are not in delete mode. We will control the position of node.
        // If it is not moving, then we are going to open modal.
        if (event.type == "touchend") {
          // For Mobile
          if (
            event.changedTouches[0].pageX == this.nodePositionX &&
            event.changedTouches[0].pageY == this.nodePositionY
          ) {
            this.$root.$emit("bv::show::modal", "add-parent-modal");
            this.clickedNode = node;
          }
        } else if (event.type == "click") {
          // For desktop
          if (
            event.pageX == this.nodePositionX &&
            event.pageY == this.nodePositionY
          ) {
            this.$root.$emit("bv::show::modal", "add-parent-modal");
            this.clickedNode = node;
          }
        }
      }
    },

    /**
     * Hides Modal with the given id.
     * @param {string} modalId  the id of the modal that is being hide
     */
    hideModal(modalId) {
      this.$root.$emit("bv::hide::modal", modalId);
      this.clearOptions();
    },
    /**Clear Options.
     * Deletes the value of the option in the modal.
     * targetConcept stores tha values of the option in the modal
     */
    clearOptions() {
      this.targetConcept = "";
      this.linkName = "";
      this.relationType = "";
      this.selectedNode = "";
    },
    /**
     * Adds the given concept to the concept map.
     * @param concept {object}
     */
    addSingleConceptToMap(concept) {
      this.$store.dispatch("conceptMap/addConceptToConceptMap", {
        concept: concept,
      });
      this.hideModal("add-first-concept-modal");
    },

    /**
     * Controls if there is a link between the selected node and clicked node.
     * It also controls if the selected node and clicked node is the same.
     * @param {object} clickedNode, the node that user has clicked
     * @param {object} nodeInOption, the node in the option
     */
    isLinkExists(clickedNode, nodeInOption) {
      let isLinkExists = false;
      let links = this.conceptMap.links;

      clickedNode.name == nodeInOption.name ? (isLinkExists = true) : "";
      links.forEach((link) => {
        link.sid == clickedNode.id && link.tid == nodeInOption.id
          ? (isLinkExists = true)
          : "";
        link.tid == clickedNode.id && link.sid == nodeInOption.id
          ? (isLinkExists = true)
          : "";
      });
      return isLinkExists;
    },

    /**
     * creates the marker by checking the relation type
     * @param {string} relationType, the type of the relation which comes from the modal
     * @returns {object} markers, the object for marker type, at the end and start of the link
     * unidirectionalPT : from parent concept to target concept
     * unidirectionalTP : from parent target to parent concept
     * bidirectional: there are arrows both side of the link
     */
    createMarkers(relationType) {
      let markers = {
        start: "m-start",
        end: "m-end",
      };
      relationType == "unidirectionalPT" ? (markers.start = "null") : "";
      relationType == "unidirectionalTP" ? (markers.end = "null") : "";
      return markers;
    },
    /**
     * Adds given concept to concept map.
     * It controls if the given concepts are in the concept map already.
     * If so it does not save the link.
     * In action "addConceptToConceptMap" we are checking if the given concepts are already in the concept map.
     * Then we return a value.
     * @param {object} sourceConcept The source concept
     * @param {object} targetConcept The target concept
     * @param {string} linkName      The name of the link
     * @param {string} relationType  The type of the link; null or m-start
     *
     */
    async addConceptToConceptMap(
      sourceConcept,
      targetConcept,
      linkName,
      relationType
    ) {
      let relationship = [];
      let name = "";
      linkName.length > 0
        ? (name = linkName)
        : (name = "von " + sourceConcept.name + " zu " + targetConcept.name);
      // We need to add the ids of the source and target concept to relationship array.
      let markers = this.createMarkers(relationType);

      relationship.push({
        name,
        tid: targetConcept.id,
        sid: sourceConcept.id,
        marker_start: markers.start,
        marker_end: markers.end,
      });

      // We need to send the source concept as an object to this methode
      this.$store.dispatch("conceptMap/addConceptToConceptMap", {
        concept: sourceConcept,
      });
      // we need to send target concept as an object to this methode
      this.$store.dispatch("conceptMap/addConceptToConceptMap", {
        concept: targetConcept,
      });

      // We need to send the relationship as an array
      this.$store.dispatch("conceptMap/addRelationshipToDatabase", {
        relationship,
      });
    },

    async deleteLink(event, link) {
      if (event.altKey == true || this.deleteMode) {
        console.log(link);

        this.$store.commit("conceptMap/DELETE_LINK_FROM_STATE", {
          linkId: link.id,
        });

        await this.$store.dispatch(
          "conceptMap/deleteLinkFromConceptMapTable",
          link.id
        );
        await this.$store.dispatch(
          "conceptMap/deleteLinkFromRelationsTable",
          link.id
        );
      }
    },
    /**
     * Deletes Node from concept map.
     * It needs to find the related links with the node and delete them too.
     * To find the link we have findLinksOfNode function.
     * To delete links we have deleteLinkFromConceptMap function.
     * To Delete Node we have deleteConceptFromConceptMap funciton
     * @param {object} node The node that we are goint to delete
     */
    async deleteNode(node) {
      let linksToDelete = await this.findLinksOfNode(node);

      linksToDelete.forEach(this.deleteLinkFromConceptMap);
      // linksToDelete.forEach((linkId) => {
      //   this.deleteLinkFromConceptMap(linkId);
      // });
      this.deleteConceptFromConceptMap(node);

      for (const linkId of linksToDelete) {
        await this.$store.dispatch(
          "conceptMap/deleteLinkFromConceptMapTable",
          linkId
        );
      }

      for (const linkId of linksToDelete) {
        await this.$store.dispatch(
          "conceptMap/deleteLinkFromRelationsTable",
          linkId
        );
      }
      this.hideModal("add-parent-modal");
    },

    /**
     * Remove Concept From Concept Map.
     * @param {object} node The node that we are going to delete from concept map.
     * This method both deletes the concept and the link that are associated with
     * this node.
     */
    deleteConceptFromConceptMap(node) {
      // Removes the node that is send to the methode
      this.$store.dispatch("conceptMap/deleteNodeFromConceptMap", {
        node: node,
      });
    },
    /**
     * Deletes given link from concept map
     */
    deleteLinkFromConceptMap(linkId) {
      this.$store.dispatch("conceptMap/deleteLinkFromConceptMap", {
        linkId: linkId,
      });
    },
    /**
     * Finds Links of the given node in active concept map.
     * @param {object} node The node that we are going to find the links of it.
     */
    findLinksOfNode(node) {
      let links = this.conceptMap.links;
      let linksOfNode = [];
      console.log(links);
      links.forEach((link) => {
        link.sid == node.id || link.tid == node.id
          ? linksOfNode.push(link.id)
          : "";
      });
      console.log(linksOfNode);
      return linksOfNode;
    },
  },
  async created() {
    await this.$store.dispatch("conceptMap/loadConceptMapsFromBackend");

    // node click detect
    let nodes = document.querySelectorAll(".nodes");
    nodes.forEach((node) => {
      node.addEventListener("mousedown", this.mouseUpOnNode);
      node.addEventListener("touchstart", this.touchStartOnNode);
    });
  },

  // watch: {
  //   /**
  //    * To make transition when switching concept maps.
  //    * Actually we are changing the activeConceptMap when we change the concept maps from dropdown
  //    * So we are applying transition whenever we change the value of activeConceptMap
  //    */
  //   activeConceptMap: () => {
  //     const map = document.querySelector("#map");
  //     const body = document.querySelector("body");
  //     body.style.overflow = "hidden";
  //     const tl = gsap.timeline({
  //       defaults: {
  //         duration: 0.6,
  //         ease: "ease-out",
  //       },
  //     });

  //     if (map) {
  //       tl.from(map, { translateX: 1000, clearProps: "all", duration: 1 }, 0.6);
  //     }

  //     // node click detect
  //     let nodes = document.querySelectorAll(".nodes");
  //     nodes.forEach((node) => {
  //       console.log(node);
  //       node.addEventListener("mousedown", this.mouseUpOnNode);
  //       node.addEventListener("touchstart", this.touchStartOnNode);
  //     });
  //   },
  // },
};
</script>
<style scoped >
.map-enter {
  opacity: 0;
}
.map-enter-active {
  transition: opacity 0.3s ease-out;
}

.map-leave-active {
  transition: opacity 0.3s ease-out;
  opacity: 0;
}

.emptyMap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.emptyMap .card {
  border: 1px solid red;
  padding: 4rem;
  font-size: 2rem;
}
.emptyMap .card:hover {
  cursor: pointer;
}

.markers {
  height: 0px;
}
button {
  display: flex !important;
  justify-content: center !important;
  align-items: center;
}

.modal-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.modal-title {
  border-bottom: 1px solid grey;
}
.modal-body {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.modal-body p {
  display: flex;
  justify-content: space-between;
}
.modal-body select {
  margin-bottom: 1rem;
}
.modal-body label {
  margin-bottom: 0.5rem;
}
.modal-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  width: 100%;
  justify-content: flex-end;
}
.modal-buttons * {
  margin: 0.2rem 0.3rem;
}

#add-first-concept-modal span {
  margin-left: 0.5rem;
}

.link-label {
  fill: purple;
  transform: translate(0, 0.5em);
  font-size: 0.8em;
}
.net {
  /* width: 100%; */
  min-height: 70vh !important;
  padding: 0;
}

#m-end path,
#m-start {
  fill: rgba(18, 120, 98, 0.8);
}

.link-label {
  fill: black !important;
  text-shadow: 2px 2px 2px white;
  transform: translate(0, 0.5em) !important;
  font-size: 0.8 em !important;
}
::v-deep #map svg {
  height: 85vh !important;
}
</style>

