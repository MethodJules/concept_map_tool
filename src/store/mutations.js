import axios from 'axios'

export const updateConcept = (state) => {
    // Concept update...
    state.push("data");
}


export const SAVE_CONCEPTS = (state, concepts) => {
    state.concepts = concepts;
}

export const ADD_NEW_CONCEPT = (state, concept) => {


    var data = `{"data":{"type":"node--concept", "attributes": {"title": "${concept}"}}}`;
    var config = {
        method: 'post',
        url: 'https://clr-backend.x-navi.de/jsonapi/node/concept',
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Basic YWRtaW46cGFzc3dvcmQ='
        },
        data: data
    };

    //Send to DB
    axios(config)
        .then(function (response) {
            console.log('Concept wurde erstellt');
            console.log(response);
            state.concepts.push({ name: concept, nid: response.data.data.attributes.drupal_internal__nid });
        })
        .catch(function (error) {
            console.log(error);
        });
}