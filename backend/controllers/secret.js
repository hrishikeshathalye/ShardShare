var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const sss = require("shamirs-secret-sharing")
const nodemailer = require('nodemailer');
var Secret = require("../models/secret.js");
const { PromiseProvider } = require("mongoose");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'seshardshare@gmail.com',
      pass: 'seproject123'
    }
});
  

const sendMail = async (participant, shard, id, owner, formData)=>{
    let subject = `New Key Shard - Secret Id ${id}`
    let body = `A new key shard was shared with you by ${owner}.\n
    Details:\n
    Shard : ${shard}\n
    Secret Name : ${formData.secret_name}\n
    Secret Id : ${id}\n
    n, k : ${formData.n}, ${formData.k}\n
    This key was shared with : `
    for(let i = 0; i < formData.participants.length; i++){
        if(i == formData.participants.length-1){
            body+=formData.participants[i];    
        }
        else{
            body+=formData.participants[i]+", ";
        }
    }
    const mailOptions = {
        from: 'seshardshare@gmail.com',
        to: participant,
        subject: subject,
        text: body
    }
    return new Promise((resolve, reject)=>{
        transporter.sendMail(mailOptions, function(err, data) {
            if(err) {
                console.log('Error Occured');
                reject(0);
            } else {
                console.log('Email sent successfully');
                resolve(1);
            }
        });
    })
    
}

exports.create = async (req, res) => {
    const formData = req.body;
    const secretName = formData.secret_name;
    let secret = formData.secret;
    const n = parseInt(formData.n);
    const k = parseInt(formData.k);
    const participants = formData.participants;
    token = req.headers.authorization.split(" ")[1];
    decodedData = jwt.decode(token);
    const secretCreator = decodedData.email;
    try {
        const result = await Secret.create({date:Date(), owner: secretCreator, sharedWith:participants, secretName: secretName});
        secret = Buffer.from(secret)
        const shares = sss.split(secret, { shares: n, threshold: k })
        for(let i = 0; i < shares.length; i++){
            ret = await sendMail(participants[i], shares[i].toString('hex'), result._id, secretCreator, formData);
            if(ret == 0){
                throw "Error Occured"
            }
        }
        res.status(200).json({result: "Success"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : "Something went wrong"});
    }
        // let temp = Buffer.from(hexString, "hex")
        // const recovered = sss.combine(shares.slice(0, 2))
        // console.log(recovered)
}
