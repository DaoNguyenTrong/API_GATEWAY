<template>
  <section class="error-page">
    <div>
      <h1 data-h1="404">404</h1>
      <p data-p="PAGE NOT FOUND">PAGE NOT FOUND</p>
    </div>
  </section>
</template>
<style lang="css" scoped>
html,
body {
  height: 100%;
  overflow: hidden;
  background: white;
}

.error-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
}

.error-page h1 {
  font-size: 10rem;
  font-weight: 700;
  position: relative;
  margin: -100px 0 0;
  padding: 0;
}

.error-page h1::after {
  content: attr(data-h1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: transparent;
  background: rgb(113, 183, 230);
  background: linear-gradient(
    -45deg,
    rgba(232, 74, 38, 1) 10%,
    rgba(232, 155, 38, 1) 15%,
    rgba(51, 232, 38, 1) 30%,
    rgba(38, 168, 232, 1) 45%,
    rgba(61, 38, 232, 1) 60%,
    rgba(148, 38, 232, 1) 85%,
    rgba(178, 98, 239, 1) 100%
  );
  -webkit-text-fill-color: transparent;
  background-size: 400%;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.25);
  animation: animateTextBg 5s ease-in-out infinite;
}

.error-page p::after {
  content: attr(data-p);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: transparent;
  background: rgb(113, 183, 230);
  background: linear-gradient(
    -45deg,
    rgba(232, 74, 38, 1) 10%,
    rgba(232, 155, 38, 1) 15%,
    rgba(51, 232, 38, 1) 30%,
    rgba(38, 168, 232, 1) 45%,
    rgba(61, 38, 232, 1) 60%,
    rgba(148, 38, 232, 1) 85%,
    rgba(178, 98, 239, 1) 100%
  );
  -webkit-text-fill-color: transparent;
  background-size: 400%;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.25);
  animation: animateTextBg 5s ease-in-out infinite;
}

.error-page h1 + p {
  color: #d6d6d6;
  font-size: 2rem;
  font-weight: 700;
  max-width: 800px;
  position: relative;
}

.error-page h1 + p::after {
  content: attr(data-p);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
}

@keyframes animateTextBg {
  0% {
    background-position: 0 0;
  }

  25% {
    background-position: 100% 0;
  }

  50% {
    background-position: 100% 100%;
  }

  75% {
    background-position: 0 100%;
  }

  100% {
    background-position: 0 0;
  }
}
</style>
