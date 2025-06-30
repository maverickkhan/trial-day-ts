import Router from 'koa-router';
import Issues from './api/issues';        
import Discovery from './api/discovery';   
import Health from './api/health';         
import Token from './api/token';           

const router = new Router();

// Public
router.get('/health', Health);
router.get('/discovery', Discovery);
router.get('/token', Token.generateToken);

// Issues
router.get('/issues', Issues.get);
router.post('/issues', Issues.create);
router.get('/issues/:id', Issues.getOne);
router.patch('/issues/:id', Issues.update);
router.delete('/issues/:id', Issues.delete);
router.get('/issues/:id/revisions', Issues.getRevisions);   
router.get('/issues/:id/compare', Issues.compare);       

export default router;
