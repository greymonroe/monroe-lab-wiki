// Simple client-side password gate
// The hash is SHA-256 of the password. Not real security, just a doorbell.
// To change: echo -n "yourpassword" | shasum -a 256
// Current password: "password"

const EXPECTED_HASH = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

(function () {
  var gate = document.getElementById("password-gate");
  if (!gate) return;

  if (sessionStorage.getItem("monroe-lab-auth") === "true") {
    gate.remove();
  } else {
    gate.style.display = "block";
  }

  var form = document.getElementById("password-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var input = document.getElementById("password-input");
      var error = document.getElementById("password-error");
      var hash = await sha256(input.value);

      if (hash === EXPECTED_HASH) {
        sessionStorage.setItem("monroe-lab-auth", "true");
        gate.remove();
      } else {
        error.style.display = "block";
        input.value = "";
        input.focus();
      }
    });
  }
})();
