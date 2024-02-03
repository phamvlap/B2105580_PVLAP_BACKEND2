const ContactService = require('./../services/contact.service');
const MongoDB = require('./../utils/mongodb.util');
const ApiError = require('./../api-error');

// create new contact
exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, 'Name cannot be empty'));
    }
    
    try {
        const contactService = new ContactService(MongoDB.client);
        const contact = await contactService.create(req.body);
        return res.json({ data: { contact } });
    }
    catch(error) {
        return next(new ApiError(500, 'An error occured while creating the contact'));
    }
};

// retrieve all contacts of a user from database
exports.findAll = async (req, res, next) => {
    let contacts = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if(name) {
            contacts = await contactService.findByName(name);
        }
        else {
            contacts = await contactService.find({});
        }
    }
    catch(error) {
        return next(
            new ApiError(500, 'An error occured while retrieving the contact')
        )
    }

    return res.json({ data: { contacts } })
};

// find a single contact with an id
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const contact = await contactService.findById(req.params.id);
        if(!contact) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.json({ data: { contact }});
    }
    catch(error) {
        return next(
            new ApiError(500, `Error  retrieving contact with id = ${req.params.id}`)
        )
    }
};

// update a contact by the id in the request
exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const newContact = await contactService.update(req.params.id, req.body);
        if(!newContact) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.json({
            message: 'Contact was updated successfully',
            data: { contact: newContact },            
        })
    }
    catch(error) {
        return next(
            new ApiError(500, `Error  updating contact with id = ${req.params.id}`)
        )
    }
};

// delete  a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedContact = await contactService.delete(req.params.id);
        if(!deletedContact) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.json({
            message: 'Contact was deleted successfully',
            contact: deletedContact,
        })
    }
    catch(error) {
        return next(
            new ApiError(500, `Could not delete contact with id = ${req.params.id}`)
        )
    }
};

// delete all contacts of a user from the database
exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteMany();
        return res.json({
            message: `${deletedCount} contacts were deleted successfully`,
        })
    }
    catch(error) {
        return next(
            new ApiError(500, 'An error occured while removing  all  contacts')
        )
    }
};

// find all favorite contacts of a user
exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const favoriteContacts = await contactService.findFavorite();
        return res.json({ data: { contacts: favoriteContacts } });
    }
    catch(error) {
        return next(
            new ApiError(500, 'An error occured while retrieving  favorite contacts')
        )
    }
};
