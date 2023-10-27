const template = require("./template.js");
const express = require("express");
const qs = require("querystring");
const fs = require("fs");
const app = express();
const page = "page";
const port = 3000;

app.get("/", (req, res) => {
  // query.name 바로 불러오기
  let { name } = req.query;
  fs.readdir(page, (err, files) => {
    let list = template.list(files);
    fs.readFile(`page/${name}`, "utf-8", (err, data) => {
      let control = `<a href="/create">create</a> <a href="/update?name=${name}">update</a>
      <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${name}">
        <button type="submit">delete</button>
      </form>
      `;
      if (name === undefined) {
        name = "WRITE_NOTE";
        data = "Welcome";
        control = `<a href="/create">create</a>`;
      }
      const HTML = template.HTML(
        name,
        list,
        `<h2>${name} 페이지</h2> <p>${data}</p>`,
        control
      );
      res.send(HTML);
    });
  });
});

app.get("/create", (req, res) => {
  fs.readdir("page", (err, files) => {
    const name = "create";
    const list = template.list(files);
    const data = template.create();
    const HTML = template.HTML(list, name, data, ``);
    res.send(HTML);
  });
});

app.get("/update", (req, res) => {
  // query.name 바로 불러오기
  let { name } = req.query;
  fs.readdir(page, (err, files) => {
    let list = template.list(files);
    fs.readFile(`page/${name}`, "utf-8", (err, content) => {
      let control = `<a href="/create">create</a> <a href="/update?name=${name}">update</a>
      <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${name}">
        <button type="submit">delete</button>
      </form>
    `;
      const data = template.update(name, content);
      const HTML = template.HTML(
        list,
        name,
        `<h2>${name} 페이지</h2> <p>${data}</p>`,
        control
      );
      res.send(HTML);
    });
  });
});

app.post("/create_process", (req, res) => {
  // res.send("성공");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const post = qs.parse(body);
    //console.log(post);
    const title = post.title;
    const description = post.description;
    fs.writeFile(`page/${title}`, description, "utf-8", (err) => {
      res.redirect(302, `/?name=${title}`); // 처리 후 만든 페이지로 리다이렉트..
    });
  });
});

app.post("/update_process", (req, res) => {
  // res.send("성공");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const post = qs.parse(body);
    const id = post.id;
    const title = post.title;
    const description = post.description;
    fs.rename(`page/${id}`, `page/${title}`, (err) => {
      fs.writeFile(`page/${title}`, description, "utf-8", (err) => {
        res.redirect(302, `/?name=${title}`); // 처리 후 만든 페이지로 리다이렉트..
      });
    });
  });
});

app.post("/delete_process", (req, res) => {
  // res.send("성공");
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const post = qs.parse(body);
    const id = post.id;
    fs.unlink(`page/${id}`, (err) => {
      res.redirect(302, `/`);
    });
  });
});

// 3000번 포트에서 listen
app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
