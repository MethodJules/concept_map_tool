import axios from 'axios';

const state = () => ({
    rowData: [
        // { id: 1, date: " ", doings: " ", todaydoings: " ", problems: " "  },
    ]
})

const getters = {
    getRowData(state) {
        return state.rowData;

    }
}

const actions = {


    async loadDailysFromBackend({ commit }) {
        await axios.get('https://clr-backend.x-navi.de/jsonapi/node/dailyscrum')
            .then((response) => {
                const data = response.data.data;
                commit('SAVE_DAILYSCRUM_FEATURE', data);
            }).catch(error => {
                throw new Error(`API ${error}`);
            });

    },

    createDaily({ commit }, dailyEntry) {
        commit('ADD_DAILY_ENTRY', dailyEntry)

    },



    deleteDaily({ commit }, dailyEntry) {
        var config = {
            method: 'delete',
            url: `https://clr-backend.x-navi.de/jsonapi/node/dailyscrum/${dailyEntry.idd}`,
            // das hier löscht korrekt einen eintrag -> url: `http://clr-backend.x-navi.de/jsonapi/node/dailyscrum/0765516c-d202-4ceb-ae44-5f86d203a278`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
            },
        };
        axios(config)
            .catch(function (error) {
                console.log(error);
            });
        commit('DELETE_DAILY_ENTRY', dailyEntry);
    },



    updateDaily({ commit }, dailyEntry) {

        commit('UPDATE_DAILY_ENTRY', dailyEntry);
    },





}

const mutations = {

    //der Teil löscht nur die Zeile aus Frontend Tabelle in Vue raus
    DELETE_DAILY_ENTRY(state, dailyEntry) {
        let index = state.rowData.indexOf(dailyEntry);
        state.rowData.splice(index, 1);
    },




    ADD_DAILY_ENTRY(state, dailyEntry) {
        var data = `{"data": {"type": "node--dailyscrum", 
            "attributes": {"title": "${dailyEntry.title}", 
            "field_datum": "${dailyEntry.date}", 
            "field_gestern": "${dailyEntry.doings}" , 
            "field_heute": "${dailyEntry.todaydoings}", 
            "field_probleme": "${dailyEntry.problems}" }}}`;
        var config = {
            method: 'post',
            url: 'https://clr-backend.x-navi.de/jsonapi/node/dailyscrum',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                // We need to reload the page here. When we dont do it. It overwrites on the last saved data in state.  
                (response) ? location.reload() : "";

            })
            .catch(function (error) {
                console.log(error)
                console.log(data);
            })

        state.rowData.push(dailyEntry);



    },

    UPDATE_DAILY_ENTRY(state, dailyEntry) {
        // State update
        let index;
        let id = dailyEntry.idd;

        state.rowData.forEach(element => {
            if (element.idd == id) {
                index = state.rowData.indexOf(element)
            }
        });
        state.rowData.splice(index, 1, dailyEntry);
        // state.rowData[index] = dailyEntry;

        // DB Update
        // console.log(dailyEntry.todaydoings)
        var data = `{"data": {"type": "node--dailyscrum", "id": "${dailyEntry.idd}", "attributes": {"title": "${dailyEntry.title}", "field_datum": "${dailyEntry.date}", "field_gestern": "${dailyEntry.doings}" , "field_heute": "${dailyEntry.todaydoings}", "field_probleme": "${dailyEntry.problems}" }}}`;
        var config = {
            method: 'patch',
            url: `https://clr-backend.x-navi.de/jsonapi/node/dailyscrum/${dailyEntry.idd}`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
            },
            data: data
        };


        axios(config)
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    },

    /**
     * Saves the dailyscrum_feature to the state as rowData.
     * @param state our state
     * @param dailyscrum_feature the data to save state 
     */
    SAVE_DAILYSCRUM_FEATURE(state, dailyscrum_feature) {
        let rowDataFromDb;
        dailyscrum_feature.forEach(element => {
            rowDataFromDb = {
                date: element.attributes.field_datum,
                doings: element.attributes.field_gestern,
                todaydoings: element.attributes.field_heute,
                problems: element.attributes.field_probleme,
                idd: element.id,
                title: element.attributes.title
            }
            state.rowData.push(rowDataFromDb);
        });
    }



}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}


