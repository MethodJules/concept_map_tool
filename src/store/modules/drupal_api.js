// import axios from 'axios'
import axios from "@/config/login_axios"
import router from "@/router"

const state = () => ({
    user: null, //TODO Should we name it current_user? Would be more semantically correct
    csrf_token: '', //TODO user individual token is to be used in all subsequent api requests instead of the admin token which is used at the moment
    logout_token: null,
    validCredential: false,
    authToken: null,
    concept_map_ids: null,
    isThereAnyConceptMap: false,


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

    getIsThereAnyConceptMap(state) {
        (state.user.concept_maps.length > 0) ? state.isThereAnyConceptMap = true : "";
        return state.isThereAnyConceptMap;
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
    async getSessionToken({ commit, dispatch }, { username, password, matrikelnummer }) {
        await axios.get('session/token')
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
    async createUser({ state, commit, rootState }, { password, matrikelnummer }) {
        var sparkyUserObject = rootState.sparky_api.sparkyUserObject
        const data = JSON.stringify({
            'name': { 'value': `${sparkyUserObject.data.username}` },
            'mail': { 'value': `${sparkyUserObject.data.email}` },
            'pass': { 'value': `${password}` },
            'field_fullname': { 'value': `${sparkyUserObject.data.displayName}` },
            'field_matrikelnummer': { 'value': `${matrikelnummer}` },
        })
        var config = {
            method: 'post',
            url: 'user/register?_format=json',
            headers: {
                'X-CSRF-Token': state.csrf_token,
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then((response) => {
                const user = response.data;
                commit('SAVE_CREATED_USER', user);
                alert("Dein Account wurde erfolgreich angelegt. Du kannst dich jetzt einloggen.")

            }).catch(error => {
                if (error.response.status == 422) {
                    alert("Offenbar bist du bereits registriert. Bitte versuche stattdessen dich einzuloggen.")
                }
                throw new Error(`API ${error}`);
            });
    },
    /**
    * Connects to the Drupal Backend and request a login
    * The Backend will give csrf_token a logout token and a current_user object
    */
    async loginToDrupal({ commit, dispatch }, { username, password }) {
        //authenticate with sparky_api at sparky backend is commented out for development purposes. thus testaccounts can be used without the need of real user data
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
            .catch(error => {
                //if the user was authorized by the SparkyService (this must be true if this method was called) and could not be authorized, 
                // and status is x -> this must mean he has not registered at the backend
                if (error.response.status == 400) {
                    alert("Du konntest nicht authentifiziert werden. Registriere dich bitte, falls dies nicht bereits geschehen ist.")
                    //console.log(error.response.data.message)
                }
                //error 403 -> requested resource is forbidden for user(role) user who logs in should be either lecturer or student. 
                // if one of those tries to log in (uses log in resource), while already logged in 
                //-> user cant get the user data in state so frontend "thinks" he is logged in, but he is logged in at the backend via a cookie
                //cookie is only seen in web storage, while at the drupal backend site (https://clr-backend.x-navi.de/) but cant be seen while on frontend site.
                //user could be authenticated automatically, when this error message comes, but this might be too insecure (there might be some other cases where 
                // this error could happen)
                //a logout button which could appear at the login page appears to be not possible as well. because csrf token and logout token are missing
                //therefore the user receives a message, which tells him to log out manually at the backend
                else if (error.response.status == 403) {

                    alert("Du konntest nicht authentifiziert werden. Bitte logge dich das nächste mal aus, bevor du die Seite verlässt, um diesen Fehler zu vermeiden. Versuche nun dich erneut einzuloggen. ")
                    dispatch('logoutDrupal')
                }
                //if the user gets another status, it most likely means there is an error on the backend side -> the user is informed of contact emails for further help
                else {
                    alert("Die Authentifizierung mit dem Backend ist leider fehlgeschlagen. Wenn dieses Problem bestehen bleiben sollte, wende dich an deinen betreuenden Dozenten oder schreibe eine Email an stadtlaender@uni-hildesheim.de")
                    //console.log(error.response.data.message)
                }
            })

    },

    /**
     * Loads user datas from backend.
     * @param {object} state, to allow access to state values
     * @param {object} commit, is being used to call a mutation.  
     */
    async loadUserFromBackend({ commit, state }) {
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
        } else {
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
            .then(() => {
                commit('SAVE_LOGOUT_USER')
                router.go("login");
            })
            .catch((error) => {
                console.log(error)
                state.validCredential = false;
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
    },

    /**
    * gets user object from action and puts it in state
    * @param user
    * @param state state as parameter for access and manipulation of state data
    */
    SAVE_CREATED_USER(state, user) {
        state.user = user
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
