/*
  The aim of this experiment is to understand the chaining
  of the Promises in JavaScript. What I am really interested
  is in how to return a promise from one function to another
  if any given function is not having a Promise option but
  only callback.
*/

/* Abstracted Layer */
let promise1, promise2;
let func1 = function(value, inc) {
  console.log(`Reached func1() with value:${value} and inc:${inc}`);
  promise1 = func2(value, inc);
  console.log('Again in func1() and got something from func2 with type:', typeof(promise1));
  console.log("Let's see what we got:", promise1);
  console.log('Thanks for visiting func1()');

  return promise1;
}

let func2 = function(value, inc) {
  console.log(`Reached func2() with value:${value} and inc:${inc}`);
  promise2 = new Promise((resolve, reject) => {
    console.log(`In the Promise(), doing something`);
    resolve(value + inc);
    console.log('Our dish is cooked and ready to be served');
    console.log('Thanks for visiting Promise()');
  });
  console.log('Cooked something with help of Promise and func1 parameters');
  console.log('What we cooked? See the type: ', typeof(promise2));
  console.log('Wanna peep inside? Here it is: ', promise2);
  console.log('Thanks for visiting func2()');
  return promise2;
}

/* User viewable */
let value = 5,
  inc = 3;
func1(value, inc)
  .then(res => {
    Promise.all([promise1, promise2])
      .then((res) => {
        console.log('all promises finished successfully');
        console.log(res);
      })
  })
  .catch((e) => console.log(e));


// then is called on the Promise returned by the func2() to its caller i.e. func1()
/*
  So what is all this and why I am reading this?
  I spent 'the' few hours on debugging and is happy to finally got it correct, but could
  not find something regarding this( or maybe I haven't searched enough instead of thinking).

  What I was doing and what I am missing?
  I was using a function of mongoosejs library(mongoosejs.com).



  Rest of the article now at: https://shubhammalik.quora.com/Chaining-Promises-across-different-modules-in-Node-js
*/
