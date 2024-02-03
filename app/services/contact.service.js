const { ObjectId } = require('mongodb');

class ContactService {
    constructor(client) {
        this.Contact = client.db('contactbook').collection('contacts');
    }
}

module.exports = ContactService;
