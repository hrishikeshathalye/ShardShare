var jwt = require("jsonwebtoken");
const sss = require("secrets.js-grempe")
const nodemailer = require("nodemailer");
var Secret = require("../models/secret.js");
var recoveryRequest = require("../models/recoveryRequest.js");

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

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
        reject(0);
      } else {
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
  const participants = formData.participants;
  if(isNaN(n) || isNaN(k)){
    return res.status(500).json({ message: "Either n or k is not a number, please check again" });
  }
  if (n < k) {
    return res.status(500).json({ message: "n cannot be less than k" });
  }
  for (let i = 0; i < participants.length; i++) {
    if (validateEmail(participants[i]) === false) {
      return res.status(500).json({
        message: "one of the emails isn't proper, please check and retry",
      });
    }
  }
  if (formData._id === "") {
    id = undefined;
  } else {
    id = formData._id;
  }
  token = req.headers.authorization.split(" ")[1];
  decodedData = jwt.decode(token);
  const secretCreator = decodedData.email;
  try {
    let result;
    if (id === undefined) {
      result = await Secret.create({
        date: Date(),
        owner: secretCreator,
        sharedWith: participants,
        secretName: secretName,
        n: n,
        k: k,
      });
    } else {
      result = await Secret.findOneAndUpdate(
        { _id: id },
        {
          date: Date(),
          sharedWith: participants,
          secretName: secretName,
          n: n,
          k: k,
        },
        {
          new: true,
        }
      );
    }
    let secretHex = sss.str2hex(secret);
    const shares = sss.share(secretHex, n, k);
    for (let i = 0; i < shares.length; i++) {
      ret = await sendMail(
        participants[i],
        shares[i],
        result._id,
        secretCreator,
        formData
      );
      if (ret == 0) {
        throw "Error Occured";
      }
    }
    return res.status(200).json({
      message: "Sending emails successful! The secret has been shared.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again." });
  }
};

exports.get_secrets_shared_by_user = async (req, res) => {
  try {
    token = req.headers.authorization.split(" ")[1];
    decodedData = jwt.decode(token);
    const secretCreator = decodedData.email;
    secrets = await Secret.find({ owner: secretCreator });
    return res.status(200).json({ secret_array: secrets });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again." });
  }
};

exports.get_secrets_shared_with_user = async (req, res) => {
  try {
    var tmp;
    token = req.headers.authorization.split(" ")[1];
    decodedData = jwt.decode(token);
    const secretCreator = decodedData.email;
    all_secrets = [];
    secrets = await Secret.find({ sharedWith: secretCreator });
    for (var i = 0; i < secrets.length; i++) {
      s_tmp = { ...secrets[i]._doc };
      tmp = await recoveryRequest.find({ secretId: secrets[i]._id });
      if (tmp.length === 0) {
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
      }
      all_secrets.push(s_tmp);
    }
    res.status(200).json({ secret_array: all_secrets });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again." });
  }
};
