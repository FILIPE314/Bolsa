
const Operacao = require('../models/operacao')


exports.save = function (req, res) {
    if (!req.session.user) {
        return res.status(401).send('Usuário não autenticado.');
    }
    const operacao = new Operacao(req.body)
    operacao.validate()
    if (operacao.errors.length > 0) {
        // Recarrega a tela de nova operação com os erros
        return res.render('pages/nova_operacao', {
            title: 'Nova Operação',
            paginaAtiva: 'operacao',
            success: '',
            error: operacao.errors.join('<br>')
        });
    } else {
        const usuario_id = req.session.user.id;
        operacao.create(usuario_id)
            .then((result) => {
                req.session.success = 'Operação salva com sucesso!';
                res.redirect('/operacoes');
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    }
}

exports.list = async function (req, res) {
    try {
        const operacoesDB = await Operacao.readAllByUser(req.session.user.id);
        const operacoes = [];
        for (const op of operacoesDB) {
            operacoes.push({
                ...op,
                tipoDeOperacao: op.tipo_de_operacao,
                valorBruto: Number(op.valor_bruto),
                taxaB3: Number(op.taxa_b3),
                valorLiquido: Number(op.valor_liquido)
            });
        }
        res.render('pages/operacoes', {
            title: 'Operações',
            paginaAtiva: 'operacao',
            operacoes
        });
    } catch (err) {
        res.status(500).send('Erro ao buscar operações: ' + err);
    }
};

exports.edit = async function (req, res) {
    const id = req.params.id;
    const usuario_id = req.session.user.id;
    const op = await Operacao.findByIdAndUser(id, usuario_id);
    if (!op) {
        return res.status(404).send('Operação não encontrada.');
    }
    const operacao = {
        ...op,
        tipoDeOperacao: op.tipo_de_operacao,
        valorBruto: Number(op.valor_bruto),
        taxaB3: Number(op.taxa_b3),
        valorLiquido: Number(op.valor_liquido)
    };
    res.render('pages/editar_operacao', {
        title: 'Editar Operação',
        paginaAtiva: 'operacao',
        operacao,
        success: '',
        error: ''
    });
};

exports.update = async function (req, res) {
    const id = req.params.id;
    const usuario_id = req.session.user.id;
    const operacao = new Operacao(req.body);
    operacao.validate();
    if (operacao.errors.length > 0) {
        // Busca a operação específica do usuário
        const op = await Operacao.findByIdAndUser(id, usuario_id);
        if (!op) {
            return res.status(404).send('Operação não encontrada.');
        }
        return res.render('pages/editar_operacao', {
            title: 'Editar Operação',
            paginaAtiva: 'operacao',
            operacao: {
                ...op,
                tipoDeOperacao: op.tipo_de_operacao,
                valorBruto: Number(op.valor_bruto),
                taxaB3: Number(op.taxa_b3),
                valorLiquido: Number(op.valor_liquido)
            },
            success: '',
            error: operacao.errors.join('<br>')
        });
    }
    await operacao.update(id, usuario_id);
    req.session.success = 'Operação atualizada com sucesso!';
    res.redirect('/operacoes');
};

exports.delete = async function (req, res) {
    const id = req.params.id;
    const usuario_id = req.session.user.id;
    // Verifica se a operação pertence ao usuário
    const op = await Operacao.findByIdAndUser(id, usuario_id);
    if (!op) {
        return res.status(404).send('Operação não encontrada.');
    }
    await Operacao.delete(id, usuario_id);
    req.session.success = 'Operação excluída com sucesso!';
    res.redirect('/operacoes');
};

exports.filterByAtivo = async function (req, res) {
    const usuario_id = req.session.user.id;
    const ativo = req.params.ativo;
    const operacoesDB = await Operacao.readAllByUserAndAtivo(usuario_id, ativo);
    const operacoes = [];
    for (const op of operacoesDB) {
        operacoes.push({
            ...op,
            tipoDeOperacao: op.tipo_de_operacao,
            valorBruto: Number(op.valor_bruto),
            taxaB3: Number(op.taxa_b3),
            valorLiquido: Number(op.valor_liquido)
        });
    }
    res.render('pages/operacoes', {
        title: 'Operações',
        paginaAtiva: 'operacao',
        operacoes
    });
};