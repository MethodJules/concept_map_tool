<template>
  <b-button @click="print2" variant="secondary" id="printButton"
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
    print2() {
      // Get HTML to print from element
      const prtHtml = document.getElementById("map").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style'),
      ]) {
        stylesHtml += node.outerHTML;
      }

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
  },
};
</script>
