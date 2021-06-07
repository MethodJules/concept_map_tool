<template>
  <div class="row">
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
        <tr v-for="(row, i) in rowData" :key="i" :class="striped(i)">
          <td class="text-center p-1">
            {{ row.date }}
          </td>
          <td class="text-center p-1">{{ row.title }}</td>
          <td class="text-center p-1">{{ row.doings }}</td>
          <td class="text-center p-1">{{ row.todaydoings }}</td>
          <td class="text-center p-1">{{ row.problems }}</td>
          <td class="text-center p-1 buttonGroup">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="showUpdateRow(row)"
            >
              Ändern
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteRow(row)"
            >
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
    return {};
  },
  computed: {
    ...mapGetters({ rowData: "dailyScrum/getRowData" }),
  },

  methods: {
    deleteRow(row) {
      this.$store.dispatch("dailyScrum/deleteDaily", row);
    },
    striped(key) {
      let className = "light";
      console.log(key);
      if (key % 2 == 1) {
        className = "dark";
      }
      return className;
    },
  },
};
</script>
<style scoped>
thead tr {
  background-color: rgba(39, 50, 124);
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
.row {
  width: 100%;
  background-color: #394173;
  height: 100vh;
  margin: 0;
  padding: 2rem 0.5rem;
}
.buttonGroup button {
  margin-right: 1rem;
}
.buttonGroup button:last-child {
  margin-right: 0;
}
</style>
