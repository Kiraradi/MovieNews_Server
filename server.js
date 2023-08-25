const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const app = new Koa();
app.use(koaBody({
    urlencoded: true,
    multipart: true,
}));

const news = [
    {
        title:'Опасная игра',
        img:'',
        description:'Актер, сыгравший главную роль в кинокомедии, был задержан полицией за нападение на своего коллегу по съемочной площадке.'
    },
    {
        title:'Реальность или монтаж',
        img:'',
        description:"Режиссер нового фильма о супергероях был уволен после того, как его команда начала снимать сцены с использованием настоящих суперспособностей."
    },
    {
        title:'Предсказание во сне',
        img:'',
        description:"Актриса, которая должна была сыграть главную роль в фильме ужасов, отказалась от участия в съемках после того, как ей приснился кошмар о том, что она превращается в зомби."
    },
    
]

app.use((ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
        return next();
    }

    const headers = { 'Access-Control-Allow-Origin': '*', };

    if (ctx.request.method !== 'OPTIONS') {
        ctx.response.set({ ...headers });
        try {
            return next();
        } catch (e) {
            e.headers = { ...e.headers, ...headers };
            throw e;
        }
    }

    if (ctx.request.get('Access-Control-Request-Method')) {
        ctx.response.set({
            ...headers,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
        });

        if (ctx.request.get('Access-Control-Request-Headers')) {
            ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
        }

        ctx.response.status = 204;
    }

});

app.use((ctx, next) => {
    if(ctx.request.method !== 'GET') {
        next();
        return;
    }
    console.log(ctx.request.query.method);
    if(ctx.request.query.method === 'allNews') {
        ctx.response.status = 200;
        ctx.response.set('Access-Control-Allow-Origin', '*');
        ctx.response.body = JSON.stringify(news);
    }

    next();
});


const port = process.env.PORT || 7077;
const server = http.createServer(app.callback());

server.listen(port, (err) => {
    if (err) {
        console.log(err);

        return
    }

    console.log('server is listening to ' + port);
});