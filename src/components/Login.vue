<template>
    <div>
        <Gdpr v-on:gdprAccepted="enableButtons" />
        <div class="container">
            <b-card class="container-form">
                <b-form-group>
                    <b-tabs>
                        <!-- Class name is automatically "tabs" -->
                        <!-- Tab 1 -->
                        <b-tab title="Login">
                            <div class="login-header">
                                <h5>Melde dich hier mit deinem Uni-Account an.</h5>
                                <p>
                                    Wenn du dich noch nicht registriert hast,
                                    registriere dich bitte mit deinem Uni-Account.
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

                            <b-button :disabled="!gdprAccepted" @click="login()">Login</b-button>
                        </b-tab>
                        <b-tab title="Registrierung">
                            <div class="registrierung-header">
                                <h5>
                                    Registriere dich hier mit deinem Uni-Account.
                                </h5>
                                <p>
                                    Falls du Hilfe benötigst, wende dich an
                                    maren.stadtlaender@uni-hildesheim.de.
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
                            <b-button :disabled="!gdprAccepted" @click="registrieren()"
                                >Registrieren</b-button
                            >
                        </b-tab>
                    </b-tabs>
                </b-form-group>
            </b-card>
        </div>
            <div>
      <v-footer padless>
        <v-card class="flat tile text-center" color="#6c757d">
          <v-card-title>
            Concept Mapping Tool - Intelligentes Concept Mapping
          </v-card-title>
          <v-card-subtitle>
            Dieses OpenSource-Projekt wurde im Rahmen der Ausschreibung
            "Qualität Plus" des MWK Niedersachsen erstellt. Näheres dazu finden
            Sie
            <a class="footer-link"
              href="https://www.uni-hildesheim.de/fb4/institute/bwl/informationssysteme-und-unternehmensmodellierung/projekte/qualitaet-plus/" target="_blank" rel="noopener noreferrer"
              >hier</a
            >.
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text class="pb-3">
            <img src="../assets/logo.svg" width="24px" height="24px" />
            <a class="footer-link" href="https://www.uni-hildesheim.de/impressum/" target="_blank" rel="noopener noreferrer">
            Universität Hildesheim
            </a> - {{ new Date().getFullYear() }}
          </v-card-text>
        </v-card>
      </v-footer>
    </div>
    </div>
</template>
<script>
import Gdpr from "@/components/Gdpr.vue";
export default {
    components: { Gdpr },
    data() {
        return {
            zugangsKennung: "",
            passwort: "",
            registrierungsKennung: "",
            registrierungsPasswort: "",
            matrikelnummer: "",
            gdprAccepted: false,
        };
    },
    computed: {
        account() {
            return this.$store.state.sparky_api.account;
        },

        validCredential() {
            // return true;
            // return this.$store.state.sparky_api.validCredential;
            return this.$store.state.drupal_api.validCredential;
        },
    },
    methods: {
        enableButtons() {
            this.gdprAccepted = true;
        },
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

            let authorization_token = this.encodeBasicAuth(username, password);

            // HUGE PROBLEM: They are not working one by one.

            await this.$store.dispatch(
                "drupal_api/saveBasicAuth",
                authorization_token
            );
            await this.$store.dispatch("drupal_api/loginToDrupal", {
                username,
                password,
            });

            await this.$router.push("concept-map-page");

            this.username = "";
            this.password = "";
            return authorization_token;
        },

        encodeBasicAuth(user, password) {
            var creds = user + ":" + password;
            var base64 = btoa(creds);
            return "Basic " + base64;
        },
    }
};
</script>
<style scoped>
.footer-link {
    color: #48c9b0;
    text-decoration: none;
}

.v-card__title,
.v-card__subtitle,
.v-card__text {
  color: white;
}

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
