import http from "node:http";

const host = "localhost";
const port = 8000;

import fs from "node:fs/promises";

// function requestListener(_request, response) {
//   response.setHeader("Content-Type", "application/json");
//   response.end(JSON.stringify({ message: "I'm OK" }));
// }

// function requestListener(_request, response) {
//   fs.readFile("index.html", "utf8")
//     .then((contents) => {
//       response.setHeader("Content-Type", "text/html");
//       response.writeHead(200);
//       return response.end(contents);
//     })
//     .catch((error) => console.error(error));
// }

// function requestListener(request, response) {

//   fs.readFile('index.html', 'utf8')
//     .then(contents => {
//       response.writeHead(200);
//       response.end(contents);
//     })
//     .catch(err => {
//       console.error(err);
//       response.writeHead(500);
//       response.end('Internal Server Error');
//     });

// }

// async function requestListener(request, response) {
//   try {
//     const contents = await fs.readFile("index.html", "utf8");

//     response.writeHead(200);
//     response.end(contents);
//   } catch (err) {
//     console.error(err);

//     response.writeHead(500);
//     response.end("Internal Server Error");
//   }
// }

// async function requestListener(request, response) {
//   response.setHeader("Content-Type", "text/html");
//   try {
//     const contents = await fs.readFile("index.html", "utf8");
//     switch (request.url) {
//       case "/index.html":
//         response.writeHead(200);
//         return response.end(contents);
//       case "/random.html":
//         response.writeHead(200);
//         return response.end(`<html><p>${Math.floor(100 * Math.random())}</p></html>`);
//       default:
//         response.writeHead(404);
//         return response.end(`<html><p>404: NOT FOUND</p></html>`);
//     }
//   } catch (error) {
//     console.error(error);
//     response.writeHead(500);
//     return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
//   }
// }

async function requestListener(request, response) {
  response.setHeader("Content-Type", "text/html");
  try {
    const urlParts = request.url.split("/");
    const path = urlParts[1];  // First level of the URL path
    switch (path) {
      case "":
      case "index.html":
        const contents = await fs.readFile("index.html", "utf8");
        response.writeHead(200);
        return response.end(contents);
      case "random.html":
        const numIntegers = parseInt(urlParts[2]);  // Extracting :nb from the URL

        if (!isNaN(numIntegers)) {
          const randomNumbers = Array.from({ length: numIntegers }, () => Math.floor(100 * Math.random()));
          response.writeHead(200);
          response.end(`<html><p>${randomNumbers.join("<br>")}</p></html>`);
        } else {
          response.writeHead(400);
          response.end(`<html><p>400: BAD REQUEST</p></html>`);
        }
        break;
      default:
        response.writeHead(404);
        return response.end(`<html><p>404: NOT FOUND</p></html>`);
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500);
    return response.end(`<html><p>500: INTERNAL SERVER ERROR</p></html>`);
  }
}




console.log("NODE_ENV =", process.env.NODE_ENV);
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
