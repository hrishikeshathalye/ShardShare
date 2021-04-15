var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const sss = require("shamirs-secret-sharing");
const nodemailer = require("nodemailer");
var Secret = require("../models/secret.js");
const { PromiseProvider } = require("mongoose");
var recoveryRequest = require("../models/recoveryRequest.js");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "seshardshare@gmail.com",
    pass: "seproject123",
  },
});

const sendMail = async (participant, shard, id, owner, formData) => {
  let subject = `New Key Shard - Secret Id ${id}`;
  let body = `A new key shard was shared with you by ${owner}.\n
    Details:\n
    Shard : ${shard}\n
    Secret Name : ${formData.secret_name}\n
    Secret Id : ${id}\n
    n, k : ${formData.n}, ${formData.k}\n
    This key was shared with : `;
  for (let i = 0; i < formData.participants.length; i++) {
    if (i == formData.participants.length - 1) {
      body += formData.participants[i];
    } else {
      body += formData.participants[i] + ", ";
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

exports.create = async (req, res) => {
  const formData = req.body;
  const secretName = formData.secret_name;
  let secret = formData.secret;
  const n = parseInt(formData.n);
  const k = parseInt(formData.k);
  if(formData._id === ""){
    id = undefined;
  }
  else{
    id = formData._id;
  }
  const participants = formData.participants;
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const secretCreator = decodedData.email;
  try {
    let result;
    if(id === undefined){
      result = await Secret.create({
        date: Date(),
        owner: secretCreator,
        sharedWith: participants,
        secretName: secretName,
        n: n,
        k: k
      });
    }else{
      result = await Secret.findOneAndUpdate({_id: id}, 
      {
        date: Date(),
        sharedWith: participants,
        secretName: secretName,
        n: n,
        k: k
      }, 
      {
        new: true
      });
    }
    secret = Buffer.from(secret);
    const shares = sss.split(secret, { shares: n, threshold: k });
    for (let i = 0; i < shares.length; i++) {
      ret = await sendMail(
        participants[i],
        shares[i].toString("hex"),
        result._id,
        secretCreator,
        formData
      );
      if (ret == 0) {
        throw "Error Occured";
      }
    }
    res.status(200).json({ result: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
  // let temp = Buffer.from(hexString, "hex")
  // const recovered = sss.combine(shares.slice(0, 2))
  // console.log(recovered)
};

exports.get_secrets_shared_by_user = async (req, res) => {
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const secretCreator = decodedData.email;
  //console.log(secretCreator);
  secrets = await Secret.find({ owner: secretCreator });
  res.status(200).json({ secret_array: secrets });
};

exports.get_secrets_shared_with_user = async (req, res) => {
  var tmp;
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const secretCreator = decodedData.email;
  //console.log(secretCreator);
  all_secrets = [];
  secrets = await Secret.find({ sharedWith: secretCreator });
  for (var i = 0; i < secrets.length; i++) {
    s_tmp = { ...secrets[i]._doc };
    tmp = await recoveryRequest.find({ secretId: secrets[i]._id });
    if (tmp.length === 0) {
      console.log(tmp);
      s_tmp["state"] = "noRequest";
    } else {
      tmp = tmp[0];
      let numAccepted = tmp.approved.length;
      if (tmp.requester === secretCreator) {
        if (numAccepted >= secrets[i].k) {
          s_tmp["state"] = "accepted";
        } else {
          s_tmp["state"] = "pending";
        }
      }
      // else{
      //   s_tmp["state"] = "noRequest";
      // }
    }
    // console.log(tmp);
    all_secrets.push(s_tmp);
  }
  res.status(200).json({ secret_array: all_secrets });
};
