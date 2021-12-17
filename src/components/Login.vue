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
                                <span>
                                    <h6>
                                        Melde dich hier mit deinem Uni-Account
                                        an.
                                    </h6>
                                    <p>
                                        Wenn du dich noch nicht registriert
                                        hast, registriere dich bitte mit deinem
                                        Uni-Account.
                                    </p>
                                </span>
                            </div>
                            <table>
                                <tr>
                                    <td>
                                        <label for="zugangsKennung"
                                            >Zugangskennung</label
                                        >
                                    </td>
                                    <td>
                                        <b-form-input
                                            v-model="zugangsKennung"
                                            v-on:input="
                                                $v.zugangsKennung.$touch
                                            "
                                            v-bind:class="{
                                                error: $v.zugangsKennung.$error,
                                                valid:
                                                    $v.zugangsKennung.$dirty &&
                                                    !$v.zugangsKennung.$invalid,
                                            }"
                                            id="zugangskennung"
                                            type="text"
                                            placeholder=""
                                            class="form-control"
                                        >
                                        </b-form-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="password">Passwort</label>
                                    </td>
                                    <td>
                                        <b-form-input
                                            v-model="passwort"
                                            v-on:input="$v.passwort.$touch"
                                            v-bind:class="{
                                                error: $v.passwort.$error,
                                                valid:
                                                    $v.passwort.$dirty &&
                                                    !$v.passwort.$invalid,
                                            }"
                                            id="password"
                                            type="password"
                                            placeholder=""
                                            class="form-control"
                                        >
                                        </b-form-input>
                                    </td>
                                </tr>
                            </table>

                            <b-button :disabled="!gdprAccepted" @click="login()"
                                >Login</b-button
                            >
                        </b-tab>
                        <b-tab title="Registrierung">
                            <div class="registrierung-header">
                                <span>
                                    <h6>
                                        Registriere dich hier mit deinem
                                        Uni-Account.
                                    </h6>
                                    <p>
                                        Falls du Hilfe benötigst, wende dich an
                                        <span class="mail">
                                            maren.stadtlaender@uni-hildesheim.de</span
                                        >.
                                        <b-icon
                                            v-b-tooltip="{
                                                title: 'Erfolgreich kopiert',
                                                placement: 'bottom',
                                                variant: 'dark',
                                                id: 'tooltip',
                                                animation: 'true',
                                                trigger: 'click',
                                            }"
                                            @click="copyMail()"
                                            :icon="copyIcon"
                                        ></b-icon>
                                    </p>
                                </span>
                            </div>
                            <table>
                                <tr>
                                    <td>
                                        <label for="zugangsKennung"
                                            >Zugangskennung</label
                                        >
                                    </td>
                                    <td>
                                        <b-form-input
                                            v-model="registrierungsKennung"
                                            v-on:input="
                                                $v.registrierungsKennung.$touch
                                            "
                                            v-bind:class="{
                                                error: $v.registrierungsKennung
                                                    .$error,
                                                valid:
                                                    $v.registrierungsKennung
                                                        .$dirty &&
                                                    !$v.registrierungsKennung
                                                        .$invalid,
                                            }"
                                            id="registrierungsKennung"
                                            type="text"
                                            placeholder=""
                                            class="form-control"
                                        >
                                        </b-form-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label for="password">Passwort</label>
                                    </td>
                                    <td>
                                        <b-form-input
                                            v-model="registrierungsPasswort"
                                            v-on:input="
                                                $v.registrierungsPasswort.$touch
                                            "
                                            v-bind:class="{
                                                error: $v.registrierungsPasswort
                                                    .$error,
                                                valid:
                                                    $v.registrierungsPasswort
                                                        .$dirty &&
                                                    !$v.registrierungsPasswort
                                                        .$invalid,
                                            }"
                                            id="registrierungsPasswort"
                                            type="password"
                                            placeholder=""
                                            class="form-control"
                                        >
                                        </b-form-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            for="matrikelnummer"
                                            >Matrikelnummer</label
                                        >
                                    </td>
                                    <td>
                                        <b-form-input
                                            v-model="matrikelnummer"
                                            v-on:input="
                                               $v.matrikelnummer.$touch
                                            "
                                            v-bind:class="{
                                                error: $v.matrikelnummer.$error,
                                                valid:
                                                    $v.matrikelnummer.$dirty &&
                                                    !$v.matrikelnummer.$invalid,
                                            }"
                                            id="matrikelnummer"
                                            type="text"
                                            placeholder=""
                                            class="form-control"
                                        >
                                        </b-form-input>
                                    </td>
                                </tr>
                            </table>
                            <b-button
                                :disabled="!gdprAccepted"
                                @click="registrieren()"
                                >Registrieren</b-button
                            >
                        </b-tab>
                    </b-tabs>
                </b-form-group>
            </b-card>
        </div>
    </div>
</template>
<script>
import Gdpr from "@/components/Gdpr.vue";
import {
    requiredIf,
    minLength,
    integer,
    minValue,
    maxLength,
} from "vuelidate/lib/validators";
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
            copyIcon: "clipboard",
        };
    },
    validations: {
        zugangsKennung: {
            required: requiredIf(function () {
                return this.validate_login();
            }),
            minLength: minLength(1),
        },
        passwort: {
            required: requiredIf(function () {
                return this.validate_login();
            }),
            minLength: minLength(1),
        },
        registrierungsKennung: {
            required: requiredIf(function () {
                return this.validate_login();
            }),
            minLength: minLength(1),
        },
        registrierungsPasswort: {
            required: requiredIf(function () {
                return this.validate_login();
            }),
            minLength: minLength(1),
        },
        matrikelnummer: {
            required: requiredIf(function () {
                return !this.getIsLecturer && this.tabIndex == 1;
            }),
            integer,
            minLength: minLength(1),
            minValue: minValue(0),
            maxLength: maxLength(10),
        },
    },

    computed: {
        account() {
            return this.$store.state.sparky_api.account;
        },

        validCredential() {
            return this.$store.state.drupal_api.validCredential;
        },
    },
    methods: {
        copyMail() {
            let mail = document.querySelector(".mail").innerText;
            navigator.clipboard.writeText(mail);
            this.copyIcon = "clipboard-check";
            setTimeout(() => {
                this.$root.$emit("bv::hide::tooltip");
                this.copyIcon = "clipboard";
            }, 1000);
        },

        enableButtons() {
            this.gdprAccepted = true;
        },

        validate_login() {
            let ausgabe = false;
            if (this.tabIndex == 0) {
                if (this.passwort == "" || this.zugangsKennung == "") {
                    ausgabe = true;
                }
            } else {
                if (
                    this.registrierungsKennung == "" ||
                    this.registrierungsPasswort == ""
                ) {
                    ausgabe = true;
                }
            }
            return ausgabe;
        },

        registrieren() {
            this.$v.$touch();
            if (!this.$v.$invalid) {
                this.$store.dispatch("sparky_api/registrate", {
                    username: this.registrierungsKennung,
                    password: this.registrierungsPasswort,
                    matrikelnummer: this.matrikelnummer,
                })
                .then(() => {
                //remove so username and password arent saved after login
                this.registrierungsKennung = "";
                this.registrierungsPasswort = "";
                this.matrikelnummer = "";
                })
                .catch((error) => {alert(error)});
            } else {
                alert("Bitte gib deine Daten ein.");
            }

        },

        generatePassword(username) {
            const crypto = require("crypto");
            const md5sum = crypto.createHash("md5");
            let str = username;
            const res = md5sum.update(str).digest("hex");
            return res;
        },
        async login() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                let username = this.zugangsKennung;
                let password = this.passwort;
                let authorization_token = this.encodeBasicAuth(username, password);

                await this.$store.dispatch(
                    "drupal_api/saveBasicAuth",
                    authorization_token
                );

                this.$store
                //TODO: uncomment next line and comment out the line after, when project goes in production -> authenticate with sparkyservice
                //.dispatch("drupal_api/loginToDrupal", {
                .dispatch("sparky_api/authenticate", {
                    username,
                    password,
                })
                .then(() => {
                    this.$router.push("concept-map-page");
                });
                this.username = "";
                this.password = "";
                return authorization_token;
            } else {
                alert("Bitte gib deine Rechenzentrumskennung und dein Passwort ein"); 
            }
        },

        encodeBasicAuth(user, password) {
            var creds = user + ":" + password;
            var base64 = btoa(creds);
            return "Basic " + base64;
        },
    },
};
</script>
<style scoped>
@media only screen and (max-width: 400px) {
    * {
        font-size: 0.8rem !important;
    }

    button {
        font-size: 1rem;
    }
    hr {
        margin-top: 0.2rem;
    }
}
button {
    margin-top: 0.5rem;
}
footer {
    position: absolute;
}

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
    height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-header,
.registrierung-header {
    margin-top: 20px;
}

.login-header,
.registrierung-header span {
    font-size: 0.9rem;
}

/*css for form validation*/
.error {
    border-color: red;
    background: #fdd;
}

.error:focus {
    outline-color: #f99;
}

.valid {
    border-color: #5a5;
    background: #efe;
}

.valid:focus {
    outline-color: #8e8;
}

.alert {
    background-color: lightgreen;
    padding: 15px;
}
</style>
