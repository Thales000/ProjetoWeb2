const MongoClient = require('mongodb').MongoClient;
const MongoUrl = "mongodb+srv://Thales000:xmongodbx321@clusterprojetoweb.tegkhw0.mongodb.net/?retryWrites=true&w=majority";
const EmailValidator = require("email-validator");

module.exports = class Usuarios{

    static async procurarUsuario(usuario){

        let aux;
        const conn = await MongoClient.connect(MongoUrl);
        const db = conn.db().collection('Usuarios');

        aux = await db.find({usuario: usuario}).toArray();

        conn.close();

        return aux;
    }

    static async procurarEmail(email){

        let aux;
        const conn = await MongoClient.connect(MongoUrl);
        const db = conn.db().collection('Usuarios');

        aux = await db.find({email: email}).toArray();

        conn.close();

        return aux;
    }

    static async inserir(email, usuario, senha, admin = false) {

        let aux2;
        
        if(!EmailValidator.validate(email)){
            return "emailInvalido";
        }
        if(usuario.length <= 5){
            return "usuarioInvalido";
        }
        if(senha.length <= 5){
            return "senhaInvalida";
        }

        const conn = await MongoClient.connect(MongoUrl);
        const db = conn.db().collection('Usuarios');

        aux2 = await this.procurarEmail(email);
        
        if(aux2.length >= 1) {
            conn.close();
            return "emailCadastrado";
        }

        aux2 = await this.procurarUsuario(usuario);
        if(aux2.length >= 1) {
            conn.close();
            return "usuarioCadastrado";
        }
        
        await db.insertOne({
            email: email,
            usuario: usuario,
            senha: senha,
            admin: admin
        });

        conn.close();
        return "insercaoRealizada";
    };

}
