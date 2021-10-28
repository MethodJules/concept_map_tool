// import axios from 'axios'
import axios from "@/config/login_axios"
import router from "@/router"

const state = () => ({
    user: null, //TODO Should we name it current_user? Would be more semantically correct
    csrf_token: '', //TODO user individual token is to be used in all subsequent api requests instead of the admin token which is used at the moment
    logout_token: null,
    validCredential: false,
    authToken: null,
    concept_map_ids: null


})

const getters = {
    /**
     * Getter for user datas. 
     * @param {object} state, to allow access to the state values 
     * @returns user, the values of user as object
     */
    getUser(state) {
        return state.user;
    },
}
const actions = {

    /**
    * gets a session token which is used for subsequent registration of a user
    * calls the mutation SAVE_SESSION_TOKEN after a token was successfully received
    * after that another action createUser is called
    * @param username username the user gives as input in App.vue for registration
    * @param password password the user gives as input in App.vue for registration
    * @param commit commit us used to call a mutation from this function
    * @param state state as parameter for access and manipulation of state data
    * @param dispatch dispatch is used to call another action from this function
    */
    async getSessionToken({ commit, state, dispatch }, { username, password, matrikelnummer }) {

        //eigtl csrf token, nicht sessiontoken
        console.log(state)
        await axios.get('rest/session/token')
            .then((response) => {
                const token = response.data;
                commit('SAVE_SESSION_TOKEN', token);
                dispatch('createUser', { username, password, matrikelnummer })

            }).catch(error => {
                throw new Error(`API ${error}`);
            });

    },

    /**
    * sends a request to sparky api to get user data, which will be saved in the user account for the registration, via getWhoAmI
    * uses csrf token from getSessionToken()
    * @param username username the user gives as input in App.vue for registration
    * @see {@link getSessionToken}
    * @param password password the user gives as input in App.vue for registration
    * @param state state as parameter for access and manipulation of state data
    * @param dispatch dispatch is used to call another action from this function
    * @param rootState rootState allows access to states of other modules in store
    */
    async createUser({ state, commit, rootState }, { username, password, matrikelnummer }) {
        //await dispatch("sparky_api/getWhoamI", { username, password }, { root: true })
        var sparkyUserObject = rootState.sparky_api.sparkyUserObject
        console.log(rootState.sparky_api.sparkyUserID)
        console.log(rootState.sparky_api.sparkyUserObject)
        console.log(username)
        console.log(sparkyUserObject)
        //console.log(generatedPassword)


        //TODO: Fehlerbehandlung: matrikelnummer ist bei mir null -> dann funzt das alles nicht -> wieso ist null, muss man so einen sonderfall normalerweise beachten
        // TODO: unnötige felder sparky_id, evtl. fullname  entfernen
        const data = JSON.stringify({
            'name': { 'value': `${sparkyUserObject.data.username}` },
            //'name': {'value': `${username}`},
            'mail': { 'value': `${sparkyUserObject.data.email}` },
            'pass': { 'value': `${password}` },
            //'field_sparky_id': {'value': `${sparkyUserObject.data.id}`},
            'field_fullname': { 'value': `${sparkyUserObject.data.displayName}` },
            'field_matrikelnummer': { 'value': `${matrikelnummer}` },
            //'field_matrikelnummer': {'value': `12345`},
            //'field_matrikelnummer': {'value': `${sparkyUserObject.data.matrNr}`},
        })
        //TODO: state.csrf_token testen und evtl gegen rootState.drupal_api.csrf_token austauschen
        var config = {
            method: 'post',
            url: 'user/register?_format=json',
            headers: {
                'X-CSRF-Token': state.csrf_token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        console.log(config)
        axios(config)
            .then((response) => {
                console.log(response.data);
                const user = response.data;
                commit('SAVE_CREATED_USER', user);

            }).catch(error => {
                throw new Error(`API ${error}`);
            });
    },
    /**
    * Connects to the Drupal Backend and request a login
    * The Backend will give csrf_token a logout token and a current_user object
    */
    async loginToDrupal({ commit, dispatch }, { username, password }) {
        //authenticate with sparky_api at sparky backend is commented out for development purposes. thus testaccounts can be used without the need of real user data
        //TODO: uncomment sparky_api/authenticate to authenticate real users when development is finished 
        //await dispatch("sparky_api/authenticate", { username, password }, { root: true })
        const data = `{"name": "${username}", "pass": "${password}"}`;
        const config = {
            method: 'post',
            url: 'user/login?_format=json',
            withCredentials: true,
            data: data
        };

        await axios(config)
            .then((response) => {
                commit('SAVE_LOGIN_USER', response.data);
                return dispatch("loadUserFromBackend");
            })
            .catch((error) => {
                console.log(error)
            });
    },

    /**
     * Loads user datas from backend.
     * @param {object} state, to allow access to state values
     * @param {object} commit, is being used to call a mutation.  
     */
    async loadUserFromBackend({ commit, state }) {
        console.log("load user")
        var config = {
            method: 'get',
            url: `jsonapi/user/user?filter[drupal_internal__uid]=${state.user.uid}`,
            headers: {
                'Authorization': `${state.authToken}`,
                'X-CSRF-Token': `${state.csrf_token}`
            },
        };

        await axios(config)
            .then(function (response) {
                // console.log(response)
                // We need for now only concept map id, but I am saving the other values in case we use them later. 
                let user = {
                    id: response.data.data[0].id,
                    name: response.data.data[0].attributes.name,
                    mail: response.data.data[0].attributes.mail,
                    concept_maps: response.data.data[0].relationships.field_concept_maps,
                    fullname: response.data.data[0].attributes.field_fullname,
                    matrikelnummer: response.data.data[0].attributes.field_matrikelnummer,
                    pictureLink: response.data.data[0].relationships.user_picture.links.self
                }
                return commit('SAVE_USER', user);
            })
            .catch(function (error) {
                console.log(error)
            })

    },
    /**
     * Loads tolen called valid_credientials from session storage. 
     * @param {object} commit, to call a mutation
     * @param {object} dispatch, to call an action
     * @returns 
     */
    async loadTokensfromSessionStorage({ commit, dispatch }) {
        if (sessionStorage.getItem("valid_credentials") == "true") {
            await commit('LOAD_TOKEN_SESSION_STORAGE');
            await dispatch('loadUserFromBackend');
            // router.push("/")
            // console.log("hello")
        } else {
            console.log("session token")
            router.push("/Login");
            return false
        }
    },

    /**
    * Connects to the Drupal Backend and request a login
    * The Backend will give csrf_token a logout token and a current_user object
    * @param {object} commit to call a mutation
    * @param {object} state allows access to state values
    * @param {object} rootState allows access to rootState values
    */
    async logoutDrupal({ commit, rootState, state }) {

        const config = {
            method: 'post',
            url: `user/logout?_format=json&token=${rootState.drupal_api.logout_token}`,
            headers: {
                'X-CSRF-Token': `${rootState.drupal_api.csrf_token}`,
            }, withCredentials: true
        };

        await axios(config)
            .then((response) => {
                console.log(response)
                commit('SAVE_LOGOUT_USER')
                router.go("login");
            })
            .catch((error) => {
                state.validCredential = false;
                console.log(error)
            });
    },
    /**
     * Sends a mutation to save authorization token to the state.
     * @param {object} commit to call a mutation 
     * @param {string} authorization_token token for access
     */
    saveBasicAuth({ commit }, authorization_token) {
        commit('SAVE_BASIC_AUTH_TOKEN', authorization_token)
    }


}
const mutations = {

    SAVE_BASIC_AUTH_TOKEN(state, authorization_token) {
        sessionStorage.setItem("auth_token", authorization_token);
        state.authToken = authorization_token
    },

    /**
    * gets the token from action and puts it in state 
    * @param token token from
    * @param state state as parameter for access and manipulation of state data
    */
    SAVE_SESSION_TOKEN(state, token) {
        state.csrf_token = token
        console.log(state.csrf_token)
    },

    /**
    * gets user object from action and puts it in state
    * @param user
    * @param state state as parameter for access and manipulation of state data
    */
    SAVE_CREATED_USER(state, user) {
        state.user = user
        console.log("jetzt csrf und user")
        console.log(state.user)
        console.log(state.csrf_token)
    },

    /**
    * gets the csrf_token, user object and loguttoken from action 
    * and puts it in the state object
    * @param {*} state 
    * @param {*} token 
    */
    SAVE_LOGIN_USER(state, login_data) {
        sessionStorage.setItem("csrf_token", login_data.csrf_token);
        sessionStorage.setItem("logout_token", login_data.logout_token);
        sessionStorage.setItem("valid_credentials", "true");
        sessionStorage.setItem('current_user', JSON.stringify(login_data.current_user));
        state.csrf_token = login_data.csrf_token;
        state.user = login_data.current_user;
        state.logout_token = login_data.logout_token;
        state.validCredential = true;
    },


    LOAD_TOKEN_SESSION_STORAGE(state) {
        console.log("load token session storage")
        state.validCredential = true;
        state.csrf_token = sessionStorage.getItem("csrf_token");
        state.logout_token = sessionStorage.getItem("logout_token");
        state.authToken = sessionStorage.getItem("auth_token");
        state.user = JSON.parse(sessionStorage.getItem('current_user'));
        return state.user;

    },

    SAVE_LOGOUT_USER(state) {
        state.validCredential = false;
        sessionStorage.removeItem("csrf_token");
        sessionStorage.removeItem("logout_token");
        sessionStorage.removeItem("valid_credentials");
        sessionStorage.removeItem("current_user");
        sessionStorage.removeItem("auth_token");
    },
    SAVE_USER(state, user) {
        state.user.id = user.id;
        state.user.mail = user.mail;
        state.user.matrikelnummer = user.matrikelnummer;
        state.user.concept_maps = user.concept_maps.data;
        state.user.fullname = user.fullname;
        state.user.pictureLink = user.pictureLink;
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}