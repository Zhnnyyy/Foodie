require("dotenv").config();
const nodemailer = require("nodemailer");
const database = require("../database/connection");
const db = new database();
const crypto = require("crypto");
class User {
  async _executeQuery(que, params) {
    try {
      const result = await db.query(que, params);
      return { Error: false, data: result.rows };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async sendMail(body) {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });
      let mailOptions = {
        to: body.email,
        from: "Foodie",
        subject: body.subject,
        text: `Your verification code: ${body.code}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
        }
        .email-header h1 {
            margin: 0;
            color: #333;
        }
        .email-body {
            text-align: center;
        }
        .verification-code {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            background-color: #e9ecef;
            padding: 10px;
            border-radius: 4px;
            display: inline-block;
        }
        .email-footer {
            text-align: center;
            padding-top: 20px;
            color: #6c757d;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <h1>Verification Code</h1>
        </div>
        <div class="email-body">
            <p>Hello,</p>
            <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
            <div class="verification-code">${body.code}</div>
        </div>
        <div class="email-footer">
            <p>If you did not request this code, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`,
      };

      transporter.sendMail(mailOptions, (err, res) => {
        if (err) reject({ Error: true, msg: err.message });
        else resolve({ Error: false, msg: res.response });
      });
    });
  }

  encrypt(inputString) {
    const hash = crypto.createHash("sha256");
    hash.update(inputString);
    const encryptedString = hash.digest("hex");
    return encryptedString;
  }

  async validateUser(data) {
    return await this._executeQuery(
      `select count(*) as result from users where email=$1`,
      [data.email]
    );
  }

  async createUser(data) {
    return await this._executeQuery(
      `insert into users(name,email,password) values($1,$2,$3)`,
      [data.name, data.email, this.encrypt(data.password)]
    );
  }

  async loginUser(data) {
    return await this._executeQuery(
      `select id from users where email=$1 and password=$2`,
      [data.email, this.encrypt(data.password)]
    );
  }

  async userPosts(data) {
    return await this._executeQuery(`select * from recipe where user_id=$1`, [
      data.userID,
    ]);
  }

  async userFavorites(data) {
    return await this._executeQuery(
      `select recipe.id, recipe.title, recipe.ingredients, recipe.instructions, image from recipe inner join likes on likes.recipe_id = recipe.id where likes.user_id=$1`,
      [data.userID]
    );
  }
}
module.exports = User;
