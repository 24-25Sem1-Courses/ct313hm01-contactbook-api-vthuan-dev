const express = require('express');
const cors = require('cors');


const Jsend = require('./jsend');
const contactsRouter = require('./routes/contacts.router');
const {
    resourceNotFound,
    methodNotAllowed,
    handleError,
} = require('./controller/errors.controller'); // Corrected path

const {
    specs,
    swaggerUi,
} = require('./docs/swagger');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.json(Jsend.success({
        message: 'Welcome to the Contactbook API'
    }));
});
app.use('/public', express.static('public')); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));  

contactsRouter.setup(app);

app.use(resourceNotFound);
app.use(methodNotAllowed);
app.use(handleError);

module.exports = app;
