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
        return {};
    },
    methods: {
        login() {
            alert();
        },
    },
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
