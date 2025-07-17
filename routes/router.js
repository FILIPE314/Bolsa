const express = require('express')
const router = express.Router()

const operacaoController = require('../controllers/operacao-controller')
const authController = require('../controllers/auth-controller')
const Operacao = require('../models/operacao')


router.use(require('../middleware/setLocals'));

// Middleware para mensagens flash de sucesso/erro
router.use(function(req, res, next) {
  res.locals.success = req.session.success || '';
  res.locals.error = req.session.error || '';
  delete req.session.success;
  delete req.session.error;
  next();
});

/* ----- funções de roteamento ----- */
router.get('/', function (req, res) {
  res.render('pages/home',
    {
      title: 'Home',
      paginaAtiva: 'home'
    }
  );
});

router.get('/nova_operacao', function (req, res) {
  res.render('pages/nova_operacao',
    {
      title: 'Nova Operação',
      paginaAtiva: 'operacao'
    }
  );
})

router.get('/operacoes', require('../middleware/requireLogin'), operacaoController.list)

router.get('/operacoes/:id/editar', require('../middleware/requireLogin'), operacaoController.edit)

// Rota para atualizar operação
router.post('/operacoes/:id/editar', require('../middleware/requireLogin'), operacaoController.update)

// Rota para excluir operação
router.post('/operacoes/:id/excluir', require('../middleware/requireLogin'), operacaoController.delete)

// Rota para filtrar operações por ativo
router.get('/operacoes/ativo/:ativo', require('../middleware/requireLogin'), operacaoController.filterByAtivo)

router.get('/login', function (req, res) {
  res.render('pages/login', {
    title: 'Login',
    paginaAtiva: ''
  });
});

router.get('/register', function (req, res) {
  res.render('pages/register', {
    title: 'Registro',
    paginaAtiva: ''
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.post('/salvar_operacao', require('../middleware/requireLogin'), operacaoController.save)
router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/contato', function (req, res) {
  res.render('pages/contato', {
    title: 'Contato',
    paginaAtiva: 'contato'
  });
});

module.exports = router