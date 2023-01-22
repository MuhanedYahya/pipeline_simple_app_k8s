const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <style>
      body{
        min-height: 100vh;
        background-color: beige;
      }
    
      div{
        display: flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        width: 100%;
        height: 100%;
      }
      h1{
        color: red;
      }
    </style>
    <div>
      <h1>Wellcome To The Node app</h1>
      <h1>Running using Jenkins && Kubernetes</h1>
    </div>
    
  `);
});

app.listen(8080);
