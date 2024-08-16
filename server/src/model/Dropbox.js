require("dotenv").config();
const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

class DropboxClient {
  static instance;
  constructor() {
    if (DropboxClient.instance) {
      return DropboxClient.instance;
    }
    this.dbx = null;
    DropboxClient.instance = this;
  }

  async init() {
    try {
      this.dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
      await this.dbx.usersGetCurrentAccount();
    } catch (error) {
      if (error.status === 401) {
        const newToken = await this.getNewToken();
        this.dbx = new Dropbox({ accessToken: newToken, fetch });
      }
    }
  }

  async getNewToken() {
    const tokenUrl = "https://api.dropbox.com/oauth2/token";
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
      client_id: process.env.DROPBOX_KEY,
      client_secret: process.env.DROPBOX_SECRET,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const result = await response.json();
    return result.access_token;
  }

  async uploadFoodImage(path, content) {
    try {
      await this.init();
      const response = await this.dbx.filesUpload({
        path: "/Food/" + path,
        contents: content,
        mode: "add",
        autorename: true,
      });
      return { Error: false, msg: response.result, path: path };
    } catch (error) {
      return {
        Error: true,
        msg: error.error,
        status: error.status,
        path: path,
      };
    }
  }

  async getFoodLink(path) {
    try {
      await this.init();
      let sharedLink = await this.dbx.sharingListSharedLinks({
        path: "/Food/" + path,
      });
      let link;
      if (sharedLink.result.links.length > 0) {
        link = sharedLink.result.links[0].url.replace(/dl=0$/, "raw=1");
      } else {
        const generateNew = await this.dbx.sharingCreateSharedLinkWithSettings({
          path: "/Food/" + path,
        });
        link = generateNew.result.url.replace(/dl=0$/, "raw=1");
      }
      return { Error: false, msg: link };
    } catch (error) {
      return { Error: true, msg: error, status: error.status };
    }
  }

  async removeFood(path) {
    const url = "https://api.dropboxapi.com/2/files/delete_v2";
    const body = JSON.stringify({ path: `/Food/${path}` });
    try {
      const response = await fetch(url, {
        method: "POST",
        body: body,
        headers: {
          Authorization: `Bearer ${process.env.DROPBOX_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return { Error: false, msg: data };
    } catch (error) {
      return { Error: true, msg: error.error };
    }
  }
}
module.exports = DropboxClient;
