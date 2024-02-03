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
        return await this.Contact.find(filter).toArray();
    }

    // find by name
    async findByName(name) {
        return await this.Contact.find({
            name: {
                $regex: new RegExp(name),
                $options: 'i',
            }
        }).toArray();
    }

    // find by ID
    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id)  ? new ObjectId(id) : null,
        })
    }

    // update contact with id
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id)  ? new ObjectId(id) : null,
        };
        const updatedData = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            {
                $set: updatedData,
            },
            {
                returnDocument: 'after',
            }
        )
        return result;
    }

    // delete with id
    async delete(id) {
        return await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // find favorite
    async findFavorite() {
        return await this.Contact.find({ favorite: true }).toArray();
    }

    // delete many
    async deleteMany() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ContactService;
