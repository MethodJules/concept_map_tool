<template>
    <v-footer padless>
        <v-card class="flat tile text-center" color="#6c757d">
            <v-card-title>
                Concept Mapping Tool - Intelligentes Concept Mapping
            </v-card-title>
            <v-card-subtitle class="footer-subtitle pt-2">
                Dieses OpenSource-Projekt wurde im Rahmen der Ausschreibung
                "Qualität Plus" des MWK Niedersachsen erstellt. Näheres dazu
                finden Sie
                <a
                    class="footer-link"
                    href="https://www.uni-hildesheim.de/fb4/institute/bwl/informationssysteme-und-unternehmensmodellierung/projekte/qualitaet-plus/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >hier</a
                >.
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <img src="@/assets/logo.svg" width="24px" height="24px" />
                <a
                    class="footer-link"
                    href="https://www.uni-hildesheim.de/impressum/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Universität Hildesheim
                </a>
                - {{ new Date().getFullYear() }}
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<style scoped>
/* @media only screen and (max-width: 400px) {
    .v-card__title,
    .v-card__subtitle,
    .v-divider {
        display: none !important;
    }
    .v-card__text {
        padding-bottom: 0;
        padding-top: 1rem;
    }
} */

footer {
    width: 100% !important;
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
.v-card__text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 1rem;
}

.v-divider {
    margin: 0.8rem;
}
</style>