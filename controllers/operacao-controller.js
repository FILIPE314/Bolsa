
const Operacao = require('../models/operacao')


exports.save = function (req, res) {
    if (!req.session.user) {
        req.flash('error', 'Usuário não autenticado.');
        return res.redirect('/login');
    }
    const operacao = new Operacao(req.body)
    operacao.validate()
    if (operacao.errors.length > 0) {
        req.flash('error', operacao.errors.join('<br>'));
        return res.redirect('/nova_operacao');
    }
    const usuario_id = req.session.user.id;
    operacao.create(usuario_id)
        .then((result) => {
            req.flash('success', 'Operação salva com sucesso!');
            res.redirect('/operacoes');
        })
        .catch((error) => {
            req.flash('error', 'Erro ao salvar operação: ' + error);
            res.redirect('/nova_operacao');
        })
}