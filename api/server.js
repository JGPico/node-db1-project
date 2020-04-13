const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({api: "up"});
});

server.get("/api/accounts", (req, res) => {
    db.select('*').from('accounts')
    .then(accs => {
        res.status(200).json(accs);
    })
    .catch(err => {
        res.status(500).json({error: "The server 'sploded"});
    });
});

server.get("/api/accounts/:id", (req, res) => {
    db.select('*').from('accounts').where({id: req.params.id}).first()
    .then(acc => {
        if (acc.id){
            res.status(200).json(acc);
        } else {
            res.status(400).json({error: "There's no account with that id, dummy"});
        }
    })
    .catch(err => {
        res.status(500).json({error: "The server 'sploded"});
    });
});

server.post("/api/accounts", (req, res) => {
    const accData = req.body;
    db("accounts")
      .insert(accData, "id")
      .then(ids => {
        const id = ids[0];
        db("accounts")
          .where({ id })
          .first()
          .then(acc => {
            res.status(201).json({ data: acc });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "What the F%*$ happened?" });
      });
  });

  server.patch("/api/accounts/:id", (req, res) => {
    const changes = req.body;
    const { id } = req.params;
    db("accounts")
      .where({ id })
      .update(changes)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: "Update successful" });
        } else {
          res.status(404).json({ message: "There is no account with that id" });
        }
      })
      .catch(err => {
          res.status(500).json({error: "Oh shit . . ."});
      });
  });

  server.delete("/api/accounts/:id", (req, res) =>{
    const { id } = req.params;
    db("accounts")
    .where({ id })
    .del()
    .then(el => {
        if(el > 0) {
            res.status(202).json({message: `You got rid of account with id ${id}`});
        } else {
            res.status(404).json({message: `There is no account with id ${id}`});
        }
        
    })
    .catch(err => {
        res.status(500).json({error: "God damned machines"});
    });
  });

module.exports = server;
