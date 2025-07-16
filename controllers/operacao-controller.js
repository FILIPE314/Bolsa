
const Operacao = require('../models/operacao')


exports.save = function (req, res) {
    if (!req.session.user) {
        req.flash('error', 'Usuário não autenticado.');
        return res.redirect('/login');
    }
    /* Criar uma nova instância da classe Operacao com os dados recebidos do corpo da requisição */
    const operacao = new Operacao(req.body)
    /* Validar e realizar as conversoes necessarias nos dados da classe */
    operacao.validate()
    if (operacao.errors.length > 0) {
        req.flash('error', operacao.errors.join('<br>'));
        return res.redirect('/nova_operacao');
    } else {
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
}