var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var recoveryRequest = require("../models/recoveryRequest.js");
const sss = require("shamirs-secret-sharing");
var Secret = require("../models/secret.js");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "seshardshare@gmail.com",
    pass: "seproject123",
  },
});

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

const sendMail = async (subject, body, participant) => {
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
    res.status(200).json({ result: "Success" });
    // res.status(200).json({result: existingUser, token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
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
    // if (numAccepted >= secret.k) {
    //   await recoveryRequest.deleteOne({ _id: request._id });
    // }
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
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
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
    // if (numRejected > secret.n - secret.k) {
    //   await recoveryRequest.deleteOne({ _id: request._id });
    // }
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getRecoveryRequests = async (req, res) => {
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const secretCreator = decodedData.email;
  let secrets = [];
  requests = await recoveryRequest.find({});
  // console.log(requests);
  for (let i = 0; i < requests.length; i++) {
    var tmp = await Secret.find({
      _id: requests[i].secretId,
      sharedWith: secretCreator,
    });
    tmp = tmp[0];
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
      // if (numAccepted >= tmp.k) {
      //   tmp["state"] = "accepted";
      // } else {
      //   tmp["state"] = "pending";
      // }
      console.log(tmp);
      secrets.push(tmp);
    }
  }
  // console.log(secrets);
  res.status(200).json({ secret_array: secrets });
};

exports.combineShards = async (req, res) => {
  try {
    const shardArray = req.body.shardArray;
    for (let i = 0; i < shardArray.length; i++) {
      shardArray[i] = Buffer.from(shardArray[i], "hex");
    }
    let recovered = await sss.combine(shardArray);
    recovered = recovered.toString();
    res.status(200).json({ combinedSecret: recovered });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some Error Occured" });
  }
};
