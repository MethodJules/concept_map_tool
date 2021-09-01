import axios from 'axios'

const state = () => ({
    user: null, //TODO Should we name it current_user? Would be more semantically correct
    csrf_token: '', //TODO user individual token is to be used in all subsequent api requests instead of the admin token which is used at the moment
    logout_token: null,
    validCredential: false,
    authToken: null, 
    concept_map_ids:null
    
    
})
const actions= {
    //TO DO: Check if a user already exists
    
    /*1. session token von drupal holen
    2. user json bauen -> mit feldern wie namen, sparky id, matrikelnummer etc
    3. user json mit token an drupal um user zu registrierenn -> response ist user objekt mit uuid, namen, felder etc
    */
    
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
    async getSessionToken({commit, state, dispatch}, { username, password, matrikelnummer }) {
        
        //eigtl csrf token, nicht sessiontoken
        console.log(state)
        await  axios.get('https://clr-backend.x-navi.de/rest/session/token')
        .then((response) => {
            console.log("HELLO")
            console.log(response.data);
            const token = response.data;
            commit('SAVE_SESSION_TOKEN', token);
            dispatch('createUser', { username, password, matrikelnummer})
            
        }).catch(error =>{
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
    async createUser({ state, commit, rootState}, {username, password, matrikelnummer}) {
        //await dispatch("sparky_api/getWhoamI", { username, password }, { root: true })
        var sparkyUserObject = rootState.sparky_api.sparkyUserObject
        console.log(rootState.sparky_api.sparkyUserID)
        console.log(rootState.sparky_api.sparkyUserObject)
        console.log(username)
        console.log(sparkyUserObject)
        //console.log(generatedPassword)
        
        
        //TODO: Fehlerbehandlung: matrikelnummer ist bei mir null -> dann funzt das alles nicht -> wieso ist null, muss man so einen sonderfall normalerweise beachten
        // TODO: unnötige felder sparky_id, evtl. fullname  entfernen
        const data = JSON.stringify ({      
            'name': {'value': `${sparkyUserObject.data.username}`},
            //'name': {'value': `${username}`},
            'mail': {'value': `${sparkyUserObject.data.email}`},
            'pass': {'value': `${password}`},
            //'field_sparky_id': {'value': `${sparkyUserObject.data.id}`},
            'field_fullname': {'value': `${sparkyUserObject.data.displayName}`},
            'field_matrikelnummer': {'value': `${matrikelnummer}`},
            //'field_matrikelnummer': {'value': `12345`},
            //'field_matrikelnummer': {'value': `${sparkyUserObject.data.matrNr}`},
        })
        //TODO: state.csrf_token testen und evtl gegen rootState.drupal_api.csrf_token austauschen
        var config = {
            method: 'post',
            url: 'https://clr-backend.x-navi.de/user/register?_format=json',
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
            
        }).catch(error =>{
            throw new Error(`API ${error}`);
        });          
    },
    /**
    * Connects to the Drupal Backend and request a login
    * The Backend will give csrf_token a logout token and a current_user object
    */
    async loginToDrupal({commit, dispatch},{username, password}) {
        //authenticate with sparky_api at sparky backend is commented out for development purposes. thus testaccounts can be used without the need of real user data
        //TODO: uncomment sparky_api/authenticate to authenticate real users when development is finished 
        //await dispatch("sparky_api/authenticate", { username, password }, { root: true })
        const url = 'https://clr-backend.x-navi.de/user/login?_format=json';
        const data = `{"name": "${username}", "pass": "${password}"}`;
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type':'application/vnd.api+json'
            },
            withCredentials: true,
            data: data
        };
        
        await axios(config)
        .then((response) => {
            
            commit('SAVE_LOGIN_USER', response.data); 
            // I need to take users concept map id from here. 
            // Todo: Save users concept map id to the state    
            return dispatch("loadUserFromBackend");  
        })
        .catch((error) => {
            console.log(error)
        });
    },

    async loadUserFromBackend({ commit, state }) {
      
        var config = {
            method: 'get',
            url: `https://clr-backend.x-navi.de/jsonapi/user/user?filter[drupal_internal__uid]=${state.user.uid}`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': state.authToken,
                'X-CSRF-Token': `${state.csrf_token}`
            },
        };

        await axios(config)
            .then(function (response) {
                
                // We need for now only concept map id, but I am saving the other values in case we use them later. 
                let user = {
                    id: response.data.data[0].id,
                    name : response.data.data[0].attributes.name,
                    mail : response.data.data[0].attributes.mail,
                    concept_maps	:  response.data.data[0].relationships.field_concept_map_ids,
                    fullname : response.data.data[0].attributes.field_fullname,
                    matrikelnummer : response.data.data[0].attributes.field_matrikelnummer,
                }
                 commit('SAVE_USER', user );
            })
            .catch(function (error) {
                console.log(error)
            })

    },



    /**
    * Connects to the Drupal Backend and request a login
    * The Backend will give csrf_token a logout token and a current_user object
    */
    async logoutDrupal({commit, rootState, state}) {
        console.log(rootState.drupal_api.csrf_token)
        console.log(rootState.drupal_api.logout_token)
        console.log(state.logout_token)
        console.log(rootState.drupal_api.authToken)
        console.log(rootState)
        const config = {
            method: 'post',
            url: `https://clr-backend.x-navi.de/user/logout?_format=json&token=${rootState.drupal_api.logout_token}`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type':'application/vnd.api+json',
                'X-CSRF-Token': `${rootState.drupal_api.csrf_token}`,
            },                    withCredentials: true
        };
        
        await axios(config)
        .then((response) => {
            console.log(response)
            //console.log(response.data.csrf_token);
            //console.log(response.data.current_user);
            //console.log(response.data.logout_token);
            commit('SAVE_LOGOUT_USER')        
        })
        .catch((error) => {
            state.validCredential=false;
            console.log(error)
        });
    },
    
    saveBasicAuth({commit}, authorization_token){
        commit('SAVE_BASIC_AUTH_TOKEN', authorization_token)
    }
    
    
}
const mutations ={
    
    SAVE_BASIC_AUTH_TOKEN(state, authorization_token){
        state.authToken=authorization_token
    },
    
    /**
    * gets the token from action and puts it in state 
    * @param token token from
    * @param state state as parameter for access and manipulation of state data
    */
    SAVE_SESSION_TOKEN(state, token) {
        state.csrf_token=token
        console.log(state.csrf_token)
    },
    
    /**
    * gets user object from action and puts it in state
    * @param user
    * @param state state as parameter for access and manipulation of state data
    */
    SAVE_CREATED_USER(state, user) {
        state.user=user
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
        state.csrf_token = login_data.csrf_token;
        state.user = login_data.current_user;
        state.logout_token = login_data.logout_token;
        state.validCredential=true;
        
    },
    
    SAVE_LOGOUT_USER(state) {
        
        state.validCredential=false;
        
    },
    SAVE_USER(state, user){
        state.user.id = user.id;
        state.user.mail = user.mail;
        state.user.matrikelnummer = user.matrikelnummer;
        state.user.concept_maps = user.concept_maps.data;
        state.user.fullname = user.fullname;
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}