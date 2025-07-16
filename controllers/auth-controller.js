const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.register = async function (req, res) {
    const usuario = new Usuario(req.body);
    if (!usuario.validateRegister()) {
        return res.render('pages/register', { title: 'Registro', paginaAtiva: 'register', error: usuario.errors.join('<br>') });
    }
    try {
        const existingUser = await Usuario.findByEmail(usuario.data.email);
        if (existingUser) {
            return res.render('pages/register', { title: 'Registro', paginaAtiva: 'register', error: 'E-mail já cadastrado.' });
        }
        await usuario.create();
        res.redirect('/login');
    } catch (err) {
        res.render('pages/register', { title: 'Registro', paginaAtiva: 'register', error: err });
    }
};

exports.login = async function (req, res) {
    const usuario = new Usuario(req.body);
    if (!usuario.validateLogin()) {
        return res.render('pages/login', { title: 'Login', paginaAtiva: 'login', error: usuario.errors.join('<br>') });
    }
    try {
        const user = await Usuario.findByEmail(usuario.data.email);
        if (!user) {
            return res.render('pages/login', { title: 'Login', paginaAtiva: 'login', error: 'Usuário não encontrado.' });
        }
        const senhaCorreta = await bcrypt.compare(usuario.data.senha, user.senha);
        if (!senhaCorreta) {
            return res.render('pages/login', { title: 'Login', paginaAtiva: 'login', error: 'Senha incorreta.' });
        }
        req.session.user = { id: user.id, nome: user.nome, email: user.email };
        res.redirect('/operacoes');
    } catch (err) {
        res.render('pages/login', { title: 'Login', paginaAtiva: 'login', error: err });
    }
}; 