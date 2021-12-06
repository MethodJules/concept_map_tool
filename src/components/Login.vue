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
                                            maren.stadtlaender@uni-hildesheim.de </span
                                        >.
                                        <b-icon
                                            v-b-tooltip="{
                                                title: 'Erfolgreich kopiert ',
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
                                <tr>
                                    <td>
                                        <label for="matrikelnummer"
                                            >Matrikelnummer</label
                                        >
                                    </td>
                                    <td>
                                        <input
                                            v-model="matrikelnummer"
                                            id="matrikelnummer"
                                            type="text"
                                            placeholder=""
                                            class="form-control"
                                        />
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
            return res;
        },
        async login() {
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
</style>
