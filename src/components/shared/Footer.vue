<template>
  <footer>
    <div>
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
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100% !important;
  background-color: #6c757d;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

.footer-link {
  color: #48c9b0;
  text-decoration: none;
}
</style>