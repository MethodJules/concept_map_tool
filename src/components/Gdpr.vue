<template>
  <footer>
    <cookie-law theme="blood-orange" 
    buttonText="Verarbeitung akzeptieren" 
    position="top" 
    transitionName="fade"
    v-on:accept="accept()"
    > 
    <div slot="message">
      <div>
        Damit diese Website funktioniert, verarbeiten wir einige persönliche Daten. Bitte bestätige, dass du mit der Verarbeitung einverstanden bist, ehe du dich einloggst oder registrierst!
        <span v-if="readMore"></span>
      </div>
      <div>
        <span class="longText" v-show="readMore">
            <hr>
            <h1>Projektverantwortliche</h1>
            <strong>Entwicklung dieser Plattform</strong><br />
            Maren Stadtländer<br />
            AG Informationssysteme und Unternehmensmodellierung<br />
            Institut für Betriebswirtschaft und Wirtschaftsinformatik<br />
            Universität Hildesheim<br />
            Universitätsplatz 1<br />
            31141 Hildesheim<br />
            E-Mail: <a href="mailto:maren.stadtlaender@uni-hildesheim.de">maren.stadtlaender@uni-hildesheim.de</a><br /><br />

            <strong>Projektverantwortung</strong><br />
            Prof. Dr. Klaus Schmidt<br />
            AG Software Systems Engineering<br />
            Institut für Informatik<br />
            Universität Hildesheim<br />
            Universitätsplatz 1<br />
            31141 Hildesheim<br />
            E-Mail: <a href="mailto:schmid@sse.uni-hildesheim.de">schmid@sse.uni-hildesheim.de</a><br />

            <h1>Verarbeitete Daten und Zweck der Datenverarbeitung</h1>
            <strong>Registrierung und Login</strong>
            <p>Für die Registrierung verwenden Sie Ihren Rechenzentrums-Account. Ihr Benutzername wird dabei im Drupal-Backend gespeichert, um Sie als Benutzer:in im Concept Mapping Tool anzulegen und Ihren Benutzernamen im Frontend anzuzeigen.
            Ihr Passwort wird nicht gespeichert. Zur Verifizierung werden Ihre Daten verschlüsselt an einen separaten Service (Sparky Service) gesendet und mit den Daten des Rechenzentrums abgeglichen.</p>
            <strong>Daten-Logging und Recommender</strong>
            <p>Um die Recommender-Funktion implementieren und verbessern zu können, werden alle Ihrer im Tool erstellten Concept Maps inklusive der Konzepte, Relationen, Tags und Zeitstempel erfasst und in einer zentralen Datenbank gespeichert, auch die ein separater Recommender Service zugreifen kann.
            Wenn Sie oder andere Benutzer:innen eine Anfrage an den Recommender stellen, wird ein Log (Zeitstempel der Anfrage, aktuelle Concept Map inkl. Konzepte, Relationen, Tags) erstellt, Ihre aktuelle Concept Map an den Recommender Service übergeben und Sie erhalten einen Vorschlag über zu Ihrer Concept Map passende Konzepte.
            Die Konzepte, die Sie übernehmen, werden an den Recommender Service gemeldet, um die Vorschlagsqualität zu verbessern.</p>
            
            <h1>Einbindung externer Services</h1>
            <strong>Sparky Service</strong>
            <p>Sascha El-Sharkawy, AG Software Systems Engineering, <a href="mailto:elscha@sse.uni-hildesheim.de">elscha@sse.uni-hildesheim.de</a></p>
            <strong>Recommender Service</strong>
            <p>Nourhan Ahmed, AG Information Systems and Machine Learning Lab, <a href="mailto:nourhan.ahmed@uni-hildesheim.de">nourhan.ahmed@uni-hildesheim.de</a></p>

            <h1>Datenschutz der Universität Hildesheim</h1>
            <p>Die geltende Datenschutzerklärung der Universität können Sie <a href="https://www.uni-hildesheim.de/datenschutz/" target="_blank" rel="noopener noreferrer">hier</a> nachlesen.</p>
        </span>
      </div>
      <button class="btn btn-success" @click="readMore =! readMore">
        <span v-if="readMore">Datenschutzhinweis verbergen</span>
        <span v-else>Datenschutzhinweis ausklappen</span>
      </button>
    </div>
    </cookie-law>
  </footer>
</template>

<script>
  import CookieLaw from 'vue-cookie-law'
  export default {
    data() {
      return {
        readMore: false,
      }
    },
    methods: {
      accept() {
        console.log('henlo')
        this.$emit('gdprAccepted');
      },
    },
    components: {
      CookieLaw
    },
  }
</script>

<style scoped>
  .longText {
    height: 400px;
    display: block;
    overflow: scroll;
  };
</style>