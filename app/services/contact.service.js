const { ObjectId } = require('mongodb');

class ContactService {
    constructor(client) {
        this.Contact = client.db('contactbook').collection('contacts');
    }

    // filter payload
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
            createdBy: new ObjectId(payload.userId),
        };
        // remove undefined fields
        Object.keys(contact).forEach(key => {
            if(contact[key] === undefined) {
                delete contact[key];
            }
        });
        return contact;
    }

    // create and save new contact
    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            {
                $set: {
                    favorite: contact.favorite === true,
                }
            },
            {
                returnDocument: 'after',
                upsert: true,
            }
        );
        return result;
    }

    // find with filter
    async find(filter) {
        filter.createdBy = new ObjectId(filter.userId);
        delete filter['userId'];
        return await this.Contact.find(filter).toArray();
    }

    // find by name
    async findByName(userId, name) {
        return await this.Contact.find({
            createdBy: new ObjectId(userId),
            name: {
                $regex: new RegExp(name),
                $options: 'i',
            }
        }).toArray();
    }

    // find by ID
    async findById(id, userId) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id)  ? new ObjectId(id) : null,
            createdBy: new ObjectId(userId),
        });
    }

    // update contact with id
    async update(id, payload, userId) {
        const filter = {
            _id: ObjectId.isValid(id)  ? new ObjectId(id) : null,
            createdBy: new ObjectId(userId),
        };
        const updatedData = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            {
                $set: {
                    ...updatedData,
                    createdBy: new ObjectId(userId),
                },
            },
            {
                returnDocument: 'after',
            }
        )
        return result;
    }

    // delete with id
    async delete(id, userId) {
        return await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            createdBy: new ObjectId(userId),
        });
    }

    // find favorite
    async findFavorite(userId) {
        return await this.Contact.find({
            createdBy: new ObjectId(userId),
            favorite: true
        }).toArray();
    }

    // delete 
    async deleteMany(userId) {
        const result = await this.Contact.deleteMany({ createdBy: new ObjectId(userId) });
        return result.deletedCount;
    }
}

module.exports = ContactService;
