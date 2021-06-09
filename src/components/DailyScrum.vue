<template>
  <div class="row daily-container">
    <div>
      <button class="btn btn-md my-button" @click="showAddRow">
        Neuer Eintrag
      </button>
      <b-modal
        ref="bv-modal-example"
        size="xl"
        title="Daily Tabelle"
        hide-footer
      >
        <template #modal-title>
          <h3>Daily Tabelle</h3>
        </template>
        <div class="d-block text-center">
          <div class="form-group">
            <form target="1">
              <!-- hier werden die des übergebenen Objekts aus TabelleDaily in den Felder gespeichert -->
              <b-form-datepicker
                id="datepicker-placeholder"
                v-model="formdata.date"
                class="mb-2"
                placeholder="Wahlen Sie ein Datum aus."
                today-button
                label-today-button="Heute"
                calendar-width="100%"
                menu-class="w-100"
                start-weekday="1"
                locale="de"
                labelHelp="Mit den Pfeiltasten durch den Kalender navigieren"
                labelNoDateSelected="Kein Datum gewählt"
              ></b-form-datepicker>

              <div class="form-group row">
                <label class="col-sm-3 text-left text-dark" for="titel"
                  >Titel</label
                >
                <div class="col-sm-9">
                  <input
                    v-model="formdata.title"
                    type="text"
                    placeholder="Geben Sie einen Titel ein!"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 text-left text-dark" for="gestern"
                  >Was habe ich gestern gemacht?</label
                >
                <div class="col-sm-9">
                  <input
                    v-model="formdata.doings"
                    type="text"
                    placeholder="Geben Sie ein, was sie gemacht haben!"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label class="col-sm-3 text-left text-dark" for="heute"
                  >Was habe ich heute vor?</label
                >
                <div class="col-sm-9">
                  <input
                    v-model="formdata.todaydoings"
                    type="text"
                    placeholder="Geben Sie ein was Sie heute vor haben!"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-3 text-left text-dark" for="probleme"
                  >Welche Probleme hatte ich?
                </label>
                <div class="col-sm-9">
                  <input
                    v-model="formdata.problems"
                    type="text"
                    placeholder="Geben Sie ein, welche Probleme es gab!"
                  />
                </div>
              </div>

              <div class="modal-buttons">
                <div v-if="formdata.updateOrAdd === 'add'">
                  <b-button
                    variant="primary"
                    :disabled="isFormFull"
                    size="md"
                    @click="addItem()"
                  >
                    Hinzufügen
                  </b-button>
                </div>
                <div v-else-if="formdata.updateOrAdd === 'update'">
                  <b-button
                    variant="primary"
                    size="md"
                    @click="updateRow(formdata)"
                  >
                    Ändern
                  </b-button>
                </div>
                <b-button
                  @click="hideModal()"
                  variant="outline-danger"
                  size="md"
                  >Close Me</b-button
                >
              </div>
            </form>
          </div>
        </div>
      </b-modal>
    </div>
    <table class="table table-striped table-hover table-sm table-responsive">
      <thead>
        <tr class="text-light">
          <th class="text-center" scope="col">Datum</th>
          <th class="text-center" scope="col">Titel</th>
          <th class="text-center" scope="col">Was habe ich gestern gemacht?</th>
          <th class="text-center" scope="col">Was habe ich heute vor?</th>
          <th class="text-center" scope="col">Welche Probleme hatte ich?</th>
          <th class="text-center" scope="col">Buttons</th>
        </tr>
      </thead>
      <!-- row beinhaltet auch ID von Objekt/Content Type Instanz Ding - wird in loaddaily auch runtergeladen -->
      <tbody>
        <tr v-for="(row, i) in getRowData" :key="i" :class="striped(i)">
          <td class="text-center p-1">
            {{ row.date }}
          </td>
          <td class="text-center p-1">{{ row.title }}</td>
          <td class="text-center p-1">{{ row.doings }}</td>
          <td class="text-center p-1">{{ row.todaydoings }}</td>
          <td class="text-center p-1">{{ row.problems }}</td>
          <td class="text-center p-1 buttonGroup">
            <button class="btn my-button btn-sm" @click="showUpdateRow(row)">
              <b-icon icon="pencil"></b-icon>
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteRow(row)">
              <b-icon icon="trash"></b-icon>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      //das objekt formdata wird mit leeren Strings initialisiert, weil das definieren der variablem alleine nicht möglich war
      formdata: {
        updateOrAdd: "",

        date: "",
        doings: "",
        todaydoings: "",
        problems: "",
        idd: "",
        title: "",
      },
      rowData: [],
    };
  },
  components: {},
  computed: {
    ...mapGetters({ getRowData: "dailyScrum/getRowData" }),

    isFormFull() {
      if (
        this.formdata.date.length > 0 &&
        this.formdata.doings.length > 0 &&
        this.formdata.todaydoings.length > 0 &&
        this.formdata.problems.length > 0 &&
        this.formdata.title.length > 0
      ) {
        return false;
      }
      return true;
    },
  },

  methods: {
    deleteRow(row) {
      this.$store.dispatch("dailyScrum/deleteDaily", row);
    },
    striped(key) {
      let className = "light";
      if (key % 2 == 1) {
        className = "dark";
      }
      return className;
    },
    showAddRow() {
      /*diese Methode wird aufgerufen, wenn mit dem Formular ein neuer Eintrag gemacht werden soll. this.$refs ist nur dazu da das modal anzuzeigen.
        danach werden den formdata attributen leere Strings zugewiesen. Das Attribut updateorAdd wird in Formular genutzt um nur den Add Button anzuzeigen */
      //$bvModal.show('bv-modal-example')
      this.$refs["bv-modal-example"].show();
      this.formdata.date = "";
      this.formdata.doings = "";
      this.formdata.todaydoings = "";
      this.formdata.problems = "";
      this.formdata.title = "";
      this.formdata.updateOrAdd = "add";
    },
    showUpdateRow(row) {
      //hier wird die row aus rowdata als parameter übergeben. aus der row werden die daten an das objekt übergeben
      this.$refs["bv-modal-example"].show();
      this.formdata.date = row.date;

      this.formdata.doings = row.doings;
      this.formdata.todaydoings = row.todaydoings;
      this.formdata.problems = row.problems;
      this.formdata.idd = row.idd;
      this.formdata.title = row.title;
      this.formdata.updateOrAdd = "update";
    },
    hideModal() {
      this.$refs["bv-modal-example"].hide();
    },

    addItem() {
      this.$store.dispatch("dailyScrum/createDaily", this.formdata);
      this.$refs["bv-modal-example"].hide();
    },

    updateRow(formdata) {
      this.$store.dispatch("dailyScrum/updateDaily", formdata);
      // we update state here. but cannot update vue instance
    },
  },
  created() {
    this.rowData = this.getRowData;
    console.log("created:");
    console.log(this.getRowData);
  },
  watch: {
    getRowData: function (newValue, oldValue) {
      console.log("New Value old Value");
      console.log(newValue);
      console.log(oldValue);
      this.rowData = newValue;
      console.log("watcher Row Data: ");
      console.log(this.rowData);
    },
  },
};
</script>
<style scoped>
.row {
  width: 100%;
  margin: 0;
  padding: 2rem 0.5rem;
}
.row div:first-child {
  margin: 0 0 1rem 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
}
thead tr {
  background-color: rgb(39, 50, 124);
}

tbody tr {
  height: 4rem !important;
  color: white !important;
  vertical-align: middle;
}

.light:hover {
  background-color: rgb(35, 53, 170);
}

.dark {
  background-color: rgba(39, 50, 124);
}

.light {
  background-color: rgba(42, 59, 172, 0.8);
}

.buttonGroup button {
  margin-right: 1rem;
}
.buttonGroup button:last-child {
  margin-right: 0;
}

.my-button {
  background-color: indigo;
  color: white;
  border: none;
}

.my-button:hover {
  background-color: rgb(64, 0, 110);
  color: white;
}

.btn-danger {
  background-color: #bb2e3c !important;
}

.btn-danger:hover {
  background-color: #a02c37 !important;
}

/* Modal Css */
input {
  width: 100%;
}
.form-group {
  padding: 0.5rem 0;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
