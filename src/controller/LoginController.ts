import { Request, Response } from "express";
import "reflect-metadata";
import { get, post, controller } from "../decorator";
import { getResponseData } from "../utils/util";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller('/')
export class LoginController {
  static isLoginFn(req: BodyRequest): boolean{
    return !!(req.session ? req.session.login : undefined)
  }
  @post("/login")
  login(req: Request, res: Response): void {
    const { password, username } = req.body;
    const isLogin = LoginController.isLoginFn(req)
    if (isLogin) {
      res.json(getResponseData(false, "已经登陆过"));
    } else {
      if (password === "123" && req.session) {
        req.session.login = true;
        res.json(getResponseData(true));
      } else {
        res.json(getResponseData(false, "登录失败"));
      }
    }
  }

  @get("/logout")
  logout(req: Request, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }

  @get("/")
  home(req: Request, res: Response): void {
    const isLogin = LoginController.isLoginFn(req)
    if (isLogin) {
      res.send(`
          <html>
              <body>
                  <a href="/getData">爬取内容</a> 
                  <a href="/showData">展示内容</a> 
                  <a href="/logout">退出</a> 
              </body>
          </html>
      `);
    } else {
      res.send(`
          <html>
              <body>
                  <form method="post" action="/login">
                      <input type="password" name="password" />
                      <button>登录</button>
                  </form>
              </body>
          </html>
      `);
    }
  }
}
