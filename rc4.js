
function S_SWAP(S, a, b) {
  const t = S[a];
  S[a] = S[b];
  S[b] = t;
}

function rc4(key, plaintext) {
  let result = '';
  const S = [];
  console.log("Entrada: " + plaintext);

  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }

  // KSA
  for (let j = 0, i = 0; i < 256; i++) {
    j = (j + (S[i]) + (key.charCodeAt([i % key.length]))) % 256;
    S_SWAP(S, S[i], S[j]);
  }

  for (let i = 0, j = 0, k = 0; k < plaintext.length; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    S_SWAP(S, S[i], S[j]);
    result += String.fromCharCode(plaintext.charCodeAt(k) ^ S[(S[i] + S[j]) % 256]);
  }
  return result;
}

// const key = "iot";
// const plaintext = "RpwDT1nwA2f9dm29VuHmOnZEOnu1";
// console.log("Key: " + key);

// console.log("Criptografia:");
// const encrypted = rc4(key, plaintext);
// console.log("Saida: " + encrypted);
// console.log("Descriptografia:");
// const decrypted = rc4(key, encrypted);
// console.log("Saida: " + decrypted);

module.exports = { rc4 };
