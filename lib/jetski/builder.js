exports.Builder = Builder;

/* Makes building a stack for jsgi simple.
 * Stacks may be constructed, modified and finally built before inserting into the final stack.
 *
 * A jsgi constructor is considered to be a function which returns the final function to use in the stack
 *
 * @example
 *   var Builder = require('./builder').Builder;
 *   var builder = new Builder();
 *   builder
 *    .use(myJsgiConstructor)
 *    .use(anotherJsgiConstructor, "args","for","the", "constructor");
 *
 *  builder.app // provides the final function entry-point to the stack.
 *
 *  ejsgi.Server(builder.app, "localhost", 8000).start();
 */
function Builder(){
  this.stack = [];
}

var proto = {
  use : function(){
    var args  = Array.prototype.slice.call(arguments);
    var app   = args.shift();
    this.stack.push({ "app" : app, "args" : args});
    return this;
  },
  get app(){
    return buildStack(this.stack);
  }
}

Builder.prototype = proto;


function buildStack(stack){
  var app = stack.shift();
  if(!app) return undefined;

  var args = app.args.slice();
  stack.length == 0 ?
    args.unshift(undefined) :
    args.unshift(buildStack(stack));

  return app.app.apply(this, args);
}

