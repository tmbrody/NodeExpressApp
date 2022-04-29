const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('../config/passport');

const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
  const {username, password} = req.body;
  const url = 
    // removed mongo account details
    'mongodb+srv://xxx:xxx@cluster0.1msex.mongodb.net?retryWrites=true&w=majority';
  const dbName = 'globomantics';

  (async function addUser(){
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = {username, password};
      const results = await db.collection('users').insertOne(user);
      debug(results);
      req.login(results.ops[0], () => {
        res.redirect('/auth/profile');
      });
    } catch (error) {
      debug(error);
    }
    client.close();
  })();

});

authRouter
.route('/signIn')
.get((req, res)=>{
  res.render('signin');
})
.post((req, res) => {
  const {username, password} = req.body;
  const url = 
    // removed mongo account details
    'mongodb+srv://xxx:xxx@cluster0.1msex.mongodb.net?retryWrites=true&w=majority';
  const dbName = 'globomantics';

  (async function addUser(){
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = {username, password};
      const results = await db.collection('users').findOne(user);
      debug(results);
      req.login(results, () => {
        if(results === null) {
          res.redirect('/');
        }
        else {
          res.redirect('/auth/profile');
        }
      });
    } catch (error) {
      debug(error);
    }
    client.close();
  })();

});
// function doesn't exist even in older versions
// of express and passport
//
// .post(passport.authenticate('local', {
//   successRedirect: '/auth/profile',
//   failureMessage: '/',
//   })
// );

authRouter.route('/profile').get((req, res)=>{
  res.json(req.user);
});

module.exports = authRouter;