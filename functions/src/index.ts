import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp();
const db = admin.firestore();

const app = express();
const main = express();

main.use('/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const collection = 'contacts';

app.post(`/${collection}`, async (req, res) => {
  try {
    const { name, email = '' } = req.body;

    if (!name)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Name is required'
      );

    const data = {
      name,
      email
    };
    const itemRef = await db.collection(collection).add(data);
    const item = await itemRef.get();

    res.json({
      id: itemRef.id,
      data: item.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get(`/${collection}/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'ID is required'
      );

    const item = await db
      .collection(collection)
      .doc(id)
      .get();

    if (!item.exists) {
      throw new functions.https.HttpsError('not-found', 'Item was not found');
    }

    res.json({
      id: item.id,
      data: item.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get(`/${collection}`, async (req, res) => {
  try {
    const snapshot = await db.collection(collection).get();
    const items = [];
    snapshot.forEach(doc => {
      items.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch(`/${collection}/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'ID is required'
      );

    const props = [
      {
        field: 'name',
        value: name
      },
      {
        field: 'email',
        value: email
      }
    ];

    const data = props.reduce((acc, { field, value }) => {
      if (value) {
        acc[field] = value;
      }

      return acc;
    }, {});

    await db
      .collection(collection)
      .doc(id)
      .set(data, { merge: true });

    res.json({
      id,
      data
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete(`/${collection}/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      throw new functions.https.HttpsError(
        'failed-precondition',
        'ID is required'
      );

    await db
      .collection(collection)
      .doc(id)
      .delete();

    res.json({
      id
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export const webApi = functions.https.onRequest(main);
