const authErrorClosers = document.querySelectorAll(".authError__closer");
authErrorClosers.forEach(authErrorCloser => {
  authErrorCloser.addEventListener("click", () => {
    authErrorCloser.parentNode.parentNode.removeChild(authErrorCloser.parentNode);
  });
});

const statusClosers = document.querySelectorAll(".status__closer");
statusClosers.forEach(statusCloser => {
  statusCloser.addEventListener("click", () => {
    statusCloser.parentNode.parentNode.removeChild(statusCloser.parentNode);
  });
});