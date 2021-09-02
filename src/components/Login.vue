<template>
    <div class="container">
        <b-card class="container-form">
            <b-form-group>
                <b-tabs>
                    <!-- Class name is automatically "tabs" -->
                    <!-- Tab 1 -->
                    <b-tab title="Login">
                        <div class="login-header">
                            <h5>Melde dich hier mit deinem Uni-Account an</h5>
                            <p>
                                Wenn du dich noch nicht registriert hast, bitte
                                registriere dich mit deinem Uni-Account
                            </p>
                        </div>
                        <table>
                            <tr>
                                <td>
                                    <label for="zugangsKennung"
                                        >Zugangskennung</label
                                    >
                                </td>
                                <td>
                                    <input
                                        v-model="zugangsKennung"
                                        id="zugangskennung"
                                        type="text"
                                        placeholder=""
                                        class="form-control"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="password">Passwort</label>
                                </td>
                                <td>
                                    <input
                                        v-model="passwort"
                                        id="password"
                                        type="password"
                                        placeholder=""
                                        class="form-control"
                                    />
                                </td>
                            </tr>
                        </table>

                        <b-button @click="login()">Login</b-button>
                    </b-tab>
                    <b-tab title="Registrierung">
                        <div class="registrierung-header">
                            <h5>
                                Registriere dich hier mit deinem Uni-Account
                            </h5>
                            <p>
                                Falls du Hilfe benötigst, wende dich an
                                mail@uni-hildesheim.de
                            </p>
                        </div>
                        <table>
                            <tr>
                                <td>
                                    <label for="zugangsKennung"
                                        >Zugangskennung</label
                                    >
                                </td>
                                <td>
                                    <input
                                        v-model="registrierungsKennung"
                                        id="registrierungsKennung"
                                        type="text"
                                        placeholder=""
                                        class="form-control"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label for="password">Passwort</label>
                                </td>
                                <td>
                                    <input
                                        v-model="registrierungsPasswort"
                                        id="registrierungsPasswort"
                                        type="password"
                                        placeholder=""
                                        class="form-control"
                                    />
                                </td>
                            </tr>
                        </table>
                        <b-button @click="registrieren()"
                            >Registrieren</b-button
                        >
                    </b-tab>
                </b-tabs>
            </b-form-group>
        </b-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            zugangsKennung: "",
            passwort: "",
            registrierungsKennung: "",
            registrierungsPasswort: "",
            matrikelnummer: "",
        };
    },
    computed: {
        account() {
            return this.$store.state.sparky_api.account;
        },

        validCredential() {
            // return true;
            // return this.$store.state.sparky_api.validCredential;
            // When we login, it breaks the z-circle at the main page.
            // Zircle is hidden when we double click outside of the zcircle

            return this.$store.state.drupal_api.validCredential;
        },
    },
    methods: {
        registrieren() {
            this.$store.dispatch("sparky_api/registrate", {
                username: this.registrierungsKennung,
                password: this.registrierungsPasswort,
                matrikelnummer: this.matrikelnummer,
            });

            //remove so username and password arent saved after login
            this.registrierungsKennung = "";
            this.registrierungsPasswort = "";
            this.matrikelnummer = "";
        },

        generatePassword(username) {
            const crypto = require("crypto");
            const md5sum = crypto.createHash("md5");
            let str = username;
            const res = md5sum.update(str).digest("hex");
            console.log(res);
            return res;
        },
        async login() {
            let username = this.zugangsKennung;
            let password = this.passwort;
            // wenn das hier genutzt wird -> password wird aus namen generiert - die "richtige" anmeldung des nutzers erfolgt beim sparky backend mit rz kennung
            //password=this.generatePassword(username)
            let authorization_token = this.encodeBasicAuth(username, password);
            // this.$store
            //     .dispatch("drupal_api/loginToDrupal", {
            //         username,
            //         password,
            //     })
            //     .then(() => {
            //         this.$router.push("concept-map-page");
            //         this.$store.dispatch(
            //             "conceptMap/loadConceptMapFromBackend"
            //         );
            //         this.$store.dispatch("loadConceptListFromDb");
            //     });
            // It does not work so: Why?
            this.$store.dispatch(
                "drupal_api/saveBasicAuth",
                authorization_token
            );
            await this.$store.dispatch("drupal_api/loginToDrupal", {
                username,
                password,
            });
            await this.$store.dispatch("conceptMap/loadConceptMapFromBackend");
            await this.$store.dispatch("loadConceptListFromDb");
            await this.$router.push("concept-map-page");

            //remove so username and password arent saved after login
            this.username = "";
            this.password = "";
            return authorization_token;
        },

        encodeBasicAuth(user, password) {
            var creds = user + ":" + password;
            var base64 = btoa(creds);
            return "Basic " + base64;
        },
    },
    // mounted() {
    //     this.$store.dispatch("drupal_api/loadTokensfromSessionStorage");
    // },
};
</script>
<style scoped>
.container {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(5, 1fr);
}

.container-form {
    grid-row: 2 / 3;
    grid-column: 2 / 5;
}
.login-header,
.registrierung-header {
    margin-top: 20px;
}
</style>
