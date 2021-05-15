import pymongo
from pymongo import MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def landing():
    return {"note": "This URL is not supposed to be hit"}

@app.route('/set_user', methods=['POST'])
def set_user():
    cluster = MongoClient("mongodb+srv://applicationUsers:manashmanash@cluster0.cd6ca.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = cluster.Users
    collection = db.user_details

    raw_data = request.get_json()

    _id = collection.count()
    _name = raw_data['name']
    _email = raw_data['email']
    _age = raw_data['age']
    _vaccineType = raw_data['vaccineType']
    _method = raw_data['method']

    if(_method == "District"):
        _district = raw_data['district']
        _state = raw_data['state']
        post = {
        "_id": _id,
        "name": _name,
        "email": _email,
        "district": _district,
        "state": _state,
        "age": _age,
        "vaccineType": _vaccineType,
        "method": _method
        }
    else:
        _pincode = raw_data['pincode']
        post = {
        "_id": _id,
        "name": _name,
        "email": _email,
        "pincode":_pincode,
        "age": _age,
        "vaccineType": _vaccineType,
        "method": _method
        }
    
    collection.insert_one(post)

    return post


if __name__ == "__main__":
    app.run(debug=True)   