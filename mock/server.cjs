const jsonServer = require('json-server');
const { existsSync, copyFileSync } = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const db = path.join(__dirname, 'db.json');
if (!existsSync(db)) copyFileSync(path.join(__dirname,'seed.json'), db);
const server = jsonServer.create();
const router = jsonServer.router(db);
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);
server.post('/login', (req,res) => {
 const user = router.db.get('users').find({email:String(req.body.email).toLowerCase(),password:req.body.password}).value();
 if (!user) return res.status(401).json({message:'Incorrect email or password'});
 const token = randomUUID();
 router.db.get('sessions').push({id:token,userId:user.id}).write();
 res.json({token,user:{id:user.id,name:user.name,email:user.email}});
});
server.use((req,res,next)=>{
 const token = (req.headers.authorization || '').replace('Bearer ','');
 const session = router.db.get('sessions').find({id:token}).value();
 if (!session) return res.status(401).json({message:'Please log in again'});
 if (req.path === '/me') {
  const user = router.db.get('users').find({id:session.userId}).value();
  return res.json({id:user.id,name:user.name,email:user.email});
 }
 if (req.path === '/logout' && req.method === 'POST') {
  router.db.get('sessions').remove({id:token}).write(); return res.sendStatus(204);
 }
 return res.sendStatus(404);
});
server.listen(3001,'127.0.0.1',()=>console.log('Mock auth: http://127.0.0.1:3001'));
