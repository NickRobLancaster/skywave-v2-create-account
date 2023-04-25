const base64Img = require("base64-img");
const fs = require("fs");

const axios = require('axios');

const express = require("express");
const cors = require("cors");

const dotenv = require('dotenv')
dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.APP_PORT

const apiBaseUrl = process.env.NODE_ENV === 'production'
? process.env.PRODUCTION_API_URL
: process.env.LOCALHOST_URL;

app.post("/signup", async (req, res) => {
  try {

    const clientData = req.body;

    // Function that generates unique id's to append to the end of each image to make them unique
    const generateUUID = () => {

      let uuid = "";
      for (let i = 0; i < 32; i++) {
        uuid += Math.floor(Math.random() * 16).toString(16);
      }
      uuid =
        uuid.substring(0, 8) +
        "-" +
        uuid.substring(8, 4) +
        "-4" +
        uuid.substring(12, 3) +
        "-" +
        (Math.floor(Math.random() * 4) + 8).toString(16) +
        uuid.substring(15, 3) +
        "-" +
        Math.floor(Math.random() * 16).toString(16) +
        uuid.substring(18, 12);
      return uuid;
    };  
    
    // An empty array to put all the html elements
    let htmlEls = [];

    // Loops over the objects entries to create pairs of html elements for data-point and data
    Object.entries(clientData).forEach((pair) => {
      //generate nice email body template
      const [point, data] = [...pair];
      let string1 = "<tr>" + `<td>${point}</td>`;
      let string2;
      if (point === "signatureData") {
        string2 = `<td><img src=\"${data}\"></td>` + "</tr>";
      } else {
        string2 = `<td>${data}</td>` + "</tr>";
      }
      let htmlRow = string1 + string2;
      htmlEls.push(htmlRow);
    });

    // Joins all the elements together into one long html string
    const companyHtmlBody = htmlEls.join("");

    // Skywave's Email Subject
    const composedSubject = `V2 Create Account | ${clientData.companyName} | ${clientData.firstName} ${clientData.lastName}`;

    // Skywave's html email template w/ merge tags
    const emailCompanyBody = `<table>
    <thead>
      <tr>
        <th>Data Point</th>
        <th>Data</th>
      </tr>
    </thead>
    <tbody>
    ${companyHtmlBody}
    <tbody>
    <table>`;

    // The client's html email template w/ merge tags
    const emailClientBody = `<!DOCTYPE html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

  <head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
  <!--<![endif]-->
  <style>
  * {
  box-sizing: border-box;
  }

  body {
  margin: 0;
  padding: 0;
  }

  a[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: inherit !important;
  }

  #MessageViewBody a {
  color: inherit;
  text-decoration: none;
  }

  p {
  line-height: inherit
  }

  .desktop_hide,
  .desktop_hide table {
  mso-hide: all;
  display: none;
  max-height: 0px;
  overflow: hidden;
  }

  .menu_block.desktop_hide .menu-links span {
  mso-hide: all;
  }

  @media (max-width:920px) {
  .row-content {
  width: 100% !important;
  }

  .mobile_hide {
  display: none;
  }

  .stack .column {
  width: 100%;
  display: block;
  }

  .mobile_hide {
  min-height: 0;
  max-height: 0;
  max-width: 0;
  overflow: hidden;
  font-size: 0px;
  }

  .desktop_hide,
  .desktop_hide table {
  display: table !important;
  max-height: none !important;
  }
  }
  </style>
  </head>

  <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
  <tbody>
  <tr>
  <td>
    <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tbody>
        <tr>
          <td>
            <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #005fa3; color: #000000; width: 900px;" width="900">
              <tbody>
                <tr>
                  <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 15px; vertical-align: top; padding-top: 15px; padding-bottom: 15px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                    <table class="menu_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tr>
                        <td class="pad" style="color:#ffffff;font-family:inherit;font-size:14px;text-align:left;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td class="alignment" style="text-align:left;font-size:0px;">
                                <div class="menu-links">
                                  <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style=""><tr style="text-align:left;"><![endif]-->
                                  <!--[if mso]><td style="padding-top:5px;padding-right:5px;padding-bottom:5px;padding-left:5px"><![endif]--><a href="https://skywave.app/" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:5px;display:inline-block;color:#ffffff;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;text-decoration:none;letter-spacing:normal;">Support Chat</a>
                                  <!--[if mso]></td><![endif]-->
                                  <!--[if mso]></tr></table><![endif]-->
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tbody>
        <tr>
          <td>
            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #d3d3d3; color: #000000; width: 900px;" width="900">
              <tbody>
                <tr>
                  <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                    <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tr>
                        <td class="pad" style="padding-bottom:45px;padding-top:45px;width:100%;padding-right:0px;padding-left:0px;">
                          <div class="alignment" align="center" style="line-height:10px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/549174_530331/skywaveLogo.png" style="display: block; height: auto; border: 0; width: 301px; max-width: 100%;" width="301"></div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tbody>
        <tr>
          <td>
            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 900px;" width="900">
              <tbody>
                <tr>
                  <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                    <table class="heading_block block-1" width="100%" border="0" cellpadding="35" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                      <tr>
                        <td class="pad">
                          <h3 style="margin: 0; color: #2f2f2f; font-size: 24px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Your Skywave CRM Account Has Been Created</span></h3>
                        </td>
                      </tr>
                    </table>
                    <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                      <tr>
                        <td class="pad">
                          <div style="color:#101112;font-size:16px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
                            <p style="margin: 0; margin-bottom: 16px;">Hi <strong>${clientData.firstName}</strong>,</p>
                            <p style="margin: 0; margin-bottom: 16px;">&nbsp;</p>
                            <p style="margin: 0;">Your Skywave CRM Account is ready for Login. Please your custom url below:</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <table class="paragraph_block block-3" width="100%" border="0" cellpadding="55" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                      <tr>
                        <td class="pad">
                          <div style="color:#101112;font-size:16px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
                            <p style="margin: 0;"><strong>You're Custom Login URL:</strong> <a href="${clientData.domainPrefix}.crm.skywave.app" target="_blank" style="text-decoration: underline; color: #3b3cee;" rel="noopener">${clientData.domainPrefix}.crm.skywave.app</a></p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <table class="paragraph_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                      <tr>
                        <td class="pad">
                          <div style="color:#101112;font-size:16px;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;font-weight:400;line-height:120%;text-align:left;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
                            <p style="margin: 0;">If you have any questions or problems getting started, please reach out to us on our Support Chat at <a href="https://skywave.app/" target="_blank" style="text-decoration: underline; color: #8a3c90;" rel="noopener">Skywave.app</a></p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tbody>
        <tr>
          <td>
            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #d3d3d3; color: #000000; width: 900px;" width="900">
              <tbody>
                <tr>
                  <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                    <table class="text_block block-1" width="100%" border="0" cellpadding="45" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                      <tr>
                        <td class="pad">
                          <div style="font-family: sans-serif">
                            <div class style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                              <p style="margin: 0; mso-line-height-alt: 16.8px;"><span style="color:#000000;"><em><span style="font-size:12px;">The content of this email is confidential and intended for the recipient specified in the message only. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.</span></em></span></p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tbody>
        <tr>
          <td>
            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #005fa3; color: #000000; width: 900px;" width="900">
              <tbody>
                <tr>
                  <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                    <table class="text_block block-1" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                      <tr>
                        <td class="pad">
                          <div style="font-family: sans-serif">
                            <div class style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 16.8px; color: #393d47; line-height: 1.2;">
                              <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="color:#ffffff;">© 2021 Skywave CRM. All rights reserved.</span></p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
  </tr>
  </tbody>
  </table><!-- End -->
  </body>

    </html>`;

    // SendInBlue - Skywave Body Obj
    const toCompanyBody = {
      sender: {
        name: "Skywave V2 Sign Up",
        email: "v2signup@skywave.app",
      },
      to: [
        {
          email: "onboarding@skywave.app",
          name: "Skywave CS",
        },
      ],
      subject: composedSubject,
      htmlContent: emailCompanyBody,
    };
    // SendInBlue - Client Body Obj
    const toClientBody = {
      sender: {
        name: "Skywave CRM",
        email: "skywave.signup@skywave.app",
      },
      to: [
        {
          email: clientData.email,
          name: `${clientData.firstName} ${clientData.lastName}`,
        },
      ],
      subject: 'Skywave Account Created!',
      htmlContent: emailClientBody,
    };

    // SIB KEY
    const sibKey = "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";

    // Post to SIB - Skywave Email
    const skywaveEmailResponse = await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      JSON.stringify(toCompanyBody),
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "api-key":
            sibKey,
        },
        
      }
    );
    
    const skywaveEmailResponseData = await skywaveEmailResponse;

    // Post to SIB - Email to Client
    const clientEmailResponse = await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      JSON.stringify(toClientBody),
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "api-key":
            sibKey,
        }
      }
    );

    const clientEmailResponseData = await clientEmailResponse;
                
    // Convert the data URL to a PNG image and save it to a file
    const imagePath = `images/signatures/esign_${clientData.firstName}_${clientData.lastName}_${generateUUID()}.png`;
    
    base64Img.img(clientData.signatureData, "", imagePath, function (err, filepath) {
      if (err) {
        console.error(err);      
        res.json({ message:`Error: ${err}` });      
      } else {
        console.log(`Signature saved to ${imagePath}`)
        res.json({ message: `success` });      
      }
    });
  } catch (e) {
    console.log(e)
  }
          
});

app.listen(port, () => {
  console.log(`Server listening at ${apiBaseUrl}`);
});
