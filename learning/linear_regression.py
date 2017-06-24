import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.feature_extraction import DictVectorizer as DV

def _connect_mongo(host,port,db):
    print host, port, db
    conn=MongoClient(host,port)
    return conn[db]
def read_mongo(db, collection, host, port):
    db = _connect_mongo(host,port,db)
    cursor=db[collection].find()
    df= pd.DataFrame(list(cursor))
    #print df
    return df


rcvd_frame =  read_mongo('meanAuth','dataschemademos','localhost',27017)
rcvd_frame.to_csv('example_data.csv')
'''n=rcvd_frame.values
f = rcvd_frame.filter(["device_id","updated_by","updated_at"],axis=1)
print f
#features=f.values
vectorizer = DV()
#features=vectorizer.fit_transform(f)
#f2=pd.DataFrame(vector.fit_transform(features.to_dict(outtype='records')).toarray())
features =  f.to_dict()
features=vectorizer.fit_transform(features).toarray()
print features
_y = rcvd_frame.filter(["state"],axis=1)
y=_y.values
y=y.astype(int)
y=[1,0,0,1,0,1,0,1,0,1,0,1,0,1]
print y
model = GaussianNB()
model.fit(features,y)
print model
print "prediction"

'''


