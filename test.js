// import { greet, add, substract, multiply } from './greet.js';
// console.log(process.argv);
// console.log(greet(process.argv[2]));
// console.log(add(parseInt(process.argv[3]), parseInt(process.argv[4])));
// console.log(substract(parseInt(process.argv[3]), parseInt(process.argv[4])));
// console.log(multiply(parseInt(process.argv[3]), parseInt(process.argv[4])));

// import fs from "fs";

// const content = `My name is ${process.argv[2]}. I'm ${process.argv[3]} years old. I'm from ${process.argv[4]}`;

// fs.writeFileSync('text.txt', content, "utf-8");

// if(fs.existsSync('text.txt')) {
//     console.log("File exit!");
// } else {
//     console.log("File doesn't exit!");
// }

// const data = fs.readFileSync('text.txt', 'utf-8');

// console.log(data);

// fs.appendFileSync('text.txt', '\nThis is next new line!', 'utf-8');

// const newData = fs.readFileSync('text.txt', 'utf-8');

// console.log(newData);

// if(fs.existsSync('text.txt')) {
//     fs.unlinkSync('text.txt');
//     console.log("Delete Successfully!");
// }

// const name = process.argv[2];

// if(!name) {
//     console.log("Please fill name!");
//     process.exit();
// }

// fs.appendFileSync('users.txt', name + '\n', 'utf-8');

// const userNames = fs.readFileSync('users.txt', 'utf-8');

// console.log(userNames);

// import { error } from 'console';
// import fs from 'fs/promises';

// async function main() {
//     try {
//         const name = process.argv[2];

//         if(!name) {
//             throw new Error("Please fill name!");
//         }

//         await fs.appendFile('users.txt', name + '\n', 'utf-8');
//         console.log("Username added!");

//         const username = await fs.readFile('users.txt', 'utf-8');
//         console.log(username);
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// main();

// import http from 'http';

// const server = http.createServer((request, response) => {
//     if(request.url === "/") {
//         response.writeHead(200, {'content-type': 'text/plain; charset=utf-8'});
//         response.end("This is home page!");
//     } else if (request.url === "/about") {
//         response.writeHead(200, {'content-type': 'text/plain; charset=utf-8'});
//         response.end("Hello, I am blah blah blah...");
//     } else if (request.url.startsWith('/name')) {
//         const url = new URL(request.url, 'http://localhost:3000');
//         const name = url.searchParams.get('value');
//         response.end(name);
//     } else {
//         response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
//         response.end("404 Not Found");
//     }
// })

// server.listen(3000, () => {
//     console.log('Server is running at http://localhost:3000');
// })

import http from "http";
import fs from "fs/promises";

const server = http.createServer(async (request, response) => {
  if (request.url === "/" && request.method === 'GET') {
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    const data = {
      message: "Welcome from home page!",
      success: true,
    };

    response.end(JSON.stringify(data));

  } else if (request.url.startsWith('/users') && request.method === 'GET') {
    try {

      const users = await getUsers();

      const url = new URL(request.url, 'http://localhost:3000');
      const search = url.searchParams.get('value');

      let filterUsers = users;

      if (search) {
        filterUsers = users.filter(user =>
          user.name.toLowerCase().includes(search.toLowerCase())
        );

      }

      if (search && filterUsers.length === 0) {
        response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });

        return response.end(JSON.stringify({
          message: 'No user found!',
          success: false
        }));
      }

      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

      const data = {
        data: filterUsers,
        success: true
      }

      response.end(JSON.stringify(data));

    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });

      const errorMessage = {
        message: error.message,
        success: false
      }

      response.end(JSON.stringify(errorMessage))
    }
  } else if (request.url.startsWith('/users') && request.method === 'POST') {
    try {
      let body = '';

      request.on('data', (chunk) => {
        body += chunk.toString();
      });

      request.on('end', async () => {
        const user = JSON.parse(body);
        const name = user.name.trim();

        if (!name && name === '') {
          throw new Error("Name is required!");
        }

        await fs.appendFile('users.txt', name + "\n", 'utf-8');

        response.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });

        response.end(JSON.stringify({
          data: name,
          message: "User added successfully!",
          success: true
        }));
      });
    } catch (error) {
      response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });

      response.end(JSON.stringify({
        message: error.message,
        success: false
      }));
    }

  } else {
    response.writeHead(404, {
      "Content-Type": "application/json; charset=utf-8",
    });

    const error = {
      message: "Page not found!",
      success: false,
    };

    response.end(JSON.stringify(error));
  }
});

async function getUsers() {
  let data;
  try {
    data = await fs.readFile("users.txt", "utf-8");
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error
  }

  const users = data
    .split("\n")
    .filter((name) => name.trim() !== "")
    .map((name, index) => ({
      id: index + 1,
      name: name.trim(),
    }));

  return users;
}

server.listen(3000, () => {
  console.log("Server is listing at http://localhost:3000");
});
