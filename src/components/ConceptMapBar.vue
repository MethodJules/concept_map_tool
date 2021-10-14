<template>
    <div class="conceptMapBar">
        <div class="tags">
            <span
                class="tag"
                v-for="(tag, i) in activeConceptMap.tags"
                :key="i"
            >
                <span class="tag-name">{{ tag }}</span>
                <b-icon
                    icon="x-circle"
                    scale="1"
                    variant="secondary"
                    @click="deleteTag(tag)"
                ></b-icon>
            </span>

            <span>
                <input
                    type="text"
                    @keydown.enter="addTag(newTag)"
                    @keydown.backspace="deleteLastTag()"
                    v-model="newTag"
                />
            </span>
            <b-button size="sm" variant="primary" @click="addTag(newTag)">
                <b-icon icon="plus-circle" sm aria-hidden="true"></b-icon>
            </b-button>
        </div>
        <b-dropdown
            id="dropdown-1"
            :text="activeConceptMap.title"
            variant="secondary"
            block
            size="sm"
            right
            ref="conceptMapDropdown"
        >
            <div class="dropdown-input">
                <b-form-input
                    size="sm"
                    placeholder="Neu Concept Map"
                    v-model="newConceptMapName"
                    @keydown.enter="createConceptMap(newConceptMapName)"
                >
                    <!-- @keydown.enter.prevent="!conceptNameEmpty" -->
                    <!-- How to stop enter when There is no name there... -->
                </b-form-input>
                <b-button
                    size="sm"
                    variant="primary"
                    @click="createConceptMap(newConceptMapName)"
                    :disabled="!conceptNameEmpty"
                >
                    <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
                </b-button>

                <b-button
                    size="sm"
                    variant="primary"
                    @click="toggleConceptMapEditModal()"
                >
                    <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
                </b-button>
            </div>
            <b-modal
                ref="conceptMapEdit-modal"
                class="conceptMapBar-editModal"
                hide-footer
                hide-header
            >
                <div class="conceptMapBar-editModal-container">
                    <div class="conceptMapBar-editModal-header">
                        <h3>Concept Map Edit</h3>
                    </div>
                    <div class="conceptMapBar-editModal-content">
                        <b-input-group
                            class="mt-3"
                            size="sm"
                            v-for="(conceptMap, index) in conceptMaps"
                            :key="index"
                        >
                            <b-form-input
                                size="sm"
                                :placeholder="conceptMap.title"
                                v-model="newName[index]"
                                @keydown.enter="
                                    changeConceptMapName(conceptMap, index)
                                "
                            ></b-form-input>
                            <b-input-group-append class="d-flex">
                                <b-button
                                    variant="outline-primary"
                                    size="md"
                                    @click="
                                        changeConceptMapName(conceptMap, index)
                                    "
                                >
                                    <b-icon icon="arrow-repeat" size="md">
                                    </b-icon>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </div>

                    <div class="conceptMapBar-editModal-footer">
                        <b-button
                            variant="danger"
                            size="sm"
                            block
                            @click="toggleConceptMapEditModal()"
                            >Close Me</b-button
                        >
                    </div>
                </div>
            </b-modal>
            <b-dropdown-item
                class="dropdown-conceptMap"
                v-for="(conceptMap, i) in conceptMaps"
                :key="i"
            >
                <span @click="conceptMapSelect(conceptMap, i)">
                    {{ conceptMap.title }}
                </span>

                <b-button
                    class="tools-buttonsDeleteMode"
                    size="sm"
                    variant="danger"
                    @click.stop="deleteConceptMap(conceptMap, i)"
                >
                    <b-icon icon="trash" size="sm" font-scale="1"></b-icon>
                </b-button>
            </b-dropdown-item>
        </b-dropdown>
    </div>
</template>

<script>
/**
 * For more information: https://www.npmjs.com/package/vue-d3-network
 * Or just google "vue-d3-network"
 * A good example: https://emiliorizzo.github.io/vue-d3-network/
 *
 */
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            highlightNodes: [],
            newConceptMapName: "",
            newName: [],
            newTag: "",
        };
    },
    components: {},
    computed: {
        ...mapGetters({
            conceptMaps: "conceptMap/getConceptMaps",
            index: "conceptMap/getIndex",
            activeConceptMap: "conceptMap/getActiveConceptMap",
        }),

        conceptNameEmpty() {
            if (this.newConceptMapName !== "") return true;
            return false;
        },
    },
    methods: {
        changeConceptMapName(conceptMap, index) {
            let payload = {
                conceptMap: conceptMap,
                index: index,
                newName: this.newName[index],
            };
            this.$store.dispatch("conceptMap/changeConceptMapName", payload);
            this.newName = "";
        },

        toggleConceptMapEditModal() {
            this.$refs["conceptMapEdit-modal"].toggle();
            this.newName = [];
        },

        async deleteConceptMap(conceptMap, index) {
            let payload = {
                conceptMap: conceptMap,
                index: index,
            };
            await this.$store.dispatch(
                "conceptMap/deleteConceptMapFromUser",
                payload
            );

            await this.$store.dispatch(
                "conceptMap/deleteConceptMapFromDatabase",
                conceptMap
            );

            let links = conceptMap.links;
            console.log(links);

            links.forEach((link) => {
                console.log(link);
                console.log(link.id);
                this.$store.dispatch(
                    "conceptMap/deleteLinkFromRelationsTable",
                    link.id
                );
            });
        },

        conceptMapSelect(conceptMap, index) {
            this.$store.state.conceptMap.index = index;
            this.$store.state.conceptMap.activeConceptMap = conceptMap;
        },

        createConceptMap(newConceptMapName) {
            let newConceptMap = {
                title: newConceptMapName,
                nodes: [],
                links: [],
            };
            this.$store.dispatch(
                "conceptMapBar/createConceptMap",
                newConceptMap
            );
            this.$refs.conceptMapDropdown.hide(true);
            this.newConceptMapName = "";
        },

        tagExists(newTag) {
            let tagExists = false;
            let tags = this.activeConceptMap.tags;
            tags.forEach((tag) => {
                if (tag == newTag) tagExists = true;
            });
            return tagExists;
        },
        addTag(newTag) {
            if (!this.tagExists(newTag)) {
                let tags = this.activeConceptMap.tags;
                tags.push(newTag);
                this.$store.dispatch("conceptMapBar/addTagToConceptMap", tags);
            }
            this.newTag = "";
        },
        deleteTag(tag) {
            console.log(tag);
            let tags = this.activeConceptMap.tags;
            let index = tags.indexOf(tag);
            console.log(index);
            tags.splice(index, 1);
            console.log(tags);
            this.$store.dispatch("conceptMapBar/deleteTagFromConceptMap", tags);
        },
        deleteLastTag() {
            let tags = this.activeConceptMap.tags;
            tags.splice(-1, 1);
            console.log(tags);
            this.$store.dispatch("conceptMapBar/deleteTagFromConceptMap", tags);
        },
    },
    async created() {},
};
</script>

<style scoped >
button {
    display: flex !important;
    justify-content: center !important;
    align-items: center;
}

.conceptMapBar-buttons label {
    height: 2rem;
}

.dropdown-input {
    display: flex;
    padding-right: 1rem;
    min-width: 15rem;
}

::v-deep .dropdown-item {
    display: flex;
    justify-content: space-between;
}
::v-deep .dropdown-item span {
    width: 100%;
}

.link-label {
    fill: purple;
    transform: translate(0, 0.5em);
    font-size: 0.8em;
}
.net {
    width: 100%;
    height: 70vh;
}

/* Recommender Modal */
.conceptMapBar-editModal-header {
    text-align: center;
}
.conceptMapBar-editModal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
}
.conceptMapBar-editModal-container {
    padding: 0.5rem 1rem;
}

.conceptMapBar-editModal-inputPrepend {
    min-width: 5em;
}
.conceptMapBar-editModal-inputPrepend button {
    width: 8em;
}

.conceptMapBar {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap-reverse;
    width: 100%;
}
.conceptMapBar * {
    margin: 2px;
}
.conceptMapBar #dropdown-1 {
    min-width: 5rem;
    width: 10%;
    padding: 0;
}
.tags {
    min-width: 30%;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.tag {
    padding: 0.4rem;
    font-size: 14px;
    margin-right: 0.3rem;
    margin-top: 0.3rem;
    border-radius: 5px;
    color: #383d41;
    background-color: #e2e3e5;
    border-color: #b8daff;
    cursor: default;
}
.tags svg {
    cursor: pointer;
}
.tags input {
    min-height: 2rem;
    width: 10rem;
    outline: none;
    border-radius: 5px;
    border: 1px solid gray;
}
</style>

