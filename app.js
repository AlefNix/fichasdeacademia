const express = require('express');
const nodemailer = require('nodemailer');
const Excel = require('exceljs');
const app = express();
const path = require("path");
const router = express.Router();
const cors = require('cors');
const fs = require("fs").promises;
const fs1 = require("fs");
//const sessionStorage = require('sessionstorage-for-nodejs');


const port = process.env.PORT || 3333;

app.use(express.static(path.join(__dirname, 'public')));

/*let rawdata = fs1.readFileSync('users.json');
let users = JSON.parse(rawdata);


app.post("/send", async (req,res) =>{
    const filename = "users.json";
    
    await fs.writeFile(filename, JSON.stringify(data));

    const user = data;
    const file = await fs.readFile(filename);
    users = JSON.parse(file);
    users.push(user);
    await fs.writeFile(filename, JSON.stringify(users, null, 4));
    console.log(users)
})
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/nome",async (req,res)=>{ 
    console.log(req.body.nome);
    nomealuno = req.body.nome;
    console.log(typeof nomealuno);
})

app.post("/send", async (req,res) => {
    users = req.body;
    const filename = 'Ficha.xlsx';
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Ficha');
worksheet.columns = [
        {header: 'Exercício', key: "exercicio"},
        {header: 'Séries', key: "series"},
        {header: 'Repetições', key: "repeticoes"},
        {header: 'Peso', key: "peso"},
        {header: 'Interevalo', key: "intervalo"},
    ];


    users.forEach((e) => {
        worksheet.addRow(e);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9b8fe9c56dbb80",
    pass: "bd0bed9e68eabf"
  }
    });
const mailOptions = {
        from: 'fichamapacademia@outlook.com',
        to: ['fichamapacademia@outlook.com'],
        subject: `Ficha do ${nomealuno}`,
        attachments: [
            {
                filename,
                content: buffer,
                contentType:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        ],
    };
    await transporter.sendMail(mailOptions);
})

app.use(cors())

app.listen(port, ()=> console.log(`Servidor iniciado em localhost:${port}`))
