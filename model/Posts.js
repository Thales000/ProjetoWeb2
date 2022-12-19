const MongoClient = require('mongodb').MongoClient;
const MongoUrl = "mongodb+srv://Thales000:xmongodbx321@clusterprojetoweb.tegkhw0.mongodb.net/?retryWrites=true&w=majority";

module.exports = class Posts{

    static async acharPost() {

        const conn = await MongoClient.connect(MongoUrl);
        const db = conn.db().collection('Posts');

        let aux = await db.find().toArray();

        conn.close();
        return aux;
    }

    static async inserirPost(usuario, post){

        let aux;

        const conn = await MongoClient.connect(MongoUrl);
        const db = conn.db().collection('Posts');
        const db2 = conn.db().collection('Usuarios');

        aux = await db2.find({usuario: usuario}).toArray();

        let dataHora = new Date().toLocaleString();

        if(post.length <= 5) {
            conn.close()
            return 1;
        }
        if(aux[0].admin == false){
            conn.close();
            return 2;
        }

        await db.insertOne({
            usuario: usuario,
            conteudo: post,
            dataHora: dataHora
        });

        conn.close();
        return 0;
    };

}