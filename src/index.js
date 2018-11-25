import PageView from './View';
import PageModel from './Model';
import PageController from './Controller';


const pageModel = new PageModel(XMLHttpRequest);

const pageView = new PageView(window);

const controller = new PageController(pageView, pageModel);

window.onload = controller.initialize();

window.addEventListener('resize', controller.redrawOnResize);
