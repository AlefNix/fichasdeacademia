const express = require('express');
const nodemailer = require('nodemailer');
const Excel = require('exceljs');
const app = express();
const path = require("path");
const router = express.Router();
const cors = require('cors');
//var LocalStorage = require('node-localstorage').LocalStorage;
//  localStorage = new LocalStorage('./scratch');]
const fs = require("fs").promises;
const fs1 = require("fs");


const port = process.env.PORT || 3333;

app.use(express.static(path.join(__dirname, 'public')));

let rawdata = fs1.readFileSync('users.json');
let users = JSON.parse(rawdata);

users = [];

async function teste(){
    const filename = "users.json";
    
    await fs.writeFile(filename, JSON.stringify(users));
  
    const user = {
        "exercicio":"Banquinho1","series":"4","repeticoes":"20","peso":"10","intervalo":"60s"
    };
    const file = await fs.readFile(filename);
    users = JSON.parse(file);
    users.push(user);
    await fs.writeFile(filename, JSON.stringify(users, null, 4));
    console.log(users)
}
teste();
app.post("/", async (req,res) => {
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
        host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'erwin11@ethereal.email',
        pass: '1v1ERBH7ay9rtCkzMN'
    }
    });
const mailOptions = {
        from: 'erwin11@ethereal.email',
        to: ['erwin11@ethereal.email'],
        subject: `Ficha`,
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

app.use(cors());

app.listen(port, ()=> console.log(`Servidor iniciado em localhost:${port}`));