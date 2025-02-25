const { Prisma } = require("@prisma/client");
const express = require("express");
const { PrismaClient} = require("@prisma/client");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();

app.get('/',(req,res) => {
     res.send('Hello world');
});

//ดึงข้อมูลผู้ใช้
app.get('/user',async(req,res) => {
    const data = await prisma.user.findMany({
        select:{
            id:true,
            username:true
        }
    });
   
    res.json({
        message : 'ok',
        data 
    });
});
//สร้างUser
app.post('/user', async(req,res) => {
    console.log(req.body);
    //const response = await prisma.user.create(req.body)
    const response = await prisma.user.create({
       data: {
            username:req.body.username,
            password:req.body.password
        }
    })
    res.json({
        message : 'add data successfully',
    });
});
//แก้ไขข้อมูล
app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                username: req.body.username,
                password: req.body.password
            }
        });
        res.json({ message: 'User updated successfully', data: response });
    } catch (error) {
        res.status(400).json({ message: 'error', error });
    }
});
// ลบข้อมูลผู้ใช้
app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: Number(id) } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'error', error });
    }
});


app.listen(3000 ,()=>{
    console.log('server is running on port 3000');
});