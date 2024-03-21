// import {Realm, createRealmContext} from '@realm/react';

// export class Task extends Realm.Object {
//   _id!: Realm.BSON.ObjectId;
//   title!: string;
//   description!: string;

//   static schema = {
//     name: 'Task',
//     primaryKey: '_id',
//     properties: {
//       _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
//       title: 'string',
//       description: 'string',
//     },
//   };
// }

// export const RealmContext = createRealmContext({
//   schema: [Task],
// });

import Realm, { BSON } from "realm";

export class Task extends Realm.Object<Task> {
  _id!: BSON.ObjectId;
  title!: string;
  description!: string;

  static schema: Realm.ObjectSchema = {
    name: "Task",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new BSON.ObjectId() },
      title: "string",
      description: "string",
    },
  };
}
