import axios from "@/config/sparky_axios";


//TO DO: Coments
const state = () => ({
    sparkyUserID: "",
    sparkyUserObject: null,
});

const mutations = {

    /**
  * makes  api request to sparky backend and gets user data. which is then saved in state with SET_SPARKY_OBJECT and calls getSessionToken
  * @param state state as parameter for access and manipulation of state data
  * @param response response from sparkyservice. includes user data
  */
    SET_SPARKY_OBJECT(state, response) {
        state.sparkyUserID = response.data.id
        state.sparkyUserObject = response
    },
};

const actions = {

    /**
    * makes  api request to sparky backend and gets user data. which is then saved in state with SET_SPARKY_OBJECT and calls getSessionToken
    * @param commit commit us used to call a mutation from this function
    * @param dispatch dispatch is used to call another action from this function
    * @param username input from user login
    * @param password input from user login
    * @param matrikelnummer input from user login (for students only)
    * @param token needed for sparkyservice stmgmt authorization, so we can prove that we registered correctly with sparkyservice
    */
    async getWhoamI({ dispatch, commit }, { username, password, matrikelnummer, token }) {
        return axios.get(
            "stmgmt/auth/whoAmI",
            {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }
        )
            .then(response => {
                if (response.status === 200) {
                    commit('SET_SPARKY_OBJECT', response);
                    dispatch("drupal_api/getSessionToken", { username, password, matrikelnummer }, { root: true })
                }
            })
            .catch(() => {
                alert("Die Authentifizierung mit dem SparkyService ist leider fehlgeschlagen. Wenn dieses Problem bestehen bleibt, wende dich an deinen betreuenden Dozenten oder schreibe eine Email an stadtlaender@uni-hildesheim.de")
            });
    },

    /**
    * makes api request to sparky backend, authenticates user, gets user token and saves it in state.
    * @param dispatch dispatch is used to call another action from this function
    * @param username input from Login.vue
    * @param password input from Login.vue
    */
    async authenticate({ dispatch }, { username, password }) {
        return await axios.post(
            "api/v1/authenticate", {
            "username": username,
            "password": password
        },
            {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(response => {
                if (response.status === 200) {
                    return dispatch("drupal_api/loginToDrupal", { username, password }, { root: true })
                }
            })
            .catch((error) => {
                //if there is an error, we check, if the error status is 401 which means the user is not authorized
                //if the error code is something else, we presume the SparkyService might not be functioning correctly, thus another error message with contact details is given
                if (error.response.status == 401) {
                    alert("Du konntest nicht authorisiert werden. Bitte gib deine korrekte Rechenzentrumskennung ein")
                } else {
                    alert("Die Authentifizierung mit dem SparkyService ist leider fehlgeschlagen. Wenn dieses Problem bestehen bleibt, wende dich an deinen betreuenden Dozenten oder schreibe eine Email an stadtlaender@uni-hildesheim.de")
                }
            });
        //console.log(data)
    },

    /**
* makes api request to sparky backend, authenticates user, gets user token and saves it in state.
* @param dispatch dispatch is used to call another action from this function
* @param username  input from user login
* @param password  input from user login
* @param matrikelnummer input from user login (for students only)

*/
    async registrate({ dispatch }, { username, password, matrikelnummer }) {
        return axios.post(
            "api/v1/authenticate", {
            "username": username,
            "password": password
        },
            {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(response => {
                if (response.status === 200) {
                    const token = response.data.token.token
                    dispatch('getWhoamI', { username, password, matrikelnummer, token })
                }
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    //in this case we throw the error again, it will be catched in the calling method "registrieren". We do this because the ".then" part of the method "registrieren" in "Login.vue" should not be executed. otherwise it would call "sendEmail" when the registering user is a lecturer, which should only happen if it is successful
                    alert("Du konntest nicht authorisiert werden. Bitte gib deine korrekte Rechenzentrumskennung ein")
                    throw error;
                } else {
                    alert("Die Authentifizierung mit dem SparkyService ist leider fehlgeschlagen. Wenn dieses Problem bestehen bleibt, wende dich an deinen betreuenden Dozenten oder schreibe eine Email an stadtlaender@uni-hildesheim.de")
                }
            });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}