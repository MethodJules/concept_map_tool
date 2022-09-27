<template>
  <b-button @click="print" variant="secondary" id="printButton"
    ><b-icon icon="camera"></b-icon>
    <b-tooltip
      target="printButton"
      placement="bottom"
      variant="secondary"
      noninteractive
      >Drucken</b-tooltip
    >
  </b-button>
</template>
<script>
export default {
  methods: {
    /**
     * Prints concept map.
     * Takes the concept of the div with id map and prints it to a pdf file.
     */
    print() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("map").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }
      console.log(stylesHtml);
      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=1800,height=1900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document
        .write(`<!DOCTYPE html><html><head>${stylesHtml}</head><body>
                ${prtHtml}</body></html>`);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },

    async print2() {
      const options = {
        name: "_blank",
        specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
        styles: [
          // "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
          // "https://unpkg.com/kidlat-css/css/kidlat.css",
          "./conceptMap.css",
        ],
        timeout: 1000, // default timeout before the print window appears
        autoClose: true, // if false, the window will not close after printing
        windowTitle: window.document.title, // override the window title
      };
      await this.$htmlToPaper("map", options);
    },
  },
};
</script>
