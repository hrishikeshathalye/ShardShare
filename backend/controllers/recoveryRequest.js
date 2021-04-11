var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
var recoveryRequest = require("../models/recoveryRequest.js")
var Secret = require("../models/secret.js");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "seshardshare@gmail.com",
      pass: "seproject123",
    },
  });
  
  const sendMail = async (participant, requester, formData) => {
    let subject = `New Recovery Request - Secret Id ${formData._id}`;
    let body = `A new recovery request by ${requester}.\n
      Details:\n
      Secret Name : ${formData.secretName}\n
      Secret Id : ${formData._id}\n
      n, k : ${formData.n}, ${formData.k}\n
      This key was shared with : `;
    for (let i = 0; i < formData.sharedWith.length; i++) {
      if (i == formData.sharedWith.length - 1) {
        body += formData.sharedWith[i];
      } else {
        body += formData.sharedWith[i] + ", ";
      }
    }
    const mailOptions = {
      from: "seshardshare@gmail.com",
      to: participant,
      subject: subject,
      text: body,
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error Occured");
          reject(0);
        } else {
          console.log("Email sent successfully");
          resolve(1);
        }
      });
    });
};  

exports.request = async (req, res) => {
    const secretId = req.params.secretId;
    console.log(secretId);
    token = req.headers.authorization.split(" ")[1];
    decodedData = jwt.decode(token);
    const requester = decodedData.email;
    try {
        const result = await recoveryRequest.create({
            requester: requester,
            secretId: secretId,
        });
        let secret = await Secret.find({ _id: secretId})
        secret = secret[0]
        for(let i = 0; i < secret.sharedWith.length; i++){
          ret = await sendMail(
            secret.sharedWith[i],
            requester,
            secret
          );
        }
        res.status(200).json({ result: "Success" });
        // res.status(200).json({result: existingUser, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : "Something went wrong"});
    }
}

exports.approve = async (req, res) => {
    const secretId = req.params.secretId;
    const {email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            res.status(404).json({message : "User does not exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn:"1h"});

        res.status(200).json({result: existingUser, token});
    } catch (error) {
        res.status(500).json({ message : "Something went wrong"});
    }
}

exports.reject = async (req, res) => {
    const secretId = req.params.secretId;
    const {email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            res.status(404).json({message : "User does not exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn:"1h"});

        res.status(200).json({result: existingUser, token});
    } catch (error) {
        res.status(500).json({ message : "Something went wrong"});
    }
}

exports.getRecoveryRequests = async (req, res)=>{
    token = req.headers.authorization.split(" ")[1];
    decodedData = jwt.decode(token);
    const secretCreator = decodedData.email;
    let secrets = []
    requests = await recoveryRequest.find({})
    console.log(requests);
    for(let i = 0; i < requests.length; i++){
      let tmp  = await Secret.find({ _id: requests[i].secretId, sharedWith:secretCreator  })
      tmp = tmp[0]
      //condition
      let numRejected = requests[i].numRejected;
      let numAccepted = requests[i].numAccepted;
      if(numRejected > tmp.n-tmp.k){
        await recoveryRequest.deleteOne({_id: requests[i]._id})
      }
      else{
        if(numAccepted >= tmp.k){
          tmp.state = "accepted"
        }
        else{
          tmp.state = "pending"
        }
        secrets.push(tmp);
      }
    }
    res.status(200).json({ secret_array: secrets });
}