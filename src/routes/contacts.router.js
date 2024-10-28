const express = require('express');
const contactsController = require('../controller/contacts.controller'); // Corrected path
const { methodNotAllowed, resourceNotFound } = require('../controller/errors.controller');
const avatarUpload = require('../midelwares/avatar-upload.midleware');

const router = express.Router();

module.exports.setup = (app) => {
    app.use('/api/v1/contacts', router);

    /**
     * @swagger
     * /api/v1/contacts:
     *   get:
     *     summary: Get contacts by filter
     *     description: Get contacts by filter
     *     parameters:
     *       - in: query
     *         name: favorite
     *         schema:
     *           type: boolean
     *         description: Filter by favorite status
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: Filter by contact name
     *     responses:
     *       200:
     *         description: A list of contacts
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: The response status
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     contacts:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Contact'
     *                     metadata:
     *                       $ref: '#/components/schemas/PaginationMetadata'
     */

    /**
     * @swagger
     * /api/v1/contacts:
     *   post:
     *     summary: Create a new contact
     *     description: Create a new contact with optional avatar upload
     *     tags:
     *       - contacts
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               phone:
     *                 type: string
     *               address:
     *                 type: string
     *               favorite:
     *                 type: boolean
     *               avatarFile:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: Contact created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Contact'
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    router.post('/', avatarUpload, contactsController.createContact);

    /**
     * @swagger
     * /api/v1/contacts:
     *   get:
     *     summary: Get contacts by filter
     *     description: Retrieve a list of contacts with optional filtering and pagination
     *     tags:
     *       - contacts
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 5
     *           minimum: 1
     *           maximum: 100
     *         description: Number of records per page
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *           minimum: 1
     *         description: Page number of records
     *       - in: query
     *         name: favorite
     *         schema:
     *           type: boolean
     *         description: Filter by favorite status
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: Filter by contact name
     *     responses:
     *       200:
     *         description: A list of contacts
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                   description: The response status
     *                 data:
     *                   type: object
     *                   properties:
     *                     contacts:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Contact'
     *                     metadata:
     *                       $ref: '#/components/schemas/PaginationMetadata'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [error]
     *                 message:
     *                   type: string
     */
    router.get('/', contactsController.getContactsByFilter);

    /**
     * @swagger
     * /api/v1/contacts:
     *   delete:
     *     summary: Delete all contacts
     *     description: Delete all contacts
     *     tags:
     *       - contacts
     *     responses:
     *       200:
     *         description: All contacts deleted
     *         $ref: '#/components/responses/200NoData'
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.delete('/', contactsController.deleteAllContacts);
    router.all('/', methodNotAllowed); // Apply methodNotAllowed middleware here

    /**
     * @swagger
     * /api/v1/contacts/{id}:
     *   get:
     *     summary: Get a contact by ID
     *     description: Retrieve a contact by its ID
     *     tags:
     *       - contacts
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the contact to retrieve
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A single contact
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   enum: [success]
     *                   description: The response status
     *                 data:
     *                   type: object
     *                   properties:
     *                     contact:
     *                       $ref: '#/components/schemas/Contact'
     *       404:
     *         description: Contact not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.get('/:id', contactsController.getContact);

    /**
     * @swagger
     * /api/v1/contacts/{id}:
     *   put:
     *     summary: Update a contact
     *     description: Update an existing contact by ID
     *     tags:
     *       - contacts
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the contact to update
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Contact'
     *     responses:
     *       200:
     *         description: Contact updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Contact'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       404:
     *         description: Contact not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.put('/:id', avatarUpload, contactsController.updateContact);

    /**
     * @swagger
     * /api/v1/contacts/{id}:
     *   delete:
     *     summary: Delete a contact
     *     description: Delete a contact by ID
     *     tags:
     *       - contacts
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the contact to delete
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Contact deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/responses/200NoData'
     *       404:
     *         description: Contact not found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    router.delete('/:id', contactsController.deleteContact);

    

    router.all('/:id', methodNotAllowed); // Apply methodNotAllowed middleware here
};