import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred,
{
"databaseURL": "https://humanitarian-app-development.firebaseio.com/"
})
db = firestore.client()
doc_ref = db.collection(u"resources")
# Import data
df = pd.read_csv("database.csv")
tmp = df.to_dict(orient="records")
list(map(lambda x: doc_ref.add(x), tmp))
