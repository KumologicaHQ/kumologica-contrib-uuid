module.exports = function (App) {
  const { KLNode, KLError } = require('@kumologica/devkit');
  const uuid = require('uuid');

  class UUIDError extends KLError { }

  class UUID extends KLNode {
    constructor(props) {
      super(App, props);
      this.operation = props.operation;
      this.namespace = props.namespace;
      this.uuidname = props.uuidname;

      // Method bindings
      this.handle = this.handle.bind(this);
    }

    async handle(msg) {
      try{
        let Namespace = App.util.evaluateDynamicField(this.namespace, msg, this);
        let Name = App.util.evaluateDynamicField(this.uuidname, msg, this);
      if (this.operation === 'uuid1') {
         msg.header.UUID = {};
         msg.header.UUID.message = uuid.v1();
         this.send(msg)
         return
      }else if(this.operation === 'uuid3'){
        msg.header.UUID = {};
        msg.header.UUID.message = uuid.v3(Name,Namespace);
        this.send(msg)
        return
      }else if(this.operation === 'uuid4'){
        msg.header.UUID = {};
        msg.header.UUID.message = uuid.v4();
        this.send(msg)
        return
      }else{
        msg.header.UUID = {};
        msg.header.UUID.message = uuid.v5(Name,Namespace);
        this.send(msg)
        return
      }
    }catch(error){
      this.sendError(new UUIDError(error), msg)
      return;
    }
    }
  }
  App.nodes.registerType('UUID', UUID);
};
