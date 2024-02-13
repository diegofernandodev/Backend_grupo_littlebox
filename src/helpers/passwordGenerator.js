const passwordGenerator = require('password-generator');

const randomPassword = async () => {
    const password = passwordGenerator(8, false); // Genera una contraseña de 16 caracteres sin símbolos
    return password
}

module.exports = {randomPassword}