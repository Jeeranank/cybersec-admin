const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const crypto = require("crypto-js");

const secretKey = 'lovemelovemycat';

const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.get('/user', async (req, res) => {
    const data = await prisma.user.findMany();

    data.map((row) => {
        // console.log('row ', row)
        row.password = (crypto.AES.decrypt(row.password.toString(), secretKey)).toString(crypto.enc.Utf8)
        return row;
    })

    res.json({
        message: 'okay',
        data 
    })
});

app.post('/user', async(req, res) => {
    console.log(req.body)
    const encode = crypto.AES.encrypt(req.body.password, secretKey);
    const response = await prisma.user.create({
        data: {
            username: req.body.username,
            password: encode.toString()
        }
    });
    if (response) {
        res.json({
            message: "add successfully"
        })
    }else {
        res.json({
            message: 'failed'
        })
    }
});

app.put('/user', async(req, res) => {
    console.log(req.body)
    const encode = crypto.AES.encrypt(req.body.password, secretKey);
    const response = await prisma.user.update({
        where: {
            id: req.body.id,
        },
        data: {
            username: req.body.username,
            password: encode.toString()
        }
    });
    if (response) {
        res.json({
            message: "updated successfully"
        })
    }else {
        res.json({
            message: 'failed'
        })
    }
});

app.delete('/user', async(req, res) => {
    console.log(req.body)
    const response = await prisma.user.delete({
        where: {
            id: req.body.id,
        }
    });
    if (response) {
        res.json({
            message: "delete successfully"
        })
    }else {
        res.json({
            message: 'failed'
        })
    }
});

app.get('/user/search', async (req, res) => {
    console.log(req.query.q);
    // const data = await prisma.user.findMany();
    // const data = await prisma.$queryRaw`select id, username from user where username like '${req.query.q}%' `
    res.json({
        message: 'okay',
        // data 
        sql: `select id, username from user where username like '${req.query.q}%' `
    })
});

app.listen(3000, () => {
    console.log(`server is running on port 3000`)
});