// VARIÁVEIS

const { Console } = require('console');
const { inserir } = require('./model/Usuarios');

let http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    session = require('express-session'),
    Usuarios = require('./model/Usuarios'),
    Posts = require('./model/Posts');


// SET / USE

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("images"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "topsecret",
    resave: true,
    saveUninitialized: true
}));

// GET
 
app.get('/', (req, res) => {
    res.redirect('/logar');
});

app.get('/index', (req, res) => {

    if(req.session && req.session.token) {
        res.render('index');
    } else {
        res.redirect('/logar');
    }

});

app.get('/perfil', async(req, res) => {

    if(req.session && req.session.token) {

        let posts;

        posts = await Posts.acharPost();

        res.render('perfil', {Usuario: req.session.token, Posts: posts});

    } else {

        req.session.destroy();
        res.redirect('/logar');
    }

});

app.get('/cadastrar', (req, res) => {
    res.render('cadastrar');
});

app.get('/logar', (req, res) => {

    if(req.session && req.session.token) {
        res.redirect('/perfil');
    } else {
        res.render('logar');
    }

});

app.get('/deslogar', (req, res) => {
    req.session.destroy();
    res.redirect('/logar');
});


// POST

app.post('/logar_post', async(req, res) => {

    let usuario = req.body.usuario;
    let senha = req.body.senha;

    if(usuario.length <= 5 && senha.length <= 5){
        res.render('logar', {MsgErro: "Usuário e senha tem que ter mais que 5 caracteres!"});
        return;
    }
    if(usuario.length <= 5) {
        res.render('logar', {MsgErro: "Usuário tem que ter mais que 5 caracteres!"});
        return;
    }
    if(senha.length <= 5) {
        res.render('logar', {MsgErro: "Senha tem que ter mais que 5 caracteres!"});
        return;
    }

    let ehCadastrado = await Usuarios.procurarUsuario(usuario);
    if(ehCadastrado.length == 0) {
        res.render('logar', {MsgErro: "Usuário não cadastrado!"});
        return;
    }
    if(!(ehCadastrado[0].senha == senha)) {
        res.render('logar', {MsgErro: "Senha incorreta!"});
        return;
    }
    
    req.session.token = ehCadastrado[0].usuario;
    req.session.save();

    res.redirect('/perfil');

});

app.post('/cadastrar_post', async(req, res) => {

    let email = req.body.email;
    let usuario = req.body.usuario;
    let senha = req.body.senha;

    let inserir = await Usuarios.inserir(email, usuario, senha, false);

    if(inserir == "insercaoRealizada"){

        res.redirect('/logar');

    } else if(inserir == "emailInvalido") {

        res.render('cadastrar', {MsgErro: "Email inválido!"});

    } else if(inserir == "usuarioInvalido") {

        res.render('cadastrar', {MsgErro: "Usuário tem que ter mais que 5 caracteres!"});
        
    } else if(inserir == "senhaInvalida") {
        
        res.render('cadastrar', {MsgErro: "Senha tem que ter mais que 5 caracteres!"});

    } else if(inserir == "emailCadastrado") {
        
        res.render('cadastrar', {MsgErro: "Email já cadastrado!"});

    } else if(inserir == "usuarioCadastrado") {
        
        res.render('cadastrar', {MsgErro: "Usuário já cadastrado!"});

    } 

});

app.post('/post_post', async (req, res) => {

    let post = req.body.post;

    let postar = await Posts.inserirPost(req.session.token, post);

    if(postar == 1) {

        res.render('perfil', {Usuario: req.session.token, PostErro: "O post deve ter pelo menos 6 caracteres!"});

    } else if(postar == 2){

        res.render('perfil', {Usuario: req.session.token, PostErro: "Apenas administradores podem postar!"});

    } else {

        let posts;

        posts = await Posts.acharPost();

        res.render('perfil', {Usuario: req.session.token, PostSucesso: "Post cadastrado com sucesso!", Posts: posts});

    }

});

// APP LISTEN

app.listen(3000, () => console.log('\n*** Aplicação está rodando, abrir o "site" localhost:3000 ***\n'));

//shibe API

/*let container = document.querySelector('.shibe-container');

document.querySelector('.btn-shibe').addEventListener('click', function(){
    container.removeChild(container.firstChild);
    axios.get('http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true')
        .then(function(resp) {
            var img = document.createElement('img');
            img.src = resp.data[0];
            container.appendChild(img);
        });
});*/