require('dotenv').config()
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var recoveryRequest = require("../models/recoveryRequest.js");
const sss = require("secrets.js-grempe");
var Secret = require("../models/secret.js");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });
  

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  return transporter;
};

const setFooter = (sharedWith) => {
  let tmp = "This key was shared with : ";
  for (let i = 0; i < sharedWith.length; i++) {
    if (i == sharedWith.length - 1) {
      tmp += sharedWith[i];
    } else {
      tmp += sharedWith[i] + ", ";
    }
  }
  return tmp;
};

const sendMail = async (participant, shard, id, owner, formData) => {
  let transporter = await createTransporter();
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
    from: process.env.EMAIL,
    to: participant,
    subject: subject,
    text: body,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        reject(0);
      } else {
        resolve(1);
      }
    });
  });
};

exports.request = async (req, res) => {
  const secretId = req.body.secretId;
  console.log(secretId);
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const requester = decodedData.email;
  try {
    const result = await recoveryRequest.create({
      requester: requester,
      secretId: secretId,
    });
    let secret = await Secret.find({ _id: secretId });
    secret = secret[0];
    for (let i = 0; i < secret.sharedWith.length; i++) {
      let subject = `New Recovery Request - Secret Id ${secret._id}`;
      let footer = setFooter(secret.sharedWith);
      let body = `A new recovery request by ${requester}.\n
          Details:\n
          Secret Name : ${secret.secretName}\n
          Secret Id : ${secret._id}\n
          n, k : ${secret.n}, ${secret.k}\n
          ${footer}`;
      ret = await sendMail(subject, body, secret.sharedWith[i]);
    }
    res.status(200).json({ message: "Recovery Request Initiated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
};

exports.approve = async (req, res) => {
  const secretId = req.body.secretId;
  const requester = req.body.requester;
  const shard = req.body.shard;
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const approver = decodedData.email;
  try {
    await recoveryRequest.updateOne(
      { requester: requester, secretId: secretId },
      { $push: { approved: approver } }
    );
    const request = await recoveryRequest.findOne({
      requester: requester,
      secretId: secretId,
    });
    const secret = await Secret.findOne({ _id: secretId });
    let numAccepted = request.approved.length;
    let subject = `Request Approved! - Secret Id ${secret._id}`;
    let footer = setFooter(secret.sharedWith);
    let body = `${approver} shared their shard with you! So far, this request has been approved by ${request.approved.length} and rejected by ${request.declined.length}\n
        Details:\n
        Shard : ${shard}\n
        Secret Name : ${secret.secretName}\n
        Secret Id : ${secret._id}\n
        n, k : ${secret.n}, ${secret.k}\n
        ${footer}`;
    ret = await sendMail(subject, body, requester);
    res.status(200).json({ message: "Recovery Request Accepted!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
};

exports.reject = async (req, res) => {
  const secretId = req.body.secretId;
  const requester = req.body.requester;
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const decliner = decodedData.email;
  try {
    await recoveryRequest.updateOne(
      { requester: requester, secretId: secretId },
      { $push: { declined: decliner } }
    );
    const request = await recoveryRequest.findOne({
      requester: requester,
      secretId: secretId,
    });
    const secret = await Secret.findOne({
      _id: request.secretId,
    });
    let numRejected = request.declined.length;
    let numAccepted = request.approved.length;
    res.status(200).json({ message: "Recovery Request Rejected!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
};

exports.getRecoveryRequests = async (req, res) => {
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const secretCreator = decodedData.email;
  let secrets = [];
  requests = await recoveryRequest.find({});
  for (let i = 0; i < requests.length; i++) {
    var tmp = await Secret.find({
      _id: requests[i].secretId,
      sharedWith: secretCreator,
    });
    tmp = tmp[0];
    if (tmp === undefined) {
      continue;
    }
    let numRejected = requests[i].declined.length;
    let numAccepted = requests[i].approved.length;
    if (
      requests[i].declined.includes(secretCreator) ||
      requests[i].approved.includes(secretCreator)
    ) {
      continue;
    }
    if (numRejected > tmp.n - tmp.k || numAccepted >= tmp.k) {
      continue;
    } else {
      var requester = requests[i].requester;
      tmp = { ...tmp._doc, requester };
      console.log(tmp);
      secrets.push(tmp);
    }
  }
  res.status(200).json({ secret_array: secrets });
};

exports.combineShards = async (req, res) => {
  try {
    const shardArray = req.body.shardArray
    let recovered = sss.combine(shardArray);
    recovered = sss.hex2str(recovered);
    res.status(200).json({ combinedSecret: recovered, message:"Recombined Successfully!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
};

exports.deleteRequests = async (req, res) => {
  try {
    const secretId = req.body.secretId;
    await recoveryRequest.deleteMany({ secretId: secretId });
    res.status(200).json({ message: "Successfully deleted pending recovery requests" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some Error Occured" });
  }
};