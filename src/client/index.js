import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'
import { testServer } from './js/formHandler'

import './styles/resets.scss';
import './styles/base.scss';
import './styles/footer.scss';
import './styles/form.scss';
import './styles/header.scss';
import './styles/card.scss';

export {
  checkForName,
  handleSubmit,
  testServer
}

// console.log(checkForName);
/* this gave the following response... why do this?

ƒ o(e){let t="";console.log("::: Running checkForName :::",e);return["Picard","Janeway","Kirk","Archer","Georgiou"].includes(e)&&(t="Welcome, Captain!",console.log("Welcome, Captain!")),t}

*/


//alert("I EXIST")
//console.log("CHANGE!!");
//console.log("what it works!!");
