const knex = require('../database/knex');
const Paginator = require('./paginator');
const { success } = require('../jsend');
const {unlink} = require('node:fs');

function contactRepository() {
return knex('contacts');
}
function readContact(payload) {
return {
name: payload.name,
email: payload.email,
address: payload.address,
phone: payload.phone,
favorite: payload.favorite,
avatar: payload.avatar,
};
}


async function createContact(payload) {
    const contact = readContact(payload);
    const [id] = await contactRepository().insert(contact);
    return { id, ...contact };
    }
    async function getManyContacts(query) {
        const { name, favorite, page = 1, limit = 5 } = query;
        const paginator = new Paginator(page, limit);
    
        try {
            // Query contacts
            let dbQuery = contactRepository();
    
            // Apply filters
            if (name) {
                dbQuery = dbQuery.where('name', 'like', `%${name}%`);
            }
            if (favorite !== undefined && favorite !== '0' && favorite !== 'false') {
                dbQuery = dbQuery.where('favorite', favorite);
            }
    
            // Get total count
            const [{ count }] = await dbQuery.clone().count('* as count');
            
            // Get paginated results
            const contacts = await dbQuery
                .select('id', 'name', 'email', 'address', 'phone', 'favorite', 'avatar')
                .limit(paginator.limit)
                .offset(paginator.offset);
    
            console.log('Query results:', {
                totalCount: count,
                contactsFound: contacts.length
            });
    
            return {
                contacts,
                metadata: paginator.getMetadata(parseInt(count))
            };
    
        } catch (error) {
            console.error('Error in getManyContacts:', error);
            throw error;
        }
    }
async function getContactById(id) {
    return contactRepository().where('id', id).first();
}

async function updateContact(id, payload) {
    const updatedContact = await contactRepository()
        .where('id', id)
        .select('*')
        .first();

    if (!updatedContact) {
        return null;
    }

    const update = readContact(payload);
    if (!update.avatar) {
        delete update.avatar;
    }

    await contactRepository().where('id', id).update(update);

    if (
        update.avatar &&
        updatedContact.avatar &&
        update.avatar !== updatedContact.avatar &&
        updatedContact.avatar.startsWith('/public/uploads')
    ) {
        unlink(`${updatedContact.avatar}`, (err) => {});
    }

    return { ...updatedContact, ...update };
}

async function deleteContact(id) {
    const deletedContact = await contactRepository()
        .where('id', id)
        .select('avatar')
        .first();

    if (!deletedContact) {
        return null;
    }

    await contactRepository().where('id', id).del();

    if (
        deletedContact.avatar &&
        deletedContact.avatar.startsWith('/public/uploads')
    ) {
        unlink(`${deletedContact.avatar}`, (err) => {});
    }

    return deletedContact;
}
async function deleteAllContacts() {
    const contacts = await contactRepository().select('avatar');
    await contactRepository().del();

    contacts.forEach((contact) => {
        if (contact.avatar && contact.avatar.startsWith('/public/uploads')) {
            unlink(`${contact.avatar}`, (err) => {});
        }
    });
}
module.exports = {
    createContact,
    getManyContacts,
    getContactById,
    updateContact,
    deleteContact,
    deleteAllContacts
};
