const pool = require('../db/postgres');
const bcrypt = require('bcrypt');
const validator = require('validator');

class Usuario {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }
}

Usuario.prototype.create = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(this.data.senha, 10);
            const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email';
            const params = [this.data.nome, this.data.email, hashedPassword];
            pool.query(query, params, (error, result) => {
                if (error) {
                    reject('Erro ao registrar usuário: ' + error);
                } else {
                    resolve(result.rows[0]);
                }
            });
        } catch (err) {
            reject('Erro ao registrar usuário: ' + err);
        }
    });
}

Usuario.findByEmail = function (email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        pool.query(query, [email], (error, result) => {
            if (error) {
                reject('Erro ao buscar usuário: ' + error);
            } else {
                resolve(result.rows[0]);
            }
        });
    });
}

Usuario.prototype.validateRegister = function () {
    this.errors = [];
    const { nome, email, senha } = this.data;
    if (!nome || !email || !senha) {
        this.errors.push('Preencha todos os campos.');
    } else {
        if (!validator.isEmail(email)) {
            this.errors.push('E-mail inválido.');
        }
        if (senha.length < 6) {
            this.errors.push('A senha deve ter pelo menos 6 caracteres.');
        }
        if (nome.trim().length < 2) {
            this.errors.push('O nome deve ter pelo menos 2 caracteres.');
        }
    }
    return this.errors.length === 0;
}

Usuario.prototype.validateLogin = function () {
    this.errors = [];
    const { email, senha } = this.data;
    if (!email || !senha) {
        this.errors.push('Preencha todos os campos.');
    }
    return this.errors.length === 0;
}

module.exports = Usuario; 